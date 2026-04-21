import React from "react";
import { FiX } from "react-icons/fi";

export function Spinner({ size = "md", className = "" }) {
  const s = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];
  return (
    <div
      className={`${s} border-2 border-white/20 border-t-brand-500 rounded-full animate-spin ${className}`}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-white/40 font-body text-sm">Loading...</p>
      </div>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} glass-card p-6 animate-slide-up`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-lg text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="text-white/20 mb-4">
          <Icon size={48} />
        </div>
      )}
      <p className="font-display font-semibold text-white/60 text-lg">
        {title}
      </p>
      {description && (
        <p className="text-white/30 text-sm mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: "badge-warning",
    approved: "badge-success",
    rejected: "badge-danger",
    active: "badge-success",
    completed: "badge-info",
    cancelled: "badge-danger",
    paid: "badge-success",
  };
  return (
    <span className={map[status] || "badge-info"}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
}

export function StatCard({ label, value, icon: Icon, sub, color = "brand" }) {
  const colors = {
    brand: "text-brand-400 bg-brand-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10",
  };
  return (
    <div className="stat-card">
      {/* Mobile: icon + label row, then value below */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`p-2 rounded-lg shrink-0 ${colors[color]}`}>
              <Icon size={16} className={colors[color].split(" ")[0]} />
            </div>
          )}
          <p className="text-white/40 text-xs font-body">{label}</p>
        </div>
        <p className="font-display font-bold text-white text-lg leading-tight">
          {value}
        </p>
        {sub && <p className="text-white/30 text-xs">{sub}</p>}
      </div>

      {/* Desktop: original side by side layout */}
      <div className="hidden sm:flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-white/40 text-sm font-body">{label}</p>
          <p className="font-display font-bold text-2xl text-white mt-1">
            {value}
          </p>
          {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${colors[color]}`}>
            <Icon size={20} className={colors[color].split(" ")[0]} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Table({ columns, data, emptyMessage = "No records found" }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-white/40 font-body font-medium py-3 px-4 ${col.className || ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-white/30"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 text-white/80 ${col.className || ""}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, lastPage, onChange }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/8">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-30"
      >
        ← Prev
      </button>
      <span className="text-white/40 text-sm">
        Page {page} of {lastPage}
      </span>
      <button
        disabled={page >= lastPage}
        onClick={() => onChange(page + 1)}
        className="btn-secondary px-3 py-2 text-sm disabled:opacity-30"
      >
        Next →
      </button>
    </div>
  );
}
