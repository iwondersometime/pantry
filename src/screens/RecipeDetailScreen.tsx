import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Clock, Users, Flame, Play, Pause, RotateCcw, Check, Sparkles, ChefHat, Plus, Minus, ShoppingBag, Info, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, RecipeIngredient } from '../types';
import { calculateRecipeMatch } from '../services/IngredientMatchingEngine';
import { IngredientChip } from '../components/IngredientChip';
import { scaleIngredientAmount } from '../utils/servingScaler';
import { CookingModeModal } from '../components/CookingModeModal';
import { RecipeImageService, ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';
import { RecipeImage } from '../components/RecipeImage';
import { haptics } from '../services/HapticService';
import { checkRecipeAllergies } from '../utils/allergyChecker';
import { LocalStorageService } from '../services/LocalStorageService';
import { AllergyWarningBadge } from '../components/AllergyWarningBadge';
import { validateRecipe } from '../utils/recipeValidator';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  userIngredients: string[];
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onBack: () => void;
  onCookedRecipe?: () => void;
  onAddMissingToShoppingList?: (missing: RecipeIngredient[], recipeId: string, recipeTitle: string) => void;
  onRecipeNormalized?: (updatedRecipe: Recipe) => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  userIngredients,
  isSaved,
  onToggleSave,
  onBack,
  onCookedRecipe,
  onAddMissingToShoppingList,
  onRecipeNormalized,
}) => {
  const match = calculateRecipeMatch(recipe, userIngredients);
  const [servingsCount, setServingsCount] = useState<number>(recipe.servings || 2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isCookingModeOpen, setIsCookingModeOpen] = useState<boolean>(false);
  const [shoppingAddedToast, setShoppingAddedToast] = useState<string | null>(null);
  const [isNormalizing, setIsNormalizing] = useState<boolean>(false);
  const [normalizationError, setNormalizationError] = useState<string | null>(null);

  // Auto-normalize recipe if it has vague ingredients
  useEffect(() => {
    const checkAndNormalize = async () => {
      const val = validateRecipe(recipe);
      if (!val.isValid) {
        setIsNormalizing(true);
        setNormalizationError(null);
        try {
          const res = await fetch('/api/normalize-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipe }),
          });
          if (!res.ok) {
            throw new Error(`Normalization API returned status ${res.status}`);
          }
          const data = await res.json();
          if (data && data.recipe) {
            onRecipeNormalized?.(data.recipe);
          } else {
            throw new Error('Invalid response from normalization API.');
          }
        } catch (err: any) {
          console.error('Failed to normalize recipe:', err);
          setNormalizationError('Failed to refine ingredients. Displaying original recipe.');
        } finally {
          setIsNormalizing(false);
        }
      } else {
        setIsNormalizing(false);
        setNormalizationError(null);
      }
    };

    checkAndNormalize();
  }, [recipe, onRecipeNormalized]);

  // Handle countdown timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      haptics.success();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const startStepTimer = (stepIndex: number, minutes: number) => {
    haptics.medium();
    if (activeStepTimerIndex === stepIndex && isTimerRunning) {
      setIsTimerRunning(false);
    } else {
      setActiveStepTimerIndex(stepIndex);
      setTimerSecondsLeft(minutes * 60);
      setIsTimerRunning(true);
    }
  };

  const toggleStepCompleted = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      haptics.light();
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      haptics.success();
      const nextCompleted = [...completedSteps, stepNumber];
      setCompletedSteps(nextCompleted);
      if (nextCompleted.length === recipe.instructions.length) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const handleAddMissingToShopping = () => {
    if (!match.missingIngredients || match.missingIngredients.length === 0) return;
    haptics.medium();
    onAddMissingToShoppingList?.(match.missingIngredients, recipe.id, recipe.title);
    setShoppingAddedToast(`Added ${match.missingIngredients.length} missing item(s) to shopping list!`);
    setTimeout(() => setShoppingAddedToast(null), 3500);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Estimate Nutrition values if not present
  const nutrition = recipe.nutrition || {
    calories: Math.round((recipe.cookTimeMinutes * 8) + 280),
    proteinGrams: Math.round(18 + (recipe.ingredients.length * 2)),
    carbsGrams: Math.round(25 + (recipe.ingredients.length * 3)),
    fatGrams: Math.round(10 + (recipe.ingredients.length * 1.5)),
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Toast Feedback Banner */}
      {shoppingAddedToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#153B28] text-[#F8F0E2] text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-[#DCE9DA]/30 flex items-center gap-2 animate-bounce">
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>{shoppingAddedToast}</span>
        </div>
      )}

      {/* Focus Cooking Mode Overlay */}
      {isCookingModeOpen && (
        <CookingModeModal
          recipe={recipe}
          onClose={() => setIsCookingModeOpen(false)}
          onFinishCooking={() => {
            setIsCookingModeOpen(false);
            setCompletedSteps(recipe.instructions.map((s) => s.stepNumber));
            onCookedRecipe?.();
          }}
        />
      )}

      {/* Top Bar Navigation */}
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

        <span className="text-xs font-semibold tracking-wider text-[#153B28]/70 dark:text-[#B6CEBC] uppercase">Recipe Details</span>

        <button
          type="button"
          onClick={() => {
            haptics.medium();
            onToggleSave(recipe);
          }}
          className={`p-2.5 rounded-full shadow-xs active-press transition-colors ${
            isSaved
              ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-white'
              : 'bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#F8F0E2] border border-[#153B28]/15 dark:border-[#DCE9DA]/15'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-white stroke-none' : 'stroke-[2]'}`} />
        </button>
      </div>

      {isNormalizing ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 min-h-[350px] bg-[#FAF5EB] dark:bg-[#152E20] rounded-2xl border border-[#153B28]/10 dark:border-[#DCE9DA]/10 shadow-xs mt-4">
          <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-700 dark:border-emerald-950 dark:border-t-emerald-400 rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-serif text-[#153B28] dark:text-[#FAF4E8] font-bold mb-2">Refining Recipe...</h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm text-center max-w-sm mb-4">
            Our AI Chef is detailing ingredients, verifying exact spice measurements, and validating cooking step consistency for <span className="font-semibold">"{recipe.title}"</span>.
          </p>
          <span className="text-xs text-amber-700 dark:text-emerald-400 font-semibold tracking-wider uppercase animate-pulse">
            Culinarily Normalizing
          </span>
        </div>
      ) : (
        <>
          {/* Normalization Error Alert */}
          {normalizationError && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{normalizationError}</span>
            </div>
          )}

          {/* Recipe Header */}
          <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#DCE9DA] dark:bg-[#224835] text-[#153B28] dark:text-[#A7F3D0] text-xs font-bold px-3 py-1 rounded-full border border-[#C2D8BF] dark:border-[#38674E]">
            {match.matchPercentage}% match
          </span>
          <span className="bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#E2EFE5] text-xs font-semibold px-3 py-1 rounded-full border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
            {recipe.cuisine}
          </span>
        </div>

        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-xs bg-[#EFE8D8] dark:bg-[#1F3C2E] border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
          <RecipeImage
            recipe={recipe}
            alt={recipe.title}
            priority={true}
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
        </div>

        <h1 className="font-serif-editorial text-3xl font-semibold text-[#153B28] dark:text-[#FAF4E8] leading-tight mb-2">
          {recipe.title}
        </h1>

        {/* Allergy Warning Banner */}
        <AllergyWarningBadge recipe={recipe} variant="full" className="my-3" />

        <p className="text-xs text-[#153B28]/80 dark:text-[#B6CEBC] leading-relaxed font-normal">{recipe.description}</p>
      </div>

      {/* Metadata & Interactive Servings Card */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {/* Interactive Servings Selector */}
        <div className="bg-[#EFE8D8] dark:bg-[#183024] p-3 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10 flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-1">SERVINGS</span>
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#153B28] dark:text-[#F8F0E2]">
            <button
              type="button"
              onClick={() => {
                haptics.light();
                setServingsCount(Math.max(1, servingsCount - 1));
              }}
              className="p-1 rounded-full bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 hover:bg-white dark:hover:bg-[#254A38] text-[#153B28] dark:text-[#F8F0E2]"
              title="Decrease servings"
            >
              <Minus className="w-3 h-3 text-[#153B28] dark:text-[#F8F0E2]" />
            </button>
            <span className="w-4 text-center">{servingsCount}</span>
            <button
              type="button"
              onClick={() => {
                haptics.light();
                setServingsCount(Math.min(12, servingsCount + 1));
              }}
              className="p-1 rounded-full bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 hover:bg-white dark:hover:bg-[#254A38] text-[#153B28] dark:text-[#F8F0E2]"
              title="Increase servings"
            >
              <Plus className="w-3 h-3 text-[#153B28] dark:text-[#F8F0E2]" />
            </button>
          </div>
        </div>

        <div className="bg-[#EFE8D8] dark:bg-[#183024] p-3 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10 flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-1">COOK TIME</span>
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28] dark:text-[#F8F0E2]">
            <Clock className="w-3.5 h-3.5 text-[#153B28] dark:text-[#F5B942]" />
            <span>{recipe.cookTimeMinutes} min</span>
          </div>
        </div>

        <div className="bg-[#EFE8D8] dark:bg-[#183024] p-3 rounded-2xl text-center border border-[#153B28]/10 dark:border-[#DCE9DA]/10 flex flex-col justify-between">
          <span className="block text-[9px] font-bold text-[#153B28]/60 dark:text-[#B6CEBC]/70 uppercase mb-1">DIFFICULTY</span>
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#153B28] dark:text-[#F8F0E2]">
            <Flame className="w-3.5 h-3.5 text-amber-700 dark:text-[#FB923C]" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Estimated Nutrition Section */}
      <div className="bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-3xl p-4 mb-6 shadow-2xs">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#153B28] dark:text-[#F8F0E2] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#153B28] dark:text-[#F5B942]" />
            <span>Nutrition Information</span>
          </span>
          <span className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC] font-medium italic">
            *Estimated per serving
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center pt-1">
          <div>
            <span className="block text-xs font-bold text-[#153B28] dark:text-[#F8F0E2]">
              {Math.round(nutrition.calories * (servingsCount / (recipe.servings || 2)))}
            </span>
            <span className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC] font-medium">Calories</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-[#153B28] dark:text-[#F8F0E2]">
              {Math.round(nutrition.proteinGrams * (servingsCount / (recipe.servings || 2)))}g
            </span>
            <span className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC] font-medium">Protein</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-[#153B28] dark:text-[#F8F0E2]">
              {Math.round(nutrition.carbsGrams * (servingsCount / (recipe.servings || 2)))}g
            </span>
            <span className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC] font-medium">Carbs</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-[#153B28] dark:text-[#F8F0E2]">
              {Math.round(nutrition.fatGrams * (servingsCount / (recipe.servings || 2)))}g
            </span>
            <span className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC] font-medium">Fat</span>
          </div>
        </div>
      </div>

      {/* Ingredients List (Have vs Missing) */}
      <div className="bg-[#EFE8D8] dark:bg-[#183024] rounded-3xl p-5 border border-[#153B28]/10 dark:border-[#DCE9DA]/10 mb-6 shadow-2xs">
        <h3 className="text-xs font-bold tracking-wider uppercase text-[#153B28] dark:text-[#F8F0E2] mb-3 flex items-center justify-between">
          <span>Ingredients ({recipe.ingredients.length})</span>
          <span className="text-[11px] font-normal text-[#153B28]/70 dark:text-[#B6CEBC]">
            Scaled for {servingsCount} serving(s)
          </span>
        </h3>

        {/* Ingredients You Have */}
        <div className="mb-3">
          <span className="block text-[10px] font-bold text-[#153B28]/70 dark:text-[#B6CEBC] uppercase mb-1.5">You Have:</span>
          <div className="flex flex-wrap gap-1.5">
            {match.availableIngredients.map((ing) => {
              const scaledAmount = scaleIngredientAmount(ing.amount, recipe.servings || 2, servingsCount);
              return (
                <IngredientChip key={ing.name} name={`${scaledAmount} ${ing.name}`} variant="available" />
              );
            })}
          </div>
        </div>

        {/* Missing Ingredients & Shopping Button */}
        {match.missingIngredients.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
            <span className="block text-[10px] font-bold text-[#C23B2D] dark:text-[#FF8A7A] uppercase mb-1.5">Missing:</span>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {match.missingIngredients.map((ing) => {
                const scaledAmount = scaleIngredientAmount(ing.amount, recipe.servings || 2, servingsCount);
                return (
                  <IngredientChip key={ing.name} name={`${scaledAmount} ${ing.name}`} variant="missing" />
                );
              })}
            </div>

            {/* Shopping List Button */}
            <button
              type="button"
              onClick={handleAddMissingToShopping}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#F8F0E2] font-semibold text-xs shadow-2xs hover:bg-white dark:hover:bg-[#254A38] active-press flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#153B28] dark:text-[#A7F3D0]" />
              <span>Add missing ingredients to shopping list</span>
            </button>
          </div>
        )}
      </div>

      {/* Focus Cooking Mode Header Button */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => {
            haptics.medium();
            setIsCookingModeOpen(true);
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs shadow-md active-press flex items-center justify-center gap-2 hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
        >
          <ChefHat className="w-4 h-4 text-[#DCE9DA] dark:text-[#A7F3D0]" />
          <span>Start Focus Cooking Mode</span>
        </button>
      </div>

      {/* Step-by-Step Cooking Instructions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
            <span>Cooking Steps</span>
          </h3>
          <span className="text-xs font-semibold text-[#153B28]/70 dark:text-[#B6CEBC]">
            {completedSteps.length}/{recipe.instructions.length} done
          </span>
        </div>

        <div className="space-y-3.5">
          {recipe.instructions.map((step, idx) => {
            const isDone = completedSteps.includes(step.stepNumber);
            const hasTimer = step.timerMinutes && step.timerMinutes > 0;
            const isTimerActiveForThis = activeStepTimerIndex === idx;

            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-[#DCE9DA]/40 dark:bg-[#224835]/40 border-[#C2D8BF] dark:border-[#38674E] opacity-80'
                    : 'bg-[#FAF5EC] dark:bg-[#183024] border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Step Number Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(step.stepNumber)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-white'
                        : 'bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#F8F0E2] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                  </button>

                  <div className="flex-1">
                    <p className={`text-xs text-[#153B28] dark:text-[#E2EFE5] leading-relaxed font-normal ${isDone ? 'line-through opacity-70' : ''}`}>
                      {step.instruction}
                    </p>

                    {/* Step Timer Control */}
                    {hasTimer && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startStepTimer(idx, step.timerMinutes!)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active-press ${
                            isTimerActiveForThis && isTimerRunning
                              ? 'bg-[#E05345] dark:bg-[#FF6B5C] text-white animate-pulse'
                              : 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2]'
                          }`}
                        >
                          {isTimerActiveForThis && isTimerRunning ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>{formatTimer(timerSecondsLeft)}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>Start {step.timerMinutes}m Timer</span>
                            </>
                          )}
                        </button>

                        {isTimerActiveForThis && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsTimerRunning(false);
                              setTimerSecondsLeft(step.timerMinutes! * 60);
                            }}
                            className="p-1.5 rounded-full bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#F8F0E2] hover:bg-gray-200 dark:hover:bg-[#254A38]"
                            title="Reset Timer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Cooking Action */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => {
            haptics.success();
            setCompletedSteps(recipe.instructions.map((s) => s.stepNumber));
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            onCookedRecipe?.();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-base shadow-md active-press flex items-center justify-center gap-2 hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
        >
          <Sparkles className="w-5 h-5 text-[#DCE9DA] dark:text-[#F5B942]" />
          <span>I cooked this!</span>
        </button>
      </div>
        </>
      )}
    </div>
  );
};

