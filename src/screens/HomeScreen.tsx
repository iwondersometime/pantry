import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Camera,
  Compass,
  Clock,
  Flame,
  ArrowRight,
  Utensils,
  ChefHat,
  Heart,
  Search,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Layers,
} from 'lucide-react';
import { Recipe, MatchedRecipe, User } from '../types';
import { ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';
import { RecipeImage } from '../components/RecipeImage';
import { OliveBranch, HerbSprig, BotanicalCorner } from '../components/BotanicalPatterns';
import { UserAvatar } from '../components/UserAvatar';
import { haptics } from '../services/HapticService';
import { AllergyWarningBadge } from '../components/AllergyWarningBadge';
import { LocalStorageService } from '../services/LocalStorageService';

interface HomeScreenProps {
  userName?: string;
  user?: User;
  allRecipes: Recipe[];
  userIngredients: string[];
  userAllergies?: string[];
  matchedRecipes: MatchedRecipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onSelectCuisine: (cuisine: string) => void;
  onGoToScan: () => void;
  onOpenProfile?: () => void;
  quickCookingSession?: { vibe: string; time: string } | null;
  onClearQuickCooking?: () => void;
  recipeIntent: string;
  onSelectRecipeIntent: (intent: string) => void;
}

interface CuisineTile {
  name: string;
  emoji: string;
  descriptor: string;
  accent: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
}

const CUISINES: CuisineTile[] = [
  {
    name: 'Italian',
    emoji: '🍝',
    descriptor: 'Al Dente & Rich',
    accent: 'text-amber-800 dark:text-amber-300',
    bgLight: 'bg-[#FDF4E7]',
    bgDark: 'dark:bg-[#252015]',
    borderLight: 'border-[#F1DFBF]',
    borderDark: 'dark:border-[#3E341F]',
  },
  {
    name: 'Indian',
    emoji: '🍛',
    descriptor: 'Spiced & Aromatic',
    accent: 'text-orange-800 dark:text-orange-300',
    bgLight: 'bg-[#FEF1E8]',
    bgDark: 'dark:bg-[#281C15]',
    borderLight: 'border-[#F8D5BE]',
    borderDark: 'dark:border-[#422B1E]',
  },
  {
    name: 'Japanese',
    emoji: '🍣',
    descriptor: 'Umami & Fresh',
    accent: 'text-rose-800 dark:text-rose-300',
    bgLight: 'bg-[#FDF0F0]',
    bgDark: 'dark:bg-[#28181A]',
    borderLight: 'border-[#F6D0D3]',
    borderDark: 'dark:border-[#422226]',
  },
  {
    name: 'Mexican',
    emoji: '🌮',
    descriptor: 'Zesty & Bold',
    accent: 'text-emerald-800 dark:text-emerald-300',
    bgLight: 'bg-[#EBF7F0]',
    bgDark: 'dark:bg-[#12261C]',
    borderLight: 'border-[#CBE9D6]',
    borderDark: 'dark:border-[#1F3E2F]',
  },
  {
    name: 'Thai',
    emoji: '🍜',
    descriptor: 'Sweet, Sour & Spicy',
    accent: 'text-yellow-800 dark:text-yellow-300',
    bgLight: 'bg-[#FCF7E6]',
    bgDark: 'dark:bg-[#262414]',
    borderLight: 'border-[#EFE1AF]',
    borderDark: 'dark:border-[#423C1B]',
  },
  {
    name: 'Chinese',
    emoji: '🥢',
    descriptor: 'Wok & Sizzle',
    accent: 'text-red-800 dark:text-red-300',
    bgLight: 'bg-[#FDF1EE]',
    bgDark: 'dark:bg-[#281A16]',
    borderLight: 'border-[#F8D2C9]',
    borderDark: 'dark:border-[#422620]',
  },
  {
    name: 'Korean',
    emoji: '🍲',
    descriptor: 'Savory & Glazed',
    accent: 'text-purple-800 dark:text-purple-300',
    bgLight: 'bg-[#F7F0FC]',
    bgDark: 'dark:bg-[#24172B]',
    borderLight: 'border-[#E7CEF5]',
    borderDark: 'dark:border-[#3D234A]',
  },
  {
    name: 'Mediterranean',
    emoji: '🥗',
    descriptor: 'Olive Oil & Herbs',
    accent: 'text-teal-800 dark:text-teal-300',
    bgLight: 'bg-[#EBF8F7]',
    bgDark: 'dark:bg-[#122627]',
    borderLight: 'border-[#C6ECE9]',
    borderDark: 'dark:border-[#1F3E40]',
  },
  {
    name: 'American',
    emoji: '🍔',
    descriptor: 'Hearty Comfort',
    accent: 'text-sky-800 dark:text-sky-300',
    bgLight: 'bg-[#EEF5FC]',
    bgDark: 'dark:bg-[#14212D]',
    borderLight: 'border-[#CCE0F6]',
    borderDark: 'dark:border-[#21354A]',
  },
  {
    name: 'Middle Eastern',
    emoji: '🧆',
    descriptor: 'Warm Tahini & Herbs',
    accent: 'text-amber-800 dark:text-amber-300',
    bgLight: 'bg-[#FBF3E8]',
    bgDark: 'dark:bg-[#271F14]',
    borderLight: 'border-[#EDDBBD]',
    borderDark: 'dark:border-[#40311D]',
  },
  {
    name: 'French',
    emoji: '🥐',
    descriptor: 'Butter & Herbs',
    accent: 'text-indigo-800 dark:text-indigo-300',
    bgLight: 'bg-[#F1F2FD]',
    bgDark: 'dark:bg-[#181B2D]',
    borderLight: 'border-[#D4D7F8]',
    borderDark: 'dark:border-[#282D4D]',
  },
  {
    name: 'Spanish',
    emoji: '🥘',
    descriptor: 'Saffron & Tapas',
    accent: 'text-rose-800 dark:text-rose-300',
    bgLight: 'bg-[#FDF0EE]',
    bgDark: 'dark:bg-[#281816]',
    borderLight: 'border-[#F8CEC9]',
    borderDark: 'dark:border-[#42221F]',
  },
];

const MOOD_FILTERS = [
  { id: 'all', label: 'All Moods', emoji: '✨' },
  { id: 'quick', label: 'Quick & Easy (≤20m)', emoji: '⚡' },
  { id: 'protein', label: 'High Protein', emoji: '💪' },
  { id: 'comfort', label: 'Comfort Food', emoji: '🍲' },
  { id: 'healthy', label: 'Light & Fresh', emoji: '🥗' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🌱' },
  { id: 'under30', label: 'Under 30 Mins', emoji: '⏱️' },
  { id: 'budget', label: 'Pantry Saver', emoji: '🪙' },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName,
  user,
  allRecipes,
  userIngredients,
  userAllergies,
  matchedRecipes,
  onSelectRecipe,
  onSelectCuisine,
  onGoToScan,
  onOpenProfile,
  quickCookingSession,
  onClearQuickCooking,
  recipeIntent,
  onSelectRecipeIntent,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [showVibePopup, setShowVibePopup] = useState<boolean>(false);
  const [isEditingMood, setIsEditingMood] = useState<boolean>(false);

  // Dessert classifier matching matching engine
  const isDessert = (r: Recipe) => {
    const titleLower = r.title.toLowerCase();
    const tagsLower = r.tags?.map((t) => t.toLowerCase()) || [];
    
    // Explicit exclusion for savory dishes with misleading names
    if (titleLower.includes('sweet and sour') || titleLower.includes('pork') || titleLower.includes('chicken') || titleLower.includes('beef') || titleLower.includes('fish') || titleLower.includes('rice cake')) {
      return false;
    }

    return (
      tagsLower.some(
        (t) =>
          t.includes('dessert') ||
          t.includes('baking') ||
          t.includes('cake') ||
          t.includes('pastry') ||
          t.includes('sweets')
      ) ||
      titleLower.includes('custard') ||
      titleLower.includes('brownie') ||
      titleLower.includes('cake') ||
      titleLower.includes('pudding') ||
      titleLower.includes('kheer') ||
      titleLower.includes('jamun') ||
      titleLower.includes('tukda') ||
      titleLower.includes('halwa') ||
      titleLower.includes('ice cream') ||
      titleLower.includes('tart') ||
      titleLower.includes('pie ') ||
      titleLower.includes('churros') ||
      titleLower.includes('jalebi') ||
      titleLower.includes('rasmalai') ||
      titleLower.includes('dessert') ||
      titleLower.includes('cookie') ||
      titleLower.includes('mousse') ||
      titleLower.includes('tiramisu')
    );
  };

  // Fun foods classifier matching matching engine
  const isFunFood = (r: Recipe) => {
    const titleLower = r.title.toLowerCase();
    const tagsLower = r.tags?.map((t) => t.toLowerCase()) || [];
    return (
      titleLower.includes('sandwich') ||
      titleLower.includes('toast') ||
      titleLower.includes('toastie') ||
      titleLower.includes('wrap') ||
      titleLower.includes('roll') ||
      titleLower.includes('taco') ||
      titleLower.includes('pizza') ||
      titleLower.includes('burger') ||
      titleLower.includes('snack') ||
      titleLower.includes('quesadilla') ||
      titleLower.includes('chaat') ||
      titleLower.includes('nachos') ||
      tagsLower.some(
        (t) =>
          t.includes('sandwich') ||
          t.includes('snack') ||
          t.includes('street food') ||
          t.includes('fast')
      )
    );
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  }, []);

  React.useEffect(() => {
    // If no active intent, check prompt timer cooldown (10 minutes)
    if (recipeIntent === 'none') {
      const lastPrompt = LocalStorageService.getLastRecipeIntentPromptAt(user?.id);
      const now = Date.now();
      const tenMinsMs = 10 * 60 * 1000;
      if (now - lastPrompt >= tenMinsMs) {
        setShowVibePopup(true);
      }
    }
  }, [recipeIntent, user?.id]);

  const handleSelectVibeFromPopup = (intent: string) => {
    haptics.medium();
    onSelectRecipeIntent(intent);
    setShowVibePopup(false);
    setIsEditingMood(false);
    
    // Reset/update prompt timer to now so it doesn't prompt again for 10 min
    const now = Date.now();
    LocalStorageService.setLastRecipeIntentPromptAt(now, user?.id);
  };

  const handleSkipPopup = () => {
    haptics.light();
    setShowVibePopup(false);
    
    // Reset/update prompt timer to now so it doesn't prompt again for 10 min
    const now = Date.now();
    LocalStorageService.setLastRecipeIntentPromptAt(now, user?.id);
  };

  // Top pantry recommendations
  const topPantryMatches = useMemo(() => {
    if (matchedRecipes.length > 0) {
      return matchedRecipes.slice(0, 10);
    }
    return allRecipes.slice(0, 8).map((r) => ({
      recipe: r,
      matchPercentage: 100,
      missingIngredients: [],
      usedIngredientsCount: r.ingredients.length,
    }));
  }, [matchedRecipes, allRecipes]);

  // Dynamic mood filtered recipes with safety, pantry matching, and falls back to filling 8 items
  const moodRecipes = useMemo(() => {
    let list: Recipe[] = [];

    // Allergy check
    const isSafe = (r: Recipe) => {
      if (!userAllergies || userAllergies.length === 0) return true;
      const rIngredients = r.ingredients.map((ing) => ing.name.toLowerCase());
      const rTitle = r.title.toLowerCase();
      const rDesc = r.description.toLowerCase();

      return !userAllergies.some((allergy) => {
        const a = allergy.toLowerCase().trim();
        if (a === 'egg' || a === 'eggs') {
          return rIngredients.some((i) => i.includes('egg')) || rTitle.includes('egg') || rDesc.includes('egg');
        }
        if (a === 'dairy' || a === 'milk') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('milk') ||
                i.includes('butter') ||
                i.includes('cheese') ||
                i.includes('cream') ||
                i.includes('ghee') ||
                i.includes('paneer') ||
                i.includes('yogurt') ||
                i.includes('curd')
            ) ||
            rTitle.includes('paneer') ||
            rTitle.includes('cheese')
          );
        }
        if (a === 'peanut' || a === 'peanuts') {
          return rIngredients.some((i) => i.includes('peanut')) || rTitle.includes('peanut');
        }
        if (a === 'gluten' || a === 'wheat') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('flour') ||
                i.includes('wheat') ||
                i.includes('bread') ||
                i.includes('biscuit') ||
                i.includes('semolina') ||
                i.includes('maida') ||
                i.includes('pasta') ||
                i.includes('noodle')
            ) || rTitle.includes('bread')
          );
        }
        if (a === 'nuts' || a === 'tree nuts') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('almond') ||
                i.includes('cashew') ||
                i.includes('pistachio') ||
                i.includes('walnut') ||
                i.includes('nut')
            ) || rTitle.includes('nut')
          );
        }
        return rIngredients.some((i) => i.includes(a)) || rTitle.includes(a);
      });
    };

    if (recipeIntent !== 'none') {
      // First, filter from already scored/matched recipes for the active mood
      const matchedWithIntent = matchedRecipes
        .filter((m) => {
          const r = m.recipe;
          if (!isSafe(r)) return false;

          if (recipeIntent === 'sweet') return isDessert(r);
          if (recipeIntent === 'fun') return isFunFood(r);
          if (recipeIntent === 'quick') return r.cookTimeMinutes <= 20;
          if (recipeIntent === 'moderate') return r.cookTimeMinutes > 15 && r.cookTimeMinutes <= 30;
          if (recipeIntent === 'challenge')
            return r.difficulty === 'Hard' || r.difficulty === 'Medium' || (r.totalTimeMinutes || r.cookTimeMinutes) >= 30;
          return true;
        })
        .map((m) => m.recipe);

      const usedIds = new Set(matchedWithIntent.map((r) => r.id));

      // Pad with fallback catalog recipes of the same mood
      const fallbackList = allRecipes.filter((r) => {
        if (usedIds.has(r.id)) return false;
        if (!isSafe(r)) return false;

        if (recipeIntent === 'sweet') return isDessert(r);
        if (recipeIntent === 'fun') return isFunFood(r);
        if (recipeIntent === 'quick') return r.cookTimeMinutes <= 20;
        if (recipeIntent === 'moderate') return r.cookTimeMinutes > 15 && r.cookTimeMinutes <= 30;
        if (recipeIntent === 'challenge')
          return r.difficulty === 'Hard' || r.difficulty === 'Medium' || (r.totalTimeMinutes || r.cookTimeMinutes) >= 30;
        return true;
      });

      list = [...matchedWithIntent, ...fallbackList];
    } else {
      // Regular fallback selector chips
      const safeAllRecipes = allRecipes.filter(isSafe);
      switch (selectedMood) {
        case 'quick':
          list = safeAllRecipes.filter((r) => r.cookTimeMinutes <= 20);
          break;
        case 'protein':
          list = safeAllRecipes.filter((r) => r.isHighProtein);
          break;
        case 'comfort':
          list = safeAllRecipes.filter(
            (r) =>
              r.cuisine === 'Italian' ||
              r.cuisine === 'American' ||
              r.cuisine === 'Indian' ||
              r.tags?.some((t) => t.toLowerCase().includes('comfort') || t.toLowerCase().includes('creamy'))
          );
          break;
        case 'healthy':
          list = safeAllRecipes.filter(
            (r) =>
              r.isVegetarian ||
              r.cuisine === 'Mediterranean' ||
              r.tags?.some((t) => t.toLowerCase().includes('salad') || t.toLowerCase().includes('healthy'))
          );
          break;
        case 'vegetarian':
          list = safeAllRecipes.filter((r) => r.isVegetarian);
          break;
        case 'under30':
          list = safeAllRecipes.filter((r) => r.cookTimeMinutes <= 30);
          break;
        case 'budget':
          list = safeAllRecipes.filter((r) => r.ingredients.length <= 6);
          break;
        default:
          list = [...safeAllRecipes];
          break;
      }
    }
    return list.slice(0, 10);
  }, [allRecipes, matchedRecipes, recipeIntent, selectedMood, userAllergies]);

  // Discovery section offsetted to avoid duplicates
  const discoveryRecipes = useMemo(() => {
    const primaryIds = new Set(moodRecipes.slice(0, 4).map((r) => r.id));
    const pantryIds = new Set(topPantryMatches.slice(0, 4).map((m) => m.recipe.id));
    const excludedIds = new Set([...primaryIds, ...pantryIds]);

    const isSafe = (r: Recipe) => {
      if (!userAllergies || userAllergies.length === 0) return true;
      const rIngredients = r.ingredients.map((ing) => ing.name.toLowerCase());
      const rTitle = r.title.toLowerCase();
      const rDesc = r.description.toLowerCase();

      return !userAllergies.some((allergy) => {
        const a = allergy.toLowerCase().trim();
        if (a === 'egg' || a === 'eggs') {
          return rIngredients.some((i) => i.includes('egg')) || rTitle.includes('egg') || rDesc.includes('egg');
        }
        if (a === 'dairy' || a === 'milk') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('milk') ||
                i.includes('butter') ||
                i.includes('cheese') ||
                i.includes('cream') ||
                i.includes('ghee') ||
                i.includes('paneer') ||
                i.includes('yogurt') ||
                i.includes('curd')
            ) ||
            rTitle.includes('paneer') ||
            rTitle.includes('cheese')
          );
        }
        if (a === 'peanut' || a === 'peanuts') {
          return rIngredients.some((i) => i.includes('peanut')) || rTitle.includes('peanut');
        }
        if (a === 'gluten' || a === 'wheat') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('flour') ||
                i.includes('wheat') ||
                i.includes('bread') ||
                i.includes('biscuit') ||
                i.includes('semolina') ||
                i.includes('maida') ||
                i.includes('pasta') ||
                i.includes('noodle')
            ) || rTitle.includes('bread')
          );
        }
        if (a === 'nuts' || a === 'tree nuts') {
          return (
            rIngredients.some(
              (i) =>
                i.includes('almond') ||
                i.includes('cashew') ||
                i.includes('pistachio') ||
                i.includes('walnut') ||
                i.includes('nut')
            ) || rTitle.includes('nut')
          );
        }
        return rIngredients.some((i) => i.includes(a)) || rTitle.includes(a);
      });
    };

    let pool = allRecipes.filter((r) => !excludedIds.has(r.id) && isSafe(r));

    if (recipeIntent !== 'none') {
      pool = pool.filter((r) => {
        if (recipeIntent === 'sweet') return isDessert(r);
        if (recipeIntent === 'fun') return isFunFood(r);
        if (recipeIntent === 'quick') return r.cookTimeMinutes <= 20;
        if (recipeIntent === 'moderate') return r.cookTimeMinutes > 15 && r.cookTimeMinutes <= 30;
        if (recipeIntent === 'challenge')
          return r.difficulty === 'Hard' || r.difficulty === 'Medium' || (r.totalTimeMinutes || r.cookTimeMinutes) >= 30;
        return true;
      });
    }

    if (pool.length < 3) {
      pool = allRecipes.filter((r) => !excludedIds.has(r.id) && isSafe(r));
    }

    const seenCuisines = new Set<string>();
    const diverse: Recipe[] = [];
    for (const r of pool) {
      if (!seenCuisines.has(r.cuisine) && diverse.length < 4) {
        seenCuisines.add(r.cuisine);
        diverse.push(r);
      }
    }
    for (const r of pool) {
      if (diverse.length >= 6) break;
      if (!diverse.some((d) => d.id === r.id)) {
        diverse.push(r);
      }
    }
    return diverse;
  }, [allRecipes, moodRecipes, topPantryMatches, recipeIntent, userAllergies]);

  return (
    <div className="pb-28 pt-2 px-4 max-w-md mx-auto space-y-6 relative w-full box-border">
      {/* Botanical Ambient Subtle Accents */}
      <div className="absolute top-20 -left-6 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.06] dark:opacity-[0.04] pointer-events-none select-none rotate-12">
        <OliveBranch className="w-36 h-36" opacity="opacity-100" />
      </div>
      <div className="absolute top-[480px] -right-6 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.05] dark:opacity-[0.03] pointer-events-none select-none -rotate-45">
        <HerbSprig className="w-36 h-36" opacity="opacity-100" />
      </div>

      {/* 1. TOP APP HEADER BAR */}
      <div className="flex items-center justify-between pt-1 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#153B28] dark:bg-[#1E4D35] text-[#F8F0E2] flex items-center justify-center shadow-xs">
            <Leaf className="w-4 h-4 text-[#DCE9DA]" />
          </div>
          <span className="font-serif-editorial text-xl font-bold tracking-tight text-[#153B28] dark:text-[#F8F0E2]">
            Pantry
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              haptics.medium();
              onGoToScan();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] text-[#153B28] dark:text-[#F8F0E2] border border-[#153B28]/10 dark:border-[#DCE9DA]/15 text-xs font-semibold hover:bg-[#E2DAC8] dark:hover:bg-[#254636] transition-colors active-press shadow-2xs"
            title="Scan Ingredients"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan</span>
          </button>

          {onOpenProfile && (
            <button
              type="button"
              onClick={() => {
                haptics.light();
                onOpenProfile();
              }}
              className="rounded-full hover:opacity-90 transition-opacity active-press shadow-2xs cursor-pointer focus:outline-none"
              title="Account & Settings"
              aria-label="Account & Settings"
            >
              <UserAvatar user={user} name={userName} size="sm" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Cooking Session Status Banner */}
      {quickCookingSession && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#EFE8D8] dark:bg-[#152E20] border border-[#153B28]/20 dark:border-[#5CB382]/25 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs relative z-10 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#153B28] dark:bg-[#5CB382] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#153B28] dark:bg-[#5CB382]"></span>
            </span>
            <div className="text-[#153B28] dark:text-[#FAF4E8] font-medium">
              <span className="font-bold">Quick Cooking:</span>{' '}
              {quickCookingSession.vibe === 'quick' ? '⚡ Quick & Easy' :
               quickCookingSession.vibe === 'moderate' ? '🍳 Moderate' :
               quickCookingSession.vibe === 'challenge' ? '👨‍🍳 Challenge Me' : '🍰 Something Sweet'}{' '}
              • {quickCookingSession.time === 'any' ? 'Any Time' : `${quickCookingSession.time} min`}
            </div>
          </div>
          {onClearQuickCooking && (
            <button
              type="button"
              onClick={() => {
                haptics.light();
                onClearQuickCooking();
              }}
              className="text-[10px] font-bold text-[#F8F0E2] dark:text-[#0D1A13] bg-[#153B28] dark:bg-[#5CB382] px-2.5 py-1 rounded-full hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </motion.div>
      )}

      {/* 2. PERSONALIZED HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#153B28] via-[#1A4530] to-[#25583E] dark:from-[#10241A] dark:via-[#163325] dark:to-[#1B402E] text-[#F8F0E2] p-5 sm:p-6 shadow-xl border border-[#326B4D]/60 dark:border-[#2D5A40]"
      >
        {/* Botanical watermark in hero */}
        <div className="absolute top-2 right-2 text-white/10 pointer-events-none rotate-45">
          <HerbSprig className="w-28 h-28" opacity="opacity-100" />
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#DCE9DA]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Editorial Greeting */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#DCE9DA] mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{greeting}, {userName || 'Chef'}</span>
            </div>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-normal leading-tight text-white tracking-tight">
              What are you craving today?
            </h1>
            <p className="text-xs text-[#DCE9DA]/90 font-normal leading-relaxed mt-1">
              Find something delicious with what you already have.
            </p>
          </div>

          {/* Pantry Intelligence Spotlight */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-200 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5" />
                {userIngredients.length > 0
                  ? `${userIngredients.length} Pantry Items in Kitchen`
                  : 'Ready to scan pantry'}
              </span>
              <span className="text-[10px] font-medium text-white/70">
                {userIngredients.length > 0 ? 'Ready to cook' : 'Instant matching'}
              </span>
            </div>

            {userIngredients.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-w-full">
                {userIngredients.slice(0, 4).map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-white/15 dark:bg-white/10 text-white text-[11px] font-medium rounded-full backdrop-blur-xs border border-white/15 max-w-[150px] truncate"
                  >
                    {ing}
                  </span>
                ))}
                {userIngredients.length > 4 && (
                  <span className="px-2 py-0.5 bg-amber-400/25 text-amber-200 text-[11px] font-bold rounded-full border border-amber-400/30">
                    +{userIngredients.length - 4} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-white/80 leading-normal">
                Take a quick photo of your fridge or pantry to discover tailored recipes instantly.
              </p>
            )}

            {/* Single Unified Action Button */}
            <button
              type="button"
              onClick={() => {
                haptics.medium();
                onGoToScan();
              }}
              className="w-full mt-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 dark:bg-amber-400 dark:hover:bg-amber-300 text-[#153B28] font-bold text-xs rounded-2xl shadow-md transition-all active-press flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>{userIngredients.length > 0 ? 'Scan & Update Ingredients' : 'Snap Fridge or Pantry'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2.5 DAILY COOKING MOOD / RECIPE INTENT (Static grid section always visible) */}
      <div className="w-full relative z-10">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <h2 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#F5B942]" />
            <span>Daily Cooking Mood</span>
          </h2>
          {recipeIntent !== 'none' && (
            <button
              onClick={() => {
                haptics.light();
                onSelectRecipeIntent('none');
                setIsEditingMood(false);
              }}
              className="text-[10px] font-bold text-amber-800 dark:text-amber-400 hover:underline active:scale-95 transition-all"
            >
              Clear filter
            </button>
          )}
        </div>
        
        {/* If a mood is active and we are NOT editing, show a premium card */}
        {recipeIntent !== 'none' && !isEditingMood ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-3xl p-4 shadow-sm border flex items-center justify-between gap-4 transition-all ${
              recipeIntent === 'sweet' ? 'bg-pink-50/80 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/40 text-pink-950 dark:text-pink-100' :
              recipeIntent === 'quick' ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40 text-amber-950 dark:text-amber-100' :
              recipeIntent === 'moderate' ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-100' :
              recipeIntent === 'challenge' ? 'bg-indigo-50/80 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-100' :
              recipeIntent === 'fun' ? 'bg-sky-50/80 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/40 text-sky-950 dark:text-sky-100' :
              'bg-teal-50/80 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/40 text-teal-950 dark:text-teal-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl filter drop-shadow-sm select-none">
                {recipeIntent === 'sweet' ? '🍰' :
                 recipeIntent === 'quick' ? '⚡' :
                 recipeIntent === 'moderate' ? '🍳' :
                 recipeIntent === 'challenge' ? '👨‍🍳' :
                 recipeIntent === 'fun' ? '🍟' : '🎲'}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs uppercase tracking-wider opacity-85">
                    {recipeIntent === 'sweet' ? 'Something Sweet' :
                     recipeIntent === 'quick' ? 'Quick & Easy' :
                     recipeIntent === 'moderate' ? 'Moderate Cooking' :
                     recipeIntent === 'challenge' ? 'Challenge Me' :
                     recipeIntent === 'fun' ? 'Something Fun' : 'Surprise Me'}
                  </h3>
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 animate-pulse" />
                </div>
                <p className="font-serif-editorial text-sm font-medium mt-0.5 leading-tight italic">
                  {recipeIntent === 'sweet' ? '"Something sweet today?"' :
                   recipeIntent === 'quick' ? '"Fast food, minimal effort."' :
                   recipeIntent === 'moderate' ? '"Something worth taking your time for."' :
                   recipeIntent === 'challenge' ? '"Let\'s challenge your skills today."' :
                   recipeIntent === 'fun' ? '"Fun, satisfying comfort food."' :
                   '"Let\'s see what Pantry decides."'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                haptics.light();
                setIsEditingMood(true);
              }}
              className="px-3.5 py-1.5 bg-white/90 dark:bg-black/40 hover:bg-white dark:hover:bg-black/60 border border-current/10 rounded-xl text-[11px] font-bold shadow-2xs whitespace-nowrap active-press cursor-pointer"
            >
              Change Mood
            </button>
          </motion.div>
        ) : (
          /* Normal Selection Grid */
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/12 dark:border-[#DCE9DA]/15 rounded-3xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between space-y-0.5">
              <div>
                <p className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8]">What are you feeling today?</p>
                <p className="text-[10.5px] text-[#567563] dark:text-[#B6CEBC]">Priority matches will automatically boost in your feed.</p>
              </div>
              {isEditingMood && (
                <button
                  onClick={() => {
                    haptics.light();
                    setIsEditingMood(false);
                  }}
                  className="text-[10.5px] font-bold text-[#153B28]/60 dark:text-[#FAF4E8]/60 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'quick', label: 'Quick & Easy', emoji: '⚡', desc: '5–15 mins', activeClass: 'bg-amber-100/70 dark:bg-amber-950/45 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200' },
                { id: 'moderate', label: 'Moderate', emoji: '🍳', desc: '15–30 mins', activeClass: 'bg-emerald-100/70 dark:bg-emerald-950/45 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' },
                { id: 'challenge', label: 'Challenge Me', emoji: '👨‍🍳', desc: 'Active cooking', activeClass: 'bg-indigo-100/70 dark:bg-indigo-950/45 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200' },
                { id: 'sweet', label: 'Something Sweet', emoji: '🍰', desc: 'Cakes & treats', activeClass: 'bg-pink-100/70 dark:bg-pink-950/45 border-pink-300 dark:border-pink-800 text-pink-900 dark:text-pink-200' },
                { id: 'fun', label: 'Something Fun', emoji: '🍟', desc: 'Tasty comfort', activeClass: 'bg-sky-100/70 dark:bg-sky-950/45 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200' },
                { id: 'surprise', label: 'Surprise Me', emoji: '🎲', desc: 'Pantry decides', activeClass: 'bg-teal-100/70 dark:bg-teal-950/45 border-teal-300 dark:border-teal-800 text-teal-900 dark:text-teal-200' },
              ].map((opt) => {
                const isSelected = recipeIntent === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      haptics.medium();
                      onSelectRecipeIntent(opt.id);
                      setIsEditingMood(false);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all active-press flex flex-col justify-between h-[74px] ${
                      isSelected
                        ? `${opt.activeClass} shadow-2xs font-bold scale-[1.01] border-2`
                        : 'bg-[#FFFDF8] dark:bg-[#152A1E] hover:bg-[#EFE8D8]/50 dark:hover:bg-[#1E3B2B]/50 border-[#153B28]/10 dark:border-[#DCE9DA]/10 text-[#153B28] dark:text-[#FAF4E8]'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <div>
                      <p className="text-[10.5px] font-bold leading-tight truncate">
                        {opt.label}
                      </p>
                      <p className="text-[9px] opacity-80 leading-none truncate">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. EXPLORE CUISINES (Responsive horizontal carousel) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-600 dark:text-[#F5B942]" />
            <span>Explore Cuisines</span>
          </h2>
          <span className="text-[11px] text-[#567563] dark:text-[#B6CEBC] font-medium flex items-center gap-1">
            Swipe <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-2.5 pb-2 pt-1 overscroll-x-contain">
          {CUISINES.map((item) => (
            <motion.button
              key={item.name}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                haptics.light();
                onSelectCuisine(item.name);
              }}
              className={`shrink-0 snap-start w-[130px] sm:w-[136px] p-3 rounded-2xl border ${item.bgLight} ${item.bgDark} ${item.borderLight} ${item.borderDark} shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer group active-press`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {item.emoji}
                </span>
                <span className={`text-[10px] font-bold ${item.accent} uppercase tracking-wider`}>
                  Explore
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8] leading-tight">
                  {item.name}
                </p>
                <p className="text-[10px] text-[#567563] dark:text-[#B6CEBC] font-medium mt-0.5 line-clamp-1">
                  {item.descriptor}
                </p>
              </div>
            </motion.button>
          ))}
          <div className="w-1 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* 4. "WHAT ARE YOU IN THE MOOD FOR?" (Interactive mood filter + matching recipes) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
            <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              {recipeIntent === 'sweet' ? 'What are you in the mood for? 🍰' :
               recipeIntent === 'quick' ? 'What are you in the mood for? ⚡' :
               recipeIntent === 'moderate' ? 'What are you in the mood for? 🍳' :
               recipeIntent === 'challenge' ? 'What are you in the mood for? 👨‍🍳' :
               recipeIntent === 'fun' ? 'What are you in the mood for? 🍟' :
               recipeIntent === 'surprise' ? 'What are you in the mood for? 🎲' :
               'What are you in the mood for?'}
            </span>
          </h2>
        </div>

        {recipeIntent !== 'none' ? (
          <div className="mb-3 px-0.5">
            <p className="text-xs font-bold text-[#153B28] dark:text-amber-400">
              {recipeIntent === 'sweet' ? 'Sweet Treats For You' :
               recipeIntent === 'quick' ? 'Quick & Easy Dishes' :
               recipeIntent === 'moderate' ? 'Moderate Delights' :
               recipeIntent === 'challenge' ? 'Culinary Challenges' :
               recipeIntent === 'fun' ? 'Fun Foods For You' : 'Surprise Picks'}
            </p>
            <p className="text-[10.5px] text-[#567563] dark:text-[#B6CEBC]">
              {recipeIntent === 'sweet' ? 'Dessert-focused recipes for your sweet tooth.' :
               recipeIntent === 'quick' ? 'Super fast recipes under 20 minutes.' :
               recipeIntent === 'moderate' ? 'Balanced recipes for everyday cooking.' :
               recipeIntent === 'challenge' ? 'Satisfying recipes to level up your culinary skills.' :
               recipeIntent === 'fun' ? 'Delicious finger foods, snacks, and popular fast comfort foods.' :
               'A custom curation selected from our kitchen.'}
            </p>
          </div>
        ) : (
          /* Mood Chips Row (only visible if no active preset intent) */
          <div className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth flex gap-2 pb-1.5 pt-0.5 mb-2 overscroll-x-contain">
            {MOOD_FILTERS.map((mood) => {
              const isSelected = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => {
                    haptics.light();
                    setSelectedMood(mood.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 active-press border shrink-0 ${
                    isSelected
                      ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] dark:border-[#2E6B4B] shadow-xs'
                      : 'bg-[#FFFDF8] dark:bg-[#183024] text-[#153B28] dark:text-[#FAF4E8] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#224835]'
                  }`}
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              );
            })}
            <div className="w-1 shrink-0 pointer-events-none" />
          </div>
        )}

        {/* Mood Filtered Recipe Carousel */}
        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-3 pb-2 pt-1 overscroll-x-contain">
          {moodRecipes.map((recipe, idx) => (
            <motion.div
              key={recipe.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                haptics.light();
                onSelectRecipe(recipe);
              }}
              className="shrink-0 snap-start w-[190px] xs:w-[210px] bg-[#FFFDF8] dark:bg-[#183024] rounded-2xl overflow-hidden border border-[#153B28]/12 dark:border-[#DCE9DA]/15 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="relative h-28 xs:h-30 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <RecipeImage
                  recipe={recipe}
                  alt={recipe.title}
                  priority={idx < 3}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  containerClassName="w-full h-full"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#153B28]/85 dark:bg-[#0D1A13]/90 backdrop-blur-xs text-[#F8F0E2] text-[10px] font-bold rounded-full shadow-xs">
                  {recipe.cuisine}
                </div>
                {recipe.isHighProtein && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded-full shadow-xs">
                    High Protein
                  </div>
                )}
                {recipe.isVegetarian && !recipe.isHighProtein && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full shadow-xs">
                    Vegetarian
                  </div>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8] line-clamp-2 leading-snug">
                    {recipe.title}
                  </h3>
                  <AllergyWarningBadge recipe={recipe} userAllergies={userAllergies} className="mt-1" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#567563] dark:text-[#B6CEBC] mt-2.5 pt-2 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                  <span className="flex items-center gap-1 font-medium text-[#153B28] dark:text-[#B6CEBC]">
                    <Clock className="w-3 h-3 text-[#153B28] dark:text-[#B6CEBC]" />
                    {recipe.cookTimeMinutes}m
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-[#FB923C]">
                    <Flame className="w-3 h-3" />
                    {recipe.difficulty}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="w-1 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* 5. "MADE WITH WHAT YOU HAVE" (Pantry-Based Recommendations) */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div>
            <h2 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-[#F5B942]" />
              <span>Made With What You Have</span>
            </h2>
            <p className="text-xs text-[#567563] dark:text-[#B6CEBC]">
              {userIngredients.length > 0
                ? 'Matched to your verified pantry ingredients'
                : 'Top kitchen staples and tailored matches'}
            </p>
          </div>
          <span className="text-[11px] text-[#567563] dark:text-[#B6CEBC] font-medium flex items-center gap-1">
            Swipe <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        <div className="-mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-3 pb-2 pt-1 overscroll-x-contain">
          {topPantryMatches.map(({ recipe, matchPercentage, missingIngredients }, idx) => {
            const isFullMatch = matchPercentage >= 95 || missingIngredients.length === 0;
            return (
              <motion.div
                key={recipe.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectRecipe(recipe)}
                className="shrink-0 snap-start w-[195px] xs:w-[215px] bg-[#FFFDF8] dark:bg-[#183024] rounded-2xl overflow-hidden border border-[#153B28]/12 dark:border-[#DCE9DA]/15 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="relative h-28 xs:h-30 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <RecipeImage
                    recipe={recipe}
                    alt={recipe.title}
                    priority={idx < 2}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#153B28]/85 dark:bg-[#0D1A13]/90 backdrop-blur-xs text-[#F8F0E2] text-[10px] font-bold rounded-full shadow-xs">
                    {recipe.cuisine}
                  </div>
                  {userIngredients.length > 0 && (
                    <div
                      className={`absolute top-2 right-2 px-2 py-0.5 text-white text-[10px] font-bold rounded-full shadow-xs ${
                        isFullMatch ? 'bg-emerald-600 dark:bg-emerald-700' : 'bg-amber-600 dark:bg-amber-700'
                      }`}
                    >
                      {matchPercentage}% Match
                    </div>
                  )}
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8] line-clamp-2 leading-snug">
                      {recipe.title}
                    </h3>
                    <AllergyWarningBadge recipe={recipe} userAllergies={userAllergies} className="mt-1" />

                    {/* Missing or ready pantry status line */}
                    <div className="mt-1.5">
                      {userIngredients.length > 0 && (
                        <div className="flex items-center gap-1 text-[10.5px]">
                          {isFullMatch ? (
                            <span className="text-emerald-700 dark:text-[#4ADE80] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              All in pantry
                            </span>
                          ) : (
                            <span className="text-amber-800 dark:text-[#FB923C] font-medium truncate flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              Need {missingIngredients.length} item{missingIngredients.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#567563] dark:text-[#B6CEBC] mt-2.5 pt-2 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                    <span className="flex items-center gap-1 font-medium text-[#153B28] dark:text-[#B6CEBC]">
                      <Clock className="w-3 h-3 text-[#153B28] dark:text-[#B6CEBC]" />
                      {recipe.cookTimeMinutes}m
                    </span>
                    <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-[#FB923C]">
                      <Flame className="w-3 h-3" />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div className="w-1 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* 6. "SOMETHING NEW TO TRY" (Discovery section with zero duplicates) */}
      <div className="w-full pt-1">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div>
            <h2 className="font-serif-editorial text-lg font-bold text-[#153B28] dark:text-[#FAF4E8] flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                {recipeIntent === 'sweet' ? 'More Sweet Recipes 🍰' :
                 recipeIntent === 'quick' ? 'More Quick Recipes ⚡' :
                 recipeIntent === 'moderate' ? 'More Moderate Recipes 🍳' :
                 recipeIntent === 'challenge' ? 'More Culinary Challenges 👨‍🍳' :
                 recipeIntent === 'fun' ? 'More Fun Recipes 🍟' :
                 recipeIntent === 'surprise' ? 'More Surprise Recipes 🎲' :
                 'Something New to Try'}
              </span>
            </h2>
            <p className="text-xs text-[#567563] dark:text-[#B6CEBC]">
              {recipeIntent === 'sweet' ? 'Explore additional sweet desserts and baked delights' :
               recipeIntent === 'quick' ? 'Quick meals with minimal setup and preparation' :
               recipeIntent === 'moderate' ? 'Expand your everyday cooking repertoire' :
               recipeIntent === 'challenge' ? 'Discover more active, multi-step gourmet recipes' :
               recipeIntent === 'fun' ? 'Satisfying casual and comfort-focused bites' :
               'Expand your culinary repertoire with diverse flavors'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {discoveryRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectRecipe(recipe)}
              className="flex items-center gap-3 p-2.5 bg-[#FFFDF8] dark:bg-[#183024] rounded-2xl border border-[#153B28]/12 dark:border-[#DCE9DA]/15 shadow-xs hover:shadow-md transition-all cursor-pointer group active-press"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                <RecipeImage
                  recipe={recipe}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  containerClassName="w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EFE8D8] dark:bg-[#224835] text-[#153B28] dark:text-[#A7F3D0] rounded-full">
                    {recipe.cuisine}
                  </span>
                  {recipe.isVegetarian && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 rounded-full">
                      Veg
                    </span>
                  )}
                  {recipe.isHighProtein && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 rounded-full">
                      Protein
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8] truncate">
                  {recipe.title}
                </h3>
                <AllergyWarningBadge recipe={recipe} userAllergies={userAllergies} className="mt-1" />

                <div className="flex items-center gap-3 text-[11px] text-[#567563] dark:text-[#B6CEBC] mt-1">
                  <span className="flex items-center gap-1 text-[#153B28] dark:text-[#B6CEBC]">
                    <Clock className="w-3 h-3 text-[#153B28] dark:text-[#B6CEBC]" />
                    {recipe.cookTimeMinutes}m
                  </span>
                  <span className="flex items-center gap-1 text-[#153B28] dark:text-[#B6CEBC]">
                    <Utensils className="w-3 h-3 text-[#153B28] dark:text-[#B6CEBC]" />
                    {recipe.ingredients.length} ingredients
                  </span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#EFE8D8] dark:bg-[#224835] flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 text-[#153B28] dark:text-[#F8F0E2]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 10-Minute Cooldown Daily Cooking Mood Popup Modal */}
      <AnimatePresence>
        {showVibePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleSkipPopup}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-sm bg-[#F8F0E2] dark:bg-[#0E1F16] rounded-3xl p-6 border border-[#153B28]/12 dark:border-[#5CB382]/20 shadow-2xl flex flex-col gap-4 overflow-hidden"
            >
              {/* Subtle top decoration */}
              <div className="absolute top-0 right-0 text-[#153B28]/5 dark:text-white/5 rotate-12 select-none pointer-events-none">
                <OliveBranch className="w-24 h-24" opacity="opacity-100" />
              </div>

              <div className="space-y-1 relative z-10">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Daily Cooking Mood</span>
                </div>
                <h3 className="font-serif-editorial text-xl font-bold text-[#153B28] dark:text-[#FAF4E8]">
                  What are you feeling today?
                </h3>
                <p className="text-xs text-[#567563] dark:text-[#B6CEBC]">
                  Tell Pantry what kind of recipes to prioritize!
                </p>
              </div>

              {/* Vibe Selection Grid */}
              <div className="grid grid-cols-2 gap-2 relative z-10">
                {[
                  { id: 'quick', label: 'Quick & Easy', emoji: '⚡', desc: '5–15 mins' },
                  { id: 'moderate', label: 'Moderate', emoji: '🍳', desc: '15–30 mins' },
                  { id: 'challenge', label: 'Challenge Me', emoji: '👨‍🍳', desc: 'Active cooking' },
                  { id: 'sweet', label: 'Something Sweet', emoji: '🍰', desc: 'Cakes & treats' },
                  { id: 'fun', label: 'Something Fun', emoji: '🍟', desc: 'Tasty comfort' },
                  { id: 'surprise', label: 'Surprise Me', emoji: '🎲', desc: 'Pantry decides' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectVibeFromPopup(opt.id)}
                    className="p-3 bg-[#FFFDF8] dark:bg-[#183024] hover:bg-[#EFE8D8] dark:hover:bg-[#224835] border border-[#153B28]/12 dark:border-[#DCE9DA]/12 rounded-2xl text-left transition-all active-press flex flex-col justify-between h-[82px]"
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <div>
                      <p className="text-[11px] font-bold text-[#153B28] dark:text-[#FAF4E8] leading-tight">
                        {opt.label}
                      </p>
                      <p className="text-[9px] text-[#567563] dark:text-[#B6CEBC]">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Footer */}
              <div className="flex gap-2 relative z-10 pt-2">
                <button
                  type="button"
                  onClick={handleSkipPopup}
                  className="flex-1 py-2.5 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#B6CEBC] text-xs font-bold rounded-xl active-press text-center"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
