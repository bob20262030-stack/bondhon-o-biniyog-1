import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, Mail, Quote, Sparkles } from 'lucide-react';

export const DirectorsSection: React.FC = () => {
  const { directors } = useApp();
  const sortedDirectors = [...directors].sort((a, b) => a.order - b.order);

  // Gallery of field surveys / inspection visits
  const inspectionGallery = [
    {
      title: 'পূর্বাচল গ্রিন ভ্যালি জমি ডিমার্কেশন ও পিলার স্থাপন',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
      date: 'সেপ্টেম্বর ২০২৬'
    },
    {
      title: 'মেঘনা ইকো রিসোর্ট সাইটে পরিচালনা পর্ষদের পরিদর্শন',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      date: 'আগস্ট ২০২৬'
    },
    {
      title: 'সরকারি সাব-রেজিস্ট্রি অফিসে যৌথ দলিলের আইনি যাচাইকরণ',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      date: 'জুলাই ২০২৬'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Leadership Board */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অভিজ্ঞ ও বিশ্বস্ত পরিচালনা পর্ষদ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            পরিচালনা পর্ষদ ও নেতৃত্ব
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            আইন, প্রকৌশল, ব্যাংকিং ও ভূমি ব্যবস্থাপনা বিশেষজ্ঞদের সমন্বয়ে পরিচালিত সুদৃঢ় পরিচালনা পরিষদ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedDirectors.map((director) => (
            <div
              key={director.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/60 shadow-lg">
                  <img
                    src={director.avatar}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-base font-bold text-white">
                    {director.name}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium mt-0.5">
                    {director.designation}
                  </p>
                </div>

                {/* Motivational Quote / Bani */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed italic relative">
                  <Quote className="w-4 h-4 text-amber-500/40 absolute top-2 left-2 pointer-events-none" />
                  <p className="pl-3">{director.quote}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-inter text-slate-300">{director.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="font-inter text-slate-300 truncate">{director.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* On-site Inspection & Survey Photo Gallery */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>সরেজমিন পরিদর্শন ও জরিপ ফটো গ্যালারি</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              প্রকল্প স্থানসমূহের নিয়মিত ড্রোন ফুটেজ, সীমানা নির্ধারণ ও সরকারি কর্মকর্তাদের উপস্থিতির চিত্র
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inspectionGallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl"
            >
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1">
                <span className="text-[10px] text-amber-400 font-semibold font-inter">
                  {item.date}
                </span>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
