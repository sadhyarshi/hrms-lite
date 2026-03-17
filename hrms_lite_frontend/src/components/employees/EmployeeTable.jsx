import { User, Mail, Briefcase, Trash2, Eye, Check } from 'lucide-react';

export default function EmployeeTable({ employees, selectedEmployeeId, onSelectEmployee, onDelete, deleting }) {
  if (!employees.length) {
    return (
      <div className="py-20 text-center bg-white/40 rounded-[2rem] border border-dashed border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          No personnel records found
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">ID</th>
              <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Name</th>
              <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Department</th>
              <th className="px-6 py-5 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((employee) => {
              // CRITICAL: We check against employee_id (the string "004")
              const isSelected = employee.employee_id === selectedEmployeeId;
              
              return (
                <tr
                  key={employee.id}
                  className={`group transition-all duration-500 ${
                    isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <td className="px-6 py-5">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {employee.employee_id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{employee.full_name}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Mail size={10} /> {employee.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                      <Briefcase size={12} className="text-slate-300" />
                      {employee.department}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      {/* View Attendance Button - Passes the String ID */}
                      <button
                        type="button"
                        onClick={() => onSelectEmployee(employee)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-100'
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300 hover:text-blue-500'
                        }`}
                      >
                        {isSelected ? <Check size={12} /> : <Eye size={12} />}
                        {isSelected ? 'Active' : 'View'}
                      </button>

                      {/* Delete Button - Passes Database Number ID */}
                      <button
                        type="button"
                        onClick={() => onDelete(employee.id, employee.employee_id)}
                        disabled={deleting === employee.id}
                        className="p-2.5 rounded-xl bg-white text-slate-300 border border-slate-100 hover:border-rose-200 hover:text-rose-500 transition-all duration-300 disabled:opacity-30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}