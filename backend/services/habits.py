from sqlalchemy.orm import Session
import models
import schemas

def get_habits(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Habit).offset(skip).limit(limit).all()

def create_habit(db: Session, habit: schemas.HabitCreate, user_id: int = 1):
    db_habit = models.Habit(
        title=habit.title,
        description=habit.description,
        category=habit.category,
        frequency_type=habit.frequency_type,
        frequency_days=habit.frequency_days,
        frequency_dates=habit.frequency_dates,
        owner_id=user_id
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit
