import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { CameraCaptureModal } from '../common/CameraCaptureModal';
import { TermsModal } from '../common/TermsModal';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Camera,
  Coins,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/bengali';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose
}) => {
  const { login, signup, switchUser, settings } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(5000); // Default 5,000 (minimum 1,000)
  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  
  // Modals state
  const [cameraOpen, setCameraOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  
  // Alerts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate minimum monthly savings target: strictly minimum 1,000 BDT
    if (monthlyTarget < 1000) {
      setErrorMsg('মাসিক সঞ্চয় টার্গেট সর্বনিম্ন ১,০০০ টাকা হতে হবে।');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('অনুগ্রহ করে সমবায়ের গঠনতন্ত্র ও শর্তাবলিতে সম্মতি দিন।');
      return;
    }

    const defaultAvatar =
      avatarBase64 ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

    const res = signup({
      full_name: fullName,
      email,
      phone,
      password: password || '123456',
      avatar: defaultAvatar,
      monthly_target: monthlyTarget
    });

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    switchUser(demoEmail);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Header with Unified Logo */}
          <div className="p-6 bg-gradient-to-b from-slate-800/60 to-transparent border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {mode === 'login' ? 'সদস্য পোর্টালে প্রবেশ' : 'নতুন সদস্য নিবন্ধন'}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {settings.brandName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Demo Switcher Strip */}
          <div className="bg-slate-950/70 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              তাৎক্ষণিক ডেমো প্রবেশ:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => fillDemo('admin@bob.com', 'admin123')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition cursor-pointer"
              >
                এডমিন (Admin)
              </button>
              <button
                type="button"
                onClick={() => fillDemo('sajib@bob.com', 'member123')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition cursor-pointer"
              >
                সক্রিয় সদস্য
              </button>
              <button
                type="button"
                onClick={() => fillDemo('rahim@bob.com', 'member123')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition cursor-pointer"
              >
                পেন্ডিং সদস্য
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Mode Toggle Tabs */}
            <div className="flex bg-slate-950 p-1 rounded-2xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                লগইন (Sign In)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                নতুন রেজিস্ট্রেশন (Sign Up)
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ইউজার আইডি / ইমেইল অ্যাড্রেস
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@bob.com অথবা আপনার ইমেইল"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  পোর্টালে প্রবেশ করুন
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-slate-900 px-3 text-slate-400">
                      অথবা গুগল ড্রাইভ সংযোগ
                    </span>
                  </div>
                </div>

                <GoogleSignInButton className="w-full" />
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* Live Camera Snapshot Section */}
                <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center shrink-0">
                      {avatarBase64 ? (
                        <img
                          src={avatarBase64}
                          alt="Captured"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-7 h-7 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        সদস্যের লাইভ ছবি (ক্যামেরা)
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {avatarBase64 ? '✓ ছবি ক্যাপচার সম্পন্ন' : 'সরাসরি ওয়েবক্যাম দিয়ে ছবি তুলুন'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{avatarBase64 ? 'ছবি বদলান' : 'ছবি তুলুন'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      পূর্ণ নাম
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="মোঃ আব্দুল্লাহ"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712-XXXXXX"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 font-inter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      ইমেইল (ইউজার আইডি)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 
                  REQUIREMENT SPEC:
                  "সাইন ইন পেইজে মাসিক সঞ্চয় টার্গেট সর্বনিম্ন 1000 টাকা হবে।"
                */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>মাসিক সঞ্চয় টার্গেট (টাকা)</span>
                    </label>
                    <span className="text-[11px] text-amber-400 font-bold">
                      সর্বনিম্ন ১,০০০ ৳
                    </span>
                  </div>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    required
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-amber-500 font-inter"
                  />
                  {monthlyTarget < 1000 && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      * সঞ্চয় টার্গেট অবশ্যই ১,০০০ টাকা বা তার বেশি হতে হবে।
                    </p>
                  )}
                </div>

                {/* Enforced Terms checkbox / modal trigger */}
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => {
                        if (!termsAccepted) {
                          setTermsModalOpen(true);
                        } else {
                          setTermsAccepted(e.target.checked);
                        }
                      }}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer">
                      আমি সমবায়ের{' '}
                      <button
                        type="button"
                        onClick={() => setTermsModalOpen(true)}
                        className="text-amber-400 underline font-semibold hover:text-amber-300"
                      >
                        শর্তাবলি ও গঠনতন্ত্র
                      </button>{' '}
                      মেনে নিচ্ছি
                    </label>
                  </div>
                  {termsAccepted && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ✓ অনুমোদিত
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={monthlyTarget < 1000 || !termsAccepted}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  নিবন্ধন সম্পন্ন করুন
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(photo) => setAvatarBase64(photo)}
      />

      {/* Enforced Scroll-to-Bottom Terms Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={() => setTermsAccepted(true)}
      />
    </>
  );
};
