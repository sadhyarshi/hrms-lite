from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

import models, schemas
from database import SessionLocal

router = APIRouter(prefix="/employees", tags=["Employees"])


# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Add employee
@router.post("")
def add_employee(emp: schemas.EmployeeCreate, db: Session = Depends(get_db)):

    # Check duplicate employee id
    existing = db.query(models.Employee).filter(
        models.Employee.employee_id == emp.employee_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Employee already exists"
        )

    # Check duplicate email
    email_exists = db.query(models.Employee).filter(
        models.Employee.email == emp.email
    ).first()

    if email_exists:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    employee = models.Employee(**emp.dict())

    try:
        db.add(employee)
        db.commit()
        db.refresh(employee)

        return {
            "message": "Employee added successfully",
            "employee": employee
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Get all employees
@router.get("")
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


# Delete employee
@router.delete("/{id}")
def delete_employee(id: int, db: Session = Depends(get_db)):

    employee = db.query(models.Employee).filter(
        models.Employee.id == id
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted"}


# Total present days per employee
@router.get("/present-days")
def employee_present_days(db: Session = Depends(get_db)):

    result = db.query(
        models.Attendance.employee_id,
        func.count(models.Attendance.id).label("present_days")
    ).filter(
        models.Attendance.status == "Present"
    ).group_by(
        models.Attendance.employee_id
    ).all()

    return [
        {"employee_id": row.employee_id, "present_days": row.present_days}
        for row in result
    ]