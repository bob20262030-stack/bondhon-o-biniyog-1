import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Check, X, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  const { settings } = useApp();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setHasScrolledToBottom(false);
    }
  }, [isOpen]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // Allow small 15px threshold
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                সমবায় গঠনতন্ত্র ও সদস্যপদ নীতিমালা
              </h3>
              <p className="text-xs text-amber-400">
                {settings.brandName} • বিধিবদ্ধ নিয়মাবলি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-bengali"
        >
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
            <ArrowDown className="w-4 h-4 shrink-0 animate-bounce" />
            <span>
              সম্মতি বোতামটি সক্রিয় করতে অনুগ্রহ করে নীতিমালার সম্পূর্ণ বিবরণ শেষ পর্যন্ত স্ক্রল করে পড়ুন।
            </span>
          </div>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm sm:text-base border-b border-slate-800 pb-1">
              ১. লক্ষ্য ও উদ্দেশ্য
            </h4>
            <p>
              ‘বন্ধন ও বিনিয়োগ’ একটি যৌথ সমবায় ও ভূমি বিনিয়োগ কার্যক্রম। এর মূল উদ্দেশ্য সদস্যদের নিয়মিত ক্ষুদ্র সঞ্চয়কে একীভূত করে নিষ্কণ্টক, সম্ভাবনাময় এবং সাব-কবলা দলিলযুক্ত ভূমি ক্রয়ের মাধ্যমে নিরাপদ ভবিষ্যৎ নিশ্চিত করা।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm sm:text-base border-b border-slate-800 pb-1">
              ২. মাসিক কিস্তি ও সঞ্চয় নিয়মাবলি
            </h4>
            <p>
              (ক) প্রত্যেক সক্রিয় সদস্যকে প্রতি ক্যালেন্ডার মাসের ১০ তারিখের মধ্যে নির্ধারিত সঞ্চয় টার্গেট (সর্বনিম্ন ১,০০০ টাকা) ব্যাংক একাউন্ট বা অনুমোদিত মোবাইল ব্যাংকিংয়ের মাধ্যমে জমা দিতে হবে।
            </p>
            <p>
              (খ) টানা তিন কিস্তি বকেয়া থাকলে সংশ্লিষ্ট সদস্যের প্রোফাইলে স্বয়ংক্রিয় সতর্কবার্তা যাবে এবং পরিচালনা পর্ষদের সিদ্ধান্ত অনুযায়ী সদস্যপদ সাময়িক স্থগিত হতে পারে।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm sm:text-base border-b border-slate-800 pb-1">
              ৩. শেয়ার ও ভূমি বণ্টন
            </h4>
            <p>
              (ক) প্রকল্পের প্রতিটি শেয়ারের মূল্য এবং মোট শেয়ার সংখ্যা প্রকল্প ঘোষণার সময় উন্মুক্ত থাকবে। শেয়ারহোল্ডারগণ তাদের জমাকৃত মূলধনের ভিত্তিতে আনুপাতিক হারে যৌথ সাব-কবলা রেজিস্ট্রির অংশীদার হবেন।
            </p>
            <p>
              (খ) যে কোনো ভূমি ক্রয় বা বিক্রয়ের প্রস্তাব আসলে সকল সাধারণ সদস্যের জন্য স্বচ্ছ পোলিং বা ভোটিং প্রক্রিয়া চালু করা হবে এবং সংখ্যাগরিষ্ঠ মতামতের ভিত্তিতে চূড়ান্ত চুক্তি সম্পাদিত হবে।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm sm:text-base border-b border-slate-800 pb-1">
              ৪. স্বচ্ছতা ও রসিদ
            </h4>
            <p>
              প্রতিটি জমার বিপরীতে অ্যাডমিন কর্তৃক ডিজিটাল স্বাক্ষর ও অনুমোদিত সিল সংবলিত মানি রিসিট ও ভাউচার পোর্টাল থেকে ডাউনলোডযোগ্য থাকবে।
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm sm:text-base border-b border-slate-800 pb-1">
              ৫. সদস্যপদ প্রত্যাহার ও অর্থ ফেরত
            </h4>
            <p>
              কোনো সদস্য সমবায় থেকে পদত্যাগ করতে চাইলে ন্যূনতম ৩ মাস পূর্বে লিখিত আবেদন করতে হবে। চলমান ভূমি প্রকল্পের হিসাব সমন্বয় সাপেক্ষে বিধি মোতাবেক জমাকৃত আসল অর্থ ফেরত প্রদান করা হবে।
            </p>
          </section>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs">
            ✓ আপনি নীতিমালার শেষ প্রান্তে পৌঁছেছেন। এখন নিচের বোতামটি চেপে সম্মতি প্রদান করতে পারেন।
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            {hasScrolledToBottom ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> সম্পূর্ণ পাঠ সম্পন্ন হয়েছে
              </span>
            ) : (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" /> নিচে স্ক্রল করুন
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              onClick={() => {
                if (hasScrolledToBottom) {
                  onAccept();
                  onClose();
                }
              }}
              disabled={!hasScrolledToBottom}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                hasScrolledToBottom
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>আমি সকল শর্ত মেনে নিচ্ছি</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
