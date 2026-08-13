import React from 'react';
import { Heart, Trash2, Clock, Users, ArrowRight, ChefHat } from 'lucide-react';
import { SavedRecipeItem, Recipe } from '../types';

interface SavedRecipesScreenProps {
  savedRecipes: SavedRecipeItem[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveSaved: (recipeId: string) => void;
  onExploreClick: () => void;
}

export const SavedRecipesScreen: React.FC<SavedRecipesScreenProps> = ({
  savedRecipes,
  onSelectRecipe,
  onRemoveSaved,
  onExploreClick,
}) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-6 pt-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] tracking-tight">
          Saved recipes
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#153B28]/80">
          Recipes you swiped right on, ready whenever you are.
        </p>
      </header>

      {/* Saved Recipe List */}
      {savedRecipes.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center text-center my-8 p-8 bg-[#EFE8D8] rounded-[32px] border border-[#153B28]/10 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#153B28]/10 flex items-center justify-center mb-4 text-[#153B28]">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-2">
            No saved recipes yet.
          </h3>

          <p className="text-xs text-[#153B28]/75 max-w-xs mb-6 leading-relaxed">
            Swipe right on a recipe during discovery to keep it here.
          </p>

          <button
            type="button"
            onClick={onExploreClick}
            className="py-3.5 px-6 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-xs shadow-md active-press flex items-center gap-2"
          >
            <span>Start exploring recipes</span>
            <ArrowRight className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {savedRecipes.map((item) => {
            const { recipe } = item;

            return (
              <div
                key={item.id}
                onClick={() => onSelectRecipe(recipe)}
                className="bg-[#FAF5EC] rounded-2xl p-4 border border-[#153B28]/15 shadow-2xs cursor-pointer active-press hover:border-[#153B28]/30 flex items-center gap-3.5 transition-all"
              >
                {/* Image Thumbnail */}
                {recipe.imageUrl ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-black/5">
                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[#EFE8D8] flex items-center justify-center text-[#153B28] shrink-0">
                    <ChefHat className="w-8 h-8 stroke-[1.5]" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif-editorial text-base font-semibold text-[#153B28] leading-snug truncate">
                    {recipe.title}
                  </h3>

                  <p className="text-[11px] text-[#153B28]/75 mt-1 font-medium truncate">
                    {recipe.cuisine} · {recipe.cookTimeMinutes} min · {recipe.servings} servings · {recipe.difficulty}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCE9DA] text-[#153B28]">
                      {recipe.ingredients.length} ingredients
                    </span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSaved(recipe.id);
                  }}
                  className="p-2.5 rounded-full text-[#E05345] hover:bg-[#E05345]/10 transition-colors shrink-0"
                  title="Remove from saved"
                  aria-label={`Remove ${recipe.title} from saved`}
                >
                  <Trash2 className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
