import React from 'react';
import { motion } from 'motion/react';
import { Home, Camera, Search, Heart, Clock, ShoppingBag } from 'lucide-react';
import { TabDestination } from '../types';
import { haptics } from '../services/HapticService';

interface BottomNavProps {
  activeTab: TabDestination;
  onTabSelect: (tab: TabDestination) => void;
  savedCount?: number;
  shoppingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabSelect,
  savedCount = 0,
  shoppingCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabDestination, label: 'Home', icon: Home },
    { id: 'scan' as TabDestination, label: 'Scan', icon: Camera },
    { id: 'search' as TabDestination, label: 'Search', icon: Search },
    { id: 'shopping' as TabDestination, label: 'Shopping', icon: ShoppingBag, badge: shoppingCount },
    { id: 'saved' as TabDestination, label: 'Saved', icon: Heart, badge: savedCount },
    { id: 'history' as TabDestination, label: 'History', icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F0E2]/95 dark:bg-[#0D1A13]/95 backdrop-blur-md border-t border-[#153B28]/12 dark:border-[#DCE9DA]/15 py-1.5 xs:py-2 px-1 xs:px-2 sm:px-3 shadow-lg max-w-md mx-auto box-border transition-colors">
      <div className="flex justify-between items-center w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                haptics.selection();
                onTabSelect(tab.id);
              }}
              className={`relative flex-1 flex flex-col items-center justify-center py-1 xs:py-1.5 px-0.5 xs:px-1.5 rounded-2xl transition-colors active-press min-w-0 ${
                isSelected
                  ? 'text-[#153B28] dark:text-[#F8F0E2]'
                  : 'text-[#567563] dark:text-[#9BB8A5] hover:text-[#153B28] dark:hover:text-[#F8F0E2]'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeTabHighlight"
                  className="absolute inset-0 bg-[#EFE8D8] dark:bg-[#1C3629] rounded-2xl border border-[#153B28]/10 dark:border-[#DCE9DA]/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center min-w-0">
                <div className="relative">
                  <motion.div
                    animate={{ scale: isSelected ? 1.12 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 xs:w-5 xs:h-5 ${
                        isSelected
                          ? 'stroke-[2.2px] text-[#153B28] dark:text-[#F8F0E2]'
                          : 'stroke-[1.75px]'
                      }`}
                    />
                  </motion.div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 bg-[#E05345] dark:bg-[#FF6B5C] text-white text-[9px] font-bold w-3.5 h-3.5 xs:w-4 xs:h-4 rounded-full flex items-center justify-center border border-[#F8F0E2] dark:border-[#0D1A13]">
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] xs:text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${
                    isSelected ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
