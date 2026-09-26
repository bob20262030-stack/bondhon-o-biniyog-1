import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  X,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Receipt,
  Layers,
  FileText,
  Share2
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate,
  BENGALI_MONTHS
} from '../../utils/bengali';
import { downloadElementAsJpg } from '../../utils/export';
import { GoogleDriveSaveButton } from '../common/GoogleDriveSaveButton';

interface FinancialDetailModalProps {
  isOpen: boolean;
  type: 'paid_monthly' | 'lumpsum' | 'due' | null;
  onClose: () => void;
  onOpenDepositTab?: () => void;
}

export const FinancialDetailModal: React.FC<FinancialDetailModalProps> = ({
  isOpen,
  type,
  onClose,
  onOpenDepositTab
}) => {
  const { currentUser, deposits, settings, getUserDueMonthsCount, getUserDueAmount } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !type || !currentUser) return null;

  // Filter deposits for this user
  const userMonthlyDeposits = deposits.filter(
    (d) => d.member_id === currentUser.id && d.type === 'monthly' && d.status === 'approved'
  );

  const userLumpsumDeposits = deposits.filter(
    (d) => d.member_id === currentUser.id && d.type === 'lumpsum' && d.status === 'approved'
  );

  const dueMonthsCount = getUserDueMonthsCount(currentUser.id);
  const dueAmount = getUserDueAmount(currentUser.id);

  const handleDownloadImage = async () => {
    setIsExporting(true);
    const elementId = `financial-report-card-${type}`;
    const filename = `bob-${type}-statement-${currentUser.id}.jpg`;
    await downloadElementAsJpg(elementId, filename);
    setIsExporting(false);
  };

  const getModalTitle = () => {
    switch (type) {
      case 'paid_monthly':
        return 'পরিশোধিত মাসিক কিস্তির বিস্তারিত হিসাব';
      case 'lumpsum':
        return 'এককালীন জমার বিস্তারিত বিবরণ ও হিসাব';
      case 'due':
        return 'বকেয়া মাসিক কিস্তির পূর্ণাঙ্গ হিসাব বিবরণী';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              {getModalTitle()}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* 
              REQUIREMENT SPEC:
              "পরিশোধিত কিস্তি তে টেপ করলে প্রতি মাসের হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
              "এককালীন জমা তে টেপ করলে এককালীন জমা হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
              "বকেয়া কিস্তি তে টেপ করলে বকেয়া কিস্তি হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
            */}
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'ছবি তৈরি হচ্ছে...' : 'হিসাবের ছবি ডাউনলোড'}</span>
            </button>
            <GoogleDriveSaveButton
              elementId={`financial-report-card-${type}`}
              filename={`bob-${type}-statement-${currentUser.id}.pdf`}
              format="pdf"
              label="গুগল ড্রাইভে সেভ"
            />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable/Exportable Canvas Container */}
        <div
          id={`financial-report-card-${type}`}
          className="p-6 sm:p-8 bg-slate-900 text-slate-100 space-y-6"
        >
          {/* Header Card Brand Banner for Image Export */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <Logo size="md" />
              <div>
                <h4 className="text-base font-extrabold text-white">
                  {settings.brandName}
                </h4>
                <p className="text-xs text-amber-400">{settings.slogan}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">তারিখ:</span>
              <span className="text-xs text-slate-200 font-inter">
                {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>
          </div>

          {/* Member Identity Strip */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">সদস্যের নাম:</span>
              <span className="font-bold text-white text-sm">{currentUser.full_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">সদস্য আইডি:</span>
              <span className="font-bold text-amber-400 font-inter text-sm">{currentUser.id}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">মোবাইল নম্বর:</span>
              <span className="text-slate-200 font-inter">{currentUser.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">মাসিক টার্গেট:</span>
              <span className="font-bold text-emerald-400 font-inter">
                {formatCurrencyBengali(currentUser.monthly_target)}
              </span>
            </div>
          </div>

          {/* Content Case 1: Paid Monthly Installments */}
          {type === 'paid_monthly' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  মোট পরিশোধিত কিস্তির সংখ্যা: {toBengaliNumber(userMonthlyDeposits.length)}টি
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  সর্বমোট: {formatCurrencyBengali(
                    userMonthlyDeposits.reduce((acc, d) => acc + d.amount, 0)
                  )}
                </span>
              </div>

              {userMonthlyDeposits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800">
                  এখনো কোনো মাসিক কিস্তি পরিশোধিত হিসেবে রেকর্ড করা হয়নি।
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">মাস</th>
                        <th className="p-3">পরিমাণ</th>
                        <th className="p-3">পদ্ধতি ও TrxID</th>
                        <th className="p-3">অনুমোদনের তারিখ</th>
                        <th className="p-3">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {userMonthlyDeposits.map((dep) => (
                        <tr key={dep.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{dep.target_month || 'নিয়মিত কিস্তি'}</span>
                          </td>
                          <td className="p-3 font-bold text-emerald-400 font-inter">
                            {formatCurrencyBengali(dep.amount)}
                          </td>
                          <td className="p-3 text-slate-300">
                            <div>{dep.payment_method}</div>
                            <div className="text-[10px] text-slate-500 font-inter">{dep.trx_id}</div>
                          </td>
                          <td className="p-3 text-slate-400 font-inter">
                            {dep.approved_at || dep.created_at}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              অনুমোদিত
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Content Case 2: Lumpsum Deposits */}
          {type === 'lumpsum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  এককালীন জমা রেকর্ড: {toBengaliNumber(userLumpsumDeposits.length)}টি
                </span>
                <span className="text-sm font-bold text-blue-400">
                  সর্বমোট এককালীন: {formatCurrencyBengali(
                    userLumpsumDeposits.reduce((acc, d) => acc + d.amount, 0)
                  )}
                </span>
              </div>

              {userLumpsumDeposits.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-950/50 rounded-2xl border border-slate-800">
                  এখনো কোনো এককালীন বিনিয়োগ জমা নেই।
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">প্রকল্পের নাম</th>
                        <th className="p-3">পরিমাণ</th>
                        <th className="p-3">পদ্ধতি ও TrxID</th>
                        <th className="p-3">অনুমোদনের তারিখ</th>
                        <th className="p-3">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                      {userLumpsumDeposits.map((dep) => (
                        <tr key={dep.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-white">
                            {dep.target_land_title || 'ভূমি শেয়ার বরাদ্দ'}
                          </td>
                          <td className="p-3 font-bold text-blue-400 font-inter">
                            {formatCurrencyBengali(dep.amount)}
                          </td>
                          <td className="p-3 text-slate-300">
                            <div>{dep.payment_method}</div>
                            <div className="text-[10px] text-slate-500 font-inter">{dep.trx_id}</div>
                          </td>
                          <td className="p-3 text-slate-400 font-inter">
                            {dep.approved_at || dep.created_at}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              অনুমোদিত
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Content Case 3: Due Installments */}
          {type === 'due' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      বকেয়া কিস্তির পরিমাণ: {toBengaliNumber(dueMonthsCount)} মাস
                    </h4>
                    <p className="text-xs text-slate-300">
                      সদস্যপদ সক্রিয় রাখতে এবং জরিমানামুক্ত থাকতে দ্রুত পরিশোধ করুন
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">মোট বকেয়া অর্থ:</span>
                  <span className="text-base font-extrabold text-rose-400 font-inter">
                    {formatCurrencyBengali(dueAmount)}
                  </span>
                </div>
              </div>

              {/* Due Months Schedule Breakdown */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  মাসিক কিস্তির স্ট্যাটাস পর্যবেক্ষণ (২০২৬):
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BENGALI_MONTHS.slice(0, 4).map((mName) => {
                    const isPaid = userMonthlyDeposits.some((d) => d.target_month === mName);
                    return (
                      <div
                        key={mName}
                        className={`p-3 rounded-xl border flex flex-col justify-between ${
                          isPaid
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <span className="text-xs font-bold">{mName}</span>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40 text-[11px]">
                          <span>{isPaid ? 'পরিশোধিত' : 'বকেয়া'}</span>
                          <span className="font-bold">
                            {formatCurrencyBengali(currentUser.monthly_target)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {dueMonthsCount > 0 && onOpenDepositTab && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDepositTab();
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                  >
                    বকেয়া কিস্তি এখনই জমা দিন
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Verification Watermark & Signature Stamp on the card */}
          <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="text-[11px] text-slate-500">
                এই হিসাবপত্রটি সমবায়ের মূল সেন্ট্রাল ডাটাবেস থেকে স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত।
              </p>
              <p className="text-[11px] text-amber-400/80">
                যেকোনো সমন্বয়ে যোগাযোগ: {settings.hotline}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-300">
                {settings.authSignature.signatoryName}
              </div>
              <div className="text-[10px] text-slate-500">
                {settings.authSignature.designation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
