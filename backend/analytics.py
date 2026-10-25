"""
Weak-Area Diagnostics and Performance Analyzer in Python
Calculates topic-level accuracy, severity thresholds, and practice recommendations.
"""
from typing import List, Dict, Any

def analyze_weaknesses(topics: List[Dict[str, Any]], quiz_attempts: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not topics:
        return {
            "overall_accuracy": 0.0,
            "weak_topics": [],
            "moderate_topics": [],
            "strong_topics": [],
            "total_attempts": len(quiz_attempts)
        }

    total_acc = sum(t.get('accuracy_rate', 0.5) for t in topics)
    overall_accuracy = round((total_acc / len(topics)) * 100, 1)

    weak_topics = []
    moderate_topics = []
    strong_topics = []

    for t in sorted(topics, key=lambda x: x.get('accuracy_rate', 0.5)):
        acc = t.get('accuracy_rate', 0.5)
        item = {
            "id": t['id'],
            "name": t['name'],
            "subject": t['subject'],
            "accuracy_rate": acc,
            "accuracy_pct": round(acc * 100, 1),
            "attempts": t.get('total_quiz_attempts', 0),
            "severity": "Critical Gap" if acc < 0.5 else ("Needs Practice" if acc < 0.7 else "Proficient")
        }
        if acc < 0.5:
            weak_topics.append(item)
        elif acc < 0.7:
            moderate_topics.append(item)
        else:
            strong_topics.append(item)

    return {
        "overall_accuracy": overall_accuracy,
        "weak_topics": weak_topics,
        "moderate_topics": moderate_topics,
        "strong_topics": strong_topics,
        "total_attempts": len(quiz_attempts),
        "recommended_focus": weak_topics[0] if weak_topics else (moderate_topics[0] if moderate_topics else None)
    }
