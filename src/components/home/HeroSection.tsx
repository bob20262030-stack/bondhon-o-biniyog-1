import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  PhoneCall,
  Coins,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali
} from '../../utils/bengali';

interface HeroSectionProps {
  onJoinClick: () => void;
  onExploreProjects: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onJoinClick,
  onExploreProjects
}) => {
  const { settings, totalApprovedCapital, members } = useApp();

  const targetCapital = settings.targetCapital || 10000000;
  const progressPct = Math.min(100, Math.round((totalApprovedCapital / targetCapital) * 100));
  const activeMembersCount = members.filter((m) => m.status === 'active').length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 sm:p-12 shadow-2xl">
      {/* Background ambient glowing orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Vision & CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-blue-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.slogan}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            স্বচ্ছ যৌথ সঞ্চয়ে{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              নিশ্চিত স্থায়ী ভূমির
            </span>{' '}
            মালিকানা
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-bengali max-w-xl mx-auto lg:mx-0">
            ‘বন্ধন ও বিনিয়োগ’ সমবায়ের মাধ্যমে আপনার ক্ষুদ্র নিয়মিত সঞ্চয় রূপান্তরিত হোক নিশ্চিত সাব-কবলা রেজিস্ট্রির মূল্যবান জমিতে। কোনো মধ্যস্বত্বভোগী নেই, নেই কোনো লুকানো শর্ত।
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onJoinClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>সদস্যপদ নিন / সঞ্চয় শুরু করুন</span>
            </button>

            <button
              onClick={onExploreProjects}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-700 hover:border-slate-600 transition flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>ভূমি প্রকল্পসমূহ</span>
            </button>
          </div>

          {/* 
            REQUIREMENT SPEC:
            "যোগাযোগ ও সরাসরি কল (Call CTA) এ্যাডমিন েপেনেল থেকে পরিবর্তন করা যাবে"
          */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-xs">
            <a
              href={`tel:${settings.hotline}`}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold transition group"
            >
              <div className="p-1 rounded-lg bg-emerald-500 text-slate-950 group-hover:scale-110 transition-transform">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-left font-inter">
                <span className="block text-[10px] text-emerald-400/90 font-bengali font-normal">
                  {settings.callBtnText}:
                </span>
                <span>{settings.hotline}</span>
              </div>
            </a>

            <div className="text-slate-400 text-[11px] text-center sm:text-left">
              <span className="block text-slate-300 font-semibold">সহায়তা সময়সূচি:</span>
              <span>{settings.supportHours}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Capital Counter Gauge */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <span>লাইভ সমবায় মূলধন তহবিল</span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
                স্বয়ংক্রিয় হালনাগাদ
              </span>
            </div>

            {/* Big Capital Counter */}
            <div>
              <span className="text-xs text-slate-400 block mb-1">
                সর্বমোট অনুমোদিত সঞ্চিত মূলধন:
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-inter">
                {formatCurrencyBengali(totalApprovedCapital)}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                <span>লক্ষ্যমাত্রা মূলধন:</span>
                <span className="font-bold text-amber-400 font-inter">
                  {formatCurrencyBengali(targetCapital)}
                </span>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-inter">
                <span className="text-slate-400">লক্ষ্যমাত্রা অর্জিত:</span>
                <span className="font-bold text-amber-400">
                  {toBengaliNumber(progressPct)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400 transition-all duration-700 shadow-sm"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Quick Stat Pill Widgets */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-slate-400 block text-[10px]">সক্রিয় সদস্য</span>
                <span className="font-bold text-white text-sm font-inter">
                  {toBengaliNumber(activeMembersCount)} জন
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-slate-400 block text-[10px]">আইনি সত্যতা</span>
                <span className="font-bold text-emerald-400 text-xs">
                  ১০০% নিষ্কণ্টক
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
