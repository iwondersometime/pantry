import React from 'react';

interface BotanicalProps {
  className?: string;
  opacity?: string;
}

/**
 * Olive branch with delicate elongated leaves and stem
 */
export const OliveBranch: React.FC<BotanicalProps> = ({
  className = 'w-32 h-32',
  opacity = 'opacity-30 dark:opacity-20',
}) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${opacity} pointer-events-none select-none`}
    aria-hidden="true"
  >
    {/* Main organic stem */}
    <path
      d="M20 140 C50 115, 80 80, 140 20"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Leaf pairs with delicate center veins */}
    {/* Leaf 1 */}
    <path
      d="M45 115 C35 100, 30 85, 40 78 C50 82, 53 100, 45 115 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
    <path d="M45 115 C42 102, 38 90, 40 78" stroke="currentColor" strokeWidth="0.6" />

    {/* Leaf 2 */}
    <path
      d="M60 102 C75 95, 90 95, 92 105 C85 115, 70 112, 60 102 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
    <path d="M60 102 C72 100, 83 101, 92 105" stroke="currentColor" strokeWidth="0.6" />

    {/* Leaf 3 */}
    <path
      d="M75 88 C68 70, 65 55, 78 50 C88 56, 86 74, 75 88 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
    <path d="M75 88 C73 75, 72 62, 78 50" stroke="currentColor" strokeWidth="0.6" />

    {/* Leaf 4 */}
    <path
      d="M92 72 C110 68, 122 72, 120 84 C110 90, 98 84, 92 72 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
    <path d="M92 72 C104 71, 114 74, 120 84" stroke="currentColor" strokeWidth="0.6" />

    {/* Leaf 5 */}
    <path
      d="M108 55 C105 38, 108 25, 120 22 C128 30, 122 46, 108 55 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
    <path d="M108 55 C110 43, 113 32, 120 22" stroke="currentColor" strokeWidth="0.6" />

    {/* Terminal Leaf */}
    <path
      d="M140 20 C145 10, 155 12, 154 22 C148 28, 142 24, 140 20 Z"
      stroke="currentColor"
      strokeWidth="0.9"
      fill="currentColor"
      fillOpacity="0.04"
    />
  </svg>
);

/**
 * Rosemary / Thyme herb sprig with delicate needle leaves
 */
export const HerbSprig: React.FC<BotanicalProps> = ({
  className = 'w-28 h-28',
  opacity = 'opacity-30 dark:opacity-20',
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${opacity} pointer-events-none select-none`}
    aria-hidden="true"
  >
    <path
      d="M15 105 C35 85, 60 55, 105 15"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    {/* Delicate fine herb leaves */}
    <path d="M30 90 C22 82, 20 72, 28 68 C34 74, 33 84, 30 90 Z" stroke="currentColor" strokeWidth="0.8" />
    <path d="M42 78 C52 72, 60 74, 60 82 C52 86, 45 82, 42 78 Z" stroke="currentColor" strokeWidth="0.8" />
    <path d="M55 65 C48 55, 46 45, 55 42 C62 48, 59 58, 55 65 Z" stroke="currentColor" strokeWidth="0.8" />
    <path d="M68 52 C78 46, 88 48, 86 56 C78 60, 72 56, 68 52 Z" stroke="currentColor" strokeWidth="0.8" />
    <path d="M82 38 C76 28, 76 18, 85 16 C92 22, 88 32, 82 38 Z" stroke="currentColor" strokeWidth="0.8" />
    <path d="M95 25 C102 18, 108 20, 106 28 C99 32, 96 28, 95 25 Z" stroke="currentColor" strokeWidth="0.8" />
  </svg>
);

/**
 * Botanical corner ornament for card borders and screens
 */
export const BotanicalCorner: React.FC<BotanicalProps> = ({
  className = 'w-24 h-24',
  opacity = 'opacity-25 dark:opacity-15',
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${opacity} pointer-events-none select-none`}
    aria-hidden="true"
  >
    <path
      d="M10 90 C10 45, 45 10, 90 10"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeDasharray="2 3"
    />
    <path
      d="M18 90 C18 50, 50 18, 90 18"
      stroke="currentColor"
      strokeWidth="1.1"
    />
    <path
      d="M35 55 C25 45, 30 35, 45 35 C45 50, 35 55, 35 55 Z"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="currentColor"
      fillOpacity="0.03"
    />
    <circle cx="50" cy="50" r="1.5" fill="currentColor" />
    <circle cx="65" cy="35" r="1.2" fill="currentColor" />
    <circle cx="35" cy="65" r="1.2" fill="currentColor" />
  </svg>
);

/**
 * Single Monstera / Fig Leaf Line Art
 */
export const FigLeaf: React.FC<BotanicalProps> = ({
  className = 'w-36 h-36',
  opacity = 'opacity-25 dark:opacity-15',
}) => (
  <svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${opacity} pointer-events-none select-none`}
    aria-hidden="true"
  >
    {/* Main Leaf contour */}
    <path
      d="M70 130 C45 110, 20 85, 25 50 C30 20, 60 10, 70 25 C80 10, 110 20, 115 50 C120 85, 95 110, 70 130 Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Central Spine */}
    <path d="M70 130 L70 25" stroke="currentColor" strokeWidth="0.9" />
    {/* Lateral veins */}
    <path d="M70 105 C55 95, 40 85, 32 75" stroke="currentColor" strokeWidth="0.7" />
    <path d="M70 105 C85 95, 100 85, 108 75" stroke="currentColor" strokeWidth="0.7" />
    <path d="M70 80 C52 72, 38 60, 30 48" stroke="currentColor" strokeWidth="0.7" />
    <path d="M70 80 C88 72, 102 60, 110 48" stroke="currentColor" strokeWidth="0.7" />
    <path d="M70 55 C56 48, 45 38, 42 28" stroke="currentColor" strokeWidth="0.7" />
    <path d="M70 55 C84 48, 95 38, 98 28" stroke="currentColor" strokeWidth="0.7" />
  </svg>
);

/**
 * Botanical Floral Wreath / Seal stamp
 */
export const BotanicalSeal: React.FC<BotanicalProps> = ({
  className = 'w-24 h-24',
  opacity = 'opacity-25 dark:opacity-15',
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${opacity} pointer-events-none select-none`}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />
    <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1" />
    {/* Four cardinal leaf accents */}
    <path d="M50 14 C46 22, 54 22, 50 14 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05" />
    <path d="M50 86 C46 78, 54 78, 50 86 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05" />
    <path d="M14 50 C22 46, 22 54, 14 50 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05" />
    <path d="M86 50 C78 46, 78 54, 86 50 Z" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fillOpacity="0.05" />
  </svg>
);

/**
 * Global App-Wide Subtle Botanical Background
 * Extremely low-contrast (3-4% opacity) so it never interferes with text or readability,
 * while imparting a warm, editorial, hand-crafted culinary atmosphere across screens.
 */
export const BotanicalAppBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Top Left Olive Branch */}
      <div className="absolute -top-6 -left-8 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.04] dark:opacity-[0.03] rotate-[15deg]">
        <OliveBranch className="w-56 h-56" opacity="opacity-100" />
      </div>

      {/* Top Right Herb Sprig */}
      <div className="absolute top-24 -right-8 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.035] dark:opacity-[0.025] -rotate-[35deg]">
        <HerbSprig className="w-48 h-48" opacity="opacity-100" />
      </div>

      {/* Mid Left Fig Leaf */}
      <div className="absolute top-[42%] -left-12 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.03] dark:opacity-[0.02] rotate-[45deg]">
        <FigLeaf className="w-52 h-52" opacity="opacity-100" />
      </div>

      {/* Mid Right Botanical Corner */}
      <div className="absolute top-[58%] -right-8 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.035] dark:opacity-[0.025]">
        <BotanicalCorner className="w-40 h-40" opacity="opacity-100" />
      </div>

      {/* Bottom Left Herb Sprig */}
      <div className="absolute bottom-20 -left-6 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.035] dark:opacity-[0.025] rotate-[75deg]">
        <HerbSprig className="w-44 h-44" opacity="opacity-100" />
      </div>

      {/* Bottom Right Olive Branch */}
      <div className="absolute -bottom-10 -right-10 text-[#153B28] dark:text-[#DCE9DA] opacity-[0.04] dark:opacity-[0.03] -rotate-[120deg]">
        <OliveBranch className="w-60 h-60" opacity="opacity-100" />
      </div>
    </div>
  );
};
