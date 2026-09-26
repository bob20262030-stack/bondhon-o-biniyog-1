import React from 'react';
import { useGoogleDrive } from '../../context/GoogleDriveContext';
import { Cloud, CheckCircle, LogOut } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  className = '',
  compact = false
}) => {
  const { googleUser, isConnected, isAuthenticating, connectGoogleDrive, disconnectGoogleDrive } =
    useGoogleDrive();

  const handleSignIn = async () => {
    try {
      const token = await connectGoogleDrive();
      if (token && onSuccess) onSuccess();
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        return;
      }
      console.error('Google sign in error:', err);
    }
  };

  if (isConnected && googleUser) {
    if (compact) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate max-w-[120px] font-inter text-[11px]">
            {googleUser.email}
          </span>
          <button
            onClick={disconnectGoogleDrive}
            title="গুগল ড্রাইভ সংযোগ বিচ্ছিন্ন করুন"
            className="text-slate-400 hover:text-red-400 ml-1 transition cursor-pointer"
          >
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 text-emerald-200">
        <div className="flex items-center gap-2.5 min-w-0">
          {googleUser.photoURL ? (
            <img
              src={googleUser.photoURL}
              alt={googleUser.displayName || 'Google User'}
              className="w-8 h-8 rounded-full border border-emerald-500/50"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-300">
              <Cloud className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Google Drive সংযুক্ত</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate font-inter">
              {googleUser.email}
            </p>
          </div>
        </div>
        <button
          onClick={disconnectGoogleDrive}
          className="text-xs text-slate-400 hover:text-red-400 px-2.5 py-1 rounded-lg hover:bg-slate-800/80 transition cursor-pointer"
        >
          সংযোগ বিচ্ছিন্ন
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isAuthenticating}
      type="button"
      className={`relative inline-flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 font-medium text-xs sm:text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {/* Official Google 'G' Multi-Color Logo */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
      <span>
        {isAuthenticating ? 'সংযোগ হচ্ছে...' : 'Sign in with Google (Google Drive)'}
      </span>
    </button>
  );
};
