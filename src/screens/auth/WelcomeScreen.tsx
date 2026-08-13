import React from 'react';
import { AuthScreen } from '../../types';
import { ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: AuthScreen) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between px-8 pt-12 pb-12 max-w-md mx-auto relative overflow-hidden">
      {/* Top Editorial Branding Badge */}
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 bg-[#EFE8D8] border border-[#153B28]/15 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide text-[#153B28]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#153B28]" />
          <span>Pantry Recipe Intelligence</span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="my-auto py-8">
        <h1 className="font-serif-editorial text-[48px] sm:text-[52px] leading-[1.08] font-normal text-[#153B28] tracking-tight mb-6">
          Cook with <br />
          what you <br />
          already have.
        </h1>

        <p className="text-[15px] sm:text-[16px] leading-relaxed text-[#153B28]/80 font-normal max-w-[280px]">
          Turn the ingredients in your kitchen into something worth eating.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3.5 w-full pt-4">
        <button
          type="button"
          onClick={() => onNavigate('signup')}
          className="w-full bg-[#153B28] text-[#F8F0E2] font-semibold py-4 px-6 rounded-2xl hover:bg-[#1C4A33] transition-all duration-200 active-press shadow-md flex items-center justify-center gap-2 text-[15px]"
        >
          <span>Get started</span>
          <ArrowRight className="w-4 h-4 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full bg-[#EFE8D8] border border-[#153B28]/20 text-[#153B28] font-semibold py-3.5 px-6 rounded-2xl hover:bg-[#E3DAC7] transition-all duration-200 active-press text-[15px]"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
};
