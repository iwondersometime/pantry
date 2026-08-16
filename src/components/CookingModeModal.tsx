import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, RotateCcw, Check, ChevronLeft, ChevronRight, Sparkles, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onFinishCooking: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  onClose,
  onFinishCooking,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const step = recipe.instructions[currentStepIndex];
  const totalSteps = recipe.instructions.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isCurrentStepDone = completedSteps.includes(step?.stepNumber);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // When step changes, reset step timer if step has timerMinutes
  useEffect(() => {
    if (step && step.timerMinutes && step.timerMinutes > 0) {
      setTimerSecondsLeft(step.timerMinutes * 60);
      setIsTimerRunning(false);
    } else {
      setTimerSecondsLeft(0);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, step]);

  const toggleCurrentStepDone = () => {
    if (isCurrentStepDone) {
      setCompletedSteps(completedSteps.filter((s) => s !== step.stepNumber));
    } else {
      const nextDone = [...completedSteps, step.stepNumber];
      setCompletedSteps(nextDone);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNextStep = () => {
    if (!isCurrentStepDone) {
      setCompletedSteps((prev) => [...new Set([...prev, step.stepNumber])]);
    }
    if (isLastStep) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onFinishCooking();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#153B28] text-[#F8F0E2] flex flex-col justify-between p-6 max-w-md mx-auto animate-fadeIn">
      {/* Top Bar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F8F0E2]/15">
        <div className="flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-[#DCE9DA]" />
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#F8F0E2]/60 block">
              Focus Cooking Mode
            </span>
            <h3 className="font-serif-editorial text-lg font-normal text-[#F8F0E2] truncate max-w-[200px]">
              {recipe.title}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-[#FAF5EC]/10 border border-[#F8F0E2]/20 flex items-center justify-center text-[#F8F0E2] hover:bg-[#FAF5EC]/20 transition-colors"
          title="Exit Cooking Mode"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Progress Bar */}
      <div className="my-4">
        <div className="flex justify-between items-center text-xs font-semibold text-[#F8F0E2]/80 mb-1.5">
          <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#FAF5EC]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#DCE9DA] transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Focus Instruction Box */}
      <div className="flex-1 my-auto flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-[#FAF5EC] dark:bg-[#183024] text-[#153B28] dark:text-[#FAF4E8] rounded-3xl p-6 shadow-2xl border border-[#F8F0E2]/20 dark:border-[#DCE9DA]/20 flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-full bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] flex items-center justify-center font-bold text-sm">
                  {step.stepNumber}
                </span>

                <button
                  type="button"
                  onClick={toggleCurrentStepDone}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isCurrentStepDone
                      ? 'bg-emerald-700 dark:bg-emerald-600 text-white'
                      : 'bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#FAF4E8] border border-[#153B28]/20 dark:border-[#DCE9DA]/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCurrentStepDone ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>

              {/* Step Instruction text (Extra Large for hands-free reading) */}
              <p className="text-base sm:text-lg font-medium leading-relaxed text-[#153B28] dark:text-[#FAF4E8]">
                {step.instruction}
              </p>
            </div>

            {/* Timer Control if present */}
            {step.timerMinutes && step.timerMinutes > 0 ? (
              <div className="mt-6 pt-4 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10 flex items-center justify-between bg-[#EFE8D8] dark:bg-[#1F3C2E] p-3.5 rounded-2xl">
                <div>
                  <span className="text-[10px] font-bold text-[#153B28]/60 dark:text-[#B6CEBC]/80 uppercase tracking-wider block">
                    Step Timer ({step.timerMinutes}m)
                  </span>
                  <span className="text-xl font-bold font-mono text-[#153B28] dark:text-[#FAF4E8]">
                    {formatTimer(timerSecondsLeft)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 active-press ${
                      isTimerRunning ? 'bg-[#E05345]' : 'bg-[#153B28] dark:bg-[#2E6B4B]'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft(step.timerMinutes! * 60);
                    }}
                    className="p-2 rounded-xl bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#FAF4E8] hover:bg-gray-200 dark:hover:bg-[#1F3C2E]"
                    title="Reset"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="pt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStepIndex === 0}
          className="py-3.5 px-4 rounded-2xl bg-[#FAF5EC]/15 text-[#F8F0E2] border border-[#F8F0E2]/20 font-semibold text-xs disabled:opacity-30 flex items-center gap-1 active-press"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <button
          type="button"
          onClick={handleNextStep}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FAF5EC] text-[#153B28] font-bold text-sm shadow-lg active-press flex items-center justify-center gap-2 hover:bg-white"
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-4 h-4 text-emerald-800" />
              <span>Complete Recipe!</span>
            </>
          ) : (
            <>
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
