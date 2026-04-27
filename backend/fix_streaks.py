from database import SessionLocal
import models
from datetime import datetime, timedelta

def recalculate_streaks():
    db = SessionLocal()
    habits = db.query(models.Habit).all()
    today = datetime.utcnow().date()
    
    for habit in habits:
        logs = db.query(models.HabitLog).filter(
            models.HabitLog.habit_id == habit.id,
            models.HabitLog.status == 'completed'
        ).order_by(models.HabitLog.completed_at.desc()).all()
        
        computed_streak = 0
        if logs:
            current_check_date = today
            first_log_date = logs[0].completed_at.date()
            if first_log_date == today:
                computed_streak = 1
                current_check_date = today - timedelta(days=1)
                start_idx = 1
            elif first_log_date == today - timedelta(days=1):
                computed_streak = 1
                current_check_date = today - timedelta(days=2)
                start_idx = 1
            else:
                computed_streak = 0
                start_idx = len(logs)
            
            for i in range(start_idx, len(logs)):
                log_date = logs[i].completed_at.date()
                if log_date == current_check_date:
                    computed_streak += 1
                    current_check_date -= timedelta(days=1)
                elif log_date > current_check_date:
                    pass
                else:
                    break
                    
        print(f"Habit {habit.id} ({habit.title}): setting streak to {computed_streak}")
        habit.current_streak = computed_streak
        db.commit()
    
    db.close()

if __name__ == "__main__":
    recalculate_streaks()
