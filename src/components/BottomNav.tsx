import React from 'react';
import { Camera, Search, Heart, Clock } from 'lucide-react';
import { TabDestination } from '../types';

interface BottomNavProps {
  activeTab: TabDestination;
  onTabSelect: (tab: TabDestination) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabSelect, savedCount = 0 }) => {
  const tabs = [
    { id: 'scan' as TabDestination, label: 'Scan', icon: Camera },
    { id: 'search' as TabDestination, label: 'Search', icon: Search },
    { id: 'saved' as TabDestination, label: 'Saved', icon: Heart, badge: savedCount },
    { id: 'history' as TabDestination, label: 'History', icon: Clock },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F8F0E2]/95 backdrop-blur-md border-t border-[#E5DAC6] py-2 px-4 shadow-lg max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all active-press ${
                isSelected ? 'text-[#153B28]' : 'text-[#6C8474] hover:text-[#153B28]/80'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform ${
                    isSelected ? 'scale-110 stroke-[2.2px]' : 'stroke-[1.75px]'
                  }`}
                />
                {tab.id === 'saved' && (tab.badge ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#E05345] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#F8F0E2]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium tracking-wide ${isSelected ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
              {isSelected && (
                <div className="w-1 h-1 bg-[#153B28] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
