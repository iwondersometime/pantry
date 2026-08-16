import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Trash2, Clock, Users, ArrowRight, ChefHat } from 'lucide-react';
import { SavedRecipeItem, Recipe } from '../types';
import { RecipeImageService, ERROR_IMAGE_FALLBACK } from '../services/RecipeImageService';
import { RecipeImage } from '../components/RecipeImage';
import { OliveBranch, HerbSprig } from '../components/BotanicalPatterns';
import { haptics } from '../services/HapticService';
import { AllergyWarningBadge } from '../components/AllergyWarningBadge';

interface SavedRecipesScreenProps {
  savedRecipes: SavedRecipeItem[];
  userAllergies?: string[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveSaved: (recipeId: string) => void;
  onExploreClick: () => void;
}

export const SavedRecipesScreen: React.FC<SavedRecipesScreenProps> = ({
  savedRecipes,
  userAllergies,
  onSelectRecipe,
  onRemoveSaved,
  onExploreClick,
}) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] dark:text-[#F8F0E2] tracking-tight">
          Saved recipes
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#153B28]/80 dark:text-[#F8F0E2]/80">
          Recipes you swiped right on, ready whenever you are.
        </p>
      </header>

      {/* Saved Recipe List */}
      {savedRecipes.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex-1 flex flex-col items-center justify-center text-center my-8 p-8 bg-[#EFE8D8] dark:bg-[#183024] rounded-[32px] border border-[#153B28]/10 dark:border-[#DCE9DA]/15 shadow-2xs relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.08] dark:opacity-[0.05] pointer-events-none rotate-12">
            <OliveBranch className="w-32 h-32" opacity="opacity-100" />
          </div>

          <div className="w-16 h-16 rounded-full bg-[#153B28]/10 dark:bg-[#2E6B4B]/30 flex items-center justify-center mb-4 text-[#153B28] dark:text-[#DCE9DA] relative z-10">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] dark:text-[#F8F0E2] mb-2 relative z-10">
            No saved recipes yet.
          </h3>

          <p className="text-xs text-[#153B28]/75 dark:text-[#F8F0E2]/75 max-w-xs mb-6 leading-relaxed relative z-10">
            Swipe right on a recipe during discovery to keep it here.
          </p>

          <button
            type="button"
            onClick={() => {
              haptics.medium();
              onExploreClick();
            }}
            className="py-3.5 px-6 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs shadow-md active-press flex items-center gap-2 relative z-10"
          >
            <span>Start exploring recipes</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {savedRecipes.map((item, idx) => {
              const { recipe } = item;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -60 }}
                  transition={{ duration: 0.2, delay: idx * 0.03, ease: 'easeOut' }}
                  onClick={() => {
                    haptics.light();
                    onSelectRecipe(recipe);
                  }}
                  className="bg-[#FAF5EC] dark:bg-[#183024] rounded-2xl p-4 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xs cursor-pointer active-press hover:border-[#153B28]/30 dark:hover:border-[#DCE9DA]/30 flex items-center gap-3.5 transition-all"
                >
                  {/* Image Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#EFE8D8] dark:bg-[#112219]">
                    <RecipeImage
                      recipe={recipe}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif-editorial text-base font-semibold text-[#153B28] dark:text-[#F8F0E2] leading-snug truncate">
                      {recipe.title}
                    </h3>

                    <AllergyWarningBadge recipe={recipe} userAllergies={userAllergies} className="mt-1" />

                    <p className="text-[11px] text-[#153B28]/75 dark:text-[#F8F0E2]/70 mt-1 font-medium truncate">
                      {recipe.cuisine} · {recipe.cookTimeMinutes} min · {recipe.servings} servings · {recipe.difficulty}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9DA] dark:bg-[#204E35] text-[#153B28] dark:text-[#E2EFE4]">
                        {recipe.ingredients.length} ingredients
                      </span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      haptics.light();
                      onRemoveSaved(recipe.id);
                    }}
                    className="p-2.5 rounded-full text-[#E05345] hover:bg-[#E05345]/10 dark:hover:bg-[#E05345]/20 transition-colors shrink-0"
                    title="Remove from saved"
                    aria-label={`Remove ${recipe.title} from saved`}
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
