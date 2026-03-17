export default function Card({ title, subtitle, actions, children }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <header className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="ml-4 flex-shrink-0">{actions}</div>
        )}
      </header>

      {/* Body */}
      <div className="px-6 py-4">{children}</div>
    </section>
  );
}