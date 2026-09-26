import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LandProject } from '../../types';
import {
  MapPin,
  Coins,
  Calendar,
  Layers,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  CheckCircle,
  X,
  FileCheck
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali
} from '../../utils/bengali';

interface LandSectionProps {
  onOpenSellModal: () => void;
}

export const LandSection: React.FC<LandSectionProps> = ({ onOpenSellModal }) => {
  const { landProjects, submitBuyProposal } = useApp();
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [selectedShareholderProject, setSelectedShareholderProject] = useState<LandProject | null>(null);
  const [selectedBuyProject, setSelectedBuyProject] = useState<LandProject | null>(null);

  // Buy Proposal Form State
  const [proposerName, setProposerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [sharesCount, setSharesCount] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);

  const handlePrevImage = (projectId: string, maxImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + maxImages) % maxImages
    }));
  };

  const handleNextImage = (projectId: string, maxImages: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes((prev) => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % maxImages
    }));
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyProject) return;

    submitBuyProposal({
      proposer_name: proposerName,
      mobile,
      address,
      land_id: selectedBuyProject.id,
      land_title: selectedBuyProject.title,
      proposed_shares_or_amount: `${toBengaliNumber(sharesCount)}টি শেয়ার`,
      proposed_price: sharesCount * selectedBuyProject.price_per_share,
      message
    });

    setBuySuccess(true);
    setTimeout(() => {
      setBuySuccess(false);
      setSelectedBuyProject(null);
      setProposerName('');
      setMobile('');
      setAddress('');
      setMessage('');
    }, 1500);
  };

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>নিষ্কণ্টক ভূমি প্রকল্প ও শেয়ার বুকিং</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            চলমান ও সম্ভাবনাময় ভূমি প্রকল্পসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            শতভাগ নিষ্কণ্টক, সাব-কবলা রেজিস্ট্রির নিশ্চয়তা ও সরাসরি কিস্তিতে শেয়ার বরাদ্দের সুবর্ণ সুযোগ
          </p>
        </div>

        {/* Action Button: Sell Land Portal */}
        <button
          onClick={onOpenSellModal}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow cursor-pointer"
        >
          <span>আপনার জমি বিক্রি করতে চান?</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {landProjects.map((project) => {
          const currentImgIdx = activeImageIndexes[project.id] || 0;
          const images = project.images && project.images.length > 0
            ? project.images
            : ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'];
          
          // Remaining Shares Calculation:
          // "প্রতি শেয়ার মূল্য, মাসিক কিস্তি পরিমাণ, অবশিষ্ট শেয়ার এর পাশাপাশি মোট দাম উল্লেখ থাকবে"
          const remainingShares = Math.max(0, project.total_shares - project.sold_shares);
          const remainingTotalValue = remainingShares * project.price_per_share;

          return (
            <div
              key={project.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
            >
              <div>
                {/* Photo Carousel Header */}
                <div className="relative h-56 w-full bg-slate-950 overflow-hidden group">
                  <img
                    src={images[currentImgIdx]}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Carousel navigation buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevImage(project.id, images.length, e)}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleNextImage(project.id, images.length, e)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold shadow-md ${
                      project.status === 'ongoing'
                        ? 'bg-emerald-600 text-white'
                        : project.status === 'upcoming'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {project.status === 'ongoing'
                      ? 'বরাদ্দ চলছে'
                      : project.status === 'upcoming'
                      ? 'আসন্ন প্রকল্প'
                      : 'সম্পন্ন'}
                  </span>

                  {/* Size Decimals Badge */}
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-xs border border-slate-700 font-inter">
                    {toBengaliNumber(project.size_decimals)} শতাংশ
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  </div>

                  {/* Financial & Share Metrics Matrix */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">প্রতি শেয়ার মূল্য:</span>
                      <span className="font-extrabold text-amber-400 font-inter text-sm">
                        {formatCurrencyBengali(project.price_per_share)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">মাসিক কিস্তি পরিমাণ:</span>
                      <span className="font-bold text-emerald-400 font-inter">
                        {formatCurrencyBengali(project.monthly_installment)} / মাস
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">মোট শেয়ার:</span>
                      <span className="font-bold text-white font-inter">
                        {toBengaliNumber(project.total_shares)} টি
                      </span>
                    </div>

                    {/* 
                      REQUIREMENT SPEC:
                      "অবশিষ্ট শেয়ার এর পাশাপাশি মোট দাম উল্লেখ থাকবে"
                    */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">অবশিষ্ট শেয়ার (খালি):</span>
                      <span className="font-black text-rose-400 font-inter">
                        {toBengaliNumber(remainingShares)} টি খালি
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">অবশিষ্ট শেয়ারের মোট দাম:</span>
                      <span className="font-black text-amber-300 font-inter text-xs">
                        {formatCurrencyBengali(remainingTotalValue)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">প্রকল্পের মোট মূলধন:</span>
                      <span className="font-black text-white font-inter">
                        {formatCurrencyBengali(project.total_valuation)}
                      </span>
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Shareholder Breakdown Modal Trigger */}
                  <button
                    onClick={() => setSelectedShareholderProject(project)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>শেয়ারহোল্ডার তালিকা</span>
                  </button>

                  {/* Buy Proposal Modal Trigger */}
                  <button
                    onClick={() => setSelectedBuyProject(project)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>আমি কিনতে চাই</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shareholder Breakdown Modal */}
      {selectedShareholderProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  শেয়ারহোল্ডারদের বিস্তারিত তালিকা
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {selectedShareholderProject.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedShareholderProject(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>মোট শেয়ার: {toBengaliNumber(selectedShareholderProject.total_shares)} টি</span>
                <span>বিক্রীত: {toBengaliNumber(selectedShareholderProject.sold_shares)} টি</span>
              </div>

              <div className="max-h-60 overflow-y-auto divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/60">
                {selectedShareholderProject.shareholders && selectedShareholderProject.shareholders.length > 0 ? (
                  selectedShareholderProject.shareholders.map((sh, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{sh.member_name}</div>
                        <div className="text-[10px] text-slate-500 font-inter">সদস্য আইডি: {sh.member_id}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-amber-400 font-inter">
                          {toBengaliNumber(sh.shares_count)} টি শেয়ার
                        </span>
                        <div className="text-[10px] text-slate-500 font-inter">{sh.allotted_date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    এখনো কোনো শেয়ারহোল্ডার ডাটা নথিভুক্ত হয়নি।
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "I Want to Buy" Modal */}
      {selectedBuyProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">ভূমি শেয়ার ক্রয়ের আবেদন</h3>
                <p className="text-xs text-amber-400">{selectedBuyProject.title}</p>
              </div>
              <button
                onClick={() => setSelectedBuyProject(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {buySuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>আপনার প্রস্তাবটি জমা হয়েছে! অ্যাডমিন প্রতিনিধি দ্রুত আপনার সাথে যোগাযোগ করবেন।</span>
              </div>
            )}

            <form onSubmit={handleBuySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">আপনার নাম</label>
                <input
                  type="text"
                  required
                  placeholder="মোঃ আব্দুল্লাহ"
                  value={proposerName}
                  onChange={(e) => setProposerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  required
                  placeholder="01712-XXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">বর্তমান ঠিকানা</label>
                <input
                  type="text"
                  required
                  placeholder="এলাকা, থানা, জেলা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">শেয়ারের সংখ্যা</label>
                  <span className="text-amber-400 font-bold font-inter">
                    মোট প্রস্তাবিত মূল্য: {formatCurrencyBengali(sharesCount * selectedBuyProject.price_per_share)}
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, selectedBuyProject.total_shares - selectedBuyProject.sold_shares)}
                  required
                  value={sharesCount}
                  onChange={(e) => setSharesCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">বার্তা বা কিস্তির প্রস্তাবনা</label>
                <textarea
                  rows={2}
                  placeholder="যেমন: এককালীন নাকি মাসিক কিস্তিতে দিতে চান..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                ক্রয় প্রস্তাব নিশ্চিত করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
