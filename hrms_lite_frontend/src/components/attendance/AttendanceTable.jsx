import { useState, useMemo } from 'react';
import { 
  Calendar, Hash, Info, CheckCircle2, XCircle, 
  User, Mail, Trophy, ListFilter, RotateCcw 
} from 'lucide-react';

export default function AttendanceTable({ records, employeeName, employeeEmail, totalPresentDays }) {
  const [filterDate, setFilterDate] = useState('');

  // ── Filter Logic ──
  const filteredRecords = useMemo(() => {
    if (!filterDate) return records;
    return records.filter(record => record.date === filterDate);
  }, [records, filterDate]);

  // Empty State
  if (!records || records.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center bg-blue-50/20 rounded-[2rem] border-2 border-dashed border-blue-100">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-200 mb-4 shadow-sm">
          <Info size={20} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
          No records found in the archive
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      
      {/* ── Light Inactive Filter Toolbar ── */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#F0F4F8] rounded-2xl border border-[#D1D9E0]">
        <div className="flex items-center gap-3">
          <ListFilter size={14} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filter History</span>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-[11px] font-bold text-blue-900 bg-white border border-[#D1D9E0] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer"
          />
          {filterDate && (
            <button 
              onClick={() => setFilterDate('')}
              className="p-1.5 text-blue-400 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all"
              title="Clear Filter"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Main Trust Table ── */}
      <div className="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white shadow-xl shadow-blue-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Personnel Profile Header (Trust Blue) */}
              <tr className="bg-blue-700 text-white">
                <th colSpan="2" className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                      <User size={24} className="text-blue-100" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-black tracking-tight leading-none uppercase">
                        {employeeName || "Authorized Personnel"}
                      </span>
                      <span className="text-[10px] text-blue-200 mt-1.5 flex items-center gap-1 font-bold lowercase tracking-wider opacity-80">
                        <Mail size={10} /> {employeeEmail || "system-protected@nexus.com"}
                      </span>
                    </div>
                  </div>
                </th>
                <th className="px-8 py-6 text-right">
                  <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 opacity-70">Total Present Days</p>
                      <p className="text-xl font-black leading-none">{totalPresentDays || 0}</p>
                    </div>
                    <Trophy size={20} className="text-amber-300" />
                  </div>
                </th>
              </tr>

              {/* Technical Header */}
              <tr className="bg-blue-50/50 border-b border-blue-100">
                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-blue-800/40">Date</th>
                <th className="px-8 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-blue-800/40"> Employee ID </th>
                <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-[0.3em] text-blue-800/40">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-blue-50">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="group hover:bg-blue-50/50 transition-all duration-300">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Calendar size={14} className="text-blue-600" />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-900 transition-colors">
                          {record.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <Hash size={12} className="text-blue-200" />
                        <span className="text-xs font-mono font-bold text-blue-800/60 uppercase bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">
                          {record.employee_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border ${
                          record.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-rose-50 text-rose-500 border-rose-100'
                        }`}>
                        {record.status === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center opacity-30">
                       <RotateCcw size={24} className="mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest">No matching logs for this date</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}