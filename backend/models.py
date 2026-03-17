from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base


class Employee(Base):

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(String(50), unique=True, index=True)

    email = Column(String(100), unique=True)

    full_name = Column(String(100))

    department = Column(String(100))

    # relationship
    attendance_records = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete"
    )


class Attendance(Base):

    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        String(50),
        ForeignKey("employees.employee_id", ondelete="CASCADE")
    )

    date = Column(Date)

    status = Column(String(10))

    employee = relationship(
        "Employee",
        back_populates="attendance_records"
    )

    __table_args__ = (
        UniqueConstraint("employee_id", "date", name="unique_attendance"),
    )