import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Clock, Users, Flame, Play, Pause, RotateCcw, Check, Sparkles, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe, RecipeIngredient } from '../types';
import { calculateRecipeMatch } from '../services/IngredientMatchingEngine';
import { IngredientChip } from '../components/IngredientChip';

interface RecipeDetailScreenProps {
  recipe: Recipe;
  userIngredients: string[];
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onBack: () => void;
  onCookedRecipe?: () => void;
}

export const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({
  recipe,
  userIngredients,
  isSaved,
  onToggleSave,
  onBack,
  onCookedRecipe,
}) => {
  const match = calculateRecipeMatch(recipe, userIngredients);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStepTimerIndex, setActiveStepTimerIndex] = useState<number | null>(null);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Handle countdown timer tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play audio chime or trigger celebratory alert
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const startStepTimer = (stepIndex: number, minutes: number) => {
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
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      const nextCompleted = [...completedSteps, stepNumber];
      setCompletedSteps(nextCompleted);
      if (nextCompleted.length === recipe.instructions.length) {
        // All steps completed celebration
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-6 pt-4 pb-24 max-w-md mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-[#153B28]/10 text-[#153B28] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </button>

        <span className="text-xs font-semibold tracking-wider text-[#153B28]/70 uppercase">Recipe Details</span>

        <button
          type="button"
          onClick={() => onToggleSave(recipe)}
          className={`p-2.5 rounded-full shadow-xs active-press transition-colors ${
            isSaved ? 'bg-[#153B28] text-white' : 'bg-[#EFE8D8] text-[#153B28] border border-[#153B28]/15'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save recipe'}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-white stroke-none' : 'stroke-[2]'}`} />
        </button>
      </div>

      {/* Recipe Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-[#DCE9DA] text-[#153B28] text-xs font-bold px-3 py-1 rounded-full border border-[#C2D8BF]">
            {match.matchPercentage}% match
          </span>
          <span className="bg-[#EFE8D8] text-[#153B28] text-xs font-semibold px-3 py-1 rounded-full border border-[#153B28]/10">
            {recipe.cuisine}
          </span>
        </div>

        {recipe.imageUrl && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 shadow-xs">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
        )}

        <h1 className="font-serif-editorial text-3xl font-semibold text-[#153B28] leading-tight mb-2">
          {recipe.title}
        </h1>

        <p className="text-xs text-[#153B28]/80 leading-relaxed font-normal">{recipe.description}</p>
      </div>

      {/* Metadata Cards */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="bg-[#EFE8D8] p-3 rounded-2xl text-center border border-[#153B28]/10">
          <span className="block text-[9px] font-bold text-[#153B28]/60 uppercase mb-0.5">SERVINGS</span>
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28]">
            <Users className="w-3.5 h-3.5" />
            <span>{recipe.servings}</span>
          </div>
        </div>

        <div className="bg-[#EFE8D8] p-3 rounded-2xl text-center border border-[#153B28]/10">
          <span className="block text-[9px] font-bold text-[#153B28]/60 uppercase mb-0.5">COOK TIME</span>
          <div className="flex items-center justify-center gap-1 text-sm font-bold text-[#153B28]">
            <Clock className="w-3.5 h-3.5" />
            <span>{recipe.cookTimeMinutes} min</span>
          </div>
        </div>

        <div className="bg-[#EFE8D8] p-3 rounded-2xl text-center border border-[#153B28]/10">
          <span className="block text-[9px] font-bold text-[#153B28]/60 uppercase mb-0.5">DIFFICULTY</span>
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#153B28]">
            <Flame className="w-3.5 h-3.5 text-amber-700" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Ingredients List (Have vs Missing) */}
      <div className="bg-[#EFE8D8] rounded-3xl p-5 border border-[#153B28]/10 mb-6 shadow-2xs">
        <h3 className="text-xs font-bold tracking-wider uppercase text-[#153B28] mb-3 flex items-center justify-between">
          <span>Ingredients ({recipe.ingredients.length})</span>
          <span className="text-[11px] font-normal text-[#153B28]/70">
            {match.availableCount} in kitchen
          </span>
        </h3>

        {/* Ingredients You Have */}
        <div className="mb-3">
          <span className="block text-[10px] font-bold text-[#153B28]/70 uppercase mb-1.5">You Have:</span>
          <div className="flex flex-wrap gap-1.5">
            {match.availableIngredients.map((ing) => (
              <IngredientChip key={ing.name} name={`${ing.amount} ${ing.name}`} variant="available" />
            ))}
          </div>
        </div>

        {/* Missing Ingredients */}
        {match.missingIngredients.length > 0 && (
          <div>
            <span className="block text-[10px] font-bold text-[#E05345] uppercase mb-1.5">Missing:</span>
            <div className="flex flex-wrap gap-1.5">
              {match.missingIngredients.map((ing) => (
                <IngredientChip key={ing.name} name={`${ing.amount} ${ing.name}`} variant="missing" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Cooking Instructions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-editorial text-2xl font-semibold text-[#153B28] flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-[#153B28]" />
            <span>Cooking Steps</span>
          </h3>
          <span className="text-xs font-semibold text-[#153B28]/70">
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
                    ? 'bg-[#DCE9DA]/50 border-[#C2D8BF] opacity-80'
                    : 'bg-[#FAF5EC] border-[#153B28]/15 shadow-2xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Step Number Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStepCompleted(step.stepNumber)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#153B28] text-white'
                        : 'bg-[#EFE8D8] text-[#153B28] border border-[#153B28]/20'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : step.stepNumber}
                  </button>

                  <div className="flex-1">
                    <p className={`text-xs text-[#153B28] leading-relaxed font-normal ${isDone ? 'line-through opacity-70' : ''}`}>
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
                              ? 'bg-[#E05345] text-white animate-pulse'
                              : 'bg-[#153B28] text-[#F8F0E2]'
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
                            className="p-1.5 rounded-full bg-[#EFE8D8] text-[#153B28] hover:bg-gray-200"
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
            setCompletedSteps(recipe.instructions.map((s) => s.stepNumber));
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
            onCookedRecipe?.();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-base shadow-md active-press flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-[#DCE9DA]" />
          <span>I cooked this!</span>
        </button>
      </div>
    </div>
  );
};
