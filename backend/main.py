from fastapi import FastAPI
from database import engine, Base
from routers import coach
import models

# Create all database tables based on models
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Streak Coach API")

app.include_router(coach.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Habit Streak Coach API"}
