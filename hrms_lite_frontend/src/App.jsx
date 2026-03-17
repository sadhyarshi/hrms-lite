import { useCallback, useEffect, useState } from 'react';
import { 
  Building2, Activity, Users, CalendarCheck, 
  Search, LayoutGrid, ListFilter, Clock, 
  ShieldCheck, ArrowUpRight, CheckCircle, Globe
} from 'lucide-react';

// Sub-components
import DashboardStats from './components/DashboardStats';
import AttendanceForm from './components/attendance/AttendanceForm';
import AttendanceTable from './components/attendance/AttendanceTable';
import EmployeeForm from './components/employees/EmployeeForm';
import EmployeeTable from './components/employees/EmployeeTable';
import Card from './components/ui/Card';
import StateMessage from './components/ui/StateMessage';

// API Services
import {
  addEmployee,
  deleteEmployee,
  getAttendance,
  getDashboard,
  getEmployees,
  markAttendance,
  getPresentDays,
} from './services/api';

export default function App() {
  // ── Data State ───────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [presentDaysList, setPresentDaysList] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  // ── UI / Live States ────────────────────────────────────
  const [today, setToday] = useState(new Date());
  const [loading, setLoading] = useState({ employees: false, attendance: false, dashboard: false });
  const [submitting, setSubmitting] = useState({ employee: false, attendance: false });
  const [deletingId, setDeletingId] = useState(null);
  const [messages, setMessages] = useState({ employee: '', attendance: '', type: 'success' });

  // ── Live Clock Effect ───────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  }).format(today);

  // ── Fetch Helpers ────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoading(prev => ({ ...prev, employees: true }));
    try {
      const { data } = await getEmployees();
      setEmployees(data);
    } catch {
      setMessages(m => ({ ...m, employee: 'Registry sync failed.', type: 'error' }));
    } finally {
      setLoading(prev => ({ ...prev, employees: false }));
    }
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(prev => ({ ...prev, dashboard: true }));
    try {
      const { data } = await getDashboard();
      setDashboard(data);
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, []);

  const fetchPresentDaysSummary = useCallback(async () => {
    try {
      const { data } = await getPresentDays();
      setPresentDaysList(data);
    } catch (err) {
      console.error("Summary fetch failed");
    }
  }, []);

  const fetchAttendance = useCallback(async (empCode) => {
    if (!empCode) return;
    setLoading(prev => ({ ...prev, attendance: true }));
    try {
      const { data } = await getAttendance(empCode);
      setAttendance(data);
    } catch {
      setMessages(m => ({ ...m, attendance: 'Log retrieval failed.', type: 'error' }));
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchDashboard();
    fetchPresentDaysSummary();
  }, [fetchEmployees, fetchDashboard, fetchPresentDaysSummary]);

  useEffect(() => {
    if (selectedEmployeeId) fetchAttendance(selectedEmployeeId);
  }, [selectedEmployeeId, fetchAttendance]);

  // ── Handlers ─────────────────────────────────────────────
  const handleAddEmployee = async (formData) => {
    setSubmitting(s => ({ ...s, employee: true }));
    setMessages({ employee: '', attendance: '', type: 'success' });
    try {
      await addEmployee(formData);
      setMessages({ employee: 'Personnel Registered.', attendance: '', type: 'success' });
      await fetchEmployees();
      await fetchDashboard();
      await fetchPresentDaysSummary();
    } catch {
      setMessages({ employee: 'Registration failed.', attendance: '', type: 'error' });
    } finally {
      setSubmitting(s => ({ ...s, employee: false }));
    }
  };

  const handleDeleteEmployee = async (dbId, empCode) => {
    if (!window.confirm(`Permanently remove employee ${empCode}?`)) return;
    setDeletingId(dbId);
    try {
      await deleteEmployee(dbId);
      if (selectedEmployeeId === empCode) {
        setSelectedEmployeeId(null);
        setAttendance([]);
      }
      await fetchEmployees();
      await fetchDashboard();
      await fetchPresentDaysSummary();
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAttendance = async (formData) => {
    setSubmitting(s => ({ ...s, attendance: true }));
    try {
      const payload = { 
        employee_id: String(formData.employee), 
        date: formData.date, 
        status: formData.status 
      };
      await markAttendance(payload);
      await fetchAttendance(formData.employee);
      await fetchPresentDaysSummary();
      await fetchDashboard();
    } catch {
      setMessages({ attendance: 'Update failed.', employee: '', type: 'error' });
    } finally {
      setSubmitting(s => ({ ...s, attendance: false }));
    }
  };

  const handleSelectEmployee = (emp) => {
    const code = String(emp.employee_id);
    setSelectedEmployeeId(prev => (prev === code ? null : code));
    setAttendance([]);
  };

  const selectedEmployee = employees.find(e => String(e.employee_id) === String(selectedEmployeeId));
  const selectedSummary = presentDaysList.find(i => String(i.employee_id) === String(selectedEmployeeId));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Structural Background Pattern */}
      <div className="fixed inset-0 -z-10 bg-[#f4f7fa]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%3C#004e92' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-600/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 py-8 space-y-8">
        
        {/* Trusted Corporate Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-white border border-blue-100 rounded-3xl shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-200">
              <Building2 size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">HRMS</h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[9px] font-black tracking-widest uppercase border border-blue-100">Portal</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-1 flex items-center gap-2">
                <Globe size={12} className="text-blue-400" />
                Single Page HRMS
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
               <Clock size={14} className="text-blue-600" />
               <span className="text-xs font-black text-blue-900 uppercase tracking-wider">{formattedDate}</span>
             </div>
          </div>
        </header>

        {/* Dashboard Section */}
        <section className="animate-in fade-in duration-700">
          {loading.dashboard ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-blue-50 animate-pulse" />)}
            </div>
          ) : (
            <DashboardStats summary={dashboard} totalEmployees={employees.length} />
          )}
        </section>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Control Panels */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Registration Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-blue-50 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900/40">ADD EMPLOYEE</h3>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Users size={18}/></div>
              </div>
              <EmployeeForm onSubmit={handleAddEmployee} loading={submitting.employee} />
              {messages.employee && (
                <div className="mt-4"><StateMessage type={messages.type} message={messages.employee} /></div>
              )}
            </div>

            {/* Attendance Trust Card */}
            <div className="bg-white rounded-[2rem] p-8 border-t-4 border-t-blue-600 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200"><CalendarCheck size={18} /></div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-900">Attendance Form</h3>
                
                </div>
              </div>
              <AttendanceForm 
                employees={employees} 
                selectedEmployeeId={selectedEmployeeId} 
                onSubmit={handleMarkAttendance} 
                loading={submitting.attendance} 
              />
              {messages.attendance && (
                <div className="mt-4"><StateMessage type={messages.type} message={messages.attendance} /></div>
              )}
            
            </div>
          </aside>

          {/* Main Records Section */}
          <section className="lg:col-span-8 space-y-8">
            <Card title="Personnel Directory" subtitle="Official record of active workforce">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                   <div className="w-2 h-2 rounded-full bg-blue-600" />
                   <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">{employees.length} Members</span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-700 hover:text-blue-900 transition-colors">
                  <ListFilter size={14} /> Refine List
                </button>
              </div>
              {loading.employees ? (
                <div className="py-20 flex justify-center"><StateMessage type="loading" message="Verifying records..." /></div>
              ) : (
                <EmployeeTable
                  employees={employees}
                  selectedEmployeeId={selectedEmployeeId}
                  onSelectEmployee={handleSelectEmployee}
                  onDelete={handleDeleteEmployee}
                  deleting={deletingId}
                />
              )}
            </Card>

            <Card 
  title="Attendance Record" 
  subtitle={
    selectedEmployee ? (
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-slate-400">Record for</span>
        {/* Highlighted Name */}
        <span className="font-black text-blue-900 uppercase tracking-tight">
          {selectedEmployee.full_name}
        </span>
        {/* Highlighted ID Badge */}
        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-black tracking-[0.15em] uppercase border border-blue-200 shadow-sm">
          #{selectedEmployee.employee_id}
        </span>
      </div>
    ) : (
      "Please select a member profile to proceed"
    )
  }
>
              {!selectedEmployeeId ? (
                <div className="py-24 flex flex-col items-center justify-center bg-blue-50/20 rounded-[2rem] border-2 border-dashed border-blue-100">
                  <Activity size={48} strokeWidth={1} className="text-blue-200 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-300">Awaiting Profile Selection</p>
                </div>
              ) : loading.attendance ? (
                <div className="py-20 flex justify-center"><StateMessage type="loading" message="Compiling data..." /></div>
              ) : (
                <AttendanceTable 
                  records={attendance} 
                  employeeName={selectedEmployee?.full_name}
                  employeeEmail={selectedEmployee?.email}
                  totalPresentDays={selectedSummary?.present_days || 0}
                />
              )}
            </Card>
          </section>
        </div>

    
      </div>
    </div>
  );
}