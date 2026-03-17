import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://hrms-dbqd.onrender.com",
});

// Response Interceptor - Centralized Error Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

// ── Employees ────────────────────────────────────────────
export const getEmployees   = ()         => API.get("/employees");
export const addEmployee    = (data)     => API.post("/employees", data);
export const updateEmployee = (id, data) => API.put(`/employees/${id}`, data);
export const deleteEmployee = (id)       => API.delete(`/employees/${id}`);
export const getPresentDays = ()         => API.get("/employees/present-days");

// ── Attendance ───────────────────────────────────────────
export const markAttendance = (data)     => API.post("/attendance", data);
export const getAttendance  = (empId)    => API.get(`/attendance/${empId}`);

// ── Dashboard ────────────────────────────────────────────
export const getDashboard   = ()         => API.get("/dashboard");