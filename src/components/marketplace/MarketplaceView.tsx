import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LandSection } from '../home/LandSection';
import { PublicLandSubmissionModal } from '../home/PublicLandSubmissionModal';
import { PollingSection } from '../dashboard/PollingSection';
import { Sparkles, ShoppingBag, PlusCircle, CheckCircle2 } from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { currentUser } = useApp();
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [activeMarketTab, setActiveMarketTab] = useState<'browse' | 'polls'>('browse');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Marketplace Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>সেন্ট্রাল সমবায় ভূমি মার্কেটপ্লেস ও ক্রয়-বিক্রয় পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            ভূমি ক্রয়, বিক্রয় ও প্রস্তাবনা কেন্দ্র
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            চলমান সমবায় প্রকল্পে শেয়ার বুকিং করুন, নিজস্ব জমি বিক্রির প্রস্তাব দিন অথবা নতুন ভূমি অধিগ্রহণের প্রস্তাব দাখিল করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSellModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>জমি বিক্রির প্রস্তাব দিন</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveMarketTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeMarketTab === 'browse'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ভূমি প্রকল্প ও শেয়ার বুকিং
        </button>

        <button
          onClick={() => setActiveMarketTab('polls')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeMarketTab === 'polls'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          সদস্য পোলিং ও ভোটাভুটি
        </button>
      </div>

      {activeMarketTab === 'browse' ? (
        <LandSection onOpenSellModal={() => setSellModalOpen(true)} />
      ) : (
        <PollingSection />
      )}

      {/* Public Land Submission Modal */}
      <PublicLandSubmissionModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />
    </div>
  );
};
