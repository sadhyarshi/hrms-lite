import { useEffect, useMemo, useState } from 'react';
import { User, Calendar, Check, X, ChevronDown, Loader2, ShieldCheck } from 'lucide-react';

const INITIAL_FORM = {
  employee: '',
  date: new Date().toISOString().split('T')[0],
  status: 'Present',
};

export default function AttendanceForm({ employees, selectedEmployeeId, onSubmit, loading }) {
  const [form, setForm] = useState({
    ...INITIAL_FORM,
    employee: selectedEmployeeId ? String(selectedEmployeeId) : '',
  });

  // Sync form when a user clicks a row in the table
  useEffect(() => {
    if (!selectedEmployeeId) return;
    setForm((prev) => ({ ...prev, employee: String(selectedEmployeeId) }));
  }, [selectedEmployeeId]);

  const isComplete = useMemo(() => form.employee && form.date && form.status, [form]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isComplete) return;
    try {
      await onSubmit({
        employee: form.employee, 
        date: form.date,
        status: form.status,
      });
      // Reset status but keep date for convenience
      setForm((prev) => ({ ...prev, status: 'Present' }));
    } catch (err) {
      // Error handled by parent
    }
  }

  // ── Shared Style Definitions ──
  const inputStyle = `
    w-full bg-[#F0F4F8] border border-[#D1D9E0] text-slate-600 text-sm rounded-xl 
    px-4 py-3 transition-all duration-300 appearance-none
    focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 focus:outline-none 
    disabled:opacity-50
  `;
  
  const labelStyle = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Employee Selection */}
      <div className="space-y-1">
        <label className={labelStyle}><User size={12} className="text-blue-400" />Employee</label>
        <div className="relative">
          <select
            name="employee"
            value={form.employee}
            onChange={handleChange}
            required
            disabled={loading || employees.length === 0}
            className={`${inputStyle} cursor-pointer`}
          >
            <option value="">Select ID...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.employee_id}>
                {emp.employee_id} — {emp.full_name}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Date Input */}
      <div className="space-y-1">
        <label className={labelStyle}><Calendar size={12} className="text-blue-400" />Date</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className={inputStyle}
        />
      </div>

      {/* Status Toggle - Light Trust Blue Style */}
      <div className="space-y-3">
        <label className={labelStyle}>Attendance Status</label>
        <div className="flex p-1.5 bg-[#F0F4F8] rounded-2xl border border-[#D1D9E0] gap-1.5">
          {['Present', 'Absent'].map((status) => {
            const isActive = form.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setForm(f => ({ ...f, status }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                    : "text-slate-400 hover:text-slate-500"
                }`}
              >
                {status === 'Present' ? <Check size={14} /> : <X size={14} />}
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Button - Always Blue Mode */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl
          text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500
          bg-blue-600 text-white shadow-md shadow-blue-100
          ${!isComplete ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'}
          ${loading ? 'opacity-50' : ''}`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={16} />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <ShieldCheck size={16} />
            <span>Mark Attendance</span>
          </>
        )}
      </button>

     
    </form>
  );
}