import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali
} from '../../utils/bengali';

export const RoiCalculator: React.FC = () => {
  const [initialAmount, setInitialAmount] = useState<number>(150000); // 1.5 Lakh default
  const [years, setYears] = useState<number>(3); // 3 years default
  const [annualGrowthRate, setAnnualGrowthRate] = useState<number>(25); // 25% annual appreciation typical for growth lands

  // Compound land value calculation: A = P * (1 + r)^t
  const futureValue = Math.round(
    initialAmount * Math.pow(1 + annualGrowthRate / 100, years)
  );
  const totalProfit = futureValue - initialAmount;
  const totalReturnPct = Math.round((totalProfit / initialAmount) * 100);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Interactive Controls */}
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>ভূমি মূল্যবৃদ্ধি ও মুনাফা সিমুলেটর</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ইন্টারেক্টিভ জমি বিনিয়োগ ও ভবিষ্যৎ মূল্যায়ন ক্যালকুলেটর
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              সমবায়ের মাধ্যমে নিষ্কণ্টক জমি ক্রয়ে সময়ের সাথে আপনার মূলধনের সম্ভাব্য প্রবৃদ্ধি হিসাব করুন।
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Investment Amount Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300">
                  বিনিয়োগের পরিমাণ (টাকা):
                </span>
                <span className="font-black text-amber-400 font-inter text-sm">
                  {formatCurrencyBengali(initialAmount)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={25000}
                value={initialAmount}
                onChange={(e) => setInitialAmount(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-inter">
                <span>৫০,০০০ ৳</span>
                <span>১০,০০,০০০ ৳</span>
                <span>২০,০০,০০০ ৳</span>
              </div>
            </div>

            {/* Time Horizon Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300">
                  বিনিয়োগের সময়কাল:
                </span>
                <span className="font-black text-blue-400 font-inter text-sm">
                  {toBengaliNumber(years)} বছর
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-inter">
                <span>১ বছর</span>
                <span>৫ বছর</span>
                <span>১০ বছর</span>
              </div>
            </div>

            {/* Estimated Annual Growth Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-300">
                  আনুমানিক বার্ষিক ভূমি মূল্যায়ন হার:
                </span>
                <span className="font-black text-emerald-400 font-inter text-sm">
                  {toBengaliNumber(annualGrowthRate)}% / বছর
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={40}
                step={5}
                value={annualGrowthRate}
                onChange={(e) => setAnnualGrowthRate(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-inter">
                <span>১০% (সাধারণ)</span>
                <span>২৫% (মহাসড়ক সংলগ্ন)</span>
                <span>৪০% (মেগা প্রজেক্ট)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Projection Card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-inner">
          <div className="text-center pb-4 border-b border-slate-800/80">
            <span className="text-xs font-semibold text-slate-400 block mb-1">
              {toBengaliNumber(years)} বছর পর আনুমানিক ভবিষ্যৎ বাজারমূল্য
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-inter">
              {formatCurrencyBengali(futureValue)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">মূল বিনিয়োগ:</span>
              <span className="font-bold text-white font-inter text-sm">
                {formatCurrencyBengali(initialAmount)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">আনুমানিক মুনাফা:</span>
              <span className="font-black text-amber-400 font-inter text-sm">
                +{formatCurrencyBengali(totalProfit)}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-emerald-300">
                সম্ভাব্য মোট রিটার্ন (ROI):
              </span>
            </div>
            <span className="text-lg font-black text-emerald-400 font-inter">
              +{toBengaliNumber(totalReturnPct)}%
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              * পূর্ববর্তী ৫ বছরের ঢাকার আশেপাশের সমবায় জমির বাজারদর ও মেগা প্রকল্প এলাকার বাস্তব প্রবৃদ্ধির ভিত্তিতে এই সিমুলেশন মডেল প্রস্তুত করা হয়েছে।
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
