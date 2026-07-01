"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const defaultIcons: Record<string, string> = {
  tickets: "🎫",
  events: "📅",
  search: "🔍",
  empty: "📭",
  error: "⚠️",
};

export default function EmptyState({
  icon = "empty",
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  const emoji = defaultIcons[icon] || icon;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 ${className}`}>
      <span className="text-5xl mb-4 block">{emoji}</span>
      <h3 className="text-[#E8E4DA] text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-[#E4BDBA]/50 text-sm max-w-xs text-center mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-blue-500/10 rounded-lg border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
