from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GoalBreakdownRequest(BaseModel):
    goal: str

class GoalBreakdownResponse(BaseModel):
    goal: str
    suggestion: str

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    frequency_type: str = "daily"
    frequency_days: Optional[str] = None
    frequency_dates: Optional[str] = None
    start_time: Optional[str] = "08:00 AM"

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    current_streak: int
    max_streak: int
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    frequency_type: str = "daily"
    frequency_days: Optional[str] = None
    frequency_dates: Optional[str] = None
    start_time: Optional[str] = "08:00 AM"

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    current_streak: int
    max_streak: int
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True
