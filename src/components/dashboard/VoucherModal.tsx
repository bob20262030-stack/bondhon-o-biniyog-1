import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Deposit } from '../../types';
import { Logo } from '../common/Logo';
import {
  X,
  Download,
  Printer,
  CheckCircle,
  ShieldCheck,
  FileCheck,
  Calendar,
  CreditCard
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate
} from '../../utils/bengali';
import { downloadElementAsJpg, downloadElementAsPdf } from '../../utils/export';
import { GoogleDriveSaveButton } from '../common/GoogleDriveSaveButton';

interface VoucherModalProps {
  isOpen: boolean;
  deposit: Deposit | null;
  onClose: () => void;
}

export const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  deposit,
  onClose
}) => {
  const { settings, members } = useApp();
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !deposit) return null;

  const member = members.find((m) => m.id === deposit.member_id);

  const handleDownloadJpg = async () => {
    setIsExporting(true);
    await downloadElementAsJpg('bob-money-receipt-voucher', `voucher-${deposit.id}.jpg`);
    setIsExporting(false);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await downloadElementAsPdf('bob-money-receipt-voucher', `voucher-${deposit.id}.pdf`);
    setIsExporting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar (Excluded from Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 no-print">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              অফিশিয়াল মানি রিসিট / জমা ভাউচার
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJpg}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="JPG ছবি হিসেবে ডাউনলোড"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JPG ছবি</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="অফিশিয়াল PDF হিসেবে ডাউনলোড"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF ডাউনলোড</span>
            </button>

            <GoogleDriveSaveButton
              elementId="bob-money-receipt-voucher"
              filename={`bob-voucher-${deposit.id}.pdf`}
              format="pdf"
              label="গুগল ড্রাইভে সেভ"
            />

            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="প্রিন্ট করুন"
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

        {/* 
          Official Printable Voucher Sheet 
          White high-contrast paper layout designed for official government cooperative / corporate submission
        */}
        <div className="p-4 sm:p-8 bg-slate-950/40 flex justify-center">
          <div
            id="bob-money-receipt-voucher"
            className="w-full max-w-2xl bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-xl relative border-2 border-slate-300 font-bengali overflow-hidden"
          >
            {/* Watermark in background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none">
              <Logo size="2xl" watermark={true} />
            </div>

            {/* Decorative Gold Header Bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-amber-500 to-emerald-600 -mt-6 -mx-6 mb-6 sm:-mt-10 sm:-mx-10 sm:mb-8" />

            {/* Header: Logo, Organization Name & Subtitle */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-900 pb-5 gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <Logo size="lg" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {settings.brandName}
                  </h2>
                  <p className="text-xs text-amber-700 font-semibold">
                    {settings.slogan}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    রেজিস্টার্ড প্রধান কার্যালয়: গুলশান-২, ঢাকা • হেল্পলাইন: {settings.hotline}
                  </p>
                </div>
              </div>

              {/* Receipt Serial Badge */}
              <div className="text-center sm:text-right shrink-0">
                <div className="inline-block px-3 py-1 bg-slate-900 text-amber-400 font-inter font-bold text-xs rounded-lg uppercase tracking-wider">
                  মানি রিসিট (MONEY RECEIPT)
                </div>
                <div className="text-[11px] text-slate-700 mt-1.5 font-inter">
                  <span className="font-bold">ভাউচার নং:</span> {deposit.id}
                </div>
                <div className="text-[11px] text-slate-600">
                  <span className="font-bold">তারিখ:</span> {formatBengaliDate(deposit.approved_at || deposit.created_at)}
                </div>
              </div>
            </div>

            {/* Member Information Section */}
            <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">সদস্যের নাম:</span>
                <span className="font-bold text-slate-900 text-sm">{deposit.member_name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">সদস্য নিবন্ধন নম্বর (Member ID):</span>
                <span className="font-bold text-blue-900 font-inter text-sm">{deposit.member_id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">মোবাইল নম্বর:</span>
                <span className="text-slate-800 font-inter">{member?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">জমার মাধ্যম (Payment Mode):</span>
                <span className="font-bold text-slate-900">{deposit.payment_method}</span>
              </div>
            </div>

            {/* Financial Particulars Table */}
            <div className="mb-6 overflow-hidden rounded-xl border border-slate-300">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-300">
                  <tr>
                    <th className="p-3">ক্রমিক</th>
                    <th className="p-3">বিবরণ / খাত</th>
                    <th className="p-3">লেনদেন নম্বর (TrxID)</th>
                    <th className="p-3 text-right">মোট পরিমাণ (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-inter">০১</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">
                        {deposit.type === 'monthly'
                          ? `মাসিক সঞ্চয় কিস্তি (${deposit.target_month || 'চলতি মাস'})`
                          : `এককালীন ভূমি শেয়ার বুকিং / বিনিয়োগ (${deposit.target_land_title || 'ভূমি প্রকল্প'})`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {deposit.note || 'সমবায় গঠনতন্ত্র মোতাবেক মূল তহবিলে গৃহীত'}
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-blue-950 font-inter text-xs">
                      {deposit.trx_id}
                    </td>
                    <td className="p-3 text-right font-black text-slate-900 text-sm font-inter">
                      {formatCurrencyBengali(deposit.amount)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-slate-700">
                      সর্বমোট পরিশোধিত অর্থ:
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700 text-base font-inter">
                      {formatCurrencyBengali(deposit.amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Approval Stamp & Signature Block */}
            <div className="pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {/* Depositor acknowledgement */}
              <div className="text-center sm:text-left">
                <div className="h-12 flex items-end justify-center sm:justify-start">
                  <span className="font-serif italic text-slate-700 text-sm">
                    {deposit.member_name}
                  </span>
                </div>
                <div className="border-t border-dashed border-slate-400 pt-1 text-[11px] text-slate-600 font-semibold">
                  জমাকারীর স্বাক্ষর
                </div>
              </div>

              {/* Official Seal / Stamp */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-600 p-1 flex items-center justify-center text-center shadow-inner relative">
                  <div className="w-full h-full rounded-full border border-dashed border-emerald-500 flex flex-col items-center justify-center text-[8px] font-bold text-emerald-800 leading-tight">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mb-0.5" />
                    <span>বন্ধন ও বিনিয়োগ</span>
                    <span className="text-[7px] text-emerald-600">অনুমোদিত সিল</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-1">
                  ✓ VERIFIED & APPROVED
                </span>
              </div>

              {/* Authorized Digital Signature from Admin */}
              <div className="text-center sm:text-right">
                <div className="h-12 flex items-end justify-center sm:justify-end">
                  {settings.authSignature.signatureUrl ? (
                    <img
                      src={settings.authSignature.signatureUrl}
                      alt="Authorized Signature"
                      className="max-h-12 object-contain"
                    />
                  ) : (
                    /* Default Vector Calligraphy Signature */
                    <div className="font-serif italic font-bold text-blue-900 text-lg tracking-wide border-b-2 border-blue-900 px-3">
                      {settings.authSignature.signatoryName || 'সজিব মোল্লা'}
                    </div>
                  )}
                </div>
                <div className="border-t border-dashed border-slate-400 pt-1 text-[11px] text-slate-800 font-bold">
                  {settings.authSignature.signatoryName}
                </div>
                <div className="text-[10px] text-slate-500">
                  {settings.authSignature.designation}
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500">
              * এটি কম্পিউটার জেনারেটেড ও ডিজিটালি অনুমোদিত অফিশিয়াল মানি রিসিট। সমবায়ের কেন্দ্রীয় সার্ভারে সংরক্ষিত রসিদের অনুরূপ।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
