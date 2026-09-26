import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { PhoneCall, MapPin, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setCurrentTab } = useApp();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Slogan */}
          <div className="space-y-4">
            <Logo size="lg" showText={true} />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-bengali">
              বন্ধন ও বিনিয়োগ সমবায় — আপনার ক্ষুদ্র মাসিক সঞ্চয়কে যৌথ বিনিয়োগের মাধ্যমে সুনিশ্চিত মূল্যবান ভূমিতে রূপান্তরের নিরাপদ ও স্বচ্ছ বিশ্বস্ত অংশীদার।
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% নিষ্কণ্টক সাব-কবলা দলিল চুক্তি</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              প্রয়োজনীয় লিংক
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('projects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  চলমান ভূমি প্রকল্পসমূহ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('marketplace');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  ভূমি মার্কেটপ্লেস ও ক্রয়-বিক্রয়
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('polling');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  সদস্য মতামত ও পোলিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentTab('directors');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition cursor-pointer"
                >
                  পরিচালনা পর্ষদ ও নেতৃত্ব
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              সরাসরি যোগাযোগ ও সহায়তা
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">জরুরি হটলাইন:</span>
                  <a
                    href={`tel:${settings.hotline}`}
                    className="font-bold text-amber-400 hover:text-amber-300 font-inter text-sm"
                  >
                    {settings.hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">সহায়তা সময়সূচি:</span>
                  <span className="text-slate-200">{settings.supportHours}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs">
                  প্রধান কার্যালয়: বাড়ি # ১২, রোড # ৪, গুলশান-২, ঢাকা-১২১২
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Official Accounts & Manager Badge */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-2">
              অফিশিয়াল পেমেন্ট গেটওয়ে
            </h4>
            <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-300 font-semibold flex items-center justify-between">
                <span>{settings.paymentInfo.bank.bankName}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-inter">
                হিসাব নং: {settings.paymentInfo.bank.accountNumber}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-amber-400 font-inter">
                <span>বিকাশ/নগদ: {settings.paymentInfo.mobile.bkash.split(' ')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Centered Manager Badge as requested in brief */}
        <div className="flex flex-col items-center justify-center pt-8 pb-4 border-t border-slate-800/60 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-900/50 via-slate-900 to-amber-900/50 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold shadow-md">
            <Heart className="w-4 h-4 text-rose-500 animate-pulse fill-rose-500" />
            <span>ব্যবস্থাপনায়— {settings.managerName}</span>
            <span className="text-[10px] text-slate-400 font-normal">({settings.managerTitle})</span>
          </div>

          {/* Copyright line as strictly required:
              "© 2026 বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)। সর্বস্বত্ব সংরক্ষিত।"
          */}
          <p className="text-xs text-slate-500 mt-4">
            © 2026 বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
};
