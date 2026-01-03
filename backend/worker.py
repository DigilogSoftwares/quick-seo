import redis.asyncio as redis
import json
import asyncio
import socket
import time
import logging

# Set up logging for better visibility
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

r = redis.Redis(
    host="localhost", port=6379, password="strongpassword123", decode_responses=True
)

# We map streams to IDs in a dictionary for xreadgroup
# ">" means "give me new messages meant for this consumer"
STREAMS = {"stream:data-prep-agents": ">"}

GROUP = "job-workers"
CONSUMER = socket.gethostname()


async def setup_groups():
    """Ensure consumer groups exist for all streams before starting."""
    for stream in STREAMS.keys():
        try:
            # 0 means create group pointing to the beginning of stream
            await r.xgroup_create(stream, GROUP, id="0", mkstream=True)
            logger.info(f"Group {GROUP} checked/created for {stream}")
        except redis.ResponseError as e:
            if "BUSYGROUP" in str(e):
                pass
            else:
                logger.error(f"Error creating group: {e}")


async def process_job(job_id, job_data, stream, msg_id):
    """
    Actual job logic running in the background.
    """
    try:
        # logger.info(f"Processing Job {job_id} [{job_data.get('action')}] from {stream}")

        # Simulate work (non-blocking sleep)
        await asyncio.sleep(2)

        # 1. Update status to completed in the Hash
        await r.hset(
            f"job:{job_id}",
            mapping={"status": "completed", "completed_at": time.time()},
        )  # type: ignore

        # 2. ACK the message in the stream so it is removed from the Pending List
        await r.xack(stream, GROUP, msg_id)
        logger.info(f"Job {job_id} Completed and ACKed")

    except Exception as e:
        logger.error(f"Job {job_id} Failed: {e}")

        # Handle Retry Logic
        current_attempt = job_data.get("attempt", 0) + 1
        job_data["attempt"] = current_attempt

        await r.hset(
            f"job:{job_id}",
            mapping={
                "data": json.dumps(job_data),
                "status": "retrying",
                "last_error": str(e),
            },
        )  # type: ignore
        # Note: We do NOT ACK here.
        # Leaving it un-ACKed allows a separate "recovery consumer" (using XAUTOCLAIM)
        # to pick it up later if this worker crashes completely.


async def main():
    await setup_groups()
    logger.info(f"Worker {CONSUMER} started listening on {list(STREAMS.keys())}")

    while True:
        try:
            # OPTIMIZATION: Read from ALL streams in a single call.
            # This returns immediately if ANY stream has data.
            messages = await r.xreadgroup(
                GROUP,
                CONSUMER,
                STREAMS,  # type: ignore
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
                    job_raw = await r.hget(f"job:{job_id}", "data")  # type: ignore

                    if job_raw is None:
                        logger.warning(
                            f"Hash job:{job_id} not found (Ghost Job). Cleaning up stream."
                        )
                        # Critical: ACK this so we don't loop forever on a missing job
                        await r.xack(stream_name, GROUP, msg_id)
                        continue

                    job = json.loads(job_raw)

                    # Fire and forget (Concurrency)
                    # This allows the loop to go back to xreadgroup immediately
                    print(job)
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
