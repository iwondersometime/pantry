import React, { useState } from 'react';
import { AuthScreen, User } from '../../types';
import { AuthService } from '../../services/AuthService';
import { ArrowLeft, Eye, EyeOff, Loader2, Check } from 'lucide-react';

interface SignUpScreenProps {
  onNavigate: (screen: AuthScreen) => void;
  onAuthSuccess: (user: User) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onNavigate,
  onAuthSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setFormError('');

    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password.');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isLoading) return;

    setIsLoading(true);
    setFormError('');

    try {
      const user = await AuthService.signUp(name.trim(), email.trim(), password);
      onAuthSuccess(user);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setFormError('');

    try {
      const user = await AuthService.loginWithGoogle(
        name.trim() || 'Gourmet Chef',
        email.trim() || 'chef@pantry.app'
      );
      onAuthSuccess(user);
    } catch (err: any) {
      setFormError(err.message || 'Google sign in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between px-6 pt-6 pb-8 max-w-md mx-auto">
      <div>
        {/* Top Bar with Back Arrow */}
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="w-10 h-10 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center hover:bg-[#E2DAC8] transition-colors active-press mb-5"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-[#153B28] stroke-[2]" />
        </button>

        {/* Heading & Supporting Text */}
        <h1 className="font-serif-editorial text-[36px] sm:text-[38px] leading-[1.1] font-normal text-[#153B28] tracking-tight mb-2">
          Make yourself at home.
        </h1>
        <p className="text-[13.5px] leading-relaxed text-[#153B28]/75 font-normal mb-6">
          Save your recipes, remember your ingredients, and pick up where you left off.
        </p>

        {/* Form Error Alert */}
        {formError && (
          <div className="mb-5 bg-[#FDF2F0] border border-[#E05345]/30 rounded-2xl p-3.5 text-xs text-[#E05345] font-medium leading-normal flex items-start gap-2.5">
            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#E05345] mt-1.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Name Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#153B28] tracking-wide">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="e.g. Maya Lin"
              className={`w-full bg-[#FFFDF8] border ${
                nameError ? 'border-[#E05345]' : 'border-[#153B28]/20 focus:border-[#153B28]'
              } rounded-2xl px-4 py-3 text-sm text-[#153B28] placeholder-[#153B28]/40 outline-none transition-colors shadow-2xs`}
            />
            {nameError && (
              <p className="text-xs text-[#E05345] font-medium px-1">{nameError}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#153B28] tracking-wide">
              Email
            </label>
            <input
              type="email"
              inputMode="email"
              autoCapitalize="none"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              placeholder="you@example.com"
              className={`w-full bg-[#FFFDF8] border ${
                emailError ? 'border-[#E05345]' : 'border-[#153B28]/20 focus:border-[#153B28]'
              } rounded-2xl px-4 py-3 text-sm text-[#153B28] placeholder-[#153B28]/40 outline-none transition-colors shadow-2xs`}
            />
            {emailError && (
              <p className="text-xs text-[#E05345] font-medium px-1">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#153B28] tracking-wide">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                placeholder="••••••••"
                className={`w-full bg-[#FFFDF8] border ${
                  passwordError ? 'border-[#E05345]' : 'border-[#153B28]/20 focus:border-[#153B28]'
                } rounded-2xl pl-4 pr-11 py-3 text-sm text-[#153B28] placeholder-[#153B28]/40 outline-none transition-colors shadow-2xs`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#153B28]/60 hover:text-[#153B28] p-1 rounded-full transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password requirement hint */}
            <div className="flex items-center gap-1.5 px-1 mt-0.5 text-[11px] text-[#153B28]/70">
              <Check className={`w-3 h-3 ${password.length >= 6 ? 'text-[#153B28]' : 'text-[#153B28]/40'}`} />
              <span>Must be at least 6 characters</span>
            </div>
            {passwordError && (
              <p className="text-xs text-[#E05345] font-medium px-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#153B28] tracking-wide">
              Confirm password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (confirmError) setConfirmError('');
              }}
              placeholder="••••••••"
              className={`w-full bg-[#FFFDF8] border ${
                confirmError ? 'border-[#E05345]' : 'border-[#153B28]/20 focus:border-[#153B28]'
              } rounded-2xl px-4 py-3 text-sm text-[#153B28] placeholder-[#153B28]/40 outline-none transition-colors shadow-2xs`}
            />
            {confirmError && (
              <p className="text-xs text-[#E05345] font-medium px-1">{confirmError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#153B28] text-[#F8F0E2] font-semibold py-3.5 px-6 rounded-2xl hover:bg-[#1C4A33] disabled:opacity-70 transition-all duration-200 active-press shadow-md flex items-center justify-center gap-2 text-[15px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#F8F0E2]" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create account</span>
            )}
          </button>
        </form>

        {/* Continue with Google */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full bg-[#FFFDF8] border border-[#153B28]/20 text-[#153B28] font-semibold py-3 px-6 rounded-2xl hover:bg-[#EFE8D8] transition-all duration-200 active-press flex items-center justify-center gap-2.5 text-xs shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      {/* Bottom Switch to Login */}
      <div className="pt-4 text-center text-xs text-[#153B28]/80 font-normal">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="font-semibold text-[#153B28] underline underline-offset-2 hover:opacity-80"
        >
          Log in
        </button>
      </div>
    </div>
  );
};
