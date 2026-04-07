from fastapi import FastAPI
from database import engine, Base
from routers import coach, habits
from fastapi.middleware.cors import CORSMiddleware
import models

# Create all database tables based on models
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Streak Coach API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(coach.router)
app.include_router(habits.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Habit Streak Coach API"}
