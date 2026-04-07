from fastapi import FastAPI
from database import engine, Base
from routers import coach, habits
import models

# Create all database tables based on models
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Streak Coach API")

app.include_router(coach.router)
app.include_router(habits.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Habit Streak Coach API"}
