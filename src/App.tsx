import React, { useState, useEffect } from 'react';
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
  User,
  AuthState,
  AuthScreen,
} from './types';
import { INITIAL_RECIPES } from './data/recipes';
import { LocalStorageService } from './services/LocalStorageService';
import { AuthService } from './services/AuthService';
import { FirebaseService, isFirebaseConfigured } from './services/FirebaseService';
import { matchAndRankRecipes } from './services/IngredientMatchingEngine';

// Screens
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

// Components
import { BottomNav } from './components/BottomNav';
import { AndroidHeader } from './components/AndroidHeader';
import { AccountModal } from './components/AccountModal';
import { User as UserIcon, Loader2 } from 'lucide-react';

type ViewMode = 'tab' | 'confirm_scan' | 'discovery' | 'recipe_detail';

export default function App() {
  // Authentication State
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabDestination>('scan');
  const [viewMode, setViewMode] = useState<ViewMode>('tab');

  // App Data State
  const [activeIngredients, setActiveIngredients] = useState<string[]>([]);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeItem[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [cookedCount, setCookedCount] = useState<number>(0);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilters>({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    lowCarb: false,
    quickOnly: false,
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);

  // Initialize Capacitor Native Settings
  useEffect(() => {
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

  // Initialize Auth & Subscribe to State Changes
  useEffect(() => {
    AuthService.init();

    // Listen to Firebase Auth if configured
    let fbUnsubscribe: (() => void) | null = null;
    if (isFirebaseConfigured) {
      fbUnsubscribe = FirebaseService.onAuthChange(async (userObj) => {
        if (userObj) {
          setCurrentUser(userObj);
          setAuthState('authenticated');
          LocalStorageService.migrateLocalDataToUser(userObj.id);

          // Sync Firestore data
          try {
            const saved = await FirebaseService.getSavedRecipes(userObj.id);
            if (saved.length > 0) setSavedRecipes(saved);
            else setSavedRecipes(LocalStorageService.getSavedRecipes(userObj.id));

            const history = await FirebaseService.getScanHistory(userObj.id);
            if (history.length > 0) setScanHistory(history);
            else setScanHistory(LocalStorageService.getScanHistory(userObj.id));
          } catch (err) {
            console.warn('Firestore sync note:', err);
          }
        }
      });
    }

    const unsubscribe = AuthService.onAuthStateChanged((user, state) => {
      setAuthState(state);
      setCurrentUser(user);

      if (state === 'authenticated' && user) {
        // Migrate pre-login data to user account if needed
        LocalStorageService.migrateLocalDataToUser(user.id);

        // Load user-scoped data
        const userSaved = LocalStorageService.getSavedRecipes(user.id);
        const userHistory = LocalStorageService.getScanHistory(user.id);
        const userCooked = LocalStorageService.getCookedCount(user.id);
        const activeIngs = LocalStorageService.getActiveIngredients();
        const filters = LocalStorageService.getDietaryFilters();

        setSavedRecipes(userSaved);
        setScanHistory(userHistory);
        setCookedCount(userCooked);
        setActiveIngredients(activeIngs);
        setDietaryFilters(filters);

        // Initial recipe matching
        const matched = matchAndRankRecipes(INITIAL_RECIPES, activeIngs, filters);
        setMatchedRecipes(matched);
      }
    });

    return () => {
      unsubscribe();
      if (fbUnsubscribe) fbUnsubscribe();
    };
  }, []);

  // Update Matched Recipes when active ingredients or filters change
  const updateRecipesForIngredients = (ingredients: string[], filtersToUse = dietaryFilters) => {
    setActiveIngredients(ingredients);
    LocalStorageService.setActiveIngredients(ingredients);

    const matched = matchAndRankRecipes(INITIAL_RECIPES, ingredients, filtersToUse);
    setMatchedRecipes(matched);
  };

  // HANDLERS
  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthState('authenticated');
    setActiveTab('scan');
    setViewMode('tab');
  };

  const handleScanComplete = (detectedIngredients: string[], image: string | null) => {
    setActiveIngredients(detectedIngredients);
    setScannedImage(image);
    setViewMode('confirm_scan');
  };

  const handleConfirmScanIngredients = (confirmedIngredients: string[]) => {
    updateRecipesForIngredients(confirmedIngredients);

    const matched = matchAndRankRecipes(INITIAL_RECIPES, confirmedIngredients, dietaryFilters);
    const userId = currentUser?.id;
    const updatedHistory = LocalStorageService.addScanHistory(
      confirmedIngredients,
      matched.length,
      scannedImage || undefined,
      userId
    );
    setScanHistory(updatedHistory);

    setViewMode('discovery');
  };

  const handleSearchFindRecipes = (ingredients: string[]) => {
    updateRecipesForIngredients(ingredients);

    const matched = matchAndRankRecipes(INITIAL_RECIPES, ingredients, dietaryFilters);
    const userId = currentUser?.id;
    const updatedHistory = LocalStorageService.addScanHistory(ingredients, matched.length, undefined, userId);
    setScanHistory(updatedHistory);

    setViewMode('discovery');
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
    setDietaryFilters(newFilters);
    LocalStorageService.setDietaryFilters(newFilters);
    updateRecipesForIngredients(activeIngredients, newFilters);
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

  const handleTabSelect = (tab: TabDestination) => {
    setActiveTab(tab);
    setViewMode('tab');
  };

  const handleLogout = () => {
    setIsAccountModalOpen(false);
    setCurrentUser(null);
    setAuthState('unauthenticated');
    setAuthScreen('welcome');
  };

  // 1. SPLASH / LOADING STATE
  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between max-w-md mx-auto relative">
        <AndroidHeader />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
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

  // 2. UNAUTHENTICATED ONBOARDING / LOGIN FLOW
  if (authState === 'unauthenticated' || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between selection:bg-[#DCE9DA]">
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F8F0E2] min-h-screen relative shadow-2xl">
          <AndroidHeader />

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

  // 3. AUTHENTICATED MAIN APP VIEW
  return (
    <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between selection:bg-[#DCE9DA]">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col bg-[#F8F0E2] min-h-screen relative shadow-2xl">
        {/* Status Bar */}
        <AndroidHeader />

        {/* Top App Bar Header with Profile Menu button */}
        <div className="flex items-center justify-between px-6 pt-2 pb-2.5 border-b border-[#153B28]/10 bg-[#F8F0E2]">
          <div className="flex items-center gap-2">
            <span className="font-serif-editorial text-xl font-medium tracking-tight text-[#153B28]">
              Pantry
            </span>
          </div>

          {/* Account Profile Icon Button */}
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2 bg-[#EFE8D8] border border-[#153B28]/15 px-3 py-1.5 rounded-full hover:bg-[#E2DAC8] transition-colors active-press shadow-2xs"
            aria-label="Open Profile & Account"
          >
            <div className="w-5 h-5 rounded-full bg-[#153B28] text-[#F8F0E2] text-[10px] font-semibold flex items-center justify-center">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-[#153B28]">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>
        </div>

        {/* Main Content View Switcher */}
        <main className="flex-1 flex flex-col">
          {viewMode === 'confirm_scan' && (
            <ConfirmIngredientsScreen
              initialIngredients={activeIngredients}
              capturedImage={scannedImage}
              onConfirm={handleConfirmScanIngredients}
              onBack={() => setViewMode('tab')}
            />
          )}

          {viewMode === 'discovery' && (
            <DiscoveryScreen
              matchedRecipes={matchedRecipes}
              userIngredients={activeIngredients}
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
            />
          )}

          {viewMode === 'tab' && (
            <>
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
                  onFindRecipes={handleSearchFindRecipes}
                />
              )}

              {activeTab === 'saved' && (
                <SavedRecipesScreen
                  savedRecipes={savedRecipes}
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
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          savedCount={savedRecipes.length}
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
