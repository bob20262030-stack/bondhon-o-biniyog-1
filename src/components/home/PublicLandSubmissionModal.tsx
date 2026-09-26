import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload, CheckCircle, MapPin, DollarSign, Sparkles } from 'lucide-react';

interface PublicLandSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicLandSubmissionModal: React.FC<PublicLandSubmissionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { submitPublicLand } = useApp();
  const [sellerName, setSellerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [landLocation, setLandLocation] = useState('');
  const [sizeDecimals, setSizeDecimals] = useState<number>(30);
  const [expectedPrice, setExpectedPrice] = useState<number>(2500000);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitPublicLand({
      seller_name: sellerName,
      mobile,
      address,
      land_location: landLocation,
      size_decimals: sizeDecimals,
      expected_price: expectedPrice,
      description,
      images
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      setSellerName('');
      setMobile('');
      setAddress('');
      setLandLocation('');
      setDescription('');
    }, 1600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImages([reader.result]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>পাবলিক ল্যান্ড সেল পোর্টাল</span>
            </div>
            <h3 className="text-lg font-bold text-white">আপনার জমি বিক্রি করতে চান?</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && (
          <div className="mb-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>আপনার জমির বিবরণ সফলভাবে জমা হয়েছে! সমবায়ের লিগ্যাল ও ফিল্ড সার্ভে টিম কাগজপত্র যাচাই করে সরাসরি যোগাযোগ করবে।</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">জমির মালিকের নাম</label>
              <input
                type="text"
                required
                placeholder="মোঃ রফিকুল ইসলাম"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
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
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">জমির সুনির্দিষ্ট অবস্থান / মৌজা</label>
            <input
              type="text"
              required
              placeholder="গ্রাম/রোড, মৌজা, থানা, জেলা"
              value={landLocation}
              onChange={(e) => setLandLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">জমির পরিমাণ (শতাংশ)</label>
              <input
                type="number"
                min={1}
                required
                value={sizeDecimals}
                onChange={(e) => setSizeDecimals(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">প্রত্যাশিত সর্বমোট মূল্য (টাকা)</label>
              <input
                type="number"
                min={50000}
                step={50000}
                required
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">কাগজপত্র ও রাস্তার বিবরণ</label>
            <textarea
              rows={2}
              required
              placeholder="যেমন: আরএস খতিয়ানভুক্ত, নামজারি সম্পন্ন, ২০ ফিট পাকা রাস্তা সংলগ্ন..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">জমির ছবি আপলোড (ঐচ্ছিক)</label>
            <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl p-3 bg-slate-950/60 flex items-center justify-center gap-2 text-slate-400 hover:text-white cursor-pointer transition">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>ছবি নির্বাচন করুন</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
            >
              বিক্রি প্রস্তাব দাখিল করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
