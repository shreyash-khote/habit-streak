from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
import schemas
import models
from services import habits as habit_service

router = APIRouter(prefix="/habits", tags=["habits"])

@router.get("/", response_model=List[schemas.Habit])
def read_habits(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return habit_service.get_habits(db, user_id=current_user.id, skip=skip, limit=limit)

@router.post("/", response_model=schemas.Habit)
def create_habit(
    habit: schemas.HabitCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return habit_service.create_habit(db=db, habit=habit, user_id=current_user.id)

@router.get("/stats/heatmap", response_model=List[schemas.HeatmapPoint])
def get_habit_heatmap(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return habit_service.get_heatmap_data(db=db, user_id=current_user.id)

@router.get("/stats/detailed", response_model=List[schemas.HabitDetailedStats])
def get_detailed_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return habit_service.get_detailed_stats(db=db, user_id=current_user.id)

@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    success = habit_service.delete_habit(db=db, habit_id=habit_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"detail": "Habit deleted"}
