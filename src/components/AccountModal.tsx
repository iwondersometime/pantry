import React, { useState, useRef } from 'react';
import { User, AppTheme } from '../types';
import { AuthService } from '../services/AuthService';
import { LocalStorageService } from '../services/LocalStorageService';
import { UserAvatar, getEffectiveAvatarUrl } from './UserAvatar';
import { compressProfileImage } from '../utils/imageCompressor';
import { haptics } from '../services/HapticService';
import {
  getUnifiedAllergyList,
  normalizeSingleAllergy,
  normalizeAllergyList,
  UnifiedAllergyItem,
} from '../utils/allergyNormalization';
import {
  X,
  LogOut,
  Trash2,
  Edit2,
  Check,
  BookMarked,
  ChefHat,
  History,
  AlertTriangle,
  Loader2,
  Sun,
  Moon,
  Laptop,
  Camera,
  Upload,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Vibrate,
} from 'lucide-react';

interface AccountModalProps {
  user: User;
  savedCount: number;
  cookedCount: number;
  historyCount: number;
  onClose: () => void;
  onLoggedOut: () => void;
  onProfileUpdated: (updatedUser: User) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  user,
  savedCount,
  cookedCount,
  historyCount,
  onClose,
  onLoggedOut,
  onProfileUpdated,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [isSavingName, setIsSavingName] = useState(false);
  const [editError, setEditError] = useState('');

  // Profile Picture state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);
  const [isResettingPhoto, setIsResettingPhoto] = useState(false);
  const [photoFeedback, setPhotoFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Theme state
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() =>
    LocalStorageService.getTheme(user.id)
  );

  // Allergy state
  const [userAllergies, setUserAllergies] = useState<string[]>(() =>
    user.allergies || LocalStorageService.getUserAllergies(user.id)
  );
  const [customAllergyInput, setCustomAllergyInput] = useState('');

  const { items: unifiedAllergyChips, activeCount } = getUnifiedAllergyList(userAllergies);

  const handleToggleAllergyItem = async (chipItem: UnifiedAllergyItem) => {
    haptics.selection();
    const currentNormalized = normalizeAllergyList(userAllergies);

    let updated: string[];
    if (chipItem.isActive) {
      // Remove item by canonical match
      updated = currentNormalized.filter((itemStr) => {
        const norm = normalizeSingleAllergy(itemStr);
        return norm ? norm.canonical !== chipItem.canonical : true;
      });
    } else {
      // Add item
      updated = [...currentNormalized, chipItem.label];
    }

    const finalNormalized = normalizeAllergyList(updated);

    setUserAllergies(finalNormalized);
    LocalStorageService.setUserAllergies(finalNormalized, user.id);
    onProfileUpdated({ ...user, allergies: finalNormalized });

    try {
      const updatedUser = await AuthService.updateUserAllergies(finalNormalized);
      onProfileUpdated(updatedUser);
    } catch (e) {
      console.warn('Failed to save allergies to cloud:', e);
    }
  };

  const handleAddCustomAllergy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rawInput = customAllergyInput;
    if (!rawInput || !rawInput.trim()) return;

    const norm = normalizeSingleAllergy(rawInput);
    if (!norm) {
      setCustomAllergyInput('');
      return;
    }

    const currentNormalized = normalizeAllergyList(userAllergies);
    const alreadyActive = currentNormalized.some((itemStr) => {
      const existingNorm = normalizeSingleAllergy(itemStr);
      return existingNorm ? existingNorm.canonical === norm.canonical : false;
    });

    if (!alreadyActive) {
      const updated = [...currentNormalized, norm.label];
      const finalNormalized = normalizeAllergyList(updated);

      setUserAllergies(finalNormalized);
      setCustomAllergyInput('');
      LocalStorageService.setUserAllergies(finalNormalized, user.id);
      onProfileUpdated({ ...user, allergies: finalNormalized });
      haptics.success();

      try {
        const updatedUser = await AuthService.updateUserAllergies(finalNormalized);
        onProfileUpdated(updatedUser);
      } catch (err) {
        console.warn('Failed to save custom allergy:', err);
      }
    } else {
      setCustomAllergyInput('');
    }
  };

  // Haptic feedback state
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() =>
    haptics.isEnabled()
  );

  // Confirmation dialog state
  const [activeModal, setActiveModal] = useState<'none' | 'logout' | 'delete' | 'privacy' | 'terms'>('none');
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [actionError, setActionError] = useState('');

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setEditError('Name cannot be empty.');
      haptics.error();
      return;
    }

    setIsSavingName(true);
    setEditError('');

    try {
      const updated = await AuthService.updateProfile(nameInput.trim());
      onProfileUpdated(updated);
      setIsEditingName(false);
      haptics.success();
    } catch (err: any) {
      setEditError(err.message || 'Failed to update name.');
      haptics.error();
    } finally {
      setIsSavingName(false);
    }
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setCurrentTheme(newTheme);
    LocalStorageService.setTheme(newTheme, user.id);
    haptics.selection();
  };

  const handleHapticToggle = (enabled: boolean) => {
    haptics.setEnabled(enabled);
    setHapticsEnabled(enabled);
    if (enabled) {
      haptics.selection();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clear value so user can select the same file again if desired
    e.target.value = '';
    setPhotoFeedback(null);
    setIsProcessingPhoto(true);
    haptics.light();

    try {
      const compressedDataUrl = await compressProfileImage(file, 300, 0.85);
      setPendingPhotoUrl(compressedDataUrl);
      haptics.selection();
    } catch (err: any) {
      setPhotoFeedback({
        type: 'error',
        message: err.message || 'Could not process the selected image. Please try another.',
      });
      haptics.error();
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleConfirmSavePhoto = async () => {
    if (!pendingPhotoUrl) return;

    setIsSavingPhoto(true);
    setPhotoFeedback(null);

    try {
      const updated = await AuthService.updateProfilePhoto(pendingPhotoUrl);
      onProfileUpdated(updated);
      setPendingPhotoUrl(null);
      setPhotoFeedback({
        type: 'success',
        message: 'Profile picture updated successfully!',
      });
      haptics.success();
      setTimeout(() => setPhotoFeedback(null), 4000);
    } catch (err: any) {
      setPhotoFeedback({
        type: 'error',
        message: err.message || 'Failed to save profile picture. Please try again.',
      });
      haptics.error();
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const handleResetToGooglePhoto = async () => {
    setIsResettingPhoto(true);
    setPhotoFeedback(null);

    try {
      const updated = await AuthService.resetToGooglePhoto();
      onProfileUpdated(updated);
      setPhotoFeedback({
        type: 'success',
        message: user.googlePhotoURL
          ? 'Reset to your Google profile picture.'
          : 'Custom photo removed. Using default avatar.',
      });
      haptics.selection();
      setTimeout(() => setPhotoFeedback(null), 4000);
    } catch (err: any) {
      setPhotoFeedback({
        type: 'error',
        message: err.message || 'Failed to reset profile picture.',
      });
      haptics.error();
    } finally {
      setIsResettingPhoto(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsProcessingAction(true);
    setActionError('');
    try {
      await AuthService.logout();
      onLoggedOut();
    } catch (e: any) {
      setActionError(e.message || 'Failed to log out.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsProcessingAction(true);
    setActionError('');
    try {
      await AuthService.deleteAccount();
      onLoggedOut();
    } catch (e: any) {
      setActionError(e.message || 'Failed to delete account.');
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Determine current photo source label for transparency
  const hasCustomPhoto = Boolean(user.customPhotoURL && (user.photoSource === 'custom' || !user.photoSource));
  const hasGooglePhoto = Boolean(user.googlePhotoURL);

  return (
    <div className="fixed inset-0 z-50 bg-[#153B28]/60 dark:bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Hidden File Input for Profile Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile photo"
      />

      {/* Container Card */}
      <div className="w-full max-w-md bg-[#F8F0E2] dark:bg-[#12261C] rounded-t-3xl sm:rounded-3xl border border-[#153B28]/15 dark:border-[#DCE9DA]/15 shadow-2xl p-5 sm:p-6 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="sm" />
            <div>
              <h2 className="font-serif-editorial text-xl font-bold text-[#153B28] dark:text-[#F8F0E2] leading-tight">
                Account & Settings
              </h2>
              <span className="text-[11px] text-[#567563] dark:text-[#9BB8A5]">
                Culinary profile & preferences
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 flex items-center justify-center hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors active-press cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#153B28] dark:text-[#F8F0E2]" />
          </button>
        </div>

        {/* Feedback Alert if any */}
        {photoFeedback && (
          <div
            className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
              photoFeedback.type === 'success'
                ? 'bg-[#EBF7F0] dark:bg-[#163826] border-[#326B4D]/30 text-[#153B28] dark:text-[#DCE9DA]'
                : 'bg-[#FDF2F0] dark:bg-[#2C1818] border-[#E05345]/30 text-[#E05345] dark:text-[#FF8880]'
            }`}
          >
            {photoFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#153B28] dark:text-[#DCE9DA]" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#E05345]" />
            )}
            <span className="flex-1">{photoFeedback.message}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-0.5">
          {/* ========================================================================= */}
          {/* 1. PROFILE PICTURE SECTION */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider">
                Profile Picture
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] text-[#153B28] dark:text-[#DCE9DA] border border-[#153B28]/10 dark:border-[#DCE9DA]/15">
                {hasCustomPhoto ? 'Custom Photo' : hasGooglePhoto ? 'Google Photo' : 'Initials Avatar'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Avatar with Interactive Camera Overlay */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <UserAvatar
                  user={user}
                  size="xl"
                  showCameraBadge
                  onCameraClick={() => fileInputRef.current?.click()}
                />
              </div>

              {/* Action Buttons & Info */}
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <p className="text-xs font-medium text-[#153B28] dark:text-[#F8F0E2] leading-snug">
                    {hasCustomPhoto
                      ? 'Custom Pantry profile picture active'
                      : hasGooglePhoto
                      ? 'Using your connected Google photo'
                      : 'Default initials avatar'}
                  </p>
                  <p className="text-[11px] text-[#567563] dark:text-[#9BB8A5] mt-0.5">
                    JPG, PNG, or WebP (auto-cropped)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Change/Upload Photo Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto || isSavingPhoto}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] text-xs font-semibold hover:bg-[#1C4A33] transition-colors active-press shadow-2xs cursor-pointer"
                  >
                    {isProcessingPhoto ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                    <span>{hasCustomPhoto ? 'Change Photo' : 'Choose Photo'}</span>
                  </button>

                  {/* Reset to Google Photo / Remove Custom Photo (Only if user has a custom photo) */}
                  {hasCustomPhoto && (
                    <button
                      type="button"
                      onClick={handleResetToGooglePhoto}
                      disabled={isResettingPhoto}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFE8D8] dark:bg-[#1C3629] text-[#153B28] dark:text-[#F8F0E2] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-xs font-semibold hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors active-press cursor-pointer"
                      title={hasGooglePhoto ? 'Use your Google profile picture' : 'Remove custom photo'}
                    >
                      {isResettingPhoto ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                      <span>{hasGooglePhoto ? 'Reset to Google Photo' : 'Remove Custom'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. USER DETAILS (NAME & EMAIL) */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider">
                User Details
              </span>
              {!isEditingName && (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#153B28] dark:text-[#DCE9DA] hover:underline cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit name</span>
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-xl px-3 py-1.5 text-sm font-semibold text-[#153B28] dark:text-[#F8F0E2] outline-none focus:border-[#153B28]"
                    placeholder="Enter your name"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] p-2 rounded-xl hover:bg-[#1C4A33] transition-colors cursor-pointer"
                    title="Save Name"
                  >
                    {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNameInput(user.name);
                    }}
                    className="p-2 rounded-xl border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629] cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {editError && <p className="text-xs text-[#E05345] font-medium">{editError}</p>}
              </div>
            ) : (
              <div>
                <p className="text-lg font-serif-editorial font-bold text-[#153B28] dark:text-[#F8F0E2] leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-[#567563] dark:text-[#9BB8A5] font-normal mt-0.5">{user.email}</p>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 3. APPEARANCE / THEME SELECTOR */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-4 shadow-2xs">
            <span className="text-[11px] font-semibold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider block mb-2.5">
              App Appearance
            </span>
            <div className="grid grid-cols-3 gap-2">
              {/* Light Option */}
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all active-press cursor-pointer ${
                  currentTheme === 'light'
                    ? 'bg-[#153B28] text-[#F8F0E2] border-[#153B28] shadow-xs'
                    : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629]'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span className="text-xs font-semibold">Light</span>
              </button>

              {/* Dark Option */}
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all active-press cursor-pointer ${
                  currentTheme === 'dark'
                    ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] dark:border-[#2E6B4B] shadow-xs'
                    : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629]'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span className="text-xs font-semibold">Dark</span>
              </button>

              {/* System Option */}
              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all active-press cursor-pointer ${
                  currentTheme === 'system'
                    ? 'bg-[#153B28] dark:bg-[#2E6B4B] text-[#F8F0E2] border-[#153B28] dark:border-[#2E6B4B] shadow-xs'
                    : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629]'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span className="text-xs font-semibold">System</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3.5. ALLERGIES & DIETARY SAFETY */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider block">
                Allergies & Food Safety
              </span>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-2.5 py-0.5 rounded-full">
                {activeCount} Active
              </span>
            </div>
            <p className="text-xs text-[#567563] dark:text-[#9BB8A5] mb-3 leading-relaxed">
              {activeCount === 0
                ? 'No allergies selected. Tap any allergen below or add a custom one.'
                : 'Recipes generated and searched will exclude selected allergens and display safety badges.'}
            </p>

            {/* Unified Allergens Chip Grid */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {unifiedAllergyChips.map((chip) => {
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleToggleAllergyItem(chip)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all active-press cursor-pointer border flex items-center gap-1.5 ${
                      chip.isActive
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-[#F8F0E2] dark:bg-[#12261C] text-[#153B28] dark:text-[#F8F0E2] border-[#153B28]/15 dark:border-[#DCE9DA]/15 hover:bg-[#EFE8D8] dark:hover:bg-[#1C3629]'
                    }`}
                  >
                    {chip.isActive ? (
                      <Check className="w-3 h-3 shrink-0" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                    )}
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Allergy Add Input */}
            <form onSubmit={handleAddCustomAllergy} className="flex gap-2">
              <input
                type="text"
                value={customAllergyInput}
                onChange={(e) => setCustomAllergyInput(e.target.value)}
                placeholder="Add specific allergy (e.g., Mushroom)..."
                className="flex-1 bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-xl px-3 py-1.5 text-xs text-[#153B28] dark:text-[#F8F0E2] placeholder-[#567563]/60 focus:outline-none focus:ring-1 focus:ring-[#153B28]"
              />
              <button
                type="submit"
                disabled={!customAllergyInput.trim()}
                className="px-3 py-1.5 bg-[#153B28] text-[#F8F0E2] dark:bg-[#2E6B4B] rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer active-press"
              >
                Add
              </button>
            </form>

            <p className="text-[10px] text-[#567563]/80 dark:text-[#9BB8A5]/70 italic mt-2.5">
              ⚠️ Allergy filtering is a safety aid, not a medical guarantee. Always inspect ingredient lists before cooking.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* 3B. HAPTIC FEEDBACK SETTINGS */}
          {/* ========================================================================= */}
          <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EFE8D8] dark:bg-[#1C3629] text-[#153B28] dark:text-[#F8F0E2] flex items-center justify-center">
                  <Vibrate className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#153B28] dark:text-[#F8F0E2] block">
                    Haptic Feedback
                  </span>
                  <span className="text-[10px] text-[#567563] dark:text-[#9BB8A5]">
                    {haptics.isSupported() ? 'Tactile vibration responses' : 'Not supported on this device/browser'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#EFE8D8] dark:bg-[#1C3629] p-1 rounded-xl border border-[#153B28]/10 dark:border-[#DCE9DA]/10">
                <button
                  type="button"
                  onClick={() => handleHapticToggle(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    hapticsEnabled
                      ? 'bg-[#153B28] text-[#F8F0E2] shadow-xs'
                      : 'text-[#153B28]/70 dark:text-[#F8F0E2]/70 hover:text-[#153B28]'
                  }`}
                >
                  ON
                </button>
                <button
                  type="button"
                  onClick={() => handleHapticToggle(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    !hapticsEnabled
                      ? 'bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] shadow-xs'
                      : 'text-[#153B28]/70 dark:text-[#F8F0E2]/70 hover:text-[#153B28]'
                  }`}
                >
                  OFF
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. USER ACTIVITY STATS */}
          {/* ========================================================================= */}
          <div>
            <p className="text-[11px] font-semibold text-[#567563] dark:text-[#9BB8A5] uppercase tracking-wider mb-2.5 px-1">
              Kitchen Activity
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs">
                <BookMarked className="w-4 h-4 text-[#153B28] dark:text-[#DCE9DA] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-bold text-[#153B28] dark:text-[#F8F0E2] leading-none">
                  {savedCount}
                </span>
                <span className="text-[10px] font-medium text-[#567563] dark:text-[#9BB8A5] mt-1">
                  Saved
                </span>
              </div>

              <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs">
                <ChefHat className="w-4 h-4 text-[#153B28] dark:text-[#DCE9DA] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-bold text-[#153B28] dark:text-[#F8F0E2] leading-none">
                  {cookedCount}
                </span>
                <span className="text-[10px] font-medium text-[#567563] dark:text-[#9BB8A5] mt-1">
                  Cooked
                </span>
              </div>

              <div className="bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/10 dark:border-[#DCE9DA]/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-2xs">
                <History className="w-4 h-4 text-[#153B28] dark:text-[#DCE9DA] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-bold text-[#153B28] dark:text-[#F8F0E2] leading-none">
                  {historyCount}
                </span>
                <span className="text-[10px] font-medium text-[#567563] dark:text-[#9BB8A5] mt-1">
                  Scans
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 5. LEGAL & ACCOUNT OPTIONS */}
          {/* ========================================================================= */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#153B28]/10 dark:border-[#DCE9DA]/10">
            {/* Privacy Policy */}
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] hover:bg-[#EFE8D8] dark:hover:bg-[#204030] transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <span>Privacy Policy</span>
              <span className="text-[#567563] dark:text-[#9BB8A5] text-[11px]">View →</span>
            </button>

            {/* Terms of Service */}
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] hover:bg-[#EFE8D8] dark:hover:bg-[#204030] transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <span>Terms of Service</span>
              <span className="text-[#567563] dark:text-[#9BB8A5] text-[11px]">View →</span>
            </button>

            {/* Log Out Option */}
            <button
              type="button"
              onClick={() => setActiveModal('logout')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF8] dark:bg-[#183024] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] hover:bg-[#EFE8D8] dark:hover:bg-[#204030] transition-colors text-sm font-semibold shadow-2xs mt-1 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 stroke-[2]" />
                <span>Log out</span>
              </div>
            </button>

            {/* Delete Account Option */}
            <button
              type="button"
              onClick={() => setActiveModal('delete')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FDF2F0] dark:bg-[#2C1818] border border-[#E05345]/25 dark:border-[#E05345]/40 text-[#E05345] dark:text-[#FF7A70] hover:bg-[#FBE8E5] dark:hover:bg-[#3D1F1F] transition-colors text-sm font-semibold shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 stroke-[2]" />
                <span>Delete account</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PHOTO CONFIRMATION / PREVIEW MODAL */}
      {/* ========================================================================= */}
      {pendingPhotoUrl && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10">
              <h3 className="font-serif-editorial text-xl font-bold text-[#153B28] dark:text-[#F8F0E2]">
                New Profile Photo
              </h3>
              <button
                type="button"
                onClick={() => setPendingPhotoUrl(null)}
                disabled={isSavingPhoto}
                className="w-7 h-7 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#153B28] dark:text-[#F8F0E2]" />
              </button>
            </div>

            {/* Circular Preview */}
            <div className="my-3 relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-3 border-[#153B28] dark:border-[#DCE9DA] shadow-lg bg-[#153B28]">
                <img
                  src={pendingPhotoUrl}
                  alt="Profile Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="absolute bottom-0 right-0 bg-[#153B28] text-[#F8F0E2] p-1.5 rounded-full shadow-md">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <p className="text-xs text-[#567563] dark:text-[#9BB8A5] leading-relaxed font-normal mb-5">
              Confirm this image as your Pantry profile picture.
            </p>

            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => setPendingPhotoUrl(null)}
                disabled={isSavingPhoto}
                className="flex-1 py-2.5 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSavePhoto}
                disabled={isSavingPhoto}
                className="flex-1 py-2.5 bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#1C4A33] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isSavingPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Photo</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#153B28] dark:text-[#F8F0E2]">Privacy Policy</h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-7 h-7 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#153B28] dark:text-[#F8F0E2]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#153B28]/85 dark:text-[#F8F0E2]/85 space-y-3 leading-relaxed pr-1">
              <p><strong>Pantry Privacy Policy</strong></p>
              <p>Your privacy is paramount. Pantry processes fridge/pantry images securely using AI vision solely to identify food ingredients and recommend recipes.</p>
              <p>1. <strong>Data Storage:</strong> Photos are analyzed on secure servers and are not sold to third parties.</p>
              <p>2. <strong>Account Security:</strong> Authentication and user data are protected using Firebase Auth and encrypted database rules.</p>
              <p>3. <strong>Your Rights:</strong> You can edit or delete your account and saved recipes at any time in Account Settings.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-4 w-full py-2.5 bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] font-semibold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#153B28]/10 dark:border-[#DCE9DA]/10">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#153B28] dark:text-[#F8F0E2]">Terms of Service</h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-7 h-7 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-[#153B28] dark:text-[#F8F0E2]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#153B28]/85 dark:text-[#F8F0E2]/85 space-y-3 leading-relaxed pr-1">
              <p><strong>Pantry Terms of Service</strong></p>
              <p>By using Pantry, you agree to these terms.</p>
              <p>1. <strong>Recipe Guidance:</strong> Recipes and AI ingredient suggestions are provided for general culinary guidance. Always verify allergen information independently.</p>
              <p>2. <strong>Fair Use:</strong> You agree to use the application in compliance with local laws and guidelines.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-4 w-full py-2.5 bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] font-semibold text-xs rounded-xl cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: LOG OUT */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] dark:bg-[#12261C] border border-[#153B28]/20 dark:border-[#DCE9DA]/20 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFE8D8] dark:bg-[#1C3629] text-[#153B28] dark:text-[#F8F0E2] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <LogOut className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-serif-editorial text-2xl font-bold text-[#153B28] dark:text-[#F8F0E2] mb-1">
              Log out?
            </h3>
            <p className="text-xs text-[#567563] dark:text-[#9BB8A5] leading-relaxed font-normal mb-6">
              You can sign back in anytime.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#153B28] dark:bg-[#204E35] text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#1C4A33] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isProcessingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Log out</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE ACCOUNT */}
      {activeModal === 'delete' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] dark:bg-[#12261C] border border-[#E05345]/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F0] dark:bg-[#2C1818] text-[#E05345] dark:text-[#FF7A70] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-serif-editorial text-2xl font-bold text-[#153B28] dark:text-[#F8F0E2] mb-1">
              Delete your account?
            </h3>
            <p className="text-xs text-[#567563] dark:text-[#9BB8A5] leading-relaxed font-normal mb-4">
              This permanently removes your account and associated data. This action cannot be undone.
            </p>

            {actionError && (
              <p className="text-xs text-[#E05345] font-medium leading-normal mb-4 bg-[#FDF2F0] dark:bg-[#2C1818] p-2.5 rounded-xl border border-[#E05345]/20">
                {actionError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#EFE8D8] dark:bg-[#1C3629] border border-[#153B28]/15 dark:border-[#DCE9DA]/15 text-[#153B28] dark:text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#E2DAC8] dark:hover:bg-[#254837] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#E05345] text-[#FFFDF8] font-semibold text-xs rounded-xl hover:bg-[#C84336] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                {isProcessingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Delete Account</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
