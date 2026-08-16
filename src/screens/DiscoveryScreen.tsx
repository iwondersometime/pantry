import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, Heart, Clock, Users, Flame, Sparkles, Filter, RefreshCw, ChefHat, Loader2 } from 'lucide-react';
import { MatchedRecipe, Recipe, DietaryFilters } from '../types';
import { IngredientChip } from '../components/IngredientChip';
import { RecipeImageService, ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';
import { RecipeImage } from '../components/RecipeImage';
import { AllergyWarningBadge } from '../components/AllergyWarningBadge';

interface DiscoveryScreenProps {
  matchedRecipes: MatchedRecipe[];
  userIngredients: string[];
  userAllergies?: string[];
  filters: DietaryFilters;
  onFilterChange: (filters: DietaryFilters) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onChangeIngredients: () => void;
  onGenerateAiRecipes?: () => void;
  isGeneratingAi?: boolean;
  generationError?: string | null;
  onClearGenerationError?: () => void;
  onRemainingCountChange?: (remaining: number) => void;
}

// Optimized Recipe Card Image component with instant fallback and zero layout shift
const RecipeCardImage: React.FC<{
  title: string;
  cuisine?: string;
  imageQuery?: string;
  ingredients?: any[];
  initialUrl?: string;
  recipeId?: string;
}> = memo(({ title, cuisine, imageQuery, ingredients, initialUrl, recipeId }) => {
  return (
    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-2xs bg-[#EFE8D8] dark:bg-[#1F3C2E] flex-shrink-0 border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
      <RecipeImage
        recipeId={recipeId}
        title={title}
        cuisine={cuisine}
        imageQuery={imageQuery}
        ingredients={ingredients}
        initialUrl={initialUrl}
        alt={title}
        priority={true}
        className="w-full h-full object-cover select-none"
        containerClassName="w-full h-full"
      />
    </div>
  );
});

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  matchedRecipes,
  userIngredients,
  userAllergies,
  filters,
  onFilterChange,
  onSaveRecipe,
  onSelectRecipe,
  onChangeIngredients,
  onGenerateAiRecipes,
  isGeneratingAi = false,
  generationError = null,
  onClearGenerationError,
  onRemainingCountChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  // Motion drag values for swipe card with hardware acceleration
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, -20], [1, 0]);

  // Reset index when active ingredients list changes (e.g. new scan or update)
  const ingredientsKey = userIngredients.join(',');
  useEffect(() => {
    setCurrentIndex(0);
  }, [ingredientsKey]);

  // Preload upcoming recipe images for buttery-smooth instant transitions
  useEffect(() => {
    if (matchedRecipes.length > 0) {
      RecipeImageService.preloadRecipeDeck(matchedRecipes, currentIndex, 3);
    }
  }, [matchedRecipes, currentIndex]);

  // Remaining deck items count
  const remainingCount = matchedRecipes.length - currentIndex;

  // Notify parent of remaining count to support background paginated discovery
  useEffect(() => {
    onRemainingCountChange?.(remainingCount);
  }, [remainingCount, onRemainingCountChange]);

  const currentMatch = matchedRecipes[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentMatch) return;

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(15);
      } catch (e) {
        // ignore if not supported
      }
    }

    setExitDirection(direction);

    if (direction === 'right') {
      onSaveRecipe(currentMatch.recipe);
      setSavedToast(`Saved "${currentMatch.recipe.title}"`);
      setTimeout(() => setSavedToast(null), 2500);
    }

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
      x.set(0);
    }, 180);
  };

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 80;
    const velocityThreshold = 350;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handleSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleSwipe('left');
    } else {
      x.set(0);
    }
  };

  const toggleFilter = (key: keyof DietaryFilters) => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
    setCurrentIndex(0); // Reset stack on filter change
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-5 pt-3 pb-20 max-w-md mx-auto relative select-none w-full box-border">
      {/* Toast notification when recipe saved */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-2 inset-x-4 sm:inset-x-6 z-50 bg-[#153B28] dark:bg-[#1F3C2E] text-[#F8F0E2] py-2.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs font-semibold border border-[#DCE9DA]/20"
          >
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>{savedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Cuisine Banner if cuisine filter is set */}
      {filters.cuisine && filters.cuisine !== 'All' && (
        <div className="flex items-center justify-between bg-[#153B28] dark:bg-[#183024] text-[#F8F0E2] p-3.5 rounded-2xl mb-3 shadow-md border border-[#DCE9DA]/20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 dark:text-[#F5B942] block">
              Cuisine Selected
            </span>
            <h1 className="text-lg font-bold">
              <span>{filters.cuisine} Recipes</span>
            </h1>
          </div>
          <button
            type="button"
            onClick={() => {
              onFilterChange({ ...filters, cuisine: 'All' });
              setCurrentIndex(0);
            }}
            className="text-xs bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-1.5 rounded-xl border border-white/20 transition-all flex items-center gap-1 active-press"
          >
            <X className="w-3.5 h-3.5" />
            <span>Show All</span>
          </button>
        </div>
      )}

      {/* Top Controls: Deck counter & Filter toggle */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#153B28] dark:text-[#FAF4E8]">
          <ChefHat className="w-4 h-4 text-[#153B28] dark:text-[#A7F3D0]" />
          <span>
            {filters.cuisine && filters.cuisine !== 'All' ? `${filters.cuisine} Recipes` : 'Pantry Recipe Deck'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full transition-all active-press ${
              showFilters || Object.values(filters).some(Boolean)
                ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2]'
                : 'bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#F8F0E2] border border-[#153B28]/10 dark:border-[#DCE9DA]/15'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter Tray */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden mb-3 bg-[#EFE8D8] dark:bg-[#183024] rounded-2xl p-3.5 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 space-y-3"
          >
            {/* Dietary Preferences */}
            <div>
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#153B28]/70 dark:text-[#B6CEBC] mb-1.5">
                Dietary Preferences
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'vegetarian', label: 'Vegetarian' },
                  { key: 'vegan', label: 'Vegan' },
                  { key: 'glutenFree', label: 'Gluten-Free' },
                  { key: 'lowCarb', label: 'Low Carb' },
                  { key: 'highProtein', label: 'High Protein' },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => toggleFilter(f.key as keyof DietaryFilters)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      filters[f.key as keyof DietaryFilters]
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold'
                        : 'bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cook Time Filter */}
            <div>
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#153B28]/70 dark:text-[#B6CEBC] mb-1.5">
                Cook Time
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Any Time' },
                  { id: 'under15', label: '< 15 mins' },
                  { id: '15to30', label: '15-30 mins' },
                  { id: '30to60', label: '30-60 mins' },
                ].map((ct) => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, cookTime: ct.id as any });
                      setCurrentIndex(0);
                    }}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      filters.cookTime === ct.id
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold'
                        : 'bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#153B28]/70 dark:text-[#B6CEBC] mb-1.5">
                Difficulty
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, difficulty: diff as any });
                      setCurrentIndex(0);
                    }}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      filters.difficulty === diff
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold'
                        : 'bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <span className="block text-[10px] font-bold tracking-wider uppercase text-[#153B28]/70 dark:text-[#B6CEBC] mb-1.5">
                Cuisine
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                {['All', 'Indian', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'Korean', 'American', 'Mediterranean', 'Thai'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, cuisine: c as any });
                      setCurrentIndex(0);
                    }}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      filters.cuisine === c
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold'
                        : 'bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Error Alert */}
      {generationError && (
        <div className="mb-3.5 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/45 rounded-2xl flex items-center justify-between text-xs text-red-800 dark:text-red-200 shadow-2xs">
          <span className="flex-1 mr-3 font-medium leading-relaxed">{generationError}</span>
          <div className="flex gap-2 items-center shrink-0">
            {onGenerateAiRecipes && (
              <button
                type="button"
                onClick={onGenerateAiRecipes}
                className="bg-red-600 dark:bg-red-800 text-white font-bold px-3 py-1.5 rounded-xl hover:opacity-90 active-press cursor-pointer text-[11px]"
              >
                Retry
              </button>
            )}
            {onClearGenerationError && (
              <button
                type="button"
                onClick={onClearGenerationError}
                className="text-red-800 dark:text-red-200 hover:opacity-80 p-1"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Swipe Deck Area */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[460px] relative w-full">
        {isGeneratingAi && currentMatch && (
          <div className="mb-3 flex justify-center w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF5EC]/90 dark:bg-[#1F3C2E]/90 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[11px] font-semibold text-[#153B28] dark:text-[#A7F3D0] rounded-full shadow-2xs animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Chef is preparing more recipes...</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center w-full relative">
          <AnimatePresence mode="popLayout">
            {isGeneratingAi && !currentMatch ? (
            /* AI Recipe Generation Loading View */
            <motion.div
              key="ai-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full bg-[#EFE8D8] dark:bg-[#183024] rounded-[32px] p-8 text-center border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-sm flex flex-col items-center justify-center min-h-[420px] my-auto"
            >
              <div className="relative w-20 h-20 rounded-full bg-[#153B28] dark:bg-[#2E6B4B] flex items-center justify-center mb-5 text-[#F8F0E2] shadow-md animate-pulse">
                <Sparkles className="w-10 h-10 text-[#DCE9DA] animate-spin" />
                <ChefHat className="w-6 h-6 absolute text-amber-300" />
              </div>

              <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] dark:text-[#FAF4E8] mb-2">
                Crafting Fresh Recipes...
              </h3>

              <p className="text-xs text-[#153B28]/80 dark:text-[#B6CEBC] mb-6 max-w-xs leading-relaxed">
                Generating delicious dishes around your confirmed ingredients:
                <span className="block font-semibold mt-1 text-[#153B28] dark:text-[#FAF4E8] bg-[#FAF5EC] dark:bg-[#1F3C2E] p-2 rounded-xl border border-[#153B28]/10 dark:border-[#DCE9DA]/15">
                  {userIngredients.length > 0
                    ? userIngredients.slice(0, 5).join(', ') + (userIngredients.length > 5 ? ' & more' : '')
                    : 'Your kitchen pantry'}
                </span>
              </p>

              <div className="w-full max-w-xs bg-[#FAF5EC] dark:bg-[#1F3C2E] rounded-full h-2 overflow-hidden border border-[#153B28]/20 dark:border-[#DCE9DA]/20">
                <div className="bg-[#153B28] dark:bg-[#2E6B4B] h-full animate-pulse w-3/4 rounded-full" />
              </div>
            </motion.div>
          ) : currentMatch ? (
            <motion.div
              key={currentMatch.recipe.id}
              initial={{ scale: 0.95, opacity: 0.8, y: 10 }}
              animate={
                exitDirection
                  ? {
                      x: exitDirection === 'right' ? 320 : -320,
                      opacity: 0,
                      rotate: exitDirection === 'right' ? 22 : -22,
                    }
                  : { scale: 1, opacity: 1, y: 0, x: 0 }
              }
              exit={{
                x: exitDirection === 'left' ? -320 : 320,
                opacity: 0,
                rotate: exitDirection === 'left' ? -22 : 22,
              }}
              transition={{
                duration: exitDirection ? 0.2 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ x, rotate, willChange: 'transform, opacity' }}
              drag={exitDirection ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              dragTransition={{ bounceStiffness: 500, bounceDamping: 30 }}
              onDragEnd={handleDragEnd}
              onClick={() => {
                if (!exitDirection) onSelectRecipe(currentMatch.recipe);
              }}
              className="w-full bg-[#FAF5EC] dark:bg-[#183024] rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-xl cursor-grab active:cursor-grabbing relative overflow-hidden flex flex-col justify-between min-h-[450px] box-border"
            >
              {/* Visual Overlays for Swipe Feedback */}
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute top-6 right-6 z-20 bg-emerald-700 text-white font-bold text-sm px-4 py-1.5 rounded-full rotate-12 border-2 border-white shadow-lg flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>SAVE</span>
              </motion.div>

              <motion.div
                style={{ opacity: skipOpacity }}
                className="absolute top-6 left-6 z-20 bg-[#E05345] text-white font-bold text-sm px-4 py-1.5 rounded-full -rotate-12 border-2 border-white shadow-lg flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>SKIP</span>
              </motion.div>

              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-[#DCE9DA] dark:bg-[#224835] text-[#153B28] dark:text-[#A7F3D0] text-xs font-bold px-3.5 py-1.5 rounded-full border border-[#C2D8BF] dark:border-[#38674E] shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#153B28] dark:text-[#A7F3D0]" />
                    <span>Pantry Match: {currentMatch.matchPercentage}%</span>
                  </span>

                  <span className="bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#E2EFE5] text-xs font-semibold px-3 py-1 rounded-full border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                    {currentMatch.recipe.cuisine}
                  </span>
                </div>

                {/* Recipe Title & Verified Image Banner */}
                <RecipeCardImage
                  title={currentMatch.recipe.title}
                  cuisine={currentMatch.recipe.cuisine}
                  imageQuery={currentMatch.recipe.imageQuery}
                  ingredients={currentMatch.recipe.ingredients}
                  initialUrl={currentMatch.recipe.imageUrl}
                  recipeId={currentMatch.recipe.id}
                />

                <AllergyWarningBadge recipe={currentMatch.recipe} userAllergies={userAllergies} className="my-2" />

                <h2 className="font-serif-editorial text-2xl font-semibold text-[#153B28] dark:text-[#FAF4E8] leading-tight mb-2">
                  {currentMatch.recipe.title}
                </h2>

                <p className="text-xs text-[#153B28]/80 dark:text-[#B6CEBC] leading-relaxed mb-4 font-normal line-clamp-2">
                  {currentMatch.recipe.description}
                </p>

                {/* Three Metadata Cards */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-[#EFE8D8] dark:bg-[#1F3C2E] p-2.5 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                    <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-0.5">
                      SERVINGS
                    </span>
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28] dark:text-[#FAF4E8]">
                      <Users className="w-3.5 h-3.5" />
                      <span>{currentMatch.recipe.servings}</span>
                    </div>
                  </div>

                  <div className="bg-[#EFE8D8] dark:bg-[#1F3C2E] p-2.5 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                    <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-0.5">
                      COOK TIME
                    </span>
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28] dark:text-[#FAF4E8]">
                      <Clock className="w-3.5 h-3.5 text-[#153B28] dark:text-[#F5B942]" />
                      <span>{currentMatch.recipe.cookTimeMinutes}m</span>
                    </div>
                  </div>

                  <div className="bg-[#EFE8D8] dark:bg-[#1F3C2E] p-2.5 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                    <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-0.5">
                      DIFFICULTY
                    </span>
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#153B28] dark:text-[#FAF4E8]">
                      <Flame className="w-3.5 h-3.5 text-amber-700 dark:text-[#FB923C]" />
                      <span>{currentMatch.recipe.difficulty}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredient Breakdown */}
                <div className="border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-[#153B28] dark:text-[#FAF4E8] uppercase">
                      YOU HAVE {currentMatch.availableCount} OF {currentMatch.totalCount} INGREDIENTS
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                    {/* Available ingredients */}
                    {currentMatch.availableIngredients.map((ing) => (
                      <IngredientChip key={ing.name} name={ing.name} variant="available" />
                    ))}

                    {/* Missing/Additional ingredients */}
                    {currentMatch.missingIngredients.map((ing) => (
                      <IngredientChip key={ing.name} name={ing.name} variant="missing" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 text-center border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                <span className="text-[10.5px] font-medium text-[#153B28]/60 dark:text-[#B6CEBC] italic">
                  Tap card to view complete cooking steps
                </span>
              </div>
            </motion.div>
          ) : (
            /* Empty Deck State */
            <div className="w-full bg-[#EFE8D8] dark:bg-[#183024] rounded-[32px] p-8 text-center border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#153B28]/10 dark:bg-white/10 flex items-center justify-center mb-4 text-[#153B28] dark:text-[#A7F3D0]">
                <ChefHat className="w-8 h-8 stroke-[1.5]" />
              </div>

              <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] dark:text-[#FAF4E8] mb-2">
                {filters.cuisine && filters.cuisine !== 'All'
                  ? `More ${filters.cuisine} recipes?`
                  : 'You explored all current matches!'}
              </h3>

              <p className="text-xs text-[#153B28]/75 dark:text-[#B6CEBC] mb-6 max-w-xs leading-relaxed">
                Generate a brand-new batch of creative, custom recipes tailored for your confirmed ingredients.
              </p>

              <div className="flex flex-col gap-2.5 w-full max-w-xs">
                {onGenerateAiRecipes && (
                  <button
                    type="button"
                    disabled={isGeneratingAi || userIngredients.length === 0}
                    onClick={onGenerateAiRecipes}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-bold text-xs shadow-md active-press flex items-center justify-center gap-2 border border-[#DCE9DA]/20"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Generate New {filters.cuisine && filters.cuisine !== 'All' ? filters.cuisine : ''} Recipes</span>
                  </button>
                )}

                {filters.cuisine && filters.cuisine !== 'All' && (
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange({ ...filters, cuisine: 'All' });
                      setCurrentIndex(0);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-[#FAF5EC] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs border border-[#153B28]/20 dark:border-[#DCE9DA]/20 active-press"
                  >
                    <span>Show All Cuisines</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onChangeIngredients}
                  className="w-full py-3 px-4 rounded-2xl bg-transparent border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#FAF4E8] font-semibold text-xs active-press flex items-center justify-center gap-2 hover:bg-[#153B28]/5 dark:hover:bg-white/5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update pantry ingredients</span>
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>

      {/* Swipe Action Controls Beneath Card */}
      {currentMatch && (
        <div className="flex items-center justify-around mt-4 px-4">
          {/* Left Skip Button */}
          <button
            type="button"
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-[#FAF5EC] dark:bg-[#1F3C2E] border-2 border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#FAF4E8] flex items-center justify-center shadow-md active-press hover:bg-[#EFE8D8] dark:hover:bg-[#274B39] transition-colors"
            title="Skip recipe"
            aria-label="Skip recipe"
          >
            <X className="w-7 h-7 stroke-[2]" />
          </button>

          {/* Center Text Instruction */}
          <div className="text-center">
            <p className="text-[11px] font-medium text-[#153B28]/70 dark:text-[#B6CEBC] leading-tight">
              Swipe left to skip,
            </p>
            <p className="text-[11px] font-bold text-[#153B28] dark:text-[#FAF4E8] leading-tight">
              right to save
            </p>
          </div>

          {/* Right Save Heart Button */}
          <button
            type="button"
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] flex items-center justify-center shadow-lg active-press hover:bg-[#1a4731] dark:hover:bg-[#387F5A] transition-colors"
            title="Save recipe"
            aria-label="Save recipe"
          >
            <Heart className="w-7 h-7 fill-[#F8F0E2] stroke-none" />
          </button>
        </div>
      )}
    </div>
  );
};
