import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Recipe } from '../types';
import { checkRecipeAllergies } from '../utils/allergyChecker';
import { LocalStorageService } from '../services/LocalStorageService';

interface AllergyWarningBadgeProps {
  recipe: Recipe;
  userAllergies?: string[];
  variant?: 'compact' | 'full';
  className?: string;
}

export const AllergyWarningBadge: React.FC<AllergyWarningBadgeProps> = ({
  recipe,
  userAllergies: propsAllergies,
  variant = 'compact',
  className = '',
}) => {
  const activeAllergies = propsAllergies ?? LocalStorageService.getUserAllergies();
  const detectedAllergens = checkRecipeAllergies(recipe, activeAllergies);

  if (detectedAllergens.length === 0) return null;

  const allergensListStr = detectedAllergens.join(', ');

  if (variant === 'full') {
    return (
      <div className={`my-3 bg-amber-100/90 dark:bg-amber-950/80 border border-amber-400 dark:border-amber-700/80 rounded-2xl p-3.5 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5 shadow-sm ${className}`}>
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1">
            <span>⚠️ ALLERGY WARNING</span>
          </p>
          <p className="font-bold text-sm text-amber-900 dark:text-amber-100 mt-0.5">
            Contains: {allergensListStr}
          </p>
          <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
            This recipe matches an active food allergy in your account settings ({allergensListStr}). Please review ingredients carefully before preparing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-amber-100/90 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs ${className}`}>
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <div className="flex flex-col text-left">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-800 dark:text-amber-400 leading-none mb-0.5">
          ⚠️ ALLERGY WARNING
        </span>
        <span className="text-xs font-bold leading-tight">
          Contains: {allergensListStr}
        </span>
      </div>
    </div>
  );
};
