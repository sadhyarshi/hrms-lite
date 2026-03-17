# HRMS Lite — Human Resource Management System

A full-stack HR Management System built with **FastAPI** (backend) and **React + Vite** (frontend) that allows organizations to manage employees and track daily attendance.

---

## Project Overview

HRMS Lite is a lightweight Human Resource Management System designed to handle core HR operations. It provides a clean dashboard to monitor employee attendance in real time, add or remove employees, and view attendance history with date-based filters.

The system is split into two parts:
- **Backend** — REST API built with FastAPI and MySQL database
- **Frontend** — React single-page application with Tailwind CSS

---

## Features

- Add and manage employees
- Mark attendance (Present / Absent) per employee per day
- **Admin can update already marked attendance** — marking attendance again on the same day automatically updates the existing record instead of creating a duplicate
- View attendance history with date range filters
- Live dashboard showing today's total, present, and absent counts
- Display total present days per employee in the employee table
- Delete employees with smooth animations

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.11 | Core language |
| FastAPI | REST API framework |
| SQLAlchemy | ORM for database operations |
| PyMySQL | MySQL database driver |
| Pydantic | Data validation and schemas |
| Uvicorn | ASGI server |
| python-dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Axios | HTTP client for API calls |

---

## Project Structure

```
HRMS/
├── backend/
│   ├── main.py                  # App setup, middleware, dashboard & health routes
│   ├── employee_routes.py       # All /employees routes
│   ├── attendance_routes.py     # All /attendance routes
│   ├── models.py                # SQLAlchemy database models
│   ├── schemas.py               # Pydantic request/response schemas
│   ├── database.py              # Database connection setup
│   ├── requirements.txt         # Python dependencies
│   ├── .env                     # Environment variables (not committed)
│   └── .env.example             # Environment variable template
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmployeeForm.jsx      # Add employee form
│   │   │   ├── EmployeeList.jsx      # Employee table with delete, attendance & present days
│   │   │   └── Attendance.jsx        # Mark attendance component
│   │   ├── services/
│   │   │   └── api.js                # Axios API calls
│   │   ├── App.jsx                   # Root component with dashboard
│   │   └── main.jsx                  # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL installed and running

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sadhyarshi/HRMS-lite.git
```

---

### Step 2 — Database Setup

Open MySQL and run:

```sql
CREATE DATABASE hrms;
```

---

### Step 3 — Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hrms
```

Start the backend server:

```bash
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`  
API docs available at: `http://localhost:8000/docs`

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

### General
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Check backend is running |
| GET | `/health` | Health check |
| GET | `/dashboard` | Get today's total, present, absent count |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | Get all employees |
| POST | `/employees` | Add new employee |
| DELETE | `/employees/{id}` | Delete employee by ID |
| GET | `/employees/present-days` | Get total present days per employee |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/attendance` | Mark attendance — if already marked for the day, updates the existing record |
| GET | `/attendance/{employee_id}` | Get attendance history by employee ID |

---

## Attendance Update Behaviour

When admin marks attendance for an employee on a day that already has a record, the system **automatically updates** the existing record instead of throwing an error or creating a duplicate. This allows admins to correct mistakes without any extra steps.

Example:
- Employee `E001` is marked **Absent** in the morning
- Admin marks `E001` as **Present** later in the day
- The record is updated to **Present** — no duplicate is created

---

## Environment Variables

Create a `.env` file in the `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hrms
```

> Never commit `.env` to Git. Use `.env.example` as a reference template.

---

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE hrms;
```

Tables are created automatically when the backend starts.

---

## Assumptions & Limitations

- **Single day attendance** — Only one attendance record per employee per day. Marking attendance again on the same day updates the existing record.
- **No authentication** — There is no login or role-based access control. The system is open to all users on the network.
- **Local MySQL only** — The backend is configured for a local MySQL database. Cloud database credentials must be updated in `.env` for deployment.
- **Employee ID is unique** — Each employee must have a unique employee ID and email. Duplicates are rejected by the API.
- **No pagination** — The employee list and attendance records load all data at once. Performance may be affected with very large datasets.
- **CORS open** — The backend allows all origins (`*`) for development. This should be restricted in production.

---

## License

This project is for educational purposes.