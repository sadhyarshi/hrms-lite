from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

import models, schemas
from database import SessionLocal

router = APIRouter(prefix="/attendance", tags=["Attendance"])


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Mark or update attendance
@router.post("")
def mark_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db)):

    employee = db.query(models.Employee).filter(
        models.Employee.employee_id == data.employee_id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Check if attendance already exists for that day
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == data.employee_id,
        models.Attendance.date == data.date
    ).first()

    if existing:
        # Update instead of creating duplicate
        existing.status = data.status
        db.commit()
        db.refresh(existing)

        return {
            "message": "Attendance updated",
            "data": existing
        }

    # Create new attendance record
    attendance = models.Attendance(**data.dict())

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return {
        "message": "Attendance recorded",
        "data": attendance
    }


# Get attendance by employee ID
@router.get("/{employee_id}")
def get_attendance(employee_id: str, db: Session = Depends(get_db)):

    records = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()

    return records