import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';
import {
  TabDestination,
  Recipe,
  SavedRecipeItem,
  ScanHistoryItem,
  DietaryFilters,
  MatchedRecipe,
  ShoppingListItem,
  RecipeIngredient,
  User,
  AuthState,
  AuthScreen,
} from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { LocalStorageService } from './services/LocalStorageService';
import { normalizeRecipeTitle } from './utils/recipeValidator';
import { AuthService } from './services/AuthService';
import { FirebaseService } from './services/FirebaseService';
import { matchAndRankRecipes } from './services/IngredientMatchingEngine';
import { AiRecipeService } from './services/AiRecipeService';
import { haptics } from './services/HapticService';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignUpScreen } from './screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ConfirmIngredientsScreen } from './screens/ConfirmIngredientsScreen';
import { SearchScreen } from './screens/SearchScreen';
import { DiscoveryScreen } from './screens/DiscoveryScreen';
import { RecipeDetailScreen } from './screens/RecipeDetailScreen';
import { SavedRecipesScreen } from './screens/SavedRecipesScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { UserAvatar } from './components/UserAvatar';
import { ShoppingListScreen } from './screens/ShoppingListScreen';
import { QuickCookingScreen } from './screens/QuickCookingScreen';

// Components
import { BottomNav } from './components/BottomNav';
import { AccountModal } from './components/AccountModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BotanicalAppBackground } from './components/BotanicalPatterns';
import { User as UserIcon, Loader2 } from 'lucide-react';

type ViewMode = 'tab' | 'confirm_scan' | 'discovery' | 'recipe_detail';

export default function App() {
  // Onboarding State
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() =>
    LocalStorageService.isOnboardingCompleted()
  );

  // Authentication State
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabDestination>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('tab');

  // App Data State
  const [activeIngredients, setActiveIngredients] = useState<string[]>([]);
  const [expiringIngredients, setExpiringIngredients] = useState<string[]>(() =>
    LocalStorageService.getExpiringIngredients()
  );
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [cookedCount, setCookedCount] = useState<number>(0);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilters>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lowCarb: false,
    highProtein: false,
    quickOnly: false,
    cookTime: 'all',
    difficulty: 'All',
    cuisine: 'All',
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [isGeneratingAiRecipes, setIsGeneratingAiRecipes] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [scannedIngredients, setScannedIngredients] = useState<string[]>([]);

  // Quick Cooking State
  const [quickCookingSession, setQuickCookingSession] = useState<{
    vibe: string;
    time: string;
    allergies?: string[];
    previouslyCookedIds?: string[];
  } | null>(null);
  const [hasClosedQuickCooking, setHasClosedQuickCooking] = useState<boolean>(false);

  // New Recipe Intent State
  const [recipeIntent, setRecipeIntent] = useState<string>('none');

  // Active Session helper that translates recipeIntent into matching scoring session
  const activeSession = useMemo(() => {
    if (recipeIntent === 'none') return null;
    const activeUserAllergies = currentUser?.allergies || LocalStorageService.getUserAllergies(currentUser?.id);
    return {
      vibe: recipeIntent,
      time: 'any',
      allergies: activeUserAllergies,
    };
  }, [recipeIntent, currentUser]);

  // Initialize Capacitor Native Settings & Apply Saved Theme
  useEffect(() => {
    const savedTheme = LocalStorageService.getTheme();
    LocalStorageService.applyTheme(savedTheme);

    if (Capacitor.isNativePlatform()) {
      StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      SplashScreen.hide().catch(() => {});
    }
  }, []);

  // Handle Android Native Hardware Back Button
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backListener = CapApp.addListener('backButton', () => {
      if (isAccountModalOpen) {
        setIsAccountModalOpen(false);
        return;
      }
      if (viewMode === 'recipe_detail') {
        setViewMode(matchedRecipes.length > 0 ? 'discovery' : 'tab');
        return;
      }
      if (viewMode === 'discovery' || viewMode === 'confirm_scan') {
        setViewMode('tab');
        return;
      }
      if (authState === 'unauthenticated') {
        if (authScreen !== 'welcome') {
          setAuthScreen('welcome');
          return;
        }
      }
      if (activeTab !== 'scan') {
        setActiveTab('scan');
        return;
      }
      CapApp.exitApp();
    });

    return () => {
      backListener.then((l) => l.remove());
    };
  }, [isAccountModalOpen, viewMode, activeTab, authState, authScreen, matchedRecipes.length]);

  // Load and merge cached recipes dynamically
  const loadCachedAndMerge = async (userId?: string) => {
    let cached: Recipe[] = [];
    
    // Load local storage cached recipes
    const localCached = LocalStorageService.getCachedRecipes(userId);
    cached = [...localCached];
    
    // If logged in, fetch from Firestore
    if (userId) {
      try {
        const fsCached = await FirebaseService.getCachedRecipes(userId);
        if (fsCached.length > 0) {
          fsCached.forEach(r => {
            if (!cached.some(c => c.id === r.id)) {
              cached.push(r);
            }
          });
          // Sync to local cache
          LocalStorageService.saveCachedRecipes(fsCached, userId);
        }
      } catch (err) {
        console.warn('Error loading Firestore cached recipes:', err);
      }
    }
    
    const merged = cached.length > 0
      ? [...cached, ...INITIAL_RECIPES.filter(r => !cached.some(c => c.id === r.id))]
      : INITIAL_RECIPES;
      
    setAllRecipes(merged);
    return merged;
  };

  // Load local cached recipes on mount for non-authenticated / guest users
  useEffect(() => {
    if (authState !== 'authenticated') {
      loadCachedAndMerge(undefined).then(mergedList => {
        const activeIngs = LocalStorageService.getActiveIngredients();
        const filters = LocalStorageService.getDietaryFilters();
        const expIngs = LocalStorageService.getExpiringIngredients();
        const storedIntent = LocalStorageService.getRecipeIntent(undefined);
        setRecipeIntent(storedIntent);
        const virtualSession = storedIntent !== 'none' ? { vibe: storedIntent, time: 'any', allergies: [] } : null;
        const matched = matchAndRankRecipes(mergedList, activeIngs, filters, undefined, undefined, expIngs, virtualSession);
        setMatchedRecipes(matched);
      });
    }
  }, [authState]);

  // Initialize Auth & Subscribe to Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (user, state) => {
      setAuthState(state);
      setCurrentUser(user);

      if (state === 'authenticated' && user) {
        // Apply user-scoped theme
        const userTheme = LocalStorageService.getTheme(user.id);
        LocalStorageService.applyTheme(userTheme);

        // Migrate local data to user account if needed
        LocalStorageService.migrateLocalDataToUser(user.id);

        let mergedList = INITIAL_RECIPES;

        // Load user-scoped data
        try {
          const saved = await FirebaseService.getSavedRecipes(user.id);
          setSavedRecipes(saved.length > 0 ? saved : LocalStorageService.getSavedRecipes(user.id));

          const history = await FirebaseService.getScanHistory(user.id);
          setScanHistory(history.length > 0 ? history : LocalStorageService.getScanHistory(user.id));
          
          mergedList = await loadCachedAndMerge(user.id);
        } catch (err) {
          console.warn('Firestore load notice:', err);
          setSavedRecipes(LocalStorageService.getSavedRecipes(user.id));
          setScanHistory(LocalStorageService.getScanHistory(user.id));
          mergedList = await loadCachedAndMerge(user.id);
        }

        const userCooked = LocalStorageService.getCookedCount(user.id);
        const activeIngs = LocalStorageService.getActiveIngredients();
        const filters = LocalStorageService.getDietaryFilters();
        const shopList = LocalStorageService.getShoppingList(user.id);
        const expIngs = LocalStorageService.getExpiringIngredients();
        const storedIntent = LocalStorageService.getRecipeIntent(user.id) || user.recipeIntent || 'none';
        setRecipeIntent(storedIntent);

        const activeUserAllergies = user.allergies || LocalStorageService.getUserAllergies(user.id);
        const virtualSession = storedIntent !== 'none' ? { vibe: storedIntent, time: 'any', allergies: activeUserAllergies } : null;

        setCookedCount(userCooked);
        setActiveIngredients(activeIngs);
        setDietaryFilters(filters);
        setShoppingList(shopList);
        setExpiringIngredients(expIngs);

        // Initial recipe matching using the cached + initial merged database
        const matched = matchAndRankRecipes(mergedList, activeIngs, filters, undefined, undefined, expIngs, virtualSession);
        setMatchedRecipes(matched);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Update Matched Recipes when active ingredients, filters, or expiring ingredients change
  const updateRecipesForIngredients = (
    ingredients: string[],
    filtersToUse = dietaryFilters,
    expiringToUse = expiringIngredients
  ) => {
    setActiveIngredients(ingredients);
    LocalStorageService.setActiveIngredients(ingredients);

    const matched = matchAndRankRecipes(allRecipes, ingredients, filtersToUse, undefined, undefined, expiringToUse, activeSession);
    setMatchedRecipes(matched);
  };

  const handleToggleExpiringIngredient = (ingredient: string) => {
    const updated = LocalStorageService.toggleExpiringIngredient(ingredient);
    setExpiringIngredients(updated);
    updateRecipesForIngredients(activeIngredients, dietaryFilters, updated);
  };

  // Generate Bespoke AI Recipes via Gemini with continuous discovery support
  const handleGenerateAiRecipes = async (
    ingredientsOverride?: string[],
    cuisineOverride?: string,
    isFreshDeck = false
  ) => {
    const ingredientsToUse = (ingredientsOverride && ingredientsOverride.length > 0)
      ? ingredientsOverride
      : activeIngredients;

    if (ingredientsToUse.length === 0) {
      setViewMode('discovery');
      return;
    }

    const targetCuisine = cuisineOverride || dietaryFilters.cuisine;
    
    // 1. Calculate local matches immediately
    const initialMatched = matchAndRankRecipes(
      allRecipes,
      ingredientsToUse,
      dietaryFilters,
      undefined,
      targetCuisine,
      expiringIngredients,
      activeSession
    );

    // 2. Display them instantly to prevent a blocking screen
    setMatchedRecipes(initialMatched);
    setActiveIngredients(ingredientsToUse);
    LocalStorageService.setActiveIngredients(ingredientsToUse);
    setViewMode('discovery');

    // 3. Check if catalog contains >= 8 matching recipes
    const matchesCount = initialMatched.length;
    if (matchesCount >= 8) {
      console.log(`[Strategy] Found ${matchesCount} suitable recipes. Skipping background Gemini generation.`);
      setIsGeneratingAiRecipes(false);
      setGenerationError(null);
      return;
    }

    // 4. Guard against re-entrant calls
    if (isGeneratingAiRecipes) {
      return;
    }

    setIsGeneratingAiRecipes(true);
    setGenerationError(null);

    // 5. Fire off asynchronous background request to Gemini
    (async () => {
      let timeoutId: any;
      try {
        const countToGenerate = Math.min(12, Math.max(8, 12 - matchesCount));
        console.log(`[Strategy] Only found ${matchesCount} suitable recipes. Generating ${countToGenerate} more in background...`);

        // AbortController for a hard 10-second timeout
        const controller = new AbortController();
        timeoutId = setTimeout(() => {
          controller.abort();
        }, 10000);

        const allExclusions = allRecipes.map((r) => r.title);

        const generated = await AiRecipeService.generateRecipes(ingredientsToUse, {
          cuisine: targetCuisine && targetCuisine !== 'All' ? targetCuisine : undefined,
          filters: dietaryFilters,
          count: countToGenerate,
          excludeTitles: allExclusions,
          signal: controller.signal,
        } as any);

        clearTimeout(timeoutId);

        if (generated.length > 0) {
          haptics.success();

          // Client-side duplicate check using normalized titles
          const existingNormalized = allRecipes.map((r) => normalizeRecipeTitle(r.title));
          const uniqueGenerated = generated.filter((g) => {
            const normG = normalizeRecipeTitle(g.title);
            return !existingNormalized.includes(normG);
          });

          const validatedWithId = uniqueGenerated.map((recipe) => ({
            ...recipe,
            id: recipe.id || `ai_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          }));

          if (validatedWithId.length > 0) {
            const updatedMasterList = [...validatedWithId, ...allRecipes];
            setAllRecipes(updatedMasterList);

            // Persist newly generated recipes in LocalStorage and Firestore caches
            const userId = currentUser?.id;
            LocalStorageService.saveCachedRecipes(validatedWithId, userId);
            if (userId) {
              FirebaseService.cacheRecipes(userId, validatedWithId).catch((err) =>
                console.warn('Error caching recipes in Firestore:', err)
              );
            }

            const matched = matchAndRankRecipes(
              updatedMasterList,
              ingredientsToUse,
              dietaryFilters,
              undefined,
              targetCuisine,
              expiringIngredients,
              activeSession
            );
            setMatchedRecipes(matched);

            const updatedHistory = LocalStorageService.addScanHistory(
              ingredientsToUse,
              matched.length,
              scannedImage || undefined,
              userId
            );
            setScanHistory(updatedHistory);
          }
        } else {
          haptics.warning();
        }
      } catch (err: any) {
        console.error('Error generating AI recipes in background:', err);
        haptics.warning();

        if (err.name === 'AbortError') {
          setGenerationError('Gemini is taking longer than usual. Showing available recipes.');
        } else {
          setGenerationError("Couldn't load more recipes right now.");
        }
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        setIsGeneratingAiRecipes(false);
      }
    })();
  };

  const handleRemainingCountChange = (remaining: number) => {
    // Top up the deck in background if we are running low (< 5), not already generating, and we have active ingredients
    if (
      remaining < 5 &&
      !isGeneratingAiRecipes &&
      activeIngredients.length > 0 &&
      viewMode === 'discovery'
    ) {
      console.log(`[Paging] Only ${remaining} recipes remaining. Top-up generating next batch in background...`);
      handleGenerateAiRecipes(activeIngredients, dietaryFilters.cuisine, false);
    }
  };

  const handleSelectRecipeIntent = (intent: string) => {
    setRecipeIntent(intent);
    const userId = currentUser?.id;
    LocalStorageService.setRecipeIntent(intent, userId);
    if (userId) {
      FirebaseService.updateRecipeIntent(userId, intent).catch((err) =>
        console.warn('Firestore update intent error:', err)
      );
    }
    
    // Instantly re-match recipes with the new intent to reflect in the UI immediately
    const activeUserAllergies = currentUser?.allergies || LocalStorageService.getUserAllergies(userId);
    const virtualSession = intent !== 'none' ? {
      vibe: intent,
      time: 'any',
      allergies: activeUserAllergies,
    } : null;
    
    const matched = matchAndRankRecipes(
      allRecipes,
      activeIngredients,
      dietaryFilters,
      undefined,
      undefined,
      expiringIngredients,
      virtualSession
    );
    setMatchedRecipes(matched);
  };

  // HANDLERS
  const handleOnboardingComplete = (nextScreen: AuthScreen) => {
    LocalStorageService.setOnboardingCompleted();
    setHasSeenOnboarding(true);
    setAuthScreen(nextScreen);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthState('authenticated');
    if (user.onboardingCompleted === true) {
      setActiveTab('home');
      setViewMode('tab');
    }
  };

  const handleScanComplete = (detectedIngredients: string[] | null | undefined, image: string | null | undefined) => {
    const validIngredients = Array.isArray(detectedIngredients)
      ? detectedIngredients.filter((ing) => typeof ing === 'string' && ing.trim().length > 0)
      : [];

    const finalIngredients = validIngredients;

    if (finalIngredients.length > 0) {
      haptics.success();
    } else {
      haptics.warning();
    }

    // Immediately display ingredients on confirm screen without blocking
    setScannedIngredients(finalIngredients);
    setViewMode('confirm_scan');

    // Run recipe matching for preview & track timing
    const tRecipeStart = performance.now();
    updateRecipesForIngredients(finalIngredients);
    const tRecipeEnd = performance.now();
    console.log(`Recipe matching: +${(tRecipeEnd - tRecipeStart).toFixed(1)}ms`);

    // Defer thumbnail creation to background without blocking the UI
    if (typeof image === 'string' && image.length > 0) {
      if (image.length < 60000) {
        setScannedImage(image);
      } else {
        setTimeout(async () => {
          try {
            const { IngredientRecognitionService } = await import('./services/IngredientRecognitionService');
            const thumb = await IngredientRecognitionService.createThumbnail(image);
            setScannedImage(thumb || image.substring(0, 1000));
          } catch {
            setScannedImage(image.substring(0, 2000));
          }
        }, 0);
      }
    } else {
      setScannedImage(null);
    }
  };

  const handleConfirmScanIngredients = async (confirmedIngredients: string[] | null | undefined) => {
    haptics.medium();
    const validConfirmed = Array.isArray(confirmedIngredients)
      ? confirmedIngredients.filter((ing) => typeof ing === 'string' && ing.trim().length > 0)
      : activeIngredients;

    setActiveIngredients(validConfirmed);
    LocalStorageService.setActiveIngredients(validConfirmed);

    const initialMatched = matchAndRankRecipes(allRecipes, validConfirmed, dietaryFilters, undefined, undefined, expiringIngredients, activeSession);
    const userId = currentUser?.id;
    const updatedHistory = LocalStorageService.addScanHistory(
      validConfirmed,
      initialMatched.length,
      scannedImage || undefined,
      userId
    );
    setScanHistory(updatedHistory);

    if (userId) {
      const tFsStart = performance.now();
      FirebaseService.addScanHistory(userId, validConfirmed, initialMatched.length, scannedImage || undefined)
        .then(() => {
          const tFsEnd = performance.now();
          console.log(`Firestore write: +${(tFsEnd - tFsStart).toFixed(1)}ms (async background)`);
        })
        .catch((err) => {
          console.warn('Firestore scan history save notice:', err);
        });
    }

    // Automatically generate fresh recipes tailored directly to confirmed ingredients
    await handleGenerateAiRecipes(validConfirmed, dietaryFilters.cuisine, true);
  };

  const handleSearchFindRecipes = async (ingredients: string[]) => {
    setActiveIngredients(ingredients);
    LocalStorageService.setActiveIngredients(ingredients);

    const initialMatched = matchAndRankRecipes(allRecipes, ingredients, dietaryFilters, undefined, undefined, expiringIngredients, activeSession);
    const userId = currentUser?.id;
    const updatedHistory = LocalStorageService.addScanHistory(ingredients, initialMatched.length, undefined, userId);
    setScanHistory(updatedHistory);

    await handleGenerateAiRecipes(ingredients, dietaryFilters.cuisine, true);
  };

  const handleToggleSaveRecipe = (recipe: Recipe) => {
    const userId = currentUser?.id;
    if (LocalStorageService.isRecipeSaved(recipe.id, userId)) {
      const updated = LocalStorageService.removeSavedRecipe(recipe.id, userId);
      setSavedRecipes(updated);
    } else {
      const updated = LocalStorageService.saveRecipe(recipe, userId);
      setSavedRecipes(updated);
    }
  };

  const handleRemoveSavedRecipe = (recipeId: string) => {
    const userId = currentUser?.id;
    const updated = LocalStorageService.removeSavedRecipe(recipeId, userId);
    setSavedRecipes(updated);
  };

  const handleFilterChange = (newFilters: DietaryFilters) => {
    const cuisineChanged = newFilters.cuisine !== dietaryFilters.cuisine;
    setDietaryFilters(newFilters);
    LocalStorageService.setDietaryFilters(newFilters);

    if (cuisineChanged && activeIngredients.length > 0) {
      handleGenerateAiRecipes(activeIngredients, newFilters.cuisine, true);
    } else {
      updateRecipesForIngredients(activeIngredients, newFilters, expiringIngredients);
    }
  };

  const handleReopenHistoryScan = (ingredients: string[]) => {
    updateRecipesForIngredients(ingredients);
    setViewMode('discovery');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const userId = currentUser?.id;
    const updated = LocalStorageService.deleteScanHistoryItem(id, userId);
    setScanHistory(updated);
  };

  const handleCookedRecipe = () => {
    const userId = currentUser?.id;
    const nextCount = LocalStorageService.incrementCookedCount(userId);
    setCookedCount(nextCount);
  };

  const handleRecipeNormalized = (updatedRecipe: Recipe) => {
    setSelectedRecipe(updatedRecipe);
    setAllRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
    );
  };

  // SHOPPING LIST HANDLERS
  const handleAddShoppingItem = (name: string, amount?: string) => {
    haptics.medium();
    const userId = currentUser?.id;
    const updated = LocalStorageService.addShoppingListItem(name, amount, undefined, undefined, userId);
    setShoppingList(updated);
  };

  const handleAddMissingToShoppingList = (missing: RecipeIngredient[], recipeId: string, recipeTitle: string) => {
    haptics.medium();
    const userId = currentUser?.id;
    const { updatedList } = LocalStorageService.addMissingIngredientsToShoppingList(missing, recipeId, recipeTitle, userId);
    setShoppingList(updatedList);
  };

  const handleToggleShoppingItem = (id: string) => {
    haptics.selection();
    const userId = currentUser?.id;
    const updated = LocalStorageService.toggleShoppingListItem(id, userId);
    setShoppingList(updated);
  };

  const handleRemoveShoppingItem = (id: string) => {
    haptics.light();
    const userId = currentUser?.id;
    const updated = LocalStorageService.removeShoppingListItem(id, userId);
    setShoppingList(updated);
  };

  const handleClearCompletedShopping = () => {
    haptics.light();
    const userId = currentUser?.id;
    const updated = LocalStorageService.clearCompletedShoppingList(userId);
    setShoppingList(updated);
  };

  const handleTabSelect = (tab: TabDestination) => {
    haptics.selection();
    setActiveTab(tab);
    setViewMode('tab');
  };

  const handleLogout = () => {
    setIsAccountModalOpen(false);
    setCurrentUser(null);
    setAuthState('unauthenticated');
    setAuthScreen('welcome');
  };

  // 1. ONBOARDING SCREEN (First-launch or authenticated new user check)
  const isUserAuthenticatedAndNeedsOnboarding = authState === 'authenticated' && currentUser && currentUser.onboardingCompleted !== true;
  const isGuestAndNeedsOnboarding = !hasSeenOnboarding && authState === 'unauthenticated';

  if (isGuestAndNeedsOnboarding || isUserAuthenticatedAndNeedsOnboarding) {
    return (
      <div className="min-h-screen bg-[#F8F0E2] dark:bg-[#0D1A13] text-[#153B28] dark:text-[#F8F0E2] flex flex-col justify-between selection:bg-[#DCE9DA] dark:selection:bg-[#204E35] transition-colors relative overflow-hidden">
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F8F0E2] dark:bg-[#0D1A13] min-h-screen relative shadow-2xl overflow-hidden z-10">
          <BotanicalAppBackground />
          <div className="relative z-10 flex-1 flex flex-col">
            <OnboardingScreen 
              currentUser={currentUser} 
              onComplete={(updatedUser) => {
                if (updatedUser) {
                  // This is the authenticated onboarding complete callback
                  setCurrentUser(updatedUser);
                  setHasSeenOnboarding(true);
                  LocalStorageService.setOnboardingCompleted();
                  
                  // Load latest matching recipes with new onboarding criteria
                  const userTheme = updatedUser.theme || 'system';
                  LocalStorageService.applyTheme(userTheme);
                  
                  const activeIngs = LocalStorageService.getActiveIngredients();
                  const filters = LocalStorageService.getDietaryFilters();
                  const expIngs = LocalStorageService.getExpiringIngredients();
                  const matched = matchAndRankRecipes(allRecipes, activeIngs, filters, undefined, undefined, expIngs, {
                    vibe: updatedUser.cookingPreference || 'quick',
                    time: 'any'
                  });
                  setMatchedRecipes(matched);
                } else {
                  // This is the guest onboarding complete callback
                  handleOnboardingComplete('signup');
                }
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // 2. SPLASH / LOADING STATE
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
        <BotanicalAppBackground />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center mb-6 shadow-xs animate-pulse">
            <span className="font-serif-editorial text-2xl font-bold text-[#153B28]">P</span>
          </div>

          <h1 className="font-serif-editorial text-3xl font-normal text-[#153B28] mb-2 tracking-tight">
            Pantry
          </h1>
          <p className="text-xs text-[#153B28]/70 max-w-[200px] leading-relaxed mb-8">
            Turning what you have into something worth eating.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#153B28] bg-[#EFE8D8] px-4 py-2 rounded-full border border-[#153B28]/10 shadow-2xs">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Opening kitchen...</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. UNAUTHENTICATED LOGIN / SIGNUP FLOW
  if (authState === 'unauthenticated' || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between selection:bg-[#DCE9DA] relative overflow-hidden">
        <BotanicalAppBackground />
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F8F0E2] min-h-screen relative shadow-2xl z-10">
          <main className="flex-1 flex flex-col">
            {authScreen === 'welcome' && (
              <WelcomeScreen onNavigate={setAuthScreen} />
            )}

            {authScreen === 'login' && (
              <LoginScreen
                onNavigate={setAuthScreen}
                onAuthSuccess={handleAuthSuccess}
              />
            )}

            {authScreen === 'signup' && (
              <SignUpScreen
                onNavigate={setAuthScreen}
                onAuthSuccess={handleAuthSuccess}
              />
            )}

            {authScreen === 'forgot_password' && (
              <ForgotPasswordScreen onNavigate={setAuthScreen} />
            )}
          </main>
        </div>
      </div>
    );
  }

  // 4. AUTHENTICATED MAIN APP VIEW
  const uncompletedShoppingCount = shoppingList.filter((i) => !i.checked).length;

  return (
    <div className="min-h-screen bg-[#F8F0E2] dark:bg-[#0D1A13] text-[#153B28] dark:text-[#F8F0E2] flex flex-col justify-between selection:bg-[#DCE9DA] dark:selection:bg-[#204E35] transition-colors relative overflow-hidden">
      {/* App-wide subtle botanical line-art background */}
      <BotanicalAppBackground />

      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F8F0E2] dark:bg-[#0D1A13] min-h-screen relative shadow-2xl z-10">
        {/* Top App Bar Header with Profile Menu button (Shown on non-home views to avoid double headers) */}
        {(viewMode !== 'tab' || activeTab !== 'home') && (
          <div className="flex items-center justify-between px-4 sm:px-6 pt-3.5 pb-2.5 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10 bg-[#F8F0E2]/95 dark:bg-[#0D1A13]/95 backdrop-blur-xs w-full box-border transition-colors">
            <div className="flex items-center gap-2">
              <span className="font-serif-editorial text-xl font-medium tracking-tight text-[#153B28] dark:text-[#F8F0E2]">
                Pantry
              </span>
            </div>

            {/* Account Profile Icon Button */}
            <button
              type="button"
              onClick={() => {
                haptics.light();
                setIsAccountModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 pl-1.5 pr-3 py-1 rounded-full hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors active-press shadow-2xs cursor-pointer"
              aria-label="Open Profile & Account"
            >
              <UserAvatar user={currentUser} size="xs" />
              <span className="text-xs font-semibold text-[#153B28] dark:text-[#F8F0E2]">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>
          </div>
        )}

        {/* Main Content View Switcher */}
        <main className="flex-1 flex flex-col relative overflow-x-hidden">
          <ErrorBoundary
            fallbackMessage="An unexpected issue occurred while processing your request. Tap retry to recover safely without losing your state."
            onReset={() => {
              setViewMode('tab');
              setActiveTab('scan');
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={viewMode === 'tab' ? activeTab : viewMode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 flex flex-col w-full"
            >
              {viewMode === 'confirm_scan' && (
                <ConfirmIngredientsScreen
                  initialIngredients={scannedIngredients.length > 0 ? scannedIngredients : activeIngredients}
                  capturedImage={scannedImage}
                  expiringIngredients={expiringIngredients}
                  onToggleExpiring={handleToggleExpiringIngredient}
                  onConfirm={handleConfirmScanIngredients}
                  onGenerateAiRecipes={(ings) => handleGenerateAiRecipes(ings)}
                  onBack={() => setViewMode('tab')}
                />
              )}

              {(() => {
                const activeUserAllergies = currentUser?.allergies || LocalStorageService.getUserAllergies(currentUser?.id);

                return (
                  <>
                    {viewMode === 'discovery' && (
                      <DiscoveryScreen
                        matchedRecipes={matchedRecipes}
                        userIngredients={activeIngredients}
                        userAllergies={activeUserAllergies}
                        filters={dietaryFilters}
                        onFilterChange={handleFilterChange}
                        onSaveRecipe={(recipe) => {
                          const userId = currentUser.id;
                          LocalStorageService.saveRecipe(recipe, userId);
                          setSavedRecipes(LocalStorageService.getSavedRecipes(userId));
                        }}
                        onSelectRecipe={(recipe) => {
                          setSelectedRecipe(recipe);
                          setViewMode('recipe_detail');
                        }}
                        onChangeIngredients={() => {
                          setActiveTab('search');
                          setViewMode('tab');
                        }}
                        onGenerateAiRecipes={() => handleGenerateAiRecipes()}
                        isGeneratingAi={isGeneratingAiRecipes}
                        generationError={generationError}
                        onClearGenerationError={() => setGenerationError(null)}
                        onRemainingCountChange={handleRemainingCountChange}
                      />
                    )}

                    {viewMode === 'recipe_detail' && selectedRecipe && (
                      <RecipeDetailScreen
                        recipe={selectedRecipe}
                        userIngredients={activeIngredients}
                        isSaved={savedRecipes.some((s) => s.recipeId === selectedRecipe.id)}
                        onToggleSave={handleToggleSaveRecipe}
                        onBack={() => setViewMode(matchedRecipes.length > 0 ? 'discovery' : 'tab')}
                        onCookedRecipe={handleCookedRecipe}
                        onAddMissingToShoppingList={handleAddMissingToShoppingList}
                        onRecipeNormalized={handleRecipeNormalized}
                      />
                    )}

                    {viewMode === 'tab' && (
                      <>
                        {activeTab === 'home' && (
                          <HomeScreen
                            userName={currentUser.name}
                            user={currentUser}
                            allRecipes={allRecipes}
                            userIngredients={activeIngredients}
                            userAllergies={activeUserAllergies}
                            matchedRecipes={matchedRecipes}
                            onSelectRecipe={(recipe) => {
                              setSelectedRecipe(recipe);
                              setViewMode('recipe_detail');
                            }}
                            onSelectCuisine={(cuisine) => {
                              const newFilters = { ...dietaryFilters, cuisine: cuisine as any };
                              handleFilterChange(newFilters);
                              setViewMode('discovery');
                            }}
                            onGoToScan={() => {
                              setActiveTab('scan');
                              setViewMode('tab');
                            }}
                            onOpenProfile={() => setIsAccountModalOpen(true)}
                            recipeIntent={recipeIntent}
                            onSelectRecipeIntent={handleSelectRecipeIntent}
                          />
                        )}

                        {activeTab === 'scan' && (
                          <ScanScreen
                            onScanComplete={handleScanComplete}
                            onManualSearchClick={() => {
                              setActiveTab('search');
                            }}
                          />
                        )}

                        {activeTab === 'search' && (
                          <SearchScreen
                            initialIngredients={activeIngredients}
                            allRecipes={allRecipes}
                            userAllergies={activeUserAllergies}
                            onFindRecipes={handleSearchFindRecipes}
                            onSelectRecipe={(recipe) => {
                              setSelectedRecipe(recipe);
                              setViewMode('recipe_detail');
                            }}
                            onGenerateAiRecipes={(ings, cuisine) => handleGenerateAiRecipes(ings, cuisine)}
                          />
                        )}

                        {activeTab === 'shopping' && (
                          <ShoppingListScreen
                            shoppingList={shoppingList}
                            onAddItem={handleAddShoppingItem}
                            onToggleItem={handleToggleShoppingItem}
                            onRemoveItem={handleRemoveShoppingItem}
                            onClearCompleted={handleClearCompletedShopping}
                          />
                        )}

                        {activeTab === 'saved' && (
                          <SavedRecipesScreen
                            savedRecipes={savedRecipes}
                            userAllergies={activeUserAllergies}
                            onSelectRecipe={(recipe) => {
                              setSelectedRecipe(recipe);
                              setViewMode('recipe_detail');
                            }}
                            onRemoveSaved={handleRemoveSavedRecipe}
                            onExploreClick={() => {
                              setViewMode('discovery');
                            }}
                          />
                        )}

                        {activeTab === 'history' && (
                          <HistoryScreen
                            historyItems={scanHistory}
                            onReopenScan={handleReopenHistoryScan}
                            onDeleteHistoryItem={handleDeleteHistoryItem}
                            onNewScanClick={() => {
                              setActiveTab('scan');
                            }}
                          />
                        )}
                      </>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>
          </ErrorBoundary>
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          savedCount={savedRecipes.length}
          shoppingCount={uncompletedShoppingCount}
        />

        {/* Account Modal Overlay */}
        {isAccountModalOpen && (
          <AccountModal
            user={currentUser}
            savedCount={savedRecipes.length}
            cookedCount={cookedCount}
            historyCount={scanHistory.length}
            onClose={() => setIsAccountModalOpen(false)}
            onLoggedOut={handleLogout}
            onProfileUpdated={(updated) => setCurrentUser(updated)}
          />
        )}
      </div>
    </div>
  );
}

