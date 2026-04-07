from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import schemas
from services import habits as habit_service

router = APIRouter(prefix="/habits", tags=["habits"])

@router.get("/", response_model=List[schemas.Habit])
def read_habits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    habits = habit_service.get_habits(db, skip=skip, limit=limit)
    return habits

@router.post("/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db)):
    return habit_service.create_habit(db=db, habit=habit)
