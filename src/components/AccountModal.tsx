import React, { useState } from 'react';
import { User } from '../types';
import { AuthService } from '../services/AuthService';
import {
  X,
  User as UserIcon,
  LogOut,
  Trash2,
  Edit2,
  Check,
  BookMarked,
  ChefHat,
  History,
  AlertTriangle,
  Loader2,
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

  // Confirmation dialog state
  const [activeModal, setActiveModal] = useState<'none' | 'logout' | 'delete' | 'privacy' | 'terms'>('none');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      setEditError('Name cannot be empty.');
      return;
    }

    setIsSavingName(true);
    setEditError('');

    try {
      const updated = await AuthService.updateProfile(nameInput.trim());
      onProfileUpdated(updated);
      setIsEditingName(false);
    } catch (err: any) {
      setEditError(err.message || 'Failed to update name.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleConfirmLogout = async () => {
    setIsProcessingAction(true);
    try {
      await AuthService.logout();
      onLoggedOut();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    setIsProcessingAction(true);
    try {
      await AuthService.deleteAccount();
      onLoggedOut();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#153B28]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      {/* Container Card */}
      <div className="w-full max-w-md bg-[#F8F0E2] rounded-t-3xl sm:rounded-3xl border border-[#153B28]/15 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#153B28]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#153B28] text-[#F8F0E2] flex items-center justify-center font-semibold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-serif-editorial text-xl font-normal text-[#153B28]">
              Account & Profile
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center hover:bg-[#E2DAC8] transition-colors active-press"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#153B28]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 flex flex-col gap-5">
          {/* User Details Box */}
          <div className="bg-[#FFFDF8] border border-[#153B28]/15 rounded-2xl p-4.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-[#153B28]/60 uppercase tracking-wider">
                User Profile
              </span>
              {!isEditingName && (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#153B28] hover:underline"
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
                    className="flex-1 bg-[#F8F0E2] border border-[#153B28]/20 rounded-xl px-3 py-1.5 text-sm font-semibold text-[#153B28] outline-none focus:border-[#153B28]"
                    placeholder="Enter your name"
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={isSavingName}
                    className="bg-[#153B28] text-[#F8F0E2] p-2 rounded-xl hover:bg-[#1C4A33] transition-colors"
                  >
                    {isSavingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingName(false);
                      setNameInput(user.name);
                    }}
                    className="p-2 rounded-xl border border-[#153B28]/15 text-[#153B28] hover:bg-[#EFE8D8]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {editError && <p className="text-xs text-[#E05345] font-medium">{editError}</p>}
              </div>
            ) : (
              <div>
                <p className="text-lg font-serif-editorial font-medium text-[#153B28] leading-tight">
                  {user.name}
                </p>
                <p className="text-xs text-[#153B28]/75 font-normal mt-0.5">{user.email}</p>
              </div>
            )}
          </div>

          {/* User Activity Stats */}
          <div>
            <p className="text-[11px] font-semibold text-[#153B28]/60 uppercase tracking-wider mb-2.5 px-1">
              Kitchen Activity
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#EFE8D8] border border-[#153B28]/10 rounded-2xl p-3 flex flex-col items-center text-center">
                <BookMarked className="w-4 h-4 text-[#153B28] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-semibold text-[#153B28] leading-none">
                  {savedCount}
                </span>
                <span className="text-[10px] font-medium text-[#153B28]/70 mt-1">
                  Saved
                </span>
              </div>

              <div className="bg-[#EFE8D8] border border-[#153B28]/10 rounded-2xl p-3 flex flex-col items-center text-center">
                <ChefHat className="w-4 h-4 text-[#153B28] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-semibold text-[#153B28] leading-none">
                  {cookedCount}
                </span>
                <span className="text-[10px] font-medium text-[#153B28]/70 mt-1">
                  Cooked
                </span>
              </div>

              <div className="bg-[#EFE8D8] border border-[#153B28]/10 rounded-2xl p-3 flex flex-col items-center text-center">
                <History className="w-4 h-4 text-[#153B28] mb-1 opacity-80" />
                <span className="text-lg font-serif-editorial font-semibold text-[#153B28] leading-none">
                  {historyCount}
                </span>
                <span className="text-[10px] font-medium text-[#153B28]/70 mt-1">
                  Scans
                </span>
              </div>
            </div>
          </div>

          {/* Legal & Account Options Section */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#153B28]/10">
            {/* Privacy Policy */}
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF8] border border-[#153B28]/15 text-[#153B28] hover:bg-[#EFE8D8] transition-colors text-xs font-semibold shadow-2xs"
            >
              <span>Privacy Policy</span>
              <span className="text-[#153B28]/60 text-[11px]">View →</span>
            </button>

            {/* Terms of Service */}
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#FFFDF8] border border-[#153B28]/15 text-[#153B28] hover:bg-[#EFE8D8] transition-colors text-xs font-semibold shadow-2xs"
            >
              <span>Terms of Service</span>
              <span className="text-[#153B28]/60 text-[11px]">View →</span>
            </button>

            {/* Log Out Option */}
            <button
              type="button"
              onClick={() => setActiveModal('logout')}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#153B28]/15 text-[#153B28] hover:bg-[#EFE8D8] transition-colors text-sm font-semibold shadow-2xs mt-1"
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
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#E05345]/25 text-[#E05345] hover:bg-[#FBE8E5] transition-colors text-sm font-semibold shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-4 h-4 stroke-[2]" />
                <span>Delete account</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] border border-[#153B28]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#153B28]/10">
              <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28]">Privacy Policy</h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-7 h-7 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#153B28]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#153B28]/85 space-y-3 leading-relaxed pr-1">
              <p><strong>Pantry Palette Privacy Policy</strong></p>
              <p>Your privacy is important to us. Pantry Palette processes fridge/pantry images securely using AI vision solely to identify food ingredients and recommend recipes.</p>
              <p>1. <strong>Data Storage:</strong> Photos are analyzed on secure servers and are not sold to third parties.</p>
              <p>2. <strong>Account Security:</strong> Authentication and user data are protected using Firebase Auth and encrypted database rules.</p>
              <p>3. <strong>Your Rights:</strong> You can edit or delete your account and saved recipes at any time in Account Settings.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-4 w-full py-2.5 bg-[#153B28] text-[#F8F0E2] font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] border border-[#153B28]/20 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#153B28]/10">
              <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28]">Terms of Service</h3>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-7 h-7 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#153B28]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto text-xs text-[#153B28]/85 space-y-3 leading-relaxed pr-1">
              <p><strong>Pantry Palette Terms of Service</strong></p>
              <p>By using Pantry Palette, you agree to these terms.</p>
              <p>1. <strong>Recipe Guidance:</strong> Recipes and AI ingredient suggestions are provided for general culinary guidance. Always verify allergen information independently.</p>
              <p>2. <strong>Fair Use:</strong> You agree to use the application in compliance with local laws and Play Store guidelines.</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="mt-4 w-full py-2.5 bg-[#153B28] text-[#F8F0E2] font-semibold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: LOG OUT */}
      {activeModal === 'logout' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] border border-[#153B28]/20 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#EFE8D8] text-[#153B28] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <LogOut className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-1">
              Log out?
            </h3>
            <p className="text-xs text-[#153B28]/75 leading-relaxed font-normal mb-6">
              You can sign back in anytime.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#EFE8D8] border border-[#153B28]/15 text-[#153B28] font-semibold text-xs rounded-xl hover:bg-[#E2DAC8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#153B28] text-[#F8F0E2] font-semibold text-xs rounded-xl hover:bg-[#1C4A33] transition-colors flex items-center justify-center gap-1.5"
              >
                {isProcessingAction ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Log out</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE ACCOUNT */}
      {activeModal === 'delete' && (
        <div className="fixed inset-0 z-60 bg-[#153B28]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#F8F0E2] border border-[#E05345]/30 rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-[#FDF2F0] text-[#E05345] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
            </div>

            <h3 className="font-serif-editorial text-2xl font-normal text-[#153B28] mb-1">
              Delete your account?
            </h3>
            <p className="text-xs text-[#153B28]/75 leading-relaxed font-normal mb-6">
              This permanently removes your account and associated data. This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#EFE8D8] border border-[#153B28]/15 text-[#153B28] font-semibold text-xs rounded-xl hover:bg-[#E2DAC8] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteAccount}
                disabled={isProcessingAction}
                className="flex-1 py-3 bg-[#E05345] text-[#FFFDF8] font-semibold text-xs rounded-xl hover:bg-[#C84336] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
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
