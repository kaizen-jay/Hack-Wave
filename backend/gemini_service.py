"""
Gemini AI Service in Python
Leverages Gemini 3.8 Flash for intelligent study recommendations,
diagnostic quiz question generation, and custom career skill roadmaps.
"""
import os
import json
import urllib.request
import urllib.error

API_KEY = os.environ.get('GEMINI_API_KEY', '')

def call_gemini(prompt: str, json_mode: bool = True) -> str:
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={API_KEY}"

    payload_dict = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    if json_mode:
        payload_dict["generationConfig"] = {
            "responseMimeType": "application/json"
        }

    data = json.dumps(payload_dict).encode('utf-8')
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=12) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        candidates = res_data.get('candidates', [])
        if candidates and 'content' in candidates[0]:
            parts = candidates[0]['content'].get('parts', [])
            if parts and 'text' in parts[0]:
                return parts[0]['text']

    raise ValueError("Empty response from Gemini API")

def get_study_recommendation(student_data: dict, weak_topics: list, deadlines: list) -> dict:
    prompt = f"""You are a senior computer science professor and personal study mentor.
Student Context:
- Target Career: {student_data.get('career_goal', 'Software Engineer')}
- Weekly Target: {student_data.get('weekly_target_hours', 14)} hours
- Detected Weak Areas: {json.dumps(weak_topics)}
- Upcoming Deadlines: {json.dumps(deadlines)}

Provide concise, practical, actionable study guidance (under 120 words) explaining why specific topics are prioritized, and suggest 2-3 specific tactical study habits (e.g. Feynman technique, test-driven study, active recall). Return valid JSON:
{{
  "advice": "string",
  "priorityAdjustments": [
    {{"topic": "string", "reason": "string", "recommendedMinutes": 45}}
  ]
}}"""
    try:
        raw = call_gemini(prompt, json_mode=True)
        return json.loads(raw)
    except Exception as e:
        # High quality heuristic mentor fallback
        nearest_exam = deadlines[0]['subject'] if deadlines else 'your upcoming exam'
        top_weak = weak_topics[0]['name'] if weak_topics else 'core topics'
        return {
            "source": "heuristic_mentor",
            "advice": f"Prioritize 50-minute active recall drills on {top_weak} today. With your {nearest_exam} exam approaching rapidly, replace passive reading with self-testing and problem solving.",
            "priorityAdjustments": [
                {"topic": top_weak, "reason": "Sub-60% accuracy requiring active practice", "recommendedMinutes": 50}
            ]
        }

def generate_quiz(topic_name: str, difficulty: str = "Medium", count: int = 3) -> list:
    prompt = f"""Generate {count} high-quality, practical multiple-choice diagnostic questions on the topic "{topic_name}" at difficulty level "{difficulty}".
For each question, provide:
- question: clear, precise scenario or concept question
- options: array of 4 distinct answers
- correctAnswerIndex: 0-3 index
- explanation: educational explanation of why the correct answer is right and common pitfalls
Return valid JSON as an object: {{ "questions": [ ... ] }}"""
    try:
        raw = call_gemini(prompt, json_mode=True)
        data = json.loads(raw)
        return data.get("questions", [])
    except Exception as e:
        return [
            {
                "id": "py-fallback-1",
                "question": f"In {topic_name}, what is the principal architectural advantage of asymptotic optimization?",
                "options": [
                    "Decreases worst-case computational upper bound as n scales",
                    "Eliminates memory overhead completely",
                    "Guarantees parallel hardware core execution",
                    "Requires zero compiler optimizations"
                ],
                "correctAnswerIndex": 0,
                "explanation": "Asymptotic analysis guarantees bounded growth rate of runtime or memory regardless of hardware constants.",
                "difficulty": difficulty
            }
        ]
