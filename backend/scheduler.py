import redis
import uuid
import json
from datetime import datetime, timezone

r = redis.Redis(
    host="localhost",
    port=6379,
    password="strongpassword123",
    decode_responses=True
)

STREAM_PREFIX = "stream:jobs"

def schedule_job(
    store_name: str,
    action: str,
    priority: str = "normal",
    payload: dict = {},
    meta: dict = {}
):
    job_id = str(uuid.uuid4())

    job = {
        "job_id": job_id,
        "store_name": store_name,
        "action": action,
        "attempt": 0,
        "priority": priority,
        "payload": payload or {},
        "meta": meta or {},
    }

    # Store full job
    r.hset(
        f"job:{job_id}",
        mapping={
            "data": json.dumps(job),
            "status": "queued",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    )

    # Push ONLY routing data to stream
    r.xadd(
        f"{STREAM_PREFIX}:{priority}",
        {
            "job_id": job_id,
            "action": action,
            "store_name": store_name
        }
    )

    print("Scheduled job:", job_id, "priority:", priority)

if __name__ == "__main__":
    schedule_job(
        store_name="acme_co",
        action="index.urls",
        priority="low",
        payload={
            "requested_at": "2025-12-31T12:00:00Z",
            "filters": {"from": "2025-12-01"}
        },
        meta={"source": "scheduler-A"}
    )
