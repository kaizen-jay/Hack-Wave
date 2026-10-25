"""
SuperMemo SM-2 Spaced Repetition Algorithm in Python
Counteracts the Ebbinghaus forgetting curve by dynamically computing
memory retention intervals and Ease Factor (EF).
"""
from datetime import date, timedelta
from typing import Dict, Any

def calculate_sm2_review(
    current_repetition: int,
    current_interval: int,
    current_ease_factor: float,
    rating: int  # 1: Again, 2: Hard, 3: Good, 4: Easy
) -> Dict[str, Any]:
    # SM-2 standard scales quality from 0-5. We map 1-4 to 2-5:
    q = rating + 1
    
    # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = current_ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if new_ef < 1.3:
        new_ef = 1.3
        
    if rating == 1:
        # Failed recall: reset repetition count, review tomorrow
        new_repetition = 0
        new_interval = 1
    elif rating == 2:
        new_repetition = current_repetition + 1
        new_interval = max(1, round(current_interval * 1.2))
    elif rating == 3:
        if current_repetition == 0:
            new_interval = 1
        elif current_repetition == 1:
            new_interval = 4
        else:
            new_interval = round(current_interval * new_ef)
        new_repetition = current_repetition + 1
    else:  # rating 4 (Easy)
        if current_repetition == 0:
            new_interval = 3
        elif current_repetition == 1:
            new_interval = 7
        else:
            new_interval = round(current_interval * new_ef * 1.3)
        new_repetition = current_repetition + 1
        
    due_date = (date.today() + timedelta(days=new_interval)).isoformat()
    
    return {
        "interval_days": new_interval,
        "repetition_count": new_repetition,
        "ease_factor": round(new_ef, 2),
        "due_date": due_date
    }
