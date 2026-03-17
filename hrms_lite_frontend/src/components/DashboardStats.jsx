import { Users, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

const STAT_CONFIG = [
  {
    key: 'employees',
    label: 'Total Staff',
    icon: <Users size={20} />,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    key: 'total_present',
    label: 'Present',
    icon: <CheckCircle2 size={20} />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    key: 'total_absent',
    label: 'Absent',
    icon: <XCircle size={20} />,
    color: 'bg-rose-50 text-rose-600 border-rose-100',
  },
  {
    key: 'total_pending',
    label: 'Absent Entries', // Neither present nor absent
    icon: <HelpCircle size={20} />,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
];

function StatCard({ label, value, icon, color }) {
  return (
    <article className={`bg-white/80 backdrop-blur-md rounded-[2.5rem] border p-6 flex items-center gap-5 shadow-xl shadow-slate-200/40 transition-all hover:translate-y-[-4px] ${color.split(' ')[2]}`}>
      <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${color.split(' ').slice(0,2).join(' ')}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <strong className="text-3xl font-black text-slate-900 tracking-tighter">{value ?? 0}</strong>
      </div>
    </article>
  );
}

export default function DashboardStats({ summary, totalEmployees }) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white/50 rounded-[2.5rem] border border-white" />
        ))}
      </div>
    );
  }

  // Calculation for "Neither"
  const present = summary.present_today || 0;
  const absent = summary.absent_today || 0;
  const pending = totalEmployees - (present + absent);

  const values = {
    employees:     totalEmployees,
    total_present: present,
    total_absent:  absent,
    total_pending: pending > 0 ? pending : 0, // Ensure we don't show negative numbers
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STAT_CONFIG.map(({ key, label, icon, color }) => (
        <StatCard
          key={key}
          label={label}
          value={values[key]}
          icon={icon}
          color={color}
        />
      ))}
    </section>
  );
}