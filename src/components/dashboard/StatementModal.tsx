import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate
} from '../../utils/bengali';
import { downloadElementAsJpg, downloadElementAsPdf } from '../../utils/export';
import { GoogleDriveSaveButton } from '../common/GoogleDriveSaveButton';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentUser, deposits, settings } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !currentUser) return null;

  // Get all approved deposits for this member sorted by date
  const memberDeposits = deposits
    .filter((d) => d.member_id === currentUser.id && d.status === 'approved')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const totalMonthly = memberDeposits
    .filter((d) => d.type === 'monthly')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalLumpsum = memberDeposits
    .filter((d) => d.type === 'lumpsum')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalGrand = totalMonthly + totalLumpsum;

  const handleDownloadJpg = async () => {
    setIsExporting(true);
    await downloadElementAsJpg('bob-ledger-statement', `bob-ledger-${currentUser.id}.jpg`);
    setIsExporting(false);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await downloadElementAsPdf('bob-ledger-statement', `bob-ledger-${currentUser.id}.pdf`);
    setIsExporting(false);
  };

  let runningBalance = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 no-print">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              পূর্ণাঙ্গ সদস্য অ্যাকাউন্ট লেজার ও স্টেটমেন্ট
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JPG ছবি</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF ডাউনলোড</span>
            </button>

            <GoogleDriveSaveButton
              elementId="bob-ledger-statement"
              filename={`bob-ledger-${currentUser.id}.pdf`}
              format="pdf"
              label="গুগল ড্রাইভে সেভ"
            />

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Statement Sheet */}
        <div className="p-4 sm:p-8 bg-slate-950/40 flex justify-center">
          <div
            id="bob-ledger-statement"
            className="w-full max-w-3xl bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-300 font-bengali relative"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <Logo size="lg" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {settings.brandName}
                  </h2>
                  <p className="text-xs text-amber-700 font-semibold">{settings.slogan}</p>
                  <p className="text-[11px] text-slate-600">
                    হটলাইন: {settings.hotline} • কেন্দ্রীয় অফিস: গুলশান-২, ঢাকা
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="inline-block px-3 py-1 bg-blue-900 text-white font-inter font-bold text-xs rounded-lg uppercase">
                  অফিশিয়াল লেজার স্টেটমেন্ট
                </span>
                <div className="text-xs text-slate-600 mt-1">
                  তারিখ: {new Date().toLocaleDateString('en-GB')}
                </div>
              </div>
            </div>

            {/* Member Profile Summary Strip */}
            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">সদস্যের নাম:</span>
                <span className="font-bold text-slate-900 text-sm">{currentUser.full_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">সদস্য আইডি (Member ID):</span>
                <span className="font-bold text-blue-900 font-inter text-sm">{currentUser.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">যোগদানের তারিখ:</span>
                <span className="text-slate-800 font-inter">{currentUser.joined_date}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">মালিকানাধীন শেয়ার:</span>
                <span className="font-bold text-amber-700 text-sm">
                  {toBengaliNumber(currentUser.owned_shares)} টি
                </span>
              </div>
            </div>

            {/* Financial Highlights */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[10px] text-blue-700 font-bold block">মাসিক কিস্তি সঞ্চয়</span>
                <span className="text-sm sm:text-base font-extrabold text-blue-900 font-inter">
                  {formatCurrencyBengali(totalMonthly)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[10px] text-amber-700 font-bold block">এককালীন জমা</span>
                <span className="text-sm sm:text-base font-extrabold text-amber-900 font-inter">
                  {formatCurrencyBengali(totalLumpsum)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[10px] text-emerald-700 font-bold block">সর্বমোট সঞ্চিত মূলধন</span>
                <span className="text-sm sm:text-base font-extrabold text-emerald-900 font-inter">
                  {formatCurrencyBengali(totalGrand)}
                </span>
              </div>
            </div>

            {/* Ledger Transactions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-300 mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-300">
                  <tr>
                    <th className="p-2.5">তারিখ</th>
                    <th className="p-2.5">ভাউচার নং</th>
                    <th className="p-2.5">খাত / বিবরণ</th>
                    <th className="p-2.5">মাধ্যম ও TrxID</th>
                    <th className="p-2.5 text-right">জমা (BDT)</th>
                    <th className="p-2.5 text-right">সর্বমোট ব্যালেন্স</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {memberDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        এখনো কোনো অনুমোদিত লেনদেন রেকর্ড নেই।
                      </td>
                    </tr>
                  ) : (
                    memberDeposits.map((dep) => {
                      runningBalance += dep.amount;
                      return (
                        <tr key={dep.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-inter text-slate-700 whitespace-nowrap">
                            {dep.approved_at || dep.created_at}
                          </td>
                          <td className="p-2.5 font-mono text-blue-900 font-inter font-bold whitespace-nowrap">
                            {dep.id}
                          </td>
                          <td className="p-2.5 font-semibold text-slate-900">
                            {dep.type === 'monthly'
                              ? `মাসিক কিস্তি (${dep.target_month || 'নিয়মিত'})`
                              : `এককালীন জমা (${dep.target_land_title || 'ভূমি বরাদ্দ'})`}
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {dep.payment_method} - <span className="font-mono text-[11px]">{dep.trx_id}</span>
                          </td>
                          <td className="p-2.5 text-right font-bold text-emerald-700 font-inter whitespace-nowrap">
                            +{formatCurrencyBengali(dep.amount)}
                          </td>
                          <td className="p-2.5 text-right font-black text-slate-900 font-inter whitespace-nowrap">
                            {formatCurrencyBengali(runningBalance)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Official Signature Footprint */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-800">
                  বন্ধন ও বিনিয়োগ সমবায় সমিতি
                </p>
                <p className="text-[10px] text-slate-500">
                  নিরীক্ষিত হিসাব শাখা • সেন্ট্রাল অ্যাকাউন্টস
                </p>
              </div>

              <div className="text-right">
                <div className="h-10 flex items-end justify-end">
                  {settings.authSignature.signatureUrl ? (
                    <img
                      src={settings.authSignature.signatureUrl}
                      alt="Signature"
                      className="max-h-10 object-contain"
                    />
                  ) : (
                    <span className="font-serif italic font-bold text-blue-900 text-base">
                      {settings.authSignature.signatoryName}
                    </span>
                  )}
                </div>
                <p className="border-t border-dashed border-slate-400 pt-1 text-[11px] font-bold text-slate-900">
                  {settings.authSignature.signatoryName}
                </p>
                <p className="text-[10px] text-slate-500">
                  {settings.authSignature.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
