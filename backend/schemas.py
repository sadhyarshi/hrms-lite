from pydantic import BaseModel, EmailStr
from datetime import date


class EmployeeCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str


class AttendanceCreate(BaseModel):
    employee_id: str
    date: date
    status: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        orm_mode = True


class AttendanceResponse(BaseModel):
    id: int
    employee_id: str
    date: date
    status: str

    class Config:
        orm_mode = True