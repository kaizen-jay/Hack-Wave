"""
Adaptive Study Planning and Prioritization Engine in Python
Connects academic deadlines, quiz weakness, topic complexity, and spaced repetition.
"""
from datetime import date
from typing import List, Dict, Any

def calculate_priority_score(
    topic: Dict[str, Any],
    deadlines: List[Dict[str, Any]],
    revisions: List[Dict[str, Any]]
) -> Dict[str, Any]:
    today = date.today()
    subject_deadlines = [
        d for d in deadlines if d['subject'].lower() == topic['subject'].lower()
    ]

    deadline_weight = 0
    deadline_reason = ""

    if subject_deadlines:
        sorted_dls = sorted(
            subject_deadlines,
            key=lambda d: (date.fromisoformat(d['exam_date']) - today).days
        )
        nearest = sorted_dls[0]
        days_left = (date.fromisoformat(nearest['exam_date']) - today).days

        if days_left <= 3:
            deadline_weight = 40 * (nearest.get('weight', 5) / 5.0)
            deadline_reason = f"Exam in {days_left}d ({nearest['subject']})"
        elif days_left <= 7:
            deadline_weight = 28 * (nearest.get('weight', 5) / 5.0)
            deadline_reason = f"Exam next week ({days_left}d away)"
        elif days_left <= 14:
            deadline_weight = 16 * (nearest.get('weight', 5) / 5.0)
            deadline_reason = f"Exam in {days_left}d"
        else:
            deadline_weight = 8
            deadline_reason = f"Upcoming exam in {days_left}d"

    # Weakness from quiz accuracy (up to 35 pts)
    accuracy = float(topic.get('accuracy_rate', 0.5))
    weakness_weight = (1.0 - accuracy) * 35.0
    weakness_reason = f"Weak accuracy ({round(accuracy * 100)}%)" if accuracy < 0.6 else ""

    # Intrinsic difficulty & importance (up to 20 pts)
    diff = topic.get('difficulty', 3)
    imp = topic.get('importance', 3)
    intrinsic_weight = ((diff * 0.5 + imp * 0.5) / 5.0) * 20.0

    # Spaced repetition status
    rev_match = next((r for r in revisions if r.get('topic_id') == topic['id']), None)
    rev_bonus = 0
    rev_reason = ""
    if rev_match:
        if rev_match.get('status') == 'overdue':
            rev_bonus = 15
            rev_reason = "Overdue Spaced Revision"
        elif rev_match.get('status') == 'due':
            rev_bonus = 8
            rev_reason = "Revision Due Today"

    total_score = round(deadline_weight + weakness_weight + intrinsic_weight + rev_bonus)
    reasons = [r for r in [deadline_reason, weakness_reason, rev_reason] if r]
    reason_str = " · ".join(reasons) if reasons else f"Difficulty {diff}/5 · Importance {imp}/5"

    return {
        "score": total_score,
        "reason": reason_str
    }

def generate_daily_schedule(
    student_id: str,
    topics: List[Dict[str, Any]],
    deadlines: List[Dict[str, Any]],
    revisions: List[Dict[str, Any]],
    available_hours: float
) -> List[Dict[str, Any]]:
    scored_topics = []
    for t in topics:
        p_info = calculate_priority_score(t, deadlines, revisions)
        scored_topics.append({
            "topic": t,
            "score": p_info['score'],
            "reason": p_info['reason']
        })

    scored_topics.sort(key=lambda x: x['score'], reverse=True)

    total_minutes = int(available_hours * 60)
    allocated = 0
    sessions = []
    time_slots = ['09:00 - 09:50', '10:15 - 11:05', '14:00 - 14:50', '16:00 - 16:50', '19:30 - 20:20']
    today_str = date.today().isoformat()

    for idx, item in enumerate(scored_topics):
        if allocated >= total_minutes:
            break
        duration = min(50, total_minutes - allocated)
        if duration < 25:
            break

        sessions.append({
            "id": f"sess-auto-{idx + 1}-{item['topic']['id']}",
            "student_id": student_id,
            "topic_id": item['topic']['id'],
            "topic_name": item['topic']['name'],
            "subject": item['topic']['subject'],
            "session_date": today_str,
            "time_slot": time_slots[idx % len(time_slots)],
            "scheduled_minutes": duration,
            "actual_minutes": None,
            "status": "planned",
            "priority_score": item['score'],
            "reason_prioritized": item['reason'],
            "notes": None
        })
        allocated += duration

    return sessions
