import React from 'react';
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
    <div className="flex flex-col min-h-[calc(100vh-80px)] px-6 pt-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6">
        <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] tracking-tight">
          Scan history
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[#153B28]/80">
          Every fridge you've photographed.
        </p>
      </header>

      {/* History Items List */}
      {historyItems.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-8 p-8 bg-[#EFE8D8] rounded-[32px] border border-[#153B28]/10 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#153B28]/10 flex items-center justify-center mb-4 text-[#153B28]">
            <Clock className="w-8 h-8 stroke-[1.5]" />
          </div>

          <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-2">
            No scan history yet.
          </h3>

          <p className="text-xs text-[#153B28]/75 max-w-xs mb-6 leading-relaxed">
            Snap a photo of your fridge or pantry to keep your scan history here.
          </p>

          <button
            type="button"
            onClick={onNewScanClick}
            className="py-3.5 px-6 rounded-2xl bg-[#153B28] text-[#F8F0E2] font-semibold text-xs shadow-md active-press flex items-center gap-2"
          >
            <Camera className="w-4 h-4 stroke-[2]" />
            <span>Snap your first scan</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onReopenScan(item.ingredients)}
              className="bg-[#FAF5EC] rounded-3xl p-5 border border-[#153B28]/15 shadow-2xs cursor-pointer active-press hover:border-[#153B28]/30 transition-all relative"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider text-[#153B28]">
                    {item.timestamp}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFE8D8] text-[#153B28] border border-[#153B28]/10 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#153B28]" />
                    <span>{item.ideasCount} ideas</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteHistoryItem(item.id);
                  }}
                  className="p-2 text-[#E05345] hover:bg-[#E05345]/10 rounded-full transition-colors"
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

              <div className="flex items-center justify-between pt-2 border-t border-[#153B28]/10 text-xs font-semibold text-[#153B28]">
                <span>Tap to reopen ingredients & match recipes</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
