import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Plus, Trash2, CheckCircle2, Circle, Sparkles } from 'lucide-react';
import { ShoppingListItem } from '../types';
import { haptics } from '../services/HapticService';

interface ShoppingListScreenProps {
  shoppingList: ShoppingListItem[];
  onAddItem: (name: string, amount?: string) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({
  shoppingList,
  onAddItem,
  onToggleItem,
  onRemoveItem,
  onClearCompleted,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    haptics.light();
    onAddItem(newItemName.trim(), newItemAmount.trim());
    setNewItemName('');
    setNewItemAmount('');
  };

  const activeItems = shoppingList.filter((i) => !i.checked);
  const completedItems = shoppingList.filter((i) => i.checked);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] dark:text-[#FAF4E8] tracking-tight">
            Shopping list
          </h1>
          {completedItems.length > 0 && (
            <button
              type="button"
              onClick={() => {
                haptics.warning();
                onClearCompleted();
              }}
              className="text-xs font-semibold text-[#E05345] dark:text-[#FF6B5C] hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear completed ({completedItems.length})</span>
            </button>
          )}
        </div>
        <p className="text-[13.5px] leading-relaxed text-[#153B28]/80 dark:text-[#B6CEBC]">
          Missing recipe ingredients & pantry staples to pick up.
        </p>
      </header>

      {/* Manual Add Input Box */}
      <form onSubmit={handleAdd} className="mb-6 bg-[#EFE8D8] dark:bg-[#183024] p-3.5 sm:p-4 rounded-3xl border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xs w-full box-border">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#153B28]/70 dark:text-[#FAF4E8] mb-2.5 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-[#153B28] dark:text-[#A7F3D0]" />
          <span>Add item manually</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Ingredient (e.g. Milk, Olive Oil)"
            className="w-full sm:flex-1 min-w-0 bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-2xl px-3.5 py-2.5 text-xs text-[#153B28] dark:text-[#FAF4E8] placeholder-[#153B28]/50 dark:placeholder-[#B6CEBC]/50 focus:outline-none focus:border-[#153B28] dark:focus:border-[#A7F3D0]"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              placeholder="Qty (e.g. 1L, 250g)"
              className="flex-1 sm:w-28 min-w-0 bg-[#FAF5EC] dark:bg-[#1F3C2E] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-2xl px-3 py-2.5 text-xs text-[#153B28] dark:text-[#FAF4E8] placeholder-[#153B28]/50 dark:placeholder-[#B6CEBC]/50 focus:outline-none focus:border-[#153B28] dark:focus:border-[#A7F3D0]"
            />
            <button
              type="submit"
              disabled={!newItemName.trim()}
              className="bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] px-4 py-2.5 rounded-2xl text-xs font-bold disabled:opacity-50 active-press shrink-0 flex items-center justify-center gap-1 hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* List Container */}
      {shoppingList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col items-center justify-center text-center my-8 p-8 bg-[#EFE8D8] dark:bg-[#183024] rounded-[32px] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 shadow-2xs"
        >
          <div className="w-16 h-16 rounded-full bg-[#153B28]/10 dark:bg-white/10 flex items-center justify-center mb-4 text-[#153B28] dark:text-[#A7F3D0]">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] dark:text-[#FAF4E8] mb-2">
            Your list is empty.
          </h3>
          <p className="text-xs text-[#153B28]/75 dark:text-[#B6CEBC] max-w-xs leading-relaxed">
            When recipes are missing ingredients, tap "Add missing ingredients to shopping list" or type them above!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Active Unchecked Items */}
          {activeItems.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-[#153B28]/70 dark:text-[#B6CEBC] uppercase tracking-wider mb-2 px-1">
                To Buy ({activeItems.length})
              </span>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {activeItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      onClick={() => {
                        haptics.selection();
                        onToggleItem(item.id);
                      }}
                      className="bg-[#FAF5EC] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs cursor-pointer hover:border-[#153B28]/30 dark:hover:border-[#DCE9DA]/30 transition-all active-press"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            haptics.selection();
                            onToggleItem(item.id);
                          }}
                          className="text-[#153B28] dark:text-[#FAF4E8] hover:scale-110 transition-transform"
                        >
                          <Circle className="w-5 h-5 stroke-[2] text-[#153B28]/40 dark:text-[#DCE9DA]/40" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-[#153B28] dark:text-[#FAF4E8] capitalize">
                            {item.name}
                            {item.amount ? <span className="font-normal text-[#153B28]/70 dark:text-[#B6CEBC] ml-1">({item.amount})</span> : null}
                          </p>
                          {item.recipeTitle && (
                            <p className="text-[10px] text-[#153B28]/60 dark:text-[#B6CEBC]/80 font-medium flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3 text-[#153B28] dark:text-[#A7F3D0]" />
                              <span>For {item.recipeTitle}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          haptics.light();
                          onRemoveItem(item.id);
                        }}
                        className="p-1.5 text-[#153B28]/40 dark:text-[#B6CEBC]/60 hover:text-[#E05345] dark:hover:text-[#FF6B5C] rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Checked Items */}
          {completedItems.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-[#153B28]/50 dark:text-[#B6CEBC]/60 uppercase tracking-wider mb-2 px-1">
                Completed ({completedItems.length})
              </span>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {completedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        haptics.selection();
                        onToggleItem(item.id);
                      }}
                      className="bg-[#EFE8D8]/60 dark:bg-[#183024]/60 border border-[#153B28]/10 dark:border-[#DCE9DA]/10 rounded-2xl p-3.5 flex items-center justify-between opacity-75 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            haptics.selection();
                            onToggleItem(item.id);
                          }}
                          className="text-[#153B28] dark:text-[#A7F3D0]"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                        </button>
                        <p className="text-xs font-semibold text-[#153B28]/60 dark:text-[#B6CEBC]/60 line-through capitalize">
                          {item.name} {item.amount ? `(${item.amount})` : ''}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          haptics.light();
                          onRemoveItem(item.id);
                        }}
                        className="p-1.5 text-[#153B28]/30 dark:text-[#B6CEBC]/40 hover:text-[#E05345] dark:hover:text-[#FF6B5C] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
