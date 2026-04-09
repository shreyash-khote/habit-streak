import sys
import os
from datetime import datetime, timedelta
import random

# Add parent directory to sys.path to find database/models
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, engine
import models

def seed():
    db = SessionLocal()
    try:
        # 1. Ensure we have at least one user
        user = db.query(models.User).filter(models.User.id == 1).first()
        if not user:
            user = models.User(id=1, username="default_user", email="user@example.com")
            db.add(user)
            db.commit()
            db.refresh(user)

        # 2. Ensure we have some habits
        habits = db.query(models.Habit).filter(models.Habit.owner_id == 1).all()
        if not habits:
            habit1 = models.Habit(title="Reading", owner_id=1)
            habit2 = models.Habit(title="Exercise", owner_id=1)
            db.add(habit1)
            db.add(habit2)
            db.commit()
            habits = [habit1, habit2]

        # 3. Create logs for the last 180 days
        print("Seeding habit logs for the last 180 days...")
        
        # Clear existing logs for fresh start (Optional)
        # db.query(models.HabitLog).delete()
        
        for i in range(180):
            date = datetime.utcnow() - timedelta(days=i)
            # Randomly decide if habits were completed on this day
            for habit in habits:
                if random.random() > 0.4: # 60% completion rate
                    log = models.HabitLog(
                        habit_id=habit.id,
                        completed_at=date,
                        status="completed"
                    )
                    db.add(log)
        
        db.commit()
        print("Success! Heatmap data seeded.")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
