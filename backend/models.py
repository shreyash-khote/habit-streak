from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    freeze_days = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    habits = relationship("Habit", back_populates="owner")

class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    current_streak = Column(Integer, default=0)
    max_streak = Column(Integer, default=0)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Frequency Settings
    frequency_type = Column(String, default="daily") # 'daily', 'weekly', 'monthly'
    frequency_days = Column(String, nullable=True) # Comma-separated: "1,2,3" (0=Mon, 6=Sun)
    frequency_dates = Column(String, nullable=True) # Comma-separated: "1,15,31"
    
    owner = relationship("User", back_populates="habits")
    logs = relationship("HabitLog", back_populates="habit")

class HabitLog(Base):
    __tablename__ = "habit_logs"
    id = Column(Integer, primary_key=True, index=True)
    habit_id = Column(Integer, ForeignKey("habits.id"))
    completed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="completed") # 'completed', 'frozen', 'skipped'
    notes = Column(Text, nullable=True)
    
    habit = relationship("Habit", back_populates="logs")
