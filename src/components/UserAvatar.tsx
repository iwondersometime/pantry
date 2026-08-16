import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Camera } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';

interface UserAvatarProps {
  user?: User | null;
  name?: string;
  photoUrl?: string | null;
  size?: AvatarSize;
  className?: string;
  showCameraBadge?: boolean;
  onCameraClick?: () => void;
  altText?: string;
}

const SIZE_CLASSES: Record<AvatarSize, { container: string; text: string; icon: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', icon: 'w-2.5 h-2.5' },
  sm: { container: 'w-8 h-8', text: 'text-xs', icon: 'w-3 h-3' },
  md: { container: 'w-10 h-10', text: 'text-sm font-bold', icon: 'w-3.5 h-3.5' },
  lg: { container: 'w-14 h-14', text: 'text-xl font-bold', icon: 'w-4 h-4' },
  xl: { container: 'w-20 h-20', text: 'text-2xl font-bold font-serif-editorial', icon: 'w-4 h-4' },
  '2xl': { container: 'w-24 h-24', text: 'text-3xl font-bold font-serif-editorial', icon: 'w-5 h-5' },
  custom: { container: '', text: 'text-base font-bold', icon: 'w-4 h-4' },
};

/**
 * Returns the effective avatar URL based on priority:
 * 1. Custom Pantry photo (if user selected one)
 * 2. Google account photo (if available)
 * 3. Fallback (null -> initials avatar)
 */
export function getEffectiveAvatarUrl(user?: User | null, overrideUrl?: string | null): string | null {
  if (overrideUrl !== undefined) {
    return overrideUrl;
  }
  if (!user) return null;

  // 1. Custom user photo priority
  if (user.customPhotoURL && (user.photoSource === 'custom' || !user.photoSource)) {
    return user.customPhotoURL;
  }

  // 2. Google account profile picture
  if (user.googlePhotoURL) {
    return user.googlePhotoURL;
  }

  return null;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  name,
  photoUrl,
  size = 'md',
  className = '',
  showCameraBadge = false,
  onCameraClick,
  altText,
}) => {
  const [imgError, setImgError] = useState(false);

  const effectiveName = name || user?.name || 'Chef';
  const effectivePhotoUrl = getEffectiveAvatarUrl(user, photoUrl);

  // Reset error state if the photo URL changes
  useEffect(() => {
    setImgError(false);
  }, [effectivePhotoUrl]);

  const displayNameInitial = (effectiveName.trim().charAt(0) || 'P').toUpperCase();
  const sizeConfig = SIZE_CLASSES[size];

  const hasValidImage = Boolean(effectivePhotoUrl && !imgError);

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${sizeConfig.container} rounded-full overflow-hidden bg-[#153B28] dark:bg-[#1E4D35] text-[#F8F0E2] border border-[#153B28]/15 dark:border-[#DCE9DA]/20 shadow-2xs flex items-center justify-center relative transition-transform`}
        style={{ aspectRatio: '1 / 1' }}
      >
        {hasValidImage ? (
          <img
            src={effectivePhotoUrl!}
            alt={altText || effectiveName}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={`${sizeConfig.text} font-bold leading-none tracking-tight select-none`}>
            {displayNameInitial}
          </span>
        )}
      </div>

      {/* Camera / Edit Badge */}
      {showCameraBadge && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCameraClick?.();
          }}
          className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[#FAF5EC] dark:bg-[#1C3629] text-[#153B28] dark:text-[#F8F0E2] border-2 border-[#F8F0E2] dark:border-[#12261C] shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="Change Profile Photo"
          aria-label="Change Profile Photo"
        >
          <Camera className="w-3.5 h-3.5 stroke-[2.25]" />
        </button>
      )}
    </div>
  );
};
