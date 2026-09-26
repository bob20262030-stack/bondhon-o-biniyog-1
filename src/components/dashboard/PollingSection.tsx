import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VoteDecision, LandPoll } from '../../types';
import {
  Vote,
  CheckCircle,
  XCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  MapPin,
  Coins,
  Clock,
  Send,
  PlusCircle,
  ShieldCheck,
  Check
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate
} from '../../utils/bengali';

export const PollingSection: React.FC = () => {
  const { currentUser, polls, castVote, submitMemberProposal } = useApp();
  const [selectedDecision, setSelectedDecision] = useState<Record<string, VoteDecision>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [showMemberProposalModal, setShowMemberProposalModal] = useState(false);

  // New Member Proposal Form State
  const [propTitle, setPropTitle] = useState('');
  const [propLocation, setPropLocation] = useState('');
  const [propBudget, setPropBudget] = useState<number>(3000000);
  const [propSize, setPropSize] = useState<number>(50);
  const [propRationale, setPropRationale] = useState('');
  const [propSuccess, setPropSuccess] = useState(false);

  const handleVoteSubmit = (pollId: string) => {
    if (!currentUser) return;
    const decision = selectedDecision[pollId];
    if (!decision) return;
    castVote(pollId, decision, commentText[pollId]);
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitMemberProposal({
      member_id: currentUser.id,
      member_name: currentUser.full_name,
      title: propTitle,
      location: propLocation,
      estimated_budget: propBudget,
      size_decimals: propSize,
      feasibility_rationale: propRationale,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
      ]
    });

    setPropSuccess(true);
    setTimeout(() => {
      setPropSuccess(false);
      setShowMemberProposalModal(false);
      setPropTitle('');
      setPropLocation('');
      setPropRationale('');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-amber-950/40 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
            <Vote className="w-3.5 h-3.5" />
            <span>সদস্যদের গণতান্ত্রিক ভোটাভুটি ও সিদ্ধান্ত গ্রহণ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            জমি ক্রয়-বিক্রয় প্রস্তাব ও ওপিনিয়ন পোলিং
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            সমবায়ের নীতি অনুযায়ী প্রতিটি নতুন ভূমি অধিগ্রহণ বা বিক্রয়ে সকল সাধারণ সদস্যের সুস্পষ্ট মতামত ও ভোট গ্রহণ করা হয়। আপনার মূল্যবান মতামত ভবিষ্যৎ প্রকল্প নির্ধারণ করে।
          </p>
        </div>

        {currentUser && (
          <button
            onClick={() => setShowMemberProposalModal(true)}
            className="shrink-0 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন জমি ক্রয়ের প্রস্তাব দিন</span>
          </button>
        )}
      </div>

      {/* Active Polls List */}
      <div className="space-y-6">
        {polls.map((poll) => {
          const votesList = Object.values(poll.votes || {});
          const totalVotes = votesList.length;
          const yesVotes = votesList.filter((v) => v.decision === 'yes').length;
          const noVotes = votesList.filter((v) => v.decision === 'no').length;
          const reviewVotes = votesList.filter((v) => v.decision === 'review').length;

          const yesPct = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0;
          const noPct = totalVotes > 0 ? Math.round((noVotes / totalVotes) * 100) : 0;
          const reviewPct = totalVotes > 0 ? Math.round((reviewVotes / totalVotes) * 100) : 0;

          const currentUserVote = currentUser ? poll.votes[currentUser.id] : null;
          const myDecision = selectedDecision[poll.id] || currentUserVote?.decision;

          return (
            <div
              key={poll.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
            >
              {/* Poll Status Ribbon */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold font-inter">
                    {poll.id}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-inter">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>শুরু: {poll.created_at}</span>
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    poll.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {poll.status === 'active' ? 'চলমান পোলিং' : 'সমাপ্ত পোল'}
                </span>
              </div>

              {/* Title & Specs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {poll.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {poll.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>অবস্থান: {poll.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>জমির পরিমাণ: {poll.size}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <Coins className="w-3.5 h-3.5 text-emerald-400" />
                      <span>প্রস্তাবিত বাজেট: {formatCurrencyBengali(poll.price_or_budget)}</span>
                    </div>
                  </div>
                </div>

                {/* Right image if available */}
                {poll.image_url && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 h-44 lg:h-auto shadow-inner">
                    <img
                      src={poll.image_url}
                      alt={poll.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Live Tally Bar & Percentage Metrics */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 mb-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">
                    মোট প্রাপ্ত ভোট: {toBengaliNumber(totalVotes)}টি
                  </span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-emerald-400">
                      সম্মত: {toBengaliNumber(yesPct)}% ({toBengaliNumber(yesVotes)})
                    </span>
                    <span className="text-amber-400">
                      পর্যালোচনা: {toBengaliNumber(reviewPct)}% ({toBengaliNumber(reviewVotes)})
                    </span>
                    <span className="text-rose-400">
                      অসম্মত: {toBengaliNumber(noPct)}% ({toBengaliNumber(noVotes)})
                    </span>
                  </div>
                </div>

                {/* Segmented Progress Bar */}
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    style={{ width: `${yesPct}%` }}
                    className="h-full bg-emerald-500 transition-all duration-500"
                    title={`সম্মত: ${yesPct}%`}
                  />
                  <div
                    style={{ width: `${reviewPct}%` }}
                    className="h-full bg-amber-500 transition-all duration-500"
                    title={`পর্যালোচনা: ${reviewPct}%`}
                  />
                  <div
                    style={{ width: `${noPct}%` }}
                    className="h-full bg-rose-500 transition-all duration-500"
                    title={`অসম্মত: ${noPct}%`}
                  />
                </div>
              </div>

              {/* Voting Action Section (For Logged in Members) */}
              {poll.status === 'active' && currentUser && (
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Vote className="w-4 h-4 text-amber-400" />
                      <span>আপনার সিদ্ধান্ত প্রদান করুন:</span>
                    </span>
                    {currentUserVote && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        ✓ আপনি ইতিমধ্যে ভোট দিয়েছেন
                      </span>
                    )}
                  </div>

                  {/* 3 Decision Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDecision((prev) => ({ ...prev, [poll.id]: 'yes' }))
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        myDecision === 'yes'
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/50'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>আমি সম্পূর্ণ সম্মত (Yes)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDecision((prev) => ({ ...prev, [poll.id]: 'review' }))
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        myDecision === 'review'
                          ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/30'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500/50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>পর্যালোচনা প্রয়োজন (Review)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDecision((prev) => ({ ...prev, [poll.id]: 'no' }))
                      }
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        myDecision === 'no'
                          ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500/50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <span>আমি অসম্মত (No)</span>
                    </button>
                  </div>

                  {/* Comment & Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <input
                      type="text"
                      placeholder="আপনার সুনির্দিষ্ট মতামত বা যুক্তি লিখুন (ঐচ্ছিক)..."
                      value={commentText[poll.id] || ''}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [poll.id]: e.target.value }))
                      }
                      className="flex-1 w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />

                    <button
                      type="button"
                      onClick={() => handleVoteSubmit(poll.id)}
                      disabled={!selectedDecision[poll.id]}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{currentUserVote ? 'ভোট পরিবর্তন করুন' : 'ভোট জমা দিন'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Member Comments & Opinions Feed */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>সদস্যদের মন্তব্য ও যৌক্তিক পর্যালোচনা ({toBengaliNumber(votesList.filter((v) => v.comment).length)})</span>
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {votesList.filter((v) => v.comment).length === 0 ? (
                    <p className="text-xs text-slate-500">এখনো কোনো লিখিত মন্তব্য জমা পড়েনি।</p>
                  ) : (
                    votesList
                      .filter((v) => v.comment)
                      .map((v, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{v.member_name}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  v.decision === 'yes'
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : v.decision === 'review'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-rose-500/20 text-rose-300'
                                }`}
                              >
                                {v.decision === 'yes'
                                  ? 'সম্মত'
                                  : v.decision === 'review'
                                  ? 'পর্যালোচনা'
                                  : 'অসম্মত'}
                              </span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{v.comment}</p>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 font-inter">
                            {v.timestamp}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Land Purchase Proposal Modal */}
      {showMemberProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
            <h3 className="text-lg font-bold text-white mb-1">
              নতুন জমি ক্রয়ের প্রস্তাব দাখিল
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              আপনার প্রস্তাবিত জমির বিবরণ দিন। যাচাই শেষে এটি সরাসরি সকল সদস্যের পোলিং তালিকায় যুক্ত হবে।
            </p>

            {propSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>প্রস্তাবটি সফলভাবে দাখিল হয়েছে এবং সকল সদস্যকে অবহিত করা হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  প্রস্তাবের শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="যেমন: সাভারে ১০ শতাংশ কমার্শিয়াল জমি ক্রয়ের প্রস্তাব"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    জমির অবস্থান
                  </label>
                  <input
                    type="text"
                    required
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    placeholder="উপজেলা, জেলা"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    জমির পরিমাণ (শতাংশ)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={propSize}
                    onChange={(e) => setPropSize(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  আনুমানিক বাজেট (টাকা)
                </label>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  required
                  value={propBudget}
                  onChange={(e) => setPropBudget(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  বিনিয়োগ সম্ভাবনা ও যৌক্তিকতা
                </label>
                <textarea
                  rows={3}
                  required
                  value={propRationale}
                  onChange={(e) => setPropRationale(e.target.value)}
                  placeholder="কেন এই জমিটি সমবায়ের জন্য লাভজনক হতে পারে সংক্ষেপে ব্যাখ্যা করুন..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMemberProposalModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  প্রস্তাব জমা দিন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
