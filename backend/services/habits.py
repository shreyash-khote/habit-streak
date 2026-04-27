from sqlalchemy.orm import Session
from sqlalchemy import func
import models
import schemas
from datetime import datetime, timedelta

def get_habits(db: Session, skip: int = 0, limit: int = 100):
    habits = db.query(models.Habit).offset(skip).limit(limit).all()
    today = datetime.utcnow().date()
    yesterday = today - timedelta(days=1)
    
    for habit in habits:
        if habit.current_streak > 0:
            last_log_for_streak = db.query(models.HabitLog).filter(
                models.HabitLog.habit_id == habit.id,
                models.HabitLog.status == 'completed'
            ).order_by(models.HabitLog.completed_at.desc()).first()
            
            if not last_log_for_streak or last_log_for_streak.completed_at.date() < yesterday:
                habit.current_streak = 0
                db.commit()
                
        # Check if completed today
        completed_today = False
        last_log = db.query(models.HabitLog).filter(
            models.HabitLog.habit_id == habit.id,
            models.HabitLog.status == 'completed'
        ).order_by(models.HabitLog.completed_at.desc()).first()
        
        if last_log and last_log.completed_at.date() == today:
            completed_today = True
            
        setattr(habit, 'completed', completed_today)
                
    return habits

def create_habit(db: Session, habit: schemas.HabitCreate, user_id: int = 1):
    db_habit = models.Habit(
        title=habit.title,
        description=habit.description,
        category=habit.category,
        frequency_type=habit.frequency_type,
        frequency_days=habit.frequency_days,
        frequency_dates=habit.frequency_dates,
        start_time=habit.start_time,
        duration=habit.duration,
        duration_seconds=habit.duration_seconds,
        icon=habit.icon,
        owner_id=user_id
    )
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def log_habit_completion(db: Session, habit_id: int):
    habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if not habit:
        return None
    
    # Check if already completed today
    today = datetime.utcnow().date()
    existing_log = db.query(models.HabitLog).filter(
        models.HabitLog.habit_id == habit_id,
        func.date(models.HabitLog.completed_at) == today
    ).first()
    
    if not existing_log:
        log = models.HabitLog(habit_id=habit_id, status='completed')
        db.add(log)
        
        # Check if they completed it yesterday
        yesterday = today - timedelta(days=1)
        last_log = db.query(models.HabitLog).filter(
            models.HabitLog.habit_id == habit.id,
            models.HabitLog.status == 'completed',
            func.date(models.HabitLog.completed_at) < today
        ).order_by(models.HabitLog.completed_at.desc()).first()
        
        if last_log and last_log.completed_at.date() == yesterday:
            habit.current_streak += 1
        else:
            habit.current_streak = 1
            
        if habit.current_streak > habit.max_streak:
            habit.max_streak = habit.current_streak
            
        db.commit()
        db.refresh(habit)
    
    return habit

def get_heatmap_data(db: Session, user_id: int = 1, days: int = 180):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Query logs for habits owned by the user, grouped by date
    results = db.query(
        func.date(models.HabitLog.completed_at).label('date'),
        func.count(models.HabitLog.id).label('count')
    ).join(models.Habit).filter(
        models.Habit.owner_id == user_id,
        models.HabitLog.completed_at >= start_date,
        models.HabitLog.status == 'completed'
    ).group_by(
        func.date(models.HabitLog.completed_at)
    ).all()
    
    return [{"date": r.date, "count": r.count} for r in results]

def delete_habit(db: Session, habit_id: int):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id).first()
    if db_habit:
        db.delete(db_habit)
        db.commit()
    return db_habit

def get_detailed_stats(db: Session, user_id: int = 1, days: int = 180):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all habits for user
    habits = db.query(models.Habit).filter(models.Habit.owner_id == user_id).all()
    
    # Get all logs for these habits in one go to be efficient
    logs = db.query(
        models.HabitLog.habit_id,
        func.date(models.HabitLog.completed_at).label('date'),
        func.count(models.HabitLog.id).label('count')
    ).join(models.Habit).filter(
        models.Habit.owner_id == user_id,
        models.HabitLog.completed_at >= start_date,
        models.HabitLog.status == 'completed'
    ).group_by(
        models.HabitLog.habit_id,
        func.date(models.HabitLog.completed_at)
    ).all()
    
    # Organize logs into a dictionary for easy mapping
    stats_map = {}
    for log in logs:
        if log.habit_id not in stats_map:
            stats_map[log.habit_id] = []
        stats_map[log.habit_id].append({"date": log.date, "count": log.count})
        
    result = []
    for h in habits:
        result.append({
            "habit_id": h.id,
            "title": h.title,
            "category": h.category,
            "icon": "star",
            "points": stats_map.get(h.id, [])
        })
        
    return result
