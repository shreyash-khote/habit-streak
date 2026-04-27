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

@router.post("/{habit_id}/complete", response_model=schemas.Habit)
def complete_habit(habit_id: int, db: Session = Depends(get_db)):
    habit = habit_service.log_habit_completion(db=db, habit_id=habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit

@router.get("/stats/heatmap", response_model=List[schemas.HeatmapPoint])
def get_habit_heatmap(db: Session = Depends(get_db)):
    return habit_service.get_heatmap_data(db=db)

@router.get("/stats/detailed", response_model=List[schemas.HabitDetailedStats])
def get_detailed_stats(db: Session = Depends(get_db)):
    return habit_service.get_detailed_stats(db=db)

@router.delete("/{habit_id}")
def delete_habit(habit_id: int, db: Session = Depends(get_db)):
    success = habit_service.delete_habit(db=db, habit_id=habit_id)
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"detail": "Habit deleted"}
