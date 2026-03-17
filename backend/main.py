from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date

import models
from database import engine, SessionLocal
from employee_routes import router as employee_router
from attendance_routes import router as attendance_router

# Create FastAPI app
app = FastAPI(title="HRMS Lite API")

# Allow React frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(employee_router)
app.include_router(attendance_router)


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Root route
@app.get("/")
def home():
    return {"message": "HRMS Lite Backend Running"}


# Health check
@app.get("/health")
def health():
    return {"status": "ok"}


# Startup DB check
@app.on_event("startup")
def startup():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))


# Dashboard summary
@app.get("/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):

    today = date.today()

    total_employees = db.query(models.Employee).count()

    present_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == "Present"
    ).count()

    absent_today = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == "Absent"
    ).count()

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today
    }