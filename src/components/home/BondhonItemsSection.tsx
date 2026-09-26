import React, { useEffect, useState } from 'react';
import { BondhonItem, fetchD1Items } from '../../services/d1Items';
import { Database, ExternalLink, RefreshCw, Sparkles, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BondhonItemsSection: React.FC = () => {
  const [items, setItems] = useState<BondhonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'d1' | 'cache'>('cache');
  const { setCurrentTab } = useApp();

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetchD1Items();
      setItems(res.items);
      setSource(res.source);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>ক্লাউডফ্লেয়ার D1 লাইভ ডেটাবেজ • bondhon_items</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>বিশেষ ঘোষণা ও প্রকল্প তালিকা</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cloudflare D1 Table (`bondhon_items`) থেকে সরাসরি লোড হওয়া তথ্য ও প্রজেক্ট সমূহ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                source === 'd1' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {source === 'd1' ? 'D1 সার্ভার ডেটা' : 'ক্যাশ ডেটা'}
            </span>
          </div>

          <button
            onClick={loadItems}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title="D1 ডেটা রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              setCurrentTab('admin');
              window.history.pushState({}, '', '/admin');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
          <span>Cloudflare D1 ডেটাবেজ থেকে লোড হচ্ছে...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-semibold text-slate-300">এখনো কোনো আইটেম যোগ করা হয়নি।</p>
          <p className="text-xs text-slate-500 mt-1">অ্যাডমিন পেজে গিয়ে প্রথম আইটেমটি যোগ করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col group"
            >
              {/* Image Preview */}
              <div className="relative h-48 bg-slate-900 overflow-hidden">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-mono text-blue-300">
                  ID: #{item.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {item.created_at ? item.created_at.split('T')[0] : 'সম্প্রতি'}
                  </span>

                  {item.link ? (
                    <a
                      href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30 transition hover:border-blue-500/50"
                    >
                      <span>বিস্তারিত দেখুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-500 text-[11px]">কোনো লিঙ্ক নেই</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
