import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2, Sparkles, Trash2, Edit2, Check, Flame } from 'lucide-react';
import { normalizeIngredient, areIngredientsEqual } from '../utils/ingredientNormalizer';
import { haptics } from '../services/HapticService';

interface ConfirmIngredientsScreenProps {
  initialIngredients: string[];
  capturedImage: string | null;
  onConfirm: (confirmedIngredients: string[]) => void;
  onGenerateAiRecipes?: (ingredients: string[]) => void;
  onBack: () => void;
  expiringIngredients?: string[];
  onToggleExpiring?: (ingredient: string) => void;
}

export const ConfirmIngredientsScreen: React.FC<ConfirmIngredientsScreenProps> = ({
  initialIngredients,
  capturedImage,
  onConfirm,
  onBack,
  expiringIngredients = [],
  onToggleExpiring,
}) => {
  const [ingredients, setIngredients] = useState<string[]>(() => {
    const safeList = Array.isArray(initialIngredients) ? initialIngredients.filter((i) => Boolean(i) && typeof i === 'string') : [];
    return safeList.map(normalizeIngredient);
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleRemove = (index: number) => {
    haptics.light();
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleStartEdit = (index: number, currentText: string) => {
    haptics.light();
    setEditingIndex(index);
    setEditingText(currentText);
  };

  const handleSaveEdit = (index: number) => {
    haptics.light();
    const trimmed = editingText.trim();
    if (trimmed) {
      const updated = [...ingredients];
      updated[index] = normalizeIngredient(trimmed);
      setIngredients(updated);
    }
    setEditingIndex(null);
    setEditingText('');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeIngredient(newIngredient);
    if (normalized) {
      haptics.light();
      if (!ingredients.some((i) => areIngredientsEqual(i, normalized))) {
        setIngredients([...ingredients, normalized]);
      }
      setNewIngredient('');
    }
  };

  const handleFindRecipes = () => {
    if (ingredients.length === 0) return;
    haptics.medium();
    onConfirm(ingredients);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => {
            haptics.light();
            onBack();
          }}
          className="p-2 -ml-2 rounded-full hover:bg-[#153B28]/10 dark:hover:bg-[#DCE9DA]/10 text-[#153B28] dark:text-[#F8F0E2] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-[#153B28]/70 dark:text-[#B6CEBC] uppercase">Confirm Pantry Items</span>
        <div className="w-5" />
      </div>

      {/* Captured Image Preview Header */}
      {capturedImage && (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xs">
          <img src={capturedImage} alt="Captured scan" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-white text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Scan analyzed</span>
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <h1 className="font-serif-editorial text-3xl font-normal text-[#153B28] dark:text-[#FAF4E8] mb-1">
        Here's what we found.
      </h1>
      <p className="text-xs text-[#153B28]/75 dark:text-[#B6CEBC] mb-5 font-normal">
        Tap to edit or remove any item. Mark items expiring soon to prioritize recipes using them.
      </p>

      {/* Ingredient Chips Container */}
      <div className="bg-[#EFE8D8] dark:bg-[#183024] rounded-3xl p-5 border border-[#153B28]/10 dark:border-[#DCE9DA]/10 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wide uppercase text-[#153B28]/80 dark:text-[#FAF4E8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#153B28] dark:text-[#A7F3D0]" />
            <span>Confirmed Ingredients ({ingredients.length})</span>
          </span>
          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={() => {
                haptics.warning();
                setIngredients([]);
              }}
              className="text-[11px] font-semibold text-[#E05345] dark:text-[#FF6B5C] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#153B28]/60 dark:text-[#B6CEBC]/70 italic">
            No ingredients selected. Add items below to generate recipes!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => {
              const ingStr = typeof ing === 'string' ? ing : String(ing || '');
              const isExpiring = Array.isArray(expiringIngredients) && expiringIngredients.some(
                (exp) => typeof exp === 'string' && exp.toLowerCase() === ingStr.toLowerCase()
              );

              if (editingIndex === idx) {
                return (
                  <div key={`edit-${idx}`} className="flex items-center gap-1 bg-white dark:bg-[#1F3C2E] border border-[#153B28] dark:border-[#A7F3D0] rounded-full px-3 py-1 text-xs">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(idx);
                      }}
                      autoFocus
                      className="w-24 bg-transparent outline-none text-[#153B28] dark:text-[#F8F0E2] font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(idx)}
                      className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={`${ing}-${idx}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isExpiring
                      ? 'bg-amber-100/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-2xs'
                      : 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#FAF4E8]'
                  }`}
                >
                  <span
                    onClick={() => handleStartEdit(idx, ing)}
                    className="cursor-pointer hover:underline capitalize"
                    title="Tap to edit"
                  >
                    {ing}
                  </span>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx, ing)}
                    className="text-[#153B28]/40 dark:text-[#B6CEBC]/60 hover:text-[#153B28] dark:hover:text-white"
                    title="Rename"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>

                  {/* Toggle Expiring Soon button */}
                  {onToggleExpiring && (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.light();
                        onToggleExpiring(ing);
                      }}
                      className={`p-0.5 rounded transition-colors ${
                        isExpiring ? 'text-amber-700 dark:text-amber-400' : 'text-[#153B28]/30 dark:text-[#B6CEBC]/40 hover:text-amber-600 dark:hover:text-amber-300'
                      }`}
                      title={isExpiring ? 'Expires soon' : 'Mark as expiring soon'}
                    >
                      <Flame className="w-3 h-3" />
                    </button>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="text-[#153B28]/40 dark:text-[#B6CEBC]/60 hover:text-[#E05345] dark:hover:text-[#FF6B5C] ml-0.5 font-bold"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Missing Ingredient Form */}
      <form onSubmit={handleAdd} className="mb-8">
        <label className="block text-xs font-bold tracking-wide uppercase text-[#153B28]/80 dark:text-[#FAF4E8] mb-2">
          Add additional ingredient
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="e.g. Soy Sauce, Butter, Garlic..."
            className="flex-1 bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-2xl px-4 py-3 text-sm text-[#153B28] dark:text-[#FAF4E8] placeholder-[#153B28]/50 dark:placeholder-[#B6CEBC]/50 focus:outline-none focus:border-[#153B28] dark:focus:border-[#A7F3D0] focus:ring-1 focus:ring-[#153B28]"
          />
          <button
            type="submit"
            disabled={!newIngredient.trim()}
            className="bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] p-3 rounded-2xl flex items-center justify-center disabled:opacity-50 active-press"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Unified Single Action Button */}
      <div className="mt-auto pt-2">
        <button
          type="button"
          disabled={ingredients.length === 0}
          onClick={handleFindRecipes}
          className="w-full py-3.5 sm:py-4 px-3 sm:px-6 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs sm:text-sm shadow-md active-press disabled:opacity-50 flex items-center justify-center gap-2 text-center hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
        >
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="truncate">Get Recipes for My Pantry ({ingredients.length} items)</span>
        </button>
      </div>
    </div>
  );
};
