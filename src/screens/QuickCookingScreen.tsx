import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Egg, ShieldAlert, Award, Cake, Clock, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { haptics } from '../services/HapticService';
import { LocalStorageService } from '../services/LocalStorageService';

interface QuickCookingScreenProps {
  userId?: string;
  onComplete: (vibe: string, time: string) => void;
  onSkip: () => void;
}

export type CookingVibe = 'quick' | 'moderate' | 'challenge' | 'sweet';
export type CookingTime = '5-10' | '15-30' | '30-60' | 'any';

export const QuickCookingScreen: React.FC<QuickCookingScreenProps> = ({
  userId,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedVibe, setSelectedVibe] = useState<CookingVibe | null>(null);
  const [selectedTime, setSelectedTime] = useState<CookingTime | null>(null);

  // Load previous choices if available
  useEffect(() => {
    const prev = LocalStorageService.getQuickCookingPreferences(userId);
    if (prev) {
      if (prev.vibe) setSelectedVibe(prev.vibe as CookingVibe);
      if (prev.time) setSelectedTime(prev.time as CookingTime);
    }
  }, [userId]);

  const handleVibeSelect = (vibe: CookingVibe) => {
    haptics.selection();
    setSelectedVibe(vibe);
    // Auto-advance after a small delay for a fluid experience
    setTimeout(() => {
      setStep(2);
    }, 280);
  };

  const handleTimeSelect = (time: CookingTime) => {
    haptics.selection();
    setSelectedTime(time);
  };

  const handleBack = () => {
    haptics.light();
    setStep(1);
  };

  const handleFinish = () => {
    if (!selectedVibe || !selectedTime) return;
    haptics.medium();
    // Save selections
    LocalStorageService.saveQuickCookingPreferences(selectedVibe, selectedTime, userId);
    onComplete(selectedVibe, selectedTime);
  };

  const handleSkipNow = () => {
    haptics.light();
    onSkip();
  };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-[calc(100vh-20px)] p-6 bg-[#F8F0E2] dark:bg-[#0D1A13] text-[#153B28] dark:text-[#FAF4E8] select-none">
      {/* Top Bar with escape hatch & progress dots */}
      <div className="flex items-center justify-between w-full mb-8">
        <div className="flex items-center gap-1.5">
          <div 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              step === 1 ? 'bg-[#153B28] dark:bg-[#FAF4E8] scale-110' : 'bg-[#153B28]/20 dark:bg-[#FAF4E8]/20'
            }`} 
          />
          <div 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              step === 2 ? 'bg-[#153B28] dark:bg-[#FAF4E8] scale-110' : 'bg-[#153B28]/20 dark:bg-[#FAF4E8]/20'
            }`} 
          />
        </div>

        <button
          type="button"
          onClick={handleSkipNow}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:bg-[#153B28]/5 dark:hover:bg-[#FAF4E8]/5 transition-colors cursor-pointer"
        >
          Skip for now
        </button>
      </div>

      {/* Main Slide Transitions */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step-vibe"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-6"
            >
              {/* Question Header */}
              <div className="space-y-2">
                <h1 className="font-serif-editorial text-3xl font-normal leading-tight tracking-tight text-[#153B28] dark:text-[#FAF4E8]">
                  What's the vibe today?
                </h1>
                <p className="text-sm leading-relaxed text-[#153B28]/70 dark:text-[#FAF4E8]/70">
                  Tell us what you're in the mood for and we'll find the best recipes for what you have.
                </p>
              </div>

              {/* Vibe Selection Grid */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                {/* 1. Quick & Easy */}
                <button
                  type="button"
                  onClick={() => handleVibeSelect('quick')}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                    selectedVibe === 'quick'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#153B28] dark:text-[#FAF4E8]">Quick & Easy</h3>
                      <p className="text-xs text-[#153B28]/60 dark:text-[#FAF4E8]/60 mt-0.5">Simple meals ready in 5–10 min</p>
                    </div>
                  </div>
                  {selectedVibe === 'quick' && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#153B28] dark:bg-[#5CB382]" />
                  )}
                </button>

                {/* 2. Moderate */}
                <button
                  type="button"
                  onClick={() => handleVibeSelect('moderate')}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                    selectedVibe === 'moderate'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Egg className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#153B28] dark:text-[#FAF4E8]">Moderate</h3>
                      <p className="text-xs text-[#153B28]/60 dark:text-[#FAF4E8]/60 mt-0.5">Perfect home-cooking in 15–30 min</p>
                    </div>
                  </div>
                  {selectedVibe === 'moderate' && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#153B28] dark:bg-[#5CB382]" />
                  )}
                </button>

                {/* 3. Challenge Me */}
                <button
                  type="button"
                  onClick={() => handleVibeSelect('challenge')}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                    selectedVibe === 'challenge'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#153B28] dark:text-[#FAF4E8]">Challenge Me</h3>
                      <p className="text-xs text-[#153B28]/60 dark:text-[#FAF4E8]/60 mt-0.5">Gourmet experiences, 30+ min</p>
                    </div>
                  </div>
                  {selectedVibe === 'challenge' && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#153B28] dark:bg-[#5CB382]" />
                  )}
                </button>

                {/* 4. Something Sweet */}
                <button
                  type="button"
                  onClick={() => handleVibeSelect('sweet')}
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
                    selectedVibe === 'sweet'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                      <Cake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#153B28] dark:text-[#FAF4E8]">Something Sweet</h3>
                      <p className="text-xs text-[#153B28]/60 dark:text-[#FAF4E8]/60 mt-0.5">Desserts, sweet bakes, and treats</p>
                    </div>
                  </div>
                  {selectedVibe === 'sweet' && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-[#153B28] dark:bg-[#5CB382]" />
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step-time"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to vibe</span>
              </button>

              {/* Question Header */}
              <div className="space-y-2">
                <h1 className="font-serif-editorial text-3xl font-normal leading-tight tracking-tight text-[#153B28] dark:text-[#FAF4E8]">
                  How much time do you have?
                </h1>
                <p className="text-sm leading-relaxed text-[#153B28]/70 dark:text-[#FAF4E8]/70">
                  We'll filter out recipes that require a long simmer if you're in a hurry.
                </p>
              </div>

              {/* Time Selection Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {/* 1. 5–10 min */}
                <button
                  type="button"
                  onClick={() => handleTimeSelect('5-10')}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all text-center aspect-[1.15] cursor-pointer relative ${
                    selectedTime === '5-10'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <Clock className="w-5 h-5 mb-2 text-[#153B28]/50 dark:text-[#FAF4E8]/50" />
                  <span className="font-bold text-[15px] block text-[#153B28] dark:text-[#FAF4E8]">5–10 min</span>
                  <span className="text-[10px] text-[#153B28]/50 dark:text-[#FAF4E8]/50 mt-1">Super quick</span>
                </button>

                {/* 2. 15–30 min */}
                <button
                  type="button"
                  onClick={() => handleTimeSelect('15-30')}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all text-center aspect-[1.15] cursor-pointer relative ${
                    selectedTime === '15-30'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <Clock className="w-5 h-5 mb-2 text-[#153B28]/50 dark:text-[#FAF4E8]/50" />
                  <span className="font-bold text-[15px] block text-[#153B28] dark:text-[#FAF4E8]">15–30 min</span>
                  <span className="text-[10px] text-[#153B28]/50 dark:text-[#FAF4E8]/50 mt-1">Standard meal</span>
                </button>

                {/* 3. 30–60 min */}
                <button
                  type="button"
                  onClick={() => handleTimeSelect('30-60')}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all text-center aspect-[1.15] cursor-pointer relative ${
                    selectedTime === '30-60'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <Clock className="w-5 h-5 mb-2 text-[#153B28]/50 dark:text-[#FAF4E8]/50" />
                  <span className="font-bold text-[15px] block text-[#153B28] dark:text-[#FAF4E8]">30–60 min</span>
                  <span className="text-[10px] text-[#153B28]/50 dark:text-[#FAF4E8]/50 mt-1">Slower build</span>
                </button>

                {/* 4. I don't care */}
                <button
                  type="button"
                  onClick={() => handleTimeSelect('any')}
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all text-center aspect-[1.15] cursor-pointer relative ${
                    selectedTime === 'any'
                      ? 'bg-[#FAF5EC] dark:bg-[#1F3C2E] border-[#153B28] dark:border-[#5CB382] shadow-sm'
                      : 'bg-white/45 dark:bg-[#15291E]/40 border-[#153B28]/10 dark:border-[#FAF4E8]/10 hover:border-[#153B28]/25 dark:hover:border-[#FAF4E8]/25'
                  }`}
                >
                  <Clock className="w-5 h-5 mb-2 text-[#153B28]/50 dark:text-[#FAF4E8]/50" />
                  <span className="font-bold text-[15px] block text-[#153B28] dark:text-[#FAF4E8]">I don't care</span>
                  <span className="text-[10px] text-[#153B28]/50 dark:text-[#FAF4E8]/50 mt-1">Show me any</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Bottom Action Button (Conditional for Step 2 or manual Advance) */}
      <div className="mt-8">
        <button
          type="button"
          disabled={step === 1 ? !selectedVibe : !selectedTime}
          onClick={step === 1 ? () => setStep(2) : handleFinish}
          className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md active-press cursor-pointer ${
            (step === 1 ? selectedVibe : selectedTime)
              ? 'bg-[#153B28] dark:bg-[#5CB382] text-[#F8F0E2] dark:text-[#0D1A13]'
              : 'bg-[#153B28]/10 dark:bg-white/10 text-[#153B28]/40 dark:text-white/35 cursor-not-allowed shadow-none'
          }`}
        >
          {step === 1 ? (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span>Let's see what you can make</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
