from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GoalBreakdownRequest(BaseModel):
    goal: str

class GoalBreakdownResponse(BaseModel):
    goal: str
    suggestion: str
