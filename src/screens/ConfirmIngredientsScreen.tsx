import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { IngredientChip } from '../components/IngredientChip';
import { normalizeIngredient, areIngredientsEqual } from '../utils/ingredientNormalizer';

interface ConfirmIngredientsScreenProps {
  initialIngredients: string[];
  capturedImage: string | null;
  onConfirm: (confirmedIngredients: string[]) => void;
  onBack: () => void;
}

export const ConfirmIngredientsScreen: React.FC<ConfirmIngredientsScreenProps> = ({
  initialIngredients,
  capturedImage,
  onConfirm,
  onBack,
}) => {
  const [ingredients, setIngredients] = useState<string[]>(
    (initialIngredients.length > 0
      ? initialIngredients
      : ['Eggs', 'Chicken', 'Rice', 'Tomatoes', 'Onion', 'Garlic']
    ).map(normalizeIngredient)
  );
  const [newIngredient, setNewIngredient] = useState('');

  const handleRemove = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeIngredient(newIngredient);
    if (normalized) {
      if (!ingredients.some((i) => areIngredientsEqual(i, normalized))) {
        setIngredients([...ingredients, normalized]);
      }
      setNewIngredient('');
    }
  };

  const handleFindRecipes = () => {
    if (ingredients.length === 0) return;
    onConfirm(ingredients);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-6 pt-4 pb-24 max-w-md mx-auto">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#153B28]/10 text-[#153B28] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-[#153B28]/70 uppercase">Confirm Scan</span>
        <div className="w-5" />
      </div>

      {/* Captured Image Preview Header */}
      {capturedImage && (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-5 border border-[#153B28]/15 shadow-2xs">
          <img src={capturedImage} alt="Captured scan" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
            <span className="text-white text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fridge photo analyzed</span>
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <h1 className="font-serif-editorial text-3xl font-normal text-[#153B28] mb-1">
        Here's what we found.
      </h1>
      <p className="text-xs text-[#153B28]/75 mb-5 font-normal">
        Tap to remove any mistake, or type below to add items we missed.
      </p>

      {/* Ingredient Chips Container */}
      <div className="bg-[#EFE8D8] rounded-3xl p-5 border border-[#153B28]/10 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wide uppercase text-[#153B28]/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#153B28]" />
            <span>Detected Ingredients ({ingredients.length})</span>
          </span>
          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={() => setIngredients([])}
              className="text-[11px] font-semibold text-[#E05345] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#153B28]/60 italic">
            No ingredients selected. Add some below to discover recipes!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ing, idx) => (
              <IngredientChip
                key={`${ing}-${idx}`}
                name={ing}
                variant="editable"
                onRemove={() => handleRemove(idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Missing Ingredient Form */}
      <form onSubmit={handleAdd} className="mb-8">
        <label className="block text-xs font-bold tracking-wide uppercase text-[#153B28]/80 mb-2">
          Add missing ingredient
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="e.g. Soy Sauce, Butter, Garlic..."
            className="flex-1 bg-[#FAF5EC] border border-[#153B28]/20 rounded-2xl px-4 py-3 text-sm text-[#153B28] placeholder-[#153B28]/50 focus:outline-none focus:border-[#153B28] focus:ring-1 focus:ring-[#153B28]"
          />
          <button
            type="submit"
            disabled={!newIngredient.trim()}
            className="bg-[#153B28] text-[#F8F0E2] p-3 rounded-2xl flex items-center justify-center disabled:opacity-50 active-press"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Primary Action Button */}
      <div className="mt-auto">
        <button
          type="button"
          disabled={ingredients.length === 0}
          onClick={handleFindRecipes}
          className="w-full py-4 px-6 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-base shadow-md active-press disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>Find recipes ({ingredients.length} items)</span>
        </button>
      </div>
    </div>
  );
};
