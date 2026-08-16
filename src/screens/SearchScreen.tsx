import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Sparkles, ArrowRight, Trash2, Filter, Clock, Flame, ChefHat, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Recipe } from '../types';
import { IngredientChip } from '../components/IngredientChip';
import { normalizeIngredient, areIngredientsEqual } from '../utils/ingredientNormalizer';
import { INITIAL_RECIPES } from '../data/recipes';
import { calculateRecipeMatch } from '../services/IngredientMatchingEngine';
import { checkRecipeAllergies } from '../utils/allergyChecker';
import { LocalStorageService } from '../services/LocalStorageService';
import { RecipeImageService, ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';
import { RecipeImage } from '../components/RecipeImage';
import { haptics } from '../services/HapticService';
import { AllergyWarningBadge } from '../components/AllergyWarningBadge';

interface SearchScreenProps {
  initialIngredients: string[];
  allRecipes?: Recipe[];
  userAllergies?: string[];
  onFindRecipes: (ingredients: string[]) => void;
  onSelectRecipe?: (recipe: Recipe) => void;
  onGenerateAiRecipes?: (ingredients: string[], cuisineOverride?: string) => void;
}

const CUISINE_OPTIONS = ['All', 'Indian', 'Italian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'Chinese', 'Japanese'];
const COOK_TIME_OPTIONS = [
  { label: 'Any Time', value: 'all' },
  { label: '<15 mins', value: 'under15' },
  { label: '<30 mins', value: 'under30' },
  { label: '<60 mins', value: 'under60' },
];
const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];

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
  allRecipes = INITIAL_RECIPES,
  userAllergies: propsAllergies,
  onFindRecipes,
  onSelectRecipe,
  onGenerateAiRecipes,
}) => {
  // Navigation Mode: 'recipes' (Search Bar & Filters) vs 'builder' (Ingredient Picker)
  const [activeTabMode, setActiveTabMode] = useState<'recipes' | 'builder'>('recipes');

  // Search & Filter state for Recipe Search tab
  const [recipeQuery, setRecipeQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCookTime, setSelectedCookTime] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isHighProtein, setIsHighProtein] = useState(false);
  const [minPantryMatch, setMinPantryMatch] = useState<number>(0);

  // Ingredient Builder State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialIngredients.map(normalizeIngredient)
  );
  const [builderInputText, setBuilderInputText] = useState('');

  const userAllergies = propsAllergies || LocalStorageService.getUserAllergies();

  // Helper to check if any filters are active
  const hasActiveFilters =
    recipeQuery.trim().length > 0 ||
    selectedCuisine !== 'All' ||
    selectedCookTime !== 'all' ||
    selectedDifficulty !== 'All' ||
    isVegetarian ||
    isHighProtein ||
    minPantryMatch > 0;

  const handleResetFilters = () => {
    haptics.light();
    setRecipeQuery('');
    setSelectedCuisine('All');
    setSelectedCookTime('all');
    setSelectedDifficulty('All');
    setIsVegetarian(false);
    setIsHighProtein(false);
    setMinPantryMatch(0);
  };

  // Recipe Search Filter Logic
  const filteredRecipes = useMemo(() => {
    const q = recipeQuery.trim().toLowerCase();

    return allRecipes.filter((recipe) => {
      // 1. Text Query Search (title, description, cuisine, tags, ingredient names)
      if (q.length > 0) {
        const titleMatch = recipe.title.toLowerCase().includes(q);
        const descMatch = recipe.description?.toLowerCase().includes(q);
        const cuisineMatch = recipe.cuisine?.toLowerCase().includes(q);
        const tagsMatch = Array.isArray(recipe.tags) && recipe.tags.some((t) => t.toLowerCase().includes(q));
        const ingredientMatch = Array.isArray(recipe.ingredients) && recipe.ingredients.some((ing) => {
          const name = typeof ing === 'string' ? ing : ing.name;
          return name.toLowerCase().includes(q);
        });

        if (!titleMatch && !descMatch && !cuisineMatch && !tagsMatch && !ingredientMatch) {
          return false;
        }
      }

      // 2. Cuisine Filter
      if (selectedCuisine !== 'All') {
        const recipeCuisine = (recipe.cuisine || '').toLowerCase();
        if (recipeCuisine !== selectedCuisine.toLowerCase()) {
          return false;
        }
      }

      // 3. Cook Time Filter
      if (selectedCookTime === 'under15' && recipe.cookTimeMinutes > 15) return false;
      if (selectedCookTime === 'under30' && recipe.cookTimeMinutes > 30) return false;
      if (selectedCookTime === 'under60' && recipe.cookTimeMinutes > 60) return false;

      // 4. Difficulty Filter
      if (selectedDifficulty !== 'All' && recipe.difficulty !== selectedDifficulty) return false;

      // 5. Vegetarian Filter
      if (isVegetarian && !recipe.isVegetarian) return false;

      // 6. High Protein Filter
      if (isHighProtein && !recipe.isHighProtein) return false;

      // 7. Minimum Pantry Match Filter
      if (minPantryMatch > 0 && selectedIngredients.length > 0) {
        const match = calculateRecipeMatch(recipe, selectedIngredients);
        if (match.matchPercentage < minPantryMatch) return false;
      }

      return true;
    });
  }, [
    allRecipes,
    recipeQuery,
    selectedCuisine,
    selectedCookTime,
    selectedDifficulty,
    isVegetarian,
    isHighProtein,
    minPantryMatch,
    selectedIngredients,
  ]);

  // Ingredient Builder Handlers
  const handleAddBuilderInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const normalized = normalizeIngredient(builderInputText);
    if (!normalized) return;

    const exists = selectedIngredients.some((i) => areIngredientsEqual(i, normalized));
    if (!exists) {
      haptics.light();
      setSelectedIngredients([...selectedIngredients, normalized]);
      setBuilderInputText('');
    } else {
      setBuilderInputText('');
    }
  };

  const toggleQuickAdd = (item: string) => {
    haptics.selection();
    const exists = selectedIngredients.some((i) => areIngredientsEqual(i, item));
    if (exists) {
      setSelectedIngredients(selectedIngredients.filter((i) => !areIngredientsEqual(i, item)));
    } else {
      setSelectedIngredients([...selectedIngredients, normalizeIngredient(item)]);
    }
  };

  const handleRemoveBuilderItem = (itemToRemove: string) => {
    haptics.light();
    setSelectedIngredients(selectedIngredients.filter((i) => !areIngredientsEqual(i, itemToRemove)));
  };

  const handleClearBuilderAll = () => {
    haptics.medium();
    setSelectedIngredients([]);
  };

  const handleFindRecipesClick = () => {
    if (selectedIngredients.length === 0) return;
    haptics.success();
    onFindRecipes(selectedIngredients);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Header & Sub-Tab Mode Switcher */}
      <header className="mb-4">
        <h1 className="font-serif-editorial text-[34px] sm:text-[36px] leading-[1.1] font-normal text-[#153B28] dark:text-[#FAF4E8] tracking-tight mb-2">
          {activeTabMode === 'recipes' ? 'Recipe Search' : 'Pantry Builder'}
        </h1>
        <p className="text-xs leading-relaxed text-[#153B28]/80 dark:text-[#B6CEBC]">
          {activeTabMode === 'recipes'
            ? 'Discover dish ideas, filter by cuisine & dietary preferences, or search directly.'
            : "Select what's currently in your kitchen to generate tailored recipes."}
        </p>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 mt-4 p-1 bg-[#EFE8D8] dark:bg-[#183024] rounded-2xl border border-[#153B28]/15 dark:border-[#DCE9DA]/15">
          <button
            type="button"
            onClick={() => {
              haptics.selection();
              setActiveTabMode('recipes');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabMode === 'recipes'
                ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] shadow-xs'
                : 'text-[#153B28]/70 dark:text-[#FAF4E8]/70 hover:text-[#153B28] dark:hover:text-[#FAF4E8]'
            }`}
          >
            Search Recipes
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.selection();
              setActiveTabMode('builder');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTabMode === 'builder'
                ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] shadow-xs'
                : 'text-[#153B28]/70 dark:text-[#FAF4E8]/70 hover:text-[#153B28] dark:hover:text-[#FAF4E8]'
            }`}
          >
            By Ingredients ({selectedIngredients.length})
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODE 1: RECIPE SEARCH TAB */}
      {/* ========================================================================= */}
      {activeTabMode === 'recipes' && (
        <div className="flex flex-col gap-4">
          {/* Prominent Recipe Search Bar */}
          <div className="relative flex items-center bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/25 dark:border-[#DCE9DA]/25 rounded-2xl p-1.5 shadow-2xs focus-within:border-[#153B28] dark:focus-within:border-[#A7F3D0]">
            <Search className="w-5 h-5 text-[#153B28]/60 dark:text-[#B6CEBC]/60 ml-3 shrink-0" />
            <input
              type="text"
              value={recipeQuery}
              onChange={(e) => setRecipeQuery(e.target.value)}
              placeholder="Search recipes (e.g. Butter Chicken, Pasta, Salad)..."
              className="w-full bg-transparent border-none px-3 py-2 text-sm text-[#153B28] dark:text-[#FAF4E8] placeholder-[#153B28]/50 dark:placeholder-[#B6CEBC]/50 focus:outline-none"
            />
            {recipeQuery && (
              <button
                type="button"
                onClick={() => setRecipeQuery('')}
                className="p-1.5 rounded-full hover:bg-[#EFE8D8] dark:hover:bg-[#204332] text-[#153B28]/60 dark:text-[#B6CEBC]/60 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills Bar */}
          <div className="flex flex-col gap-2.5 bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-semibold text-[#E05345] dark:text-[#FF6B5C] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Cuisine Filter Scroll */}
            <div>
              <span className="text-[10px] font-semibold text-[#153B28]/70 dark:text-[#B6CEBC]/70 mb-1 block">
                Cuisine:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <button
                    key={cuisine}
                    type="button"
                    onClick={() => {
                      haptics.selection();
                      setSelectedCuisine(cuisine);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                      selectedCuisine === cuisine
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] shadow-xs'
                        : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#FAF4E8] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629]'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary & Time Toggles */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
              {/* Vegetarian */}
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setIsVegetarian(!isVegetarian);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isVegetarian
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#FAF4E8] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
                }`}
              >
                🌱 Vegetarian
              </button>

              {/* High Protein */}
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setIsHighProtein(!isHighProtein);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isHighProtein
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#FAF4E8] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
                }`}
              >
                💪 High Protein
              </button>

              {/* Cook Time Options */}
              {COOK_TIME_OPTIONS.filter((c) => c.value !== 'all').map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => {
                    haptics.selection();
                    setSelectedCookTime(selectedCookTime === ct.value ? 'all' : ct.value);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    selectedCookTime === ct.value
                      ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28]'
                      : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#FAF4E8] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
                  }`}
                >
                  ⏱️ {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#153B28]/80 dark:text-[#FAF4E8] uppercase tracking-wider">
              Matching Recipes
            </span>
          </div>

          {/* Recipe List Results */}
          {filteredRecipes.length > 0 ? (
            <div className="flex flex-col gap-3">
              {filteredRecipes.map((recipe, idx) => {
                const match = calculateRecipeMatch(recipe, selectedIngredients);
                const detectedAllergens = checkRecipeAllergies(recipe, userAllergies);

                return (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      haptics.selection();
                      if (onSelectRecipe) {
                        onSelectRecipe(recipe);
                      } else {
                        onFindRecipes(recipe.ingredients.map((i) => (typeof i === 'string' ? i : i.name)));
                      }
                    }}
                    className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer active-press flex gap-3.5 items-center"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#EFE8D8] dark:bg-[#12261C]">
                      <RecipeImage
                        recipe={recipe}
                        alt={recipe.title}
                        priority={idx < 4}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                      {match.matchPercentage > 0 && (
                        <div className="absolute bottom-1 left-1 bg-[#153B28]/90 text-[#F8F0E2] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                          {match.matchPercentage}%
                        </div>
                      )}
                    </div>

                    {/* Meta & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold text-[#153B28] dark:text-[#A7F3D0] bg-[#DCE9DA] dark:bg-[#204E35] px-2 py-0.5 rounded-full">
                          {recipe.cuisine || 'Global'}
                        </span>
                        <span className="text-[10px] text-[#567563] dark:text-[#9BB8A5] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.cookTimeMinutes} mins</span>
                        </span>
                      </div>

                      <h3 className="font-serif-editorial text-base font-bold text-[#153B28] dark:text-[#FAF4E8] leading-tight truncate">
                        {recipe.title}
                      </h3>

                      <p className="text-xs text-[#567563] dark:text-[#9BB8A5] line-clamp-1 mt-0.5">
                        {recipe.description}
                      </p>

                      {/* Allergy Warning Badge */}
                      <AllergyWarningBadge recipe={recipe} userAllergies={userAllergies} className="mt-1.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State when zero search matches */
            <div className="bg-[#EFE8D8]/60 dark:bg-[#183024]/60 border border-dashed border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-3xl p-6 text-center flex flex-col items-center justify-center gap-3 my-4">
              <div className="w-12 h-12 rounded-full bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] flex items-center justify-center shadow-xs">
                <ChefHat className="w-6 h-6 stroke-[1.75]" />
              </div>

              <div>
                <h4 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8]">
                  No exact recipes found
                </h4>
                <p className="text-xs text-[#153B28]/70 dark:text-[#B6CEBC] max-w-xs mt-1">
                  We couldn't find recipes matching your query or filters. Try adjusting your parameters or ask AI to create a custom dish.
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs active-press cursor-pointer hover:bg-[#EFE8D8]"
                >
                  Reset Filters
                </button>

                {onGenerateAiRecipes && (
                  <button
                    type="button"
                    onClick={() => {
                      haptics.medium();
                      onGenerateAiRecipes(selectedIngredients, recipeQuery || selectedCuisine);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs shadow-xs active-press cursor-pointer hover:bg-[#1C4A33] flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>✨ Ask AI Master Chef to create this</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INGREDIENT BUILDER TAB */}
      {/* ========================================================================= */}
      {activeTabMode === 'builder' && (
        <div className="flex flex-col flex-1">
          {/* Input Field for Ingredients */}
          <form onSubmit={handleAddBuilderInput} className="mb-6">
            <div className="relative flex items-center bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/25 dark:border-[#DCE9DA]/25 rounded-2xl p-1.5 shadow-2xs focus-within:border-[#153B28] dark:focus-within:border-[#A7F3D0]">
              <Search className="w-5 h-5 text-[#153B28]/60 dark:text-[#B6CEBC]/60 ml-3 shrink-0" />
              <input
                type="text"
                value={builderInputText}
                onChange={(e) => setBuilderInputText(e.target.value)}
                placeholder="Add an ingredient (e.g. Eggs, Tomatoes)..."
                className="w-full bg-transparent border-none px-3 py-2 text-sm text-[#153B28] dark:text-[#FAF4E8] placeholder-[#153B28]/50 dark:placeholder-[#B6CEBC]/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!builderInputText.trim()}
                className="w-10 h-10 rounded-full bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] flex items-center justify-center shrink-0 disabled:opacity-40 active-press transition-transform hover:bg-[#1C4A33]"
                title="Add ingredient"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Selected Ingredients Chip List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-[#153B28]/80 dark:text-[#FAF4E8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#153B28] dark:text-[#A7F3D0]" />
                <span>Selected ({selectedIngredients.length})</span>
              </span>
              {selectedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearBuilderAll}
                  className="text-[11px] font-semibold text-[#E05345] dark:text-[#FF6B5C] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {selectedIngredients.length === 0 ? (
              <div className="bg-[#EFE8D8]/60 dark:bg-[#183024]/60 border border-dashed border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-2xl p-4 text-center text-xs text-[#153B28]/60 dark:text-[#B6CEBC]/70 italic">
                No ingredients added yet. Tap quick-add options below or type above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 bg-[#EFE8D8] dark:bg-[#183024] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 rounded-2xl p-3.5">
                {selectedIngredients.map((item) => (
                  <IngredientChip
                    key={item}
                    name={item}
                    variant="editable"
                    onRemove={() => handleRemoveBuilderItem(item)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Add Grid */}
          <div className="mb-8">
            <span className="block text-xs font-bold tracking-wider uppercase text-[#153B28]/80 dark:text-[#FAF4E8] mb-3">
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

          {/* Bottom Primary Button - NO Duplicate AI button! */}
          <div className="mt-auto pt-4 flex flex-col gap-2.5">
            {selectedIngredients.length === 0 && (
              <p className="text-[11px] text-center text-[#E05345] dark:text-[#FF6B5C] font-medium mb-1">
                Please add at least 1 ingredient to discover recipes
              </p>
            )}
            <button
              type="button"
              disabled={selectedIngredients.length === 0}
              onClick={handleFindRecipesClick}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-sm shadow-md active-press disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#1C4A33] transition-colors"
            >
              <span>Find matching recipes</span>
              <ArrowRight className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
