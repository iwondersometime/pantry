import React, { useState } from 'react';
import { AuthScreen } from '../../types';
import { AuthService } from '../../services/AuthService';
import { ArrowLeft, MailCheck, Loader2 } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: AuthScreen) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await AuthService.requestPasswordReset(trimmedEmail);
      setIsSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F0E2] text-[#153B28] flex flex-col justify-between px-6 pt-6 pb-8 max-w-md mx-auto">
      <div>
        {/* Back Arrow Button */}
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-10 h-10 rounded-full bg-[#EFE8D8] border border-[#153B28]/15 flex items-center justify-center hover:bg-[#E2DAC8] transition-colors active-press mb-6"
          aria-label="Back to login"
        >
          <ArrowLeft className="w-5 h-5 text-[#153B28] stroke-[2]" />
        </button>

        {isSuccess ? (
          /* Success State View */
          <div className="flex flex-col items-start pt-2">
            <div className="w-14 h-14 rounded-2xl bg-[#E2EEDF] text-[#153B28] flex items-center justify-center mb-5 shadow-xs">
              <MailCheck className="w-7 h-7 stroke-[1.75]" />
            </div>

            <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] tracking-tight mb-3">
              Check your email
            </h1>

            <p className="text-[14.5px] leading-relaxed text-[#153B28]/80 font-normal mb-8">
              Password reset instructions have been sent to <strong className="font-semibold text-[#153B28]">{email}</strong>.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full bg-[#153B28] text-[#F8F0E2] font-semibold py-4 px-6 rounded-2xl hover:bg-[#1C4A33] transition-all duration-200 active-press shadow-md text-[15px]"
            >
              Back to login
            </button>
          </div>
        ) : (
          /* Form Request View */
          <div>
            <h1 className="font-serif-editorial text-[36px] leading-[1.1] font-normal text-[#153B28] tracking-tight mb-2">
              Forgot your password?
            </h1>
            <p className="text-[14px] leading-relaxed text-[#153B28]/75 font-normal mb-8">
              Enter your email and we'll send you a link to reset your password.
            </p>

            {formError && (
              <div className="mb-6 bg-[#FDF2F0] border border-[#E05345]/30 rounded-2xl p-3.5 text-xs text-[#E05345] font-medium leading-normal flex items-start gap-2.5">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#E05345] mt-1.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
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
                  } rounded-2xl px-4 py-3.5 text-sm text-[#153B28] placeholder-[#153B28]/40 outline-none transition-colors shadow-2xs`}
                />
                {emailError && (
                  <p className="text-xs text-[#E05345] font-medium px-1">{emailError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#153B28] text-[#F8F0E2] font-semibold py-4 px-6 rounded-2xl hover:bg-[#1C4A33] disabled:opacity-70 transition-all duration-200 active-press shadow-md flex items-center justify-center gap-2 text-[15px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#F8F0E2]" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send reset link</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {!isSuccess && (
        <div className="pt-6 text-center text-xs text-[#153B28]/80 font-normal">
          <span>Remembered your password? </span>
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-semibold text-[#153B28] underline underline-offset-2 hover:opacity-80"
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );
};
