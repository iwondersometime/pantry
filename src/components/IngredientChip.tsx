import React from 'react';
import { X, Plus, Check } from 'lucide-react';

export interface IngredientChipProps {
  name: string;
  variant?: 'available' | 'missing' | 'quick-add' | 'editable';
  isSelected?: boolean;
  onRemove?: () => void;
  onToggle?: () => void;
  onClick?: () => void;
  className?: string;
}

export const IngredientChip: React.FC<IngredientChipProps> = ({
  name,
  variant = 'available',
  isSelected = false,
  onRemove,
  onToggle,
  onClick,
  className = '',
}) => {
  if (variant === 'missing') {
    return (
      <span
        onClick={onClick}
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-dashed border-[#E05345]/80 bg-[#FAF5EC] text-[#E05345] transition-all ${className}`}
      >
        {name}
      </span>
    );
  }

  if (variant === 'quick-add') {
    return (
      <button
        type="button"
        onClick={onToggle || onClick}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active-press ${
          isSelected
            ? 'bg-[#153B28] text-[#F8F0E2] shadow-xs'
            : 'bg-[#EFE8D8] text-[#153B28] hover:bg-[#E3DAC8]'
        } ${className}`}
      >
        {isSelected ? <Check className="w-3 h-3 text-[#DCE9DA]" /> : <Plus className="w-3 h-3 text-[#153B28]/70" />}
        <span>{name}</span>
      </button>
    );
  }

  if (variant === 'editable') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#DCE9DA] text-[#153B28] border border-[#C5D8C2] shadow-2xs ${className}`}
      >
        <span>{name}</span>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0.5 rounded-full hover:bg-[#153B28]/10 text-[#153B28] transition-colors"
            title="Remove ingredient"
            aria-label={`Remove ${name}`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </span>
    );
  }

  // Available variant (default)
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-[#DCE9DA] text-[#153B28] border border-[#C8DAC5] ${className}`}
    >
      {name}
    </span>
  );
};
