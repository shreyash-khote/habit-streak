import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

_client = None

def get_client():
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return None
        _client = OpenAI(api_key=api_key)
    return _client

def get_habit_suggestions_for_goal(goal: str) -> str:
    """Takes a big goal and uses OpenAI to break it down into daily actionable habits."""
    client = get_client()
    if not client:
        return "AI Coach is currently offline (API key missing)."
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are 'True Coach', an expert in habit building. Break down the user's large goal into 3 specific, very small daily micro-habits. Return the response as a bulleted list. Do not use markdown headers, just bullet points."},
                {"role": "user", "content": f"My goal is: {goal}"}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI Error: {e}")
        # Fallback to local mock coach if API fails (e.g., quota exceeded or network error)
        return (
            "True Coach (Offline Backup):\n"
            "• Spend 10 minutes daily researching or reading about this goal.\n"
            "• Dedicate 15 minutes of uninterrupted focus to it today.\n"
            "• Write down one specific step you will take tomorrow."
        )
