import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { X, Heart, Clock, Users, Flame, Sparkles, Filter, RefreshCw, ChefHat } from 'lucide-react';
import { MatchedRecipe, Recipe, DietaryFilters } from '../types';
import { IngredientChip } from '../components/IngredientChip';

interface DiscoveryScreenProps {
  matchedRecipes: MatchedRecipe[];
  userIngredients: string[];
  filters: DietaryFilters;
  onFilterChange: (filters: DietaryFilters) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onChangeIngredients: () => void;
}

export const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({
  matchedRecipes,
  userIngredients,
  filters,
  onFilterChange,
  onSaveRecipe,
  onSelectRecipe,
  onChangeIngredients,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Motion drag values for swipe card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-100, -20], [1, 0]);

  const currentMatch = matchedRecipes[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentMatch) return;

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(15);
      } catch (e) {
        // ignore if not allowed by browser permissions
      }
    }

    if (direction === 'right') {
      onSaveRecipe(currentMatch.recipe);
      setSavedToast(`Saved "${currentMatch.recipe.title}"`);
      setTimeout(() => setSavedToast(null), 2500);
    }

    setCurrentIndex((prev) => prev + 1);
    x.set(0);
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      handleSwipe('right');
    } else if (info.offset.x < -100) {
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

  // Remaining deck items count
  const remainingCount = matchedRecipes.length - currentIndex;

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-5 pt-3 pb-20 max-w-md mx-auto relative select-none">
      {/* Toast notification when recipe saved */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-2 inset-x-6 z-50 bg-[#153B28] text-[#F8F0E2] py-2.5 px-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-xs font-semibold border border-[#DCE9DA]/20"
          >
            <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>{savedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls: Deck counter & Dietary Filter toggle */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#153B28]/80">
          <ChefHat className="w-4 h-4 text-[#153B28]" />
          <span>Recipe Deck ({remainingCount > 0 ? remainingCount : 0})</span>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-full transition-all active-press ${
            showFilters || Object.values(filters).some(Boolean)
              ? 'bg-[#153B28] text-[#F8F0E2]'
              : 'bg-[#EFE8D8] text-[#153B28]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Expandable Dietary Filter bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3 bg-[#EFE8D8] rounded-2xl p-3 border border-[#153B28]/15"
          >
            <span className="block text-[11px] font-bold tracking-wider uppercase text-[#153B28]/70 mb-2">
              Dietary Preferences
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'vegetarian', label: 'Vegetarian' },
                { key: 'vegan', label: 'Vegan' },
                { key: 'glutenFree', label: 'Gluten-Free' },
                { key: 'lowCarb', label: 'Low Carb' },
                { key: 'quickOnly', label: 'Quick (≤20m)' },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFilter(f.key as keyof DietaryFilters)}
                  className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                    filters[f.key as keyof DietaryFilters]
                      ? 'bg-[#153B28] text-[#F8F0E2] font-semibold'
                      : 'bg-[#FAF5EC] text-[#153B28] border border-[#153B28]/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tinder Card Swipe Area */}
      <div className="flex-1 flex items-center justify-center min-h-[460px] relative">
        {currentMatch ? (
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectRecipe(currentMatch.recipe)}
            className="w-full bg-[#FAF5EC] rounded-[32px] p-6 border border-[#153B28]/15 shadow-xl cursor-grab active:cursor-grabbing relative overflow-hidden flex flex-col justify-between min-h-[450px]"
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
                <span className="inline-flex items-center gap-1 bg-[#DCE9DA] text-[#153B28] text-xs font-bold px-3 py-1 rounded-full border border-[#C2D8BF]">
                  <Sparkles className="w-3.5 h-3.5 text-[#153B28]" />
                  <span>{currentMatch.matchPercentage}% pantry match</span>
                </span>

                <span className="bg-[#EFE8D8] text-[#153B28] text-xs font-semibold px-3 py-1 rounded-full border border-[#153B28]/10">
                  {currentMatch.recipe.cuisine}
                </span>
              </div>

              {/* Recipe Title & Image Banner */}
              {currentMatch.recipe.imageUrl && (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-2xs">
                  <img
                    src={currentMatch.recipe.imageUrl}
                    alt={currentMatch.recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h2 className="font-serif-editorial text-2xl font-semibold text-[#153B28] leading-tight mb-2">
                {currentMatch.recipe.title}
              </h2>

              <p className="text-xs text-[#153B28]/80 leading-relaxed mb-5 font-normal line-clamp-2">
                {currentMatch.recipe.description}
              </p>

              {/* Three Metadata Cards */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-[#EFE8D8] p-2.5 rounded-2xl text-center border border-[#153B28]/10">
                  <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 uppercase mb-0.5">
                    SERVINGS
                  </span>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{currentMatch.recipe.servings}</span>
                  </div>
                </div>

                <div className="bg-[#EFE8D8] p-2.5 rounded-2xl text-center border border-[#153B28]/10">
                  <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 uppercase mb-0.5">
                    COOK TIME
                  </span>
                  <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentMatch.recipe.cookTimeMinutes}m</span>
                  </div>
                </div>

                <div className="bg-[#EFE8D8] p-2.5 rounded-2xl text-center border border-[#153B28]/10">
                  <span className="block text-[9px] font-bold tracking-wider text-[#153B28]/60 uppercase mb-0.5">
                    DIFFICULTY
                  </span>
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#153B28]">
                    <Flame className="w-3.5 h-3.5 text-amber-700" />
                    <span>{currentMatch.recipe.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Ingredient Matching Count & Chips */}
              <div className="border-t border-[#153B28]/10 pt-4">
                <span className="block text-[11px] font-bold tracking-wider text-[#153B28] uppercase mb-2">
                  YOU HAVE {currentMatch.availableCount} OF {currentMatch.totalCount} INGREDIENTS
                </span>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                  {/* Available ingredients (pale green filled) */}
                  {currentMatch.availableIngredients.map((ing) => (
                    <IngredientChip key={ing.name} name={ing.name} variant="available" />
                  ))}

                  {/* Missing ingredients (cream + dashed coral border) */}
                  {currentMatch.missingIngredients.map((ing) => (
                    <IngredientChip key={ing.name} name={ing.name} variant="missing" />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2 text-center border-t border-[#153B28]/10">
              <span className="text-[10.5px] font-medium text-[#153B28]/60 italic">
                Tap card to view complete cooking steps
              </span>
            </div>
          </motion.div>
        ) : (
          /* Empty Deck State */
          <div className="w-full bg-[#EFE8D8] rounded-[32px] p-8 text-center border border-[#153B28]/15 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
            <div className="w-16 h-16 rounded-full bg-[#153B28]/10 flex items-center justify-center mb-4 text-[#153B28]">
              <Sparkles className="w-8 h-8 stroke-[1.5]" />
            </div>

            <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-2">
              No more recipes for now.
            </h3>

            <p className="text-xs text-[#153B28]/75 mb-6 max-w-xs leading-relaxed">
              You've swiped through all available matching recipes with your current ingredients.
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              <button
                type="button"
                onClick={onChangeIngredients}
                className="w-full py-3 px-4 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-xs shadow-xs active-press flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change ingredients</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Swipe Action Controls Beneath Card */}
      {currentMatch && (
        <div className="flex items-center justify-around mt-4 px-4">
          {/* Left Skip Button */}
          <button
            type="button"
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-[#FAF5EC] border-2 border-[#153B28]/20 text-[#153B28] flex items-center justify-center shadow-md active-press hover:bg-[#EFE8D8]"
            title="Skip recipe"
            aria-label="Skip recipe"
          >
            <X className="w-7 h-7 stroke-[2]" />
          </button>

          {/* Center Text Instruction */}
          <div className="text-center">
            <p className="text-[11px] font-medium text-[#153B28]/70 leading-tight">
              Swipe left to skip,
            </p>
            <p className="text-[11px] font-bold text-[#153B28] leading-tight">
              right to cook
            </p>
          </div>

          {/* Right Save Heart Button */}
          <button
            type="button"
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-[#153B28] text-[#F8F0E2] flex items-center justify-center shadow-lg active-press hover:bg-[#1a4731]"
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
