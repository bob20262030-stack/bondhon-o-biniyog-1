import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DepositType, PaymentMethod, Deposit } from '../../types';
import { FinancialDetailModal } from './FinancialDetailModal';
import { VoucherModal } from './VoucherModal';
import { StatementModal } from './StatementModal';
import { PollingSection } from './PollingSection';
import {
  Wallet,
  TrendingUp,
  AlertCircle,
  Receipt,
  FileSpreadsheet,
  Coins,
  Send,
  Upload,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  MapPin,
  ChevronRight,
  Vote,
  Sparkles,
  Info
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate,
  BENGALI_MONTHS
} from '../../utils/bengali';

export const MemberDashboard: React.FC = () => {
  const {
    currentUser,
    deposits,
    landProjects,
    settings,
    submitDeposit,
    getUserMonthlyPaidTotal,
    getUserLumpsumPaidTotal,
    getUserDueMonthsCount,
    getUserDueAmount
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'history' | 'polls'>('overview');

  // Modals state
  const [detailModalType, setDetailModalType] = useState<'paid_monthly' | 'lumpsum' | 'due' | null>(null);
  const [selectedVoucherDeposit, setSelectedVoucherDeposit] = useState<Deposit | null>(null);
  const [statementOpen, setStatementOpen] = useState(false);

  // New Deposit Form State
  const [depositType, setDepositType] = useState<DepositType>('monthly');
  const [amount, setAmount] = useState<number>(currentUser?.monthly_target || 5000);
  const [targetMonth, setTargetMonth] = useState<string>(BENGALI_MONTHS[3] || 'এপ্রিল ২০২৬');
  const [targetLandId, setTargetLandId] = useState<string>(landProjects[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [trxId, setTrxId] = useState<string>('');
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  if (!currentUser) return null;

  const monthlyPaidTotal = getUserMonthlyPaidTotal(currentUser.id);
  const lumpsumPaidTotal = getUserLumpsumPaidTotal(currentUser.id);
  const totalPaid = monthlyPaidTotal + lumpsumPaidTotal;
  const dueMonths = getUserDueMonthsCount(currentUser.id);
  const dueAmount = getUserDueAmount(currentUser.id);

  // User's deposits history
  const userDeposits = deposits.filter((d) => d.member_id === currentUser.id);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess(null);
    setFormError(null);

    if (amount <= 0) {
      setFormError('সঠিক জমার পরিমাণ উল্লেখ করুন।');
      return;
    }
    if (!trxId.trim()) {
      setFormError('লেনদেনের ট্রানজেকশন আইডি (TrxID) দেওয়া আবশ্যক।');
      return;
    }

    const selectedLand = landProjects.find((l) => l.id === targetLandId);

    submitDeposit({
      member_id: currentUser.id,
      member_name: currentUser.full_name,
      type: depositType,
      amount,
      target_month: depositType === 'monthly' ? targetMonth : undefined,
      target_land_id: depositType === 'lumpsum' ? targetLandId : undefined,
      target_land_title: depositType === 'lumpsum' ? selectedLand?.title : undefined,
      payment_method: paymentMethod,
      trx_id: trxId.trim(),
      receipt_url: receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
      note: note.trim()
    });

    setFormSuccess('আপনার জমার তথ্য সফলভাবে দাখিল করা হয়েছে! অ্যাডমিন ভেরিফিকেশনের পর ভাউচার অনুমোদন পাবে।');
    setTrxId('');
    setNote('');
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setReceiptUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic Member Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950/70 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <span
              className={`absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border-2 border-slate-900 ${
                currentUser.status === 'active'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-amber-500 text-slate-950'
              }`}
            >
              {currentUser.status === 'active' ? 'সক্রিয়' : 'পেন্ডিং'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-amber-400 font-semibold">সম্মানিত সদস্য</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-inter">
                {currentUser.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentUser.full_name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              মাসিক সঞ্চয় টার্গেট: <strong className="text-emerald-400">{formatCurrencyBengali(currentUser.monthly_target)}</strong> • মালিকানাধীন শেয়ার: <strong className="text-amber-400">{toBengaliNumber(currentUser.owned_shares)} টি</strong>
            </p>
          </div>
        </div>

        {/* Quick Statement & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setStatementOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 hover:border-slate-600 transition flex items-center gap-2 shadow cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>অ্যাকাউন্ট লেজার স্টেটমেন্ট</span>
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Coins className="w-4 h-4" />
            <span>কিস্তি বা এককালীন জমা দিন</span>
          </button>
        </div>
      </div>

      {/* Due Installment Alert (If Any) */}
      {dueMonths > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-amber-950/60 border border-rose-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <AlertCircle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                মাসিক কিস্তি বকেয়া নোটিফিকেশন!
              </h4>
              <p className="text-xs text-rose-200">
                আপনার বর্তমানে <strong className="underline">{toBengaliNumber(dueMonths)}টি কিস্তি</strong> বকেয়া রয়েছে (মোট বকেয়া: {formatCurrencyBengali(dueAmount)})। অ্যাকাউন্ট সচল রাখতে দ্রুত পরিশোধ করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDetailModalType('due')}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-xs font-semibold text-rose-300 border border-rose-500/30 cursor-pointer"
            >
              বকেয়া বিবরণ দেখুন
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow cursor-pointer"
            >
              এখনই জমা দিন
            </button>
          </div>
        </div>
      )}

      {/* 
        FOUR FINANCIAL SUMMARY CARDS WITH TAP-TO-OPEN DETAIL MODAL AND IMAGE DOWNLOAD
        Requirements:
        - "পরিশোধিত কিস্তি তে টেপ করলে প্রতি মাসের হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
        - "এককালীন জমা তে টেপ করলে এককালীন জমা হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
        - "বকেয়া কিস্তি তে টেপ করলে বকেয়া কিস্তি হিসাব দেখাবে, এবং এর হিসাবের ছবি ডাউনলোট করা যাবে"
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: পরিশোধিত কিস্তি */}
        <div
          onClick={() => setDetailModalType('paid_monthly')}
          className="group relative bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                পরিশোধিত মাসিক কিস্তি
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-inter">
              {formatCurrencyBengali(monthlyPaidTotal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              নিয়মিত সঞ্চয় খাতের মোট অনুমোদন
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>মাসের হিসাব ও ছবি ডাউনলোড</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: এককালীন জমা */}
        <div
          onClick={() => setDetailModalType('lumpsum')}
          className="group relative bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                এককালীন জমা (Lumpsum)
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-inter">
              {formatCurrencyBengali(lumpsumPaidTotal)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              নির্দিষ্ট ভূমি প্রকল্প শেয়ার ক্রয়
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>এককালীন হিসাব ও ছবি ডাউনলোড</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: বকেয়া কিস্তি */}
        <div
          onClick={() => setDetailModalType('due')}
          className="group relative bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-rose-500/50 rounded-3xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                বকেয়া কিস্তি
              </span>
              <div className="p-2.5 rounded-2xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight font-inter">
              {formatCurrencyBengali(dueAmount)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              মোট বকেয়া মাস: <strong className="text-rose-300">{toBengaliNumber(dueMonths)} মাস</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>বকেয়া হিসাব ও ছবি ডাউনলোড</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: সর্বমোট মূলধন ও শেয়ার */}
        <div
          onClick={() => setStatementOpen(true)}
          className="group relative bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                সর্বমোট সঞ্চয় ও মূলধন
              </span>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-inter">
              {formatCurrencyBengali(totalPaid)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              শেয়ার মালিকানা: <strong className="text-white">{toBengaliNumber(currentUser.owned_shares)} টি</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>পূর্ণাঙ্গ লেজার ভিউ</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Overview, Deposit Form, Deposit History, Polling */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          একনজরে ড্যাশবোর্ড
        </button>

        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'deposit'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>জমা প্রদান ফর্ম</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>জমা হিস্ট্রি ও ভাউচার রিসিট</span>
        </button>

        <button
          onClick={() => setActiveTab('polls')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'polls'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Vote className="w-4 h-4 text-emerald-400" />
          <span>জমি ক্রয়-বিক্রয় পোল</span>
        </button>
      </div>

      {/* TAB CONTENT 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Recent Transactions & Vouchers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>সাম্প্রতিক জমার তালিকা ও ভাউচার রিসিট</span>
              </h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                সবগুলো দেখুন
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-800/80">
                {userDeposits.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    এখনো কোনো জমা দাখিল করা হয়নি।
                  </div>
                ) : (
                  userDeposits.slice(0, 5).map((dep) => (
                    <div
                      key={dep.id}
                      className="p-4 sm:p-5 hover:bg-slate-800/40 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-3 rounded-2xl ${
                            dep.type === 'monthly'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {dep.type === 'monthly' ? (
                            <Calendar className="w-5 h-5" />
                          ) : (
                            <Wallet className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              {dep.type === 'monthly'
                                ? `মাসিক কিস্তি (${dep.target_month || 'নিয়মিত'})`
                                : `এককালীন জমা (${dep.target_land_title || 'ভূমি বরাদ্দ'})`}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                dep.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : dep.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {dep.status === 'approved'
                                ? 'অনুমোদিত'
                                : dep.status === 'pending'
                                ? 'যাচাইনাধীন'
                                : 'বাতিল'}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3">
                            <span>পদ্ধতি: {dep.payment_method}</span>
                            <span className="font-mono text-slate-500">{dep.trx_id}</span>
                            <span className="font-inter">{dep.created_at}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="text-sm sm:text-base font-extrabold text-white font-inter">
                            {formatCurrencyBengali(dep.amount)}
                          </div>
                          <span className="text-[10px] text-slate-500 block font-inter">
                            ভাউচার নং: {dep.id}
                          </span>
                        </div>

                        {dep.status === 'approved' && (
                          <button
                            onClick={() => setSelectedVoucherDeposit(dep)}
                            className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                            title="মানি রিসিট ভাউচার দেখুন"
                          >
                            রিসিট
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Official Bank & Mobile Payment Guidelines */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>অফিশিয়াল পেমেন্ট তথ্য</span>
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-950/50 border border-blue-800/60 space-y-2">
                <span className="text-blue-300 font-bold block text-sm">
                  {settings.paymentInfo.bank.bankName}
                </span>
                <div className="text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-400">হিসাবের নাম:</span>{' '}
                    <span className="font-semibold">{settings.paymentInfo.bank.accountName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">হিসাব নম্বর:</span>{' '}
                    <span className="font-mono font-bold text-white text-sm">
                      {settings.paymentInfo.bank.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">শাখা ও রাউটিং:</span>{' '}
                    <span>
                      {settings.paymentInfo.bank.branch} (রাউটিং: {settings.paymentInfo.bank.routing})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 block">মোবাইল ব্যাংকিং:</span>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-rose-400 font-bold">বিকাশ:</span>
                  <span className="font-mono text-white font-bold">{settings.paymentInfo.mobile.bkash}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold">নগদ:</span>
                  <span className="font-mono text-white font-bold">{settings.paymentInfo.mobile.nagad}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-purple-400 font-bold">রকেট:</span>
                  <span className="font-mono text-white font-bold">{settings.paymentInfo.mobile.rocket}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                {settings.paymentInfo.instructions}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DEPOSIT SUBMISSION FORM */}
      {activeTab === 'deposit' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>জমা প্রদান ও ভাউচার রিকোয়েস্ট</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ব্যাংক বা মোবাইল ব্যাংকিংয়ে টাকা পাঠানোর পর সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন
            </p>
          </div>

          {formSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleDepositSubmit} className="space-y-5 text-xs">
            {/* Deposit Type Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                জমার ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDepositType('monthly');
                    setAmount(currentUser.monthly_target);
                  }}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    depositType === 'monthly'
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>মাসিক কিস্তি সঞ্চয়</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDepositType('lumpsum');
                    setAmount(50000);
                  }}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                    depositType === 'lumpsum'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>এককালীন ভূমি শেয়ার জমা</span>
                </button>
              </div>
            </div>

            {/* Target Month or Land Project */}
            {depositType === 'monthly' ? (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  যে মাসের কিস্তি দিচ্ছেন
                </label>
                <select
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {BENGALI_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ভূমি প্রকল্প নির্বাচন করুন
                </label>
                <select
                  value={targetLandId}
                  onChange={(e) => setTargetLandId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  {landProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (প্রতি শেয়ার: {formatCurrencyBengali(p.price_per_share)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                জমার পরিমাণ (টাকা)
              </label>
              <input
                type="number"
                min={100}
                required
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-sm focus:outline-none focus:border-amber-500 font-inter"
              />
            </div>

            {/* Payment Method & TrxID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  পেমেন্ট মেথড
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="bKash">বিকাশ (bKash)</option>
                  <option value="Nagad">নগদ (Nagad)</option>
                  <option value="Rocket">রকেট (Rocket)</option>
                  <option value="Bank">ব্যাংক ডিপোজিট / ট্রান্সফার</option>
                  <option value="Cash">ক্যাশ / সরাসরি অফিস জমা</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ট্রানজেকশন আইডি (TrxID)
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: BK9X8745QW"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Receipt Upload / Screenshot */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">
                জমার স্লিপ বা স্ক্রিনশট আপলোড করুন
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-4 bg-slate-950/60 flex items-center justify-center gap-2 text-slate-400 hover:text-white cursor-pointer transition">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>{receiptUrl ? '✓ রিসিট সিলেক্ট হয়েছে (পরিবর্তন করুন)' : 'ফাইল নির্বাচন করুন (JPG, PNG)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
                {receiptUrl && (
                  <img
                    src={receiptUrl}
                    alt="Receipt preview"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                  />
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                বিশেষ নোট বা মন্তব্য (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ব্যাংকের গুলশান শাখা থেকে জমা দেওয়া হয়েছে"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-2xl text-sm shadow-xl shadow-emerald-600/30 transition cursor-pointer"
            >
              জমার রিকোয়েস্ট নিশ্চিত করুন
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT 3: FULL HISTORY & VOUCHERS */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>আপনার সকল জমার তালিকা ও ভাউচার রিসিট</span>
            </h3>
            <span className="text-xs text-slate-400 font-inter">
              মোট রেকর্ড: {toBengaliNumber(userDeposits.length)}টি
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ভাউচার আইডি</th>
                    <th className="p-3.5">খাত / বিবরণ</th>
                    <th className="p-3.5">পরিমাণ</th>
                    <th className="p-3.5">পদ্ধতি ও TrxID</th>
                    <th className="p-3.5">দাখিলের তারিখ</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">রিসিট ডাউনলোড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {userDeposits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        এখনো কোনো জমার তথ্য জমা হয়নি।
                      </td>
                    </tr>
                  ) : (
                    userDeposits.map((dep) => (
                      <tr key={dep.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono text-blue-400 font-inter font-bold">
                          {dep.id}
                        </td>
                        <td className="p-3.5 font-bold text-white">
                          {dep.type === 'monthly'
                            ? `মাসিক কিস্তি (${dep.target_month || 'নিয়মিত'})`
                            : `এককালীন (${dep.target_land_title || 'ভূমি বরাদ্দ'})`}
                        </td>
                        <td className="p-3.5 font-extrabold text-emerald-400 font-inter text-sm">
                          {formatCurrencyBengali(dep.amount)}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <div>{dep.payment_method}</div>
                          <div className="font-mono text-[10px] text-slate-500">{dep.trx_id}</div>
                        </td>
                        <td className="p-3.5 text-slate-400 font-inter">
                          {dep.created_at}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              dep.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : dep.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {dep.status === 'approved'
                              ? 'অনুমোদিত'
                              : dep.status === 'pending'
                              ? 'যাচাইনাধীন'
                              : 'বাতিল'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {dep.status === 'approved' ? (
                            <button
                              onClick={() => setSelectedVoucherDeposit(dep)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                            >
                              রিসিট ভিউ
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-600">অপেক্ষমাণ</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: POLLING & OPINIONS */}
      {activeTab === 'polls' && <PollingSection />}

      {/* Modals */}
      <FinancialDetailModal
        isOpen={!!detailModalType}
        type={detailModalType}
        onClose={() => setDetailModalType(null)}
        onOpenDepositTab={() => setActiveTab('deposit')}
      />

      <VoucherModal
        isOpen={!!selectedVoucherDeposit}
        deposit={selectedVoucherDeposit}
        onClose={() => setSelectedVoucherDeposit(null)}
      />

      <StatementModal
        isOpen={statementOpen}
        onClose={() => setStatementOpen(false)}
      />
    </div>
  );
};
