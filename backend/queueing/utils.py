from .models import TemporaryStorageQueue
from django.utils.timezone import localdate
from datetime import date

def compute_queue_snapshot():
    today = localdate()
    priority = TemporaryStorageQueue.objects.filter(
        status="Waiting",
        priority_level="Priority",
        created_at__date=today
    ).order_by("position", "queue_number")
    regular = TemporaryStorageQueue.objects.filter(
        status="Waiting",
        priority_level="Regular",
        created_at__date=today
    ).order_by("position", "queue_number")

    def get_next(qs):
        lst = list(qs)
        return (
            lst[0] if len(lst) > 0 else None,
            lst[1] if len(lst) > 1 else None,
            lst[2] if len(lst) > 2 else None,
        )

    def fmt(q):
        if not q:
            return None
        if q.user and hasattr(q.user, "patient_profile"):
            patient = q.user.patient_profile
            first_name = patient.first_name
            last_name = patient.last_name
            phone = patient.phone_number
            dob = patient.date_of_birth
            pid = patient.patient_id
        else:
            first_name = q.temp_first_name
            last_name = q.temp_last_name
            phone = q.temp_phone_number
            dob = q.temp_date_of_birth
            pid = None

        # compute age
        if dob:
            try:
                dob_date = date.fromisoformat(str(dob))
                today0 = date.today()
                age = today0.year - dob_date.year - (
                    (today0.month, today0.day) < (dob_date.month, dob_date.day)
                )
            except Exception:
                age = None
        else:
            age = None

        return {
            "id": q.id,
            "patient_id": pid,
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone,
            "date_of_birth": dob,
            "age": age,
            "priority_level": q.priority_level,
            "complaint": q.complaint,
            "status": q.status,
            "queue_number": q.queue_number,
            "position": q.position,
            "created_at": q.created_at,
            "is_new_patient": not q.user,
        }

    pr0, pr1, pr2 = get_next(priority)
    rg0, rg1, rg2 = get_next(regular)

    return {
        "priority_current": fmt(pr0),
        "priority_next1": fmt(pr1),
        "priority_next2": fmt(pr2),
        "regular_current": fmt(rg0),
        "regular_next1": fmt(rg1),
        "regular_next2": fmt(rg2),
    }
