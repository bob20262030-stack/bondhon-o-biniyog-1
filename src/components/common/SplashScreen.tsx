import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { settings, dismissSplash } = useApp();
  const [progress, setProgress] = useState<number>(0);
  const totalDuration = 5000; // 5 seconds
  const intervalTime = 50;

  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(currentProgress);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        dismissSplash();
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [dismissSplash]);

  const remainingSeconds = Math.max(0, Math.ceil((100 - progress) / 20));

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 overflow-hidden text-white select-none">
      {/* Dynamic ambient pulsing lights */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center animate-in fade-in zoom-in duration-700">
        {/* Glowing Logo Frame */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-500 rounded-3xl blur-xl opacity-70 animate-pulse" />
          <div className="relative p-2 bg-slate-900 rounded-3xl border border-slate-700/80 shadow-2xl">
            <Logo size="2xl" />
          </div>
        </div>

        {/* Title & Slogan */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>স্মার্ট ভূমি সমবায় বিনিয়োগ প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow">
            {settings.brandName}
          </h1>

          <p className="text-base sm:text-lg font-medium text-amber-400">
            {settings.slogan}
          </p>

          <p className="text-xs text-slate-400 pt-1">
            স্বচ্ছতা, নিষ্কণ্টক জমি ও নিরাপদ যৌথ সঞ্চয়
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-inter">
            <span>লোড হচ্ছে...</span>
            <span className="text-amber-400 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-75 ease-linear shadow-sm shadow-amber-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-inter">
            স্বয়ংক্রিয় প্রবেশ {remainingSeconds} সেকেন্ডে
          </p>
        </div>

        {/* Skip Button */}
        <button
          onClick={dismissSplash}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white text-sm font-medium transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>সরাসরি প্রবেশ করুন</span>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-4 text-center text-[11px] text-slate-500">
        ব্যবস্থাপনায়— {settings.managerName} | © 2026 বন্ধন ও বিনিয়োগ
      </div>
    </div>
  );
};
