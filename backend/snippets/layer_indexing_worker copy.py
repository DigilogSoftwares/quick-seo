import json
import uuid
import socket
import asyncio
import logging

import redis.asyncio as redis
from typing import Dict, List
from collections import defaultdict
from datetime import datetime, timezone
from indexing_google import process_indexing_job
from indexing_bing import process_bing_indexing_job
from auth import decrypt


from config import (
    settings,
    L2_GROUP,
    L2_HASH_PATH,
    L2_JOB_LIMIT,
    L2_STREAM_PREFIX,
    L3_HASH_PATH,
    L3_STREAM_PREFIX,
)

# CONFIG
REDIS_PORT: int = settings.REDIS_PORT
REDIS_PASS: str = settings.REDIS_PASS
REDIS_HOST: str = settings.REDIS_HOST

HASH_PATH: str = L2_HASH_PATH
NEXT_HASH_PATH: str = L3_HASH_PATH

STREAM_PREFIX = L2_STREAM_PREFIX
NEXT_STREAM_PREFIX = L3_STREAM_PREFIX

JOB_LIMIT = asyncio.Semaphore(L2_JOB_LIMIT)
GROUP = L2_GROUP

# Layer Specific

# Set up logging for better visibility
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

r = redis.Redis(
    host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS, decode_responses=True
)


CONSUMER = socket.gethostname()


async def process_job(job_id, job, stream_name, msg_id):
    async with JOB_LIMIT:
        # logger.info(f"Job {job_id} started | Available slots: {JOB_LIMIT._value}")
        try:
            shop = job.get("shop", None)
            if not shop:
                logger.error("Invalid Request 'shop' not present in job")
                return

            # BATCH OPERATION HERE
            google_auth = job.get("auth", {}).get("googleConfig", None)
            bing_auth = job.get("auth", {}).get("bingApiKey", None)

            bing_result = None
            google_result = None
            if bing_auth and bing_auth != "" and len(bing_auth) > 10:
                bing_result = await process_bing_indexing_job(
                    job_data=job, decode_function=decrypt
                )

                print(f"Submitted: {bing_result['results']['successful_urls']} URLs")
                print(f"Failed: {bing_result['results']['failed_urls']} URLs")

            if google_auth and google_auth != "" and len(google_auth) > 10:
                google_result = process_indexing_job(
                    job_data=job, decode_function=decrypt
                )

                # Access results
                print(f"Success: {google_result['success']}")
                print(f"Total: {google_result['results']['total_urls']}")
                print(f"Successful: {google_result['results']['successful']}")
                print(f"Failed: {google_result['results']['failed']}")

                # Access individual URL results
                for url_result in google_result["results"]["results"]:
                    print(f"{url_result['url']}: {url_result['status']}")

            ## response building
            response = {}
            if google_result:
                response["google"] = {
                    "executed": True,
                    "success": google_result["success"],
                    "result": google_result,
                }
            else:
                response["google"] = {
                    "executed": False,
                    "reason": "missing_credentials",
                }

            if bing_result:
                response["bing"] = {
                    "executed": True,
                    "success": bing_result["success"],
                    "result": bing_result,
                }
            else:
                response["bing"] = {"executed": False, "reason": "missing_credentials"}

            next_job_id = str(uuid.uuid4())

            await r.hset(
                f"{NEXT_HASH_PATH}:{next_job_id}",
                mapping={
                    "data": json.dumps(response),
                    "status": "queued",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                },
            )  # type: ignore

            # Push ONLY routing data to stream
            await r.xadd(
                f"{NEXT_STREAM_PREFIX}",
                {"job_id": next_job_id, "shop": shop},
            )

            # 1. Update status to completed in the Hash
            await r.hset(
                f"{HASH_PATH}:{job_id}",
                mapping={
                    "status": "completed",
                    "completed_at": datetime.now(timezone.utc).isoformat(),
                },
            )  # type: ignore

            # ACK only after successful processing
            await r.xack(stream_name, GROUP, msg_id)

        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}")

            # Optional: retry / dead-letter logic here
            # For now, ACK to avoid poison-pill loops
            await r.xack(stream_name, GROUP, msg_id)


async def setup_groups():
    """Ensure consumer group exists for the single stream."""
    try:
        # 0 means create group pointing to the beginning of stream
        await r.xgroup_create(STREAM_PREFIX, GROUP, id="0", mkstream=True)
        logger.info(f"Group {GROUP} checked/created for {STREAM_PREFIX}")
    except redis.ResponseError as e:
        if "BUSYGROUP" in str(e):
            pass
        else:
            logger.error(f"Error creating group: {e}")


async def main():
    await setup_groups()
    logger.info(f"Worker {CONSUMER} started listening on {STREAM_PREFIX}")

    while True:
        try:
            # This returns immediately if stream has data.
            messages = await r.xreadgroup(
                GROUP,
                CONSUMER,
                {STREAM_PREFIX: ">"},
                count=1,
                block=2000,
            )

            if not messages:
                continue

            for stream_name, entries in messages:
                for msg_id, data in entries:
                    job_id = data.get("job_id")

                    if not job_id:
                        # Malformed message in stream, ACK and skip
                        await r.xack(stream_name, GROUP, msg_id)
                        continue

                    # Fetch actual job data from Hash
                    job_raw = await r.hget(f"{HASH_PATH}:{job_id}", "data")  # type: ignore

                    if job_raw is None:
                        logger.warning(
                            f"Hash {HASH_PATH}:{job_id} not found (Ghost Job). Cleaning up stream."
                        )
                        # Critical: ACK this so we don't loop forever on a missing job
                        await r.xack(stream_name, GROUP, msg_id)
                        continue

                    job = json.loads(job_raw)

                    # Fire and forget (Concurrency)
                    # This allows the loop to go back to xreadgroup immediately
                    asyncio.create_task(process_job(job_id, job, stream_name, msg_id))

        except redis.ConnectionError:
            logger.error("Connection lost. Retrying in 5 seconds...")
            await asyncio.sleep(5)
        except Exception as e:
            logger.error(f"Critical Loop Error: {e}")
            await asyncio.sleep(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Worker stopped manually.")
    finally:
        pass
