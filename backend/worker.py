import redis
import json
import time
import socket

r = redis.Redis(
    host="localhost",
    port=6379,
    password="strongpassword123",
    decode_responses=True
)

STREAMS = [
    "stream:jobs:high",
    "stream:jobs:normal",
    "stream:jobs:low"
]

GROUP = "job-workers"
CONSUMER = socket.gethostname()

# Ensure consumer groups exist
for stream in STREAMS:
    try:
        r.xgroup_create(stream, GROUP, id="0", mkstream=True)
    except redis.ResponseError:
        pass

def process_job(job: dict):
    print("Processing:", job["job_id"], job["action"])
    time.sleep(2)  # simulate work

while True:
    for stream in STREAMS:
        messages = r.xreadgroup(
            GROUP,
            CONSUMER,
            {stream: ">"},
            count=1,
            block=2000
        )

        if not messages:
            continue

        for _, entries in messages:
            for msg_id, data in entries:
                job_id = data["job_id"]

                job_raw = r.hget(f"job:{job_id}", "data")
                job = json.loads(job_raw)

                try:
                    process_job(job)

                    r.hset(
                        f"job:{job_id}",
                        mapping={
                            "status": "completed",
                            "completed_at": time.time()
                        }
                    )

                    r.xack(stream, GROUP, msg_id)

                except Exception:
                    job["attempt"] += 1
                    r.hset(
                        f"job:{job_id}",
                        mapping={
                            "data": json.dumps(job),
                            "status": "retrying"
                        }
                    )

        break  # restart priority order loop
