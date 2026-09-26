import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Clock, Gift } from 'lucide-react';

interface PromoBannerProps {
  onActionClick: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onActionClick }) => {
  const { settings } = useApp();
  const offer = settings.promoOffer;

  if (!offer || !offer.enabled) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
      {/* Background ambient decorative shapes */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Gift className="w-3.5 h-3.5" />
            <span>{offer.badge}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
            {offer.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-bengali">
            {offer.description}
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-amber-400 font-semibold font-inter">
            <Clock className="w-4 h-4" />
            <span>{offer.deadline}</span>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={onActionClick}
            className="group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition cursor-pointer"
          >
            <span>{offer.btnText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
