import React, { useState } from 'react';
import { Search, Plus, X, Sparkles, ArrowRight, Trash2 } from 'lucide-react';
import { IngredientChip } from '../components/IngredientChip';
import { normalizeIngredient, areIngredientsEqual } from '../utils/ingredientNormalizer';

interface SearchScreenProps {
  initialIngredients: string[];
  onFindRecipes: (ingredients: string[]) => void;
}

const QUICK_ADD_ITEMS = [
  'Eggs',
  'Rice',
  'Chicken',
  'Tomatoes',
  'Paneer',
  'Pasta',
  'Onion',
  'Spinach',
  'Garlic',
  'Butter',
  'Soy Sauce',
  'Parmesan Cheese',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  initialIngredients,
  onFindRecipes,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialIngredients.map(normalizeIngredient)
  );
  const [inputText, setInputText] = useState('');

  const handleAddInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = normalizeIngredient(inputText);
    if (!normalized) return;

    // Prevent duplicates (e.g. egg vs Egg vs eggs)
    const exists = selectedIngredients.some((i) => areIngredientsEqual(i, normalized));
    if (!exists) {
      setSelectedIngredients([...selectedIngredients, normalized]);
      setInputText('');
    } else {
      setInputText('');
    }
  };

  const toggleQuickAdd = (item: string) => {
    const exists = selectedIngredients.some((i) => areIngredientsEqual(i, item));
    if (exists) {
      setSelectedIngredients(selectedIngredients.filter((i) => !areIngredientsEqual(i, item)));
    } else {
      setSelectedIngredients([...selectedIngredients, normalizeIngredient(item)]);
    }
  };

  const handleRemove = (itemToRemove: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => !areIngredientsEqual(i, itemToRemove)));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
  };

  const handleFindRecipes = () => {
    if (selectedIngredients.length === 0) return;
    onFindRecipes(selectedIngredients);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-6 pt-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] tracking-tight">
          Search by <br />
          ingredient
        </h1>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[#153B28]/80">
          No photo needed — tell us what's in the kitchen and we'll deal the deck.
        </p>
      </header>

      {/* Input Field with Search Icon and Green Circular '+' Button */}
      <form onSubmit={handleAddInput} className="mb-6">
        <div className="relative flex items-center bg-[#FAF5EC] border border-[#153B28]/25 rounded-2xl p-1.5 shadow-2xs focus-within:border-[#153B28] focus-within:ring-1 focus-within:ring-[#153B28]">
          <Search className="w-5 h-5 text-[#153B28]/60 ml-3 shrink-0" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Add an ingredient"
            className="w-full bg-transparent border-none px-3 py-2 text-sm text-[#153B28] placeholder-[#153B28]/50 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#153B28] text-[#F8F0E2] flex items-center justify-center shrink-0 disabled:opacity-40 active-press transition-transform"
            title="Add ingredient"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Selected Ingredients List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wider uppercase text-[#153B28]/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#153B28]" />
            <span>Selected ({selectedIngredients.length})</span>
          </span>
          {selectedIngredients.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[11px] font-semibold text-[#E05345] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {selectedIngredients.length === 0 ? (
          <div className="bg-[#EFE8D8]/60 border border-dashed border-[#153B28]/20 rounded-2xl p-4 text-center text-xs text-[#153B28]/60 italic">
            No ingredients added yet. Tap quick-add options below or type above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 bg-[#EFE8D8] border border-[#153B28]/10 rounded-2xl p-3.5">
            {selectedIngredients.map((item) => (
              <IngredientChip
                key={item}
                name={item}
                variant="editable"
                onRemove={() => handleRemove(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Section */}
      <div className="mb-8">
        <span className="block text-xs font-bold tracking-wider uppercase text-[#153B28]/80 mb-3">
          QUICK ADD
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_ADD_ITEMS.map((item) => {
            const isSelected = selectedIngredients.some((i) => i.toLowerCase() === item.toLowerCase());
            return (
              <IngredientChip
                key={item}
                name={item}
                variant="quick-add"
                isSelected={isSelected}
                onToggle={() => toggleQuickAdd(item)}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Primary Button */}
      <div className="mt-auto">
        {selectedIngredients.length === 0 && (
          <p className="text-[11px] text-center text-[#E05345] font-medium mb-2">
            Please add at least 1 ingredient to discover recipes
          </p>
        )}
        <button
          type="button"
          disabled={selectedIngredients.length === 0}
          onClick={handleFindRecipes}
          className="w-full py-4 px-6 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-base shadow-md active-press disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span>Find recipes</span>
          <ArrowRight className="w-5 h-5 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
