import React from 'react';

export interface TagChipProps {
  label: string;
  variant?: 'default' | 'deletable' | 'add';
  onDelete?: () => void;
  onClick?: () => void;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  variant = 'default',
  onDelete,
  onClick,
}) => {
  const baseClasses =
    'inline-flex items-center justify-center text-[9px] font-semibold rounded-full transition-colors';

  if (variant === 'add') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${baseClasses} border border-dashed border-primary-200 text-primary-400 px-2 py-1 gap-1`}
      >
        <span>+</span>
        <span>{label}</span>
      </button>
    );
  }

  if (variant === 'deletable') {
    return (
      <div
        className={`${baseClasses} bg-primary-50 text-primary-800 pl-2.5 pr-1 py-1 gap-1`}
        onClick={onClick}
      >
        <span>{label}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="w-[11px] h-[11px] rounded-full flex items-center justify-center text-[8px] bg-primary-800/15 text-primary-800"
          aria-label="Delete tag"
        >
          <svg
            width="6"
            height="6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} bg-primary-50 text-primary-800 px-2.5 py-1`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};
