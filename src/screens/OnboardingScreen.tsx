import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle2, ArrowRight, ChefHat, Sun, Moon, Laptop } from 'lucide-react';
import { User, AppTheme } from '../types';
import { LocalStorageService } from '../services/LocalStorageService';
import { FirebaseService } from '../services/FirebaseService';
import { PRESET_ALLERGY_OPTIONS, normalizeAllergyList } from '../utils/allergyNormalization';
import { haptics } from '../services/HapticService';

interface OnboardingScreenProps {
  currentUser?: User | null;
  onComplete: (updatedUser: User | null) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ currentUser, onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  // Scoped initialization of states based on existing local preferences
  const [selectedTheme, setSelectedTheme] = useState<AppTheme>(() => 
    LocalStorageService.getTheme(currentUser?.id)
  );
  
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(() => 
    LocalStorageService.getUserAllergies(currentUser?.id)
  );

  // Keep theme updated visually during onboarding
  const handleThemeSelect = (theme: AppTheme) => {
    haptics.selection();
    setSelectedTheme(theme);
    LocalStorageService.applyTheme(theme);
  };

  const handleAllergyToggle = (allergyLabel: string) => {
    haptics.selection();
    setSelectedAllergies((prev) => {
      const isAlreadySelected = prev.some((a) => a.toLowerCase() === allergyLabel.toLowerCase());
      const updated = isAlreadySelected
        ? prev.filter((a) => a.toLowerCase() !== allergyLabel.toLowerCase())
        : [...prev, allergyLabel];
      return normalizeAllergyList(updated);
    });
  };

  const handleOnboardingCompleteAndSave = async () => {
    haptics.success();
    
    // Save to LocalStorage
    LocalStorageService.setUserAllergies(selectedAllergies, currentUser?.id);
    LocalStorageService.setTheme(selectedTheme, currentUser?.id);
    LocalStorageService.setOnboardingCompleted();

    const existingVibe = LocalStorageService.getQuickCookingPreferences(currentUser?.id)?.vibe || 'quick';

    if (currentUser) {
      try {
        await FirebaseService.completeOnboarding(
          currentUser.id,
          selectedAllergies,
          selectedTheme,
          existingVibe
        );
        
        onComplete({
          ...currentUser,
          allergies: selectedAllergies,
          theme: selectedTheme,
          cookingPreference: existingVibe,
          onboardingCompleted: true,
        });
      } catch (err) {
        console.warn('Failed to complete onboarding in Firestore, using local fallback:', err);
        onComplete({
          ...currentUser,
          allergies: selectedAllergies,
          theme: selectedTheme,
          cookingPreference: existingVibe,
          onboardingCompleted: true,
        });
      }
    } else {
      onComplete(null);
    }
  };

  const handleSkipOnboardingAndSave = async () => {
    haptics.light();
    
    const finalAllergies = selectedAllergies; // Preserve whatever is selected so far
    const finalTheme = selectedTheme;
    const existingVibe = LocalStorageService.getQuickCookingPreferences(currentUser?.id)?.vibe || 'quick';

    LocalStorageService.setUserAllergies(finalAllergies, currentUser?.id);
    LocalStorageService.setTheme(finalTheme, currentUser?.id);
    LocalStorageService.setOnboardingCompleted();

    if (currentUser) {
      try {
        await FirebaseService.completeOnboarding(
          currentUser.id,
          finalAllergies,
          finalTheme,
          existingVibe
        );
        onComplete({
          ...currentUser,
          allergies: finalAllergies,
          theme: finalTheme,
          cookingPreference: existingVibe,
          onboardingCompleted: true,
        });
      } catch (err) {
        console.warn('Failed to complete onboarding on skip in Firestore:', err);
        onComplete({
          ...currentUser,
          allergies: finalAllergies,
          theme: finalTheme,
          cookingPreference: existingVibe,
          onboardingCompleted: true,
        });
      }
    } else {
      onComplete(null);
    }
  };

  const slides = [
    {
      id: 1,
      badge: 'Step 1 of 5',
      title: 'Snap what you already have.',
      subtitle: 'Scan your fridge, pantry or counter and let Pantry identify your ingredients.',
      previewCard: (
        <div className="bg-[#EFE8D8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-3xl p-6 shadow-md text-center max-w-xs mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Camera className="w-8 h-8 stroke-[1.75]" />
          </div>
          <p className="text-xs font-semibold text-[#153B28]/80 dark:text-[#DCE9DA] uppercase tracking-wider mb-1">
            AI Vision Scanner
          </p>
          <p className="text-sm font-medium text-[#153B28] dark:text-[#F8F0E2]">
            Point & shoot. Detects fresh produce, dairy, proteins & pantry staples in seconds.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      badge: 'Step 2 of 5',
      title: 'Confirm your ingredients.',
      subtitle: 'Review, add, remove or edit anything Pantry detected.',
      previewCard: (
        <div className="bg-[#EFE8D8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-3xl p-5 shadow-md max-w-xs mx-auto">
          <div className="flex items-center justify-between mb-3 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10 pb-2">
            <span className="text-xs font-bold text-[#153B28] dark:text-[#F8F0E2] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Verified Pantry</span>
            </span>
            <span className="text-[10px] font-bold bg-[#DCE9DA] dark:bg-[#264A38] text-[#153B28] dark:text-[#DCE9DA] px-2 py-0.5 rounded-full">
              4 detected
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <span className="bg-[#FAF5EC] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#F8F0E2] text-xs font-medium px-3 py-1 rounded-full">
              Eggs ✓
            </span>
            <span className="bg-[#FAF5EC] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#F8F0E2] text-xs font-medium px-3 py-1 rounded-full">
              Tomatoes ✓
            </span>
            <span className="bg-[#FAF5EC] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#F8F0E2] text-xs font-medium px-3 py-1 rounded-full">
              Garlic ✓
            </span>
            <span className="bg-[#FAF5EC] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 text-[#153B28] dark:text-[#F8F0E2] text-xs font-medium px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-400 font-bold">
              + Add item
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: 'Step 3 of 5',
      title: 'Find something delicious.',
      subtitle: 'Swipe through recipes matched to what you already have.',
      previewCard: (
        <div className="bg-[#153B28] dark:bg-[#163325] text-[#F8F0E2] border border-[#153B28] dark:border-[#2D5A40] rounded-3xl p-5 shadow-lg max-w-xs mx-auto text-left relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="bg-[#DCE9DA] dark:bg-[#264A38] text-[#153B28] dark:text-[#DCE9DA] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
              100% Match
            </span>
            <ChefHat className="w-5 h-5 text-[#F8F0E2]/80" />
          </div>
          <h4 className="font-serif-editorial text-xl font-normal leading-snug mb-1">
            Garlic Tomato Omelette
          </h4>
          <p className="text-xs text-[#F8F0E2]/80 font-normal">
            12 mins • Easy • Zero wasted groceries
          </p>
        </div>
      ),
    },
    {
      id: 4,
      badge: 'Step 4 of 5',
      title: 'Dietary & Safety Setup.',
      subtitle: 'Select food allergies to customize Pantry filters safely for you.',
      previewCard: (
        <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-3xl p-4 shadow-md max-w-xs mx-auto">
          <div className="text-left mb-2.5">
            <span className="text-[10px] font-bold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider block text-center">
              Common Allergens
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-center max-h-[140px] overflow-y-auto pr-1">
            {PRESET_ALLERGY_OPTIONS.map((opt) => {
              const isSelected = selectedAllergies.some((a) => a.toLowerCase() === opt.canonical);
              return (
                <button
                  key={opt.canonical}
                  type="button"
                  onClick={() => handleAllergyToggle(opt.label)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: 'Step 5 of 5',
      title: 'Choose appearance.',
      subtitle: 'Select preferred atmosphere. You can change this anytime in settings.',
      previewCard: (
        <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-3xl p-4 shadow-md max-w-xs mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleThemeSelect('light')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all active-press ${
                selectedTheme === 'light'
                  ? 'bg-[#153B28] text-[#F8F0E2] border-[#153B28] shadow-xs'
                  : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="text-xs font-bold">Light</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeSelect('dark')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all active-press ${
                selectedTheme === 'dark'
                  ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] dark:border-[#2E6B4B] shadow-xs'
                  : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs font-bold">Dark</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeSelect('system')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all active-press ${
                selectedTheme === 'system'
                  ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] dark:border-[#2E6B4B] shadow-xs'
                  : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15'
              }`}
            >
              <Laptop className="w-5 h-5" />
              <span className="text-xs font-bold">System</span>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleOnboardingCompleteAndSave();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#F8F0E2] dark:bg-[#0D1A13] text-[#153B28] dark:text-[#F8F0E2] flex flex-col justify-between px-6 pt-8 pb-10 max-w-md mx-auto relative overflow-hidden">
      {/* Top Header: Badge & Skip button */}
      <div className="flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#153B28] dark:text-[#F8F0E2]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#153B28] dark:bg-[#DCE9DA]" />
          <span>{slide.badge}</span>
        </div>

        {currentSlide < slides.length - 1 && (
          <button
            type="button"
            onClick={handleSkipOnboardingAndSave}
            className="text-xs font-semibold text-[#153B28]/70 dark:text-[#DCE9DA]/70 hover:text-[#153B28] dark:hover:text-[#F8F0E2] px-3 py-1 rounded-full transition-colors cursor-pointer"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Content Animation */}
      <div className="my-auto py-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="w-full text-center flex flex-col items-center"
          >
            {/* Visual Card Preview */}
            <div className="w-full mb-8">{slide.previewCard}</div>

            {/* Typography */}
            <h1 className="font-serif-editorial text-3xl sm:text-4xl leading-tight font-normal text-[#153B28] dark:text-[#F8F0E2] mb-3 px-2">
              {slide.title}
            </h1>

            <p className="text-sm leading-relaxed text-[#153B28]/80 dark:text-[#DCE9DA]/80 font-normal max-w-xs px-2">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation: Dots & CTA Buttons */}
      <div className="flex flex-col gap-5 w-full pt-2">
        {/* Slide Indicators */}
        <div className="flex justify-center items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-8 bg-[#153B28] dark:bg-[#DCE9DA]'
                  : 'w-2 bg-[#153B28]/20 dark:bg-[#DCE9DA]/20'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons Row */}
        <div className="flex gap-3 w-full">
          {currentSlide > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="w-1/3 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] font-semibold py-4 px-4 rounded-2xl hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-all duration-200 active-press text-sm"
            >
              Back
            </button>
          )}
          
          <button
            type="button"
            onClick={handleNext}
            className={`font-semibold py-4 px-6 rounded-2xl transition-all duration-200 active-press shadow-md flex items-center justify-center gap-2 text-sm ${
              currentSlide > 0 ? 'flex-1' : 'w-full'
            } bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] hover:bg-[#1C4A33] dark:hover:bg-[#2A6546]`}
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
