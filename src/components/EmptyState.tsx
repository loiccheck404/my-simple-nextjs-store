// components/EmptyState.tsx
interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
