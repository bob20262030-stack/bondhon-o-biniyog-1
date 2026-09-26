import React, { useState, useEffect } from 'react';
import { BondhonItem, fetchD1Items, saveD1Item, deleteD1Item } from '../../services/d1Items';
import {
  Database,
  PlusCircle,
  ExternalLink,
  Trash2,
  RefreshCw,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

export const BondhonD1AdminSection: React.FC = () => {
  const [items, setItems] = useState<BondhonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetchD1Items();
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMsg({ type: 'error', text: 'দয়া করে আইটেমের শিরোনাম (Title) লিখুন।' });
      return;
    }

    setSubmitting(true);
    setStatusMsg(null);

    try {
      const res = await saveD1Item({
        title: title.trim(),
        description: description.trim(),
        image: image.trim(),
        link: link.trim()
      });

      if (res.success) {
        setStatusMsg({
          type: 'success',
          text: 'সফলভাবে ক্লাউডফ্লেয়ার D1 ডেটাবেজ (bondhon_items)-এ সেভ হয়েছে!'
        });
        // Reset form
        setTitle('');
        setDescription('');
        setImage('');
        setLink('');
        // Reload items
        await loadItems();
      } else {
        setStatusMsg({
          type: 'error',
          text: res.error || 'D1-তে সেভ করতে সমস্যা হয়েছে।'
        });
      }
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err?.message || 'সার্ভারে সংযোগ ব্যর্থ হয়েছে।'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই আইটেমটি D1 ডেটাবেজ থেকে মুছে ফেলতে চান?')) {
      return;
    }
    await deleteD1Item(id);
    await loadItems();
    setStatusMsg({ type: 'success', text: 'আইটেমটি সফলভাবে মুছে ফেলা হয়েছে।' });
  };

  // Sample filler helper for rapid testing
  const fillSample = (index: number) => {
    const samples = [
      {
        title: 'সোনারগাঁও হেরিটেজ ভ্যালি সমবায় প্রকল্প',
        description: 'ঐতিহাসিক সোনারগাঁওয়ে নদী তীরবর্তী দৃষ্টিনন্দন সমবায় আবাসিক প্রকল্প। দ্রুত বুকিং চলছে।',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        link: 'https://bondhon.org/projects/heritage'
      },
      {
        title: 'স্মার্ট এগ্রো ফার্ম ও ডেইরি ফার্মিং বিনিয়োগ',
        description: 'সমবায়ের নিজস্ব ভূমিতে আধুনিক ডেইরি ও এগ্রো ফার্মিং উদ্যোগ। বার্ষিক লভ্যাংশ বণ্টন।',
        image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
        link: 'https://bondhon.org/projects/agro'
      }
    ];
    const s = samples[index % samples.length];
    setTitle(s.title);
    setDescription(s.description);
    setImage(s.image);
    setLink(s.link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cloudflare D1 Info Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold mb-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>Cloudflare D1 Database Binding • Table: bondhon_items</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ক্লাউডফ্লেয়ার D1 ডেটাবেজ ম্যানেজমেন্ট
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              রুট <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">/admin</code> থেকে সরাসরি D1 টেবিলে নতুন আইটেম সংরক্ষণ ও পর্যবেক্ষণ করুন
            </p>
          </div>

          <button
            onClick={loadItems}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            <span>D1 রিফ্রেশ করুন</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form to Add to D1 */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>D1-তে নতুন আইটেম যোগ করুন</span>
            </h3>
            <button
              type="button"
              onClick={() => fillSample(Math.floor(Math.random() * 2))}
              className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>নমুনা পূরণ</span>
            </button>
          </div>

          {statusMsg && (
            <div
              className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                শিরোনাম (Title) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="প্রকল্প বা আইটেমের নাম লিখুন..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                বিবরণ (Description)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="বিস্তারিত বিবরণ লিখুন..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ছবির লিঙ্ক (Image URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none transition"
                />
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>

              {image && (
                <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute bottom-1 left-2 text-[10px] bg-slate-950/80 px-2 py-0.5 rounded text-slate-400">
                    ছবির প্রিভিউ
                  </div>
                </div>
              )}
            </div>

            {/* Link */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ওয়েব লিঙ্ক (Link)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com বা প্রজেক্ট লিঙ্ক"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-sm text-white placeholder-slate-500 outline-none transition"
                />
                <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>D1-তে সেভ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Cloudflare D1-তে সেভ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Existing Items from D1 Table bondhon_items */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>D1 সংরক্ষিত আইটেমসমূহ</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                মোট সংরক্ষিত রেকর্ড: {items.length} টি
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-blue-300">
              bondhon_items
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              <span>D1 টেবিল থেকে লোড হচ্ছে...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Database className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p>D1 টেবিলে কোনো তথ্য নেই। বামপাশের ফর্ম পূরণ করে যোগ করুন।</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                          #{item.id}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate max-w-xs">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      {item.link && (
                        <a
                          href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline mt-1"
                        >
                          <span className="truncate max-w-xs">{item.link}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
