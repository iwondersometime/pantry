import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { ScanHistoryItem } from '../types';
import { IngredientChip } from '../components/IngredientChip';

interface HistoryScreenProps {
  historyItems: ScanHistoryItem[];
  onReopenScan: (ingredients: string[]) => void;
  onDeleteHistoryItem: (id: string) => void;
  onNewScanClick: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  historyItems,
  onReopenScan,
  onDeleteHistoryItem,
  onNewScanClick,
}) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-4 sm:px-6 pt-4 pb-24 max-w-md mx-auto w-full box-border">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] dark:text-[#FAF4E8] tracking-tight">
          Scan history
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#153B28]/80 dark:text-[#B6CEBC]">
          Every fridge you've photographed.
        </p>
      </header>

      {/* History Items List */}
      {historyItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex-1 flex flex-col items-center justify-center text-center my-8 p-6 sm:p-8 bg-[#EFE8D8] dark:bg-[#183024] rounded-[32px] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 shadow-2xs w-full box-border"
        >
          <div className="w-16 h-16 rounded-full bg-[#153B28]/10 dark:bg-white/10 flex items-center justify-center mb-4 text-[#153B28] dark:text-[#A7F3D0]">
            <Clock className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] dark:text-[#FAF4E8] mb-2">
            No scan history yet.
          </h3>

          <p className="text-xs text-[#153B28]/75 dark:text-[#B6CEBC] max-w-xs mb-6 leading-relaxed">
            Snap a photo of your fridge or pantry to keep your scan history here.
          </p>

          <button
            type="button"
            onClick={onNewScanClick}
            className="py-3.5 px-6 rounded-2xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs shadow-md active-press flex items-center gap-2 hover:bg-[#1C4A33] dark:hover:bg-[#347A55] transition-colors"
          >
            <Camera className="w-4 h-4 stroke-[2]" />
            <span>Snap your first scan</span>
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4 w-full">
          <AnimatePresence mode="popLayout">
            {historyItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -60 }}
                transition={{ duration: 0.2, delay: idx * 0.03, ease: 'easeOut' }}
                onClick={() => onReopenScan(item.ingredients)}
                className="bg-[#FAF5EC] dark:bg-[#183024] rounded-3xl p-4 sm:p-5 border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xs cursor-pointer active-press hover:border-[#153B28]/30 dark:hover:border-[#DCE9DA]/30 transition-all relative w-full box-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-[#153B28] dark:text-[#FAF4E8]">
                      {item.timestamp}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFE8D8] dark:bg-[#1F3C2E] text-[#153B28] dark:text-[#E2EFE5] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#153B28] dark:text-[#A7F3D0]" />
                      <span>{item.ideasCount} ideas</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    className="p-2 text-[#E05345] dark:text-[#FF6B5C] hover:bg-[#E05345]/10 dark:hover:bg-[#FF6B5C]/10 rounded-full transition-colors"
                    title="Delete scan"
                    aria-label="Delete scan history item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Ingredient Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.ingredients.map((ing) => (
                    <IngredientChip key={ing} name={ing} variant="available" />
                  ))}
                </div>

                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 pt-2 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10 text-xs font-semibold text-[#153B28] dark:text-[#FAF4E8]">
                  <span className="text-[#153B28]/80 dark:text-[#B6CEBC] text-[11px]">Re-match recipes from this scan</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReopenScan(item.ingredients);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] font-semibold text-xs flex items-center gap-1.5 shadow-2xs hover:bg-[#1C4A33] dark:hover:bg-[#347A55] active-press self-end xs:self-auto shrink-0 transition-colors"
                  >
                    <span>Scan Again</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
