const STYLES = {
  neutral: 'bg-gray-50 text-gray-500 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  error:   'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  loading: 'bg-blue-50 text-blue-600 border-blue-200',
};

const ICONS = {
  neutral: 'ℹ️',
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  loading: '⏳',
};

export default function StateMessage({ type = 'neutral', message }) {
  const styles = STYLES[type] ?? STYLES.neutral;
  const icon   = ICONS[type]  ?? '';

  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium ${styles}`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}