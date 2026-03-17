import { useMemo, useState } from 'react';
import { UserPlus, Fingerprint, User, Mail, Briefcase, Loader2, ShieldCheck } from 'lucide-react';

const INITIAL_FORM = {
  employee_id: '',
  full_name: '',
  email: '',
  department: '',
};

export default function EmployeeForm({ onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);

  const isComplete = useMemo(
    () =>
      form.employee_id.trim() &&
      form.full_name.trim() &&
      form.email.trim() &&
      form.department.trim(),
    [form]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isComplete) return; // Guard clause since button is always "active" visually
    try {
      await onSubmit({
        employee_id: form.employee_id.trim(),
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        department: form.department.trim(),
      });
      setForm(INITIAL_FORM);
    } catch {
      // Data retained on error
    }
  }

  // ── Light Inactive Tone Styles ──
  const inputClasses = `
    w-full bg-[#F0F4F8] border border-[#D1D9E0] text-slate-600 text-sm rounded-xl 
    px-4 py-3 transition-all duration-300
    placeholder:text-slate-300
    focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 focus:outline-none
  `;

  const labelClasses = "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Employee ID */}
        <div className="flex flex-col">
          <label className={labelClasses}>
            <Fingerprint size={12} className="text-blue-300" /> ID
          </label>
          <input
            type="text"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            placeholder="e.g. 004"
            required
            className={inputClasses}
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col">
          <label className={labelClasses}>
            <User size={12} className="text-blue-300" /> Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Authorized Name"
            required
            className={inputClasses}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className={labelClasses}>
            <Mail size={12} className="text-blue-300" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className={inputClasses}
          />
        </div>

        {/* Department */}
        <div className="flex flex-col">
          <label className={labelClasses}>
            <Briefcase size={12} className="text-blue-300" /> Department
          </label>
          <input
            type="text"
            name="department"
            value={form.department}
            onChange={handleChange}
            placeholder="Operations"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading} // Only truly disabled during network requests
        className={`
          w-full flex items-center justify-center gap-3 py-4 rounded-xl
          text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500
          bg-blue-600 text-white shadow-md shadow-blue-100
          ${!isComplete ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'}
          ${loading ? 'opacity-50' : ''}
        `}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>ADD Employee</span>
          </>
        )}
      </button>
    
    </form>
  );
}