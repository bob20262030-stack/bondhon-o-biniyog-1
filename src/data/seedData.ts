import {
  Member,
  Deposit,
  LandProject,
  Director,
  SystemSettings,
  PublicLandSubmission,
  LandBuyProposal,
  MemberLandProposal,
  LandPoll,
  AppNotification
} from '../types';

export const initialSettings: SystemSettings = {
  brandName: 'বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)',
  slogan: 'যৌথ স্বপ্ন • নিশ্চিত ভবিষ্যৎ',
  logoUrl: '', // uses fallback built-in SVG emblem if empty
  hotline: '+880 1712-345678',
  callBtnText: 'সরাসরি কল করুন',
  supportHours: 'সকাল ৯:০০ - রাত ৯:০০ (প্রতিদিন)',
  managerName: 'সজিব মোল্লা',
  managerTitle: 'ব্যবস্থাপক ও প্রধান সমন্বয়ক',
  targetCapital: 10000000, // ৳ ১,০০,০০,০০০
  marqueeNotices: [
    'স্বাগতম বন্ধন ও বিনিয়োগ সমবায়ে! যৌথ শক্তিতে গড়ে উঠুক নিশ্চিত ভবিষ্যৎ।',
    'নতুন পূর্বাচল গ্রিন ভ্যালি প্রকল্পের সীমিত সংখ্যক শেয়ার বরাদ্দ চলছে। দ্রুত আপনার শেয়ার নিশ্চিত করুন।',
    'সম্মানিত সদস্যগণ, চলতি মাসের মাসিক সঞ্চয় কিস্তি আগামী ১০ তারিখের মধ্যে পরিশোধের জন্য অনুরোধ করা হচ্ছে।',
    'সরাসরি হটলাইন: +880 1712-345678। যে কোনো তথ্যে আমাদের সাথে সরাসরি যোগাযোগ করুন।'
  ],
  promoOffer: {
    enabled: true,
    badge: 'বিশেষ অফার ২০২৬',
    title: 'এককালীন ৫টি শেয়ার বুকিংয়ে বিনামূল্যে দলিলের সম্পূর্ণ খরচ সমবায় বহন করবে!',
    description: 'পূর্বাচল গ্রিন ভ্যালি প্রকল্পে এককালীন ৫ বা ততোধিক শেয়ার বরাদ্দ নিলে সাব-কবলা রেজিস্ট্রির সমবায় ফি সম্পূর্ণ মওকুফ করা হবে। সীমিত সময়ের জন্য এই সুবিধা প্রযোজ্য।',
    deadline: '৩১ অক্টোবর ২০২৬ পর্যন্ত',
    btnText: 'অফারে যুক্ত হোন',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  },
  paymentInfo: {
    bank: {
      bankName: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি (Islami Bank Bangladesh PLC)',
      accountName: 'বন্ধন ও বিনিয়োগ সমবায় (Bondhon O Biniyog Somobay)',
      accountNumber: '20502140100987654',
      branch: 'গুলশান শাখা, ঢাকা',
      routing: '125272341'
    },
    mobile: {
      bkash: '01712-345678 (মার্চেন্ট / পার্সোনাল)',
      nagad: '01812-345678 (পার্সোনাল)',
      rocket: '01912-345678-7'
    },
    instructions: 'ব্যাংক ডিপোজিট বা মোবাইল ফিন্যান্সিয়াল সার্ভিসের (বিকাশ/নগদ/রকেট) মাধ্যমে টাকা পাঠানোর পর অবশ্যই ট্রানজেকশন আইডি (TrxID) এবং ডিপোজিট স্লিপের ছবি সংরক্ষণ করে ড্যাশবোর্ড থেকে আপলোড করুন।'
  },
  authSignature: {
    signatureUrl: '', // if empty, renders verified calligraphy seal
    signatoryName: 'সজিব মোল্লা',
    designation: 'ব্যবস্থাপনা পরিচালক ও অনুমোদিত কর্মকর্তা',
    sealUrl: ''
  }
};

export const initialMembers: Member[] = [
  {
    id: 'BOB-ADM-001',
    full_name: 'সজিব মোল্লা',
    email: 'admin@bob.com',
    phone: '01712345678',
    password: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    role: 'admin',
    status: 'active',
    monthly_target: 5000,
    joined_date: '2024-01-01',
    owned_shares: 15,
    nid: '19902692510000123',
    address: 'বাড়ি # ১২, রোড # ৪, গুলশান-২, ঢাকা'
  },
  {
    id: 'BOB-M-101',
    full_name: 'সজিব আহমেদ',
    email: 'sajib@bob.com',
    phone: '01819876543',
    password: 'member123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'member',
    status: 'active',
    monthly_target: 5000,
    joined_date: '2024-03-15',
    owned_shares: 8,
    nid: '19922692510000456',
    address: 'মিরপুর-১০, ঢাকা'
  },
  {
    id: 'BOB-M-102',
    full_name: 'মোহাম্মদ রহিম উদ্দিন',
    email: 'rahim@bob.com',
    phone: '01912987654',
    password: 'member123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role: 'member',
    status: 'pending',
    monthly_target: 2000,
    joined_date: '2026-09-20',
    owned_shares: 0,
    nid: '19952692510000888',
    address: 'উত্তরা সেক্টর ৭, ঢাকা'
  },
  {
    id: 'BOB-M-103',
    full_name: 'তানভীর হোসেন',
    email: 'tanvir@bob.com',
    phone: '01755123456',
    password: 'member123',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    role: 'member',
    status: 'active',
    monthly_target: 5000,
    joined_date: '2024-05-10',
    owned_shares: 6,
    nid: '19912692510000789',
    address: 'ধানমন্ডি ২৭, ঢাকা'
  },
  {
    id: 'BOB-M-104',
    full_name: 'নুসরাত জাহান',
    email: 'nusrat@bob.com',
    phone: '01688998877',
    password: 'member123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'member',
    status: 'active',
    monthly_target: 3000,
    joined_date: '2024-06-01',
    owned_shares: 4,
    nid: '19942692510000999',
    address: 'বনশ্রী, ঢাকা'
  }
];

export const initialDeposits: Deposit[] = [
  {
    id: 'DEP-2026-001',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    type: 'monthly',
    amount: 5000,
    target_month: 'জানুয়ারি ২০২৬',
    payment_method: 'bKash',
    trx_id: 'BK9X8745QW',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    status: 'approved',
    created_at: '2026-01-05',
    approved_at: '2026-01-06',
    approved_by: 'সজিব মোল্লা (Admin)',
    note: 'জানুয়ারি মাসের নিয়মিত কিস্তি'
  },
  {
    id: 'DEP-2026-002',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    type: 'monthly',
    amount: 5000,
    target_month: 'ফেব্রুয়ারি ২০২৬',
    payment_method: 'Nagad',
    trx_id: 'NG4K9812RT',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    status: 'approved',
    created_at: '2026-02-04',
    approved_at: '2026-02-05',
    approved_by: 'সজিব মোল্লা (Admin)',
    note: 'ফেব্রুয়ারি মাসের নিয়মিত কিস্তি'
  },
  {
    id: 'DEP-2026-003',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    type: 'monthly',
    amount: 5000,
    target_month: 'মার্চ ২০২৬',
    payment_method: 'Bank',
    trx_id: 'IBBL-9920141',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    status: 'approved',
    created_at: '2026-03-05',
    approved_at: '2026-03-06',
    approved_by: 'সজিব মোল্লা (Admin)',
    note: 'মার্চ মাসের নিয়মিত কিস্তি'
  },
  {
    id: 'DEP-2026-004',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    type: 'lumpsum',
    amount: 150000,
    target_land_id: 'LAND-01',
    target_land_title: 'পূর্বাচল গ্রিন ভ্যালি ফেজ-১',
    payment_method: 'Bank',
    trx_id: 'IBBL-TRF-881239',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    status: 'approved',
    created_at: '2026-02-15',
    approved_at: '2026-02-16',
    approved_by: 'সজিব মোল্লা (Admin)',
    note: '২টি নতুন শেয়ারের এককালীন বরাদ্দ'
  },
  {
    id: 'DEP-2026-005',
    member_id: 'BOB-M-103',
    member_name: 'তানভীর হোসেন',
    type: 'monthly',
    amount: 5000,
    target_month: 'জানুয়ারি ২০২৬',
    payment_method: 'Rocket',
    trx_id: 'RK77665544',
    status: 'approved',
    created_at: '2026-01-08',
    approved_at: '2026-01-09',
    approved_by: 'সজিব মোল্লা (Admin)'
  },
  {
    id: 'DEP-2026-006',
    member_id: 'BOB-M-104',
    member_name: 'নুসরাত জাহান',
    type: 'lumpsum',
    amount: 100000,
    target_land_id: 'LAND-02',
    target_land_title: 'মেঘনা রিভারভিউ ইকো রিসোর্ট ও প্লট',
    payment_method: 'Bank',
    trx_id: 'EBL-DEP-449102',
    status: 'approved',
    created_at: '2026-03-01',
    approved_at: '2026-03-02',
    approved_by: 'সজিব মোল্লা (Admin)'
  },
  {
    id: 'DEP-2026-007',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    type: 'monthly',
    amount: 5000,
    target_month: 'এপ্রিল ২০২৬',
    payment_method: 'bKash',
    trx_id: 'BK12345678',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
    status: 'pending',
    created_at: '2026-04-02',
    note: 'এপ্রিল মাসের অগ্রিম কিস্তি জমা'
  }
];

export const initialLandProjects: LandProject[] = [
  {
    id: 'LAND-01',
    title: 'পূর্বাচল গ্রিন ভ্যালি ফেজ-১',
    location: 'পূর্বাচল সেক্টর ২১ সংলগ্ন, ৩০০ ফিট এক্সপ্রেসওয়ে লিংক, ঢাকা',
    size_decimals: 50,
    total_valuation: 7500000, // ৳ ৭৫,০০,০০০
    price_per_share: 75000, // ৳ ৭৫,০০০
    monthly_installment: 5000, // ৳ ৫,০০০ / মাস
    total_shares: 100,
    sold_shares: 88,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'ongoing',
    description: 'রাজউকের পূর্বাচল উপশহর ২১ নম্বর সেক্টর সংলগ্ন নিষ্কণ্টক উঁচু ভিটি জমি। গ্যাস ও বিদ্যুতের সুগম লাইন, প্রশস্ত ডিমার্কেশন রোড এবং চারদিকে সুরক্ষা সীমানা প্রাচীর সম্পন্ন।',
    features: ['৩০ ফিট প্রশস্থ পাকা সংযোগ সড়ক', 'ডিমার্কেশন পিলার ও বাউন্ডারি ওয়াল সম্পন্ন', '১০০% নির্ভেজাল সাব-কবলা দলিল', 'উঁচু বালু ভরাটকৃত ভিটি জমি'],
    shareholders: [
      { member_id: 'BOB-ADM-001', member_name: 'সজিব মোল্লা', shares_count: 15, allotted_date: '2024-02-01' },
      { member_id: 'BOB-M-101', member_name: 'সজিব আহমেদ', shares_count: 8, allotted_date: '2024-03-20' },
      { member_id: 'BOB-M-103', member_name: 'তানভীর হোসেন', shares_count: 6, allotted_date: '2024-05-15' },
      { member_id: 'BOB-M-104', member_name: 'নুসরাত জাহান', shares_count: 4, allotted_date: '2024-06-10' }
    ]
  },
  {
    id: 'LAND-02',
    title: 'মেঘনা রিভারভিউ ইকো রিসোর্ট ও প্লট',
    location: 'গজারিয়া, মুন্সীগঞ্জ (ঢাকা-চট্টগ্রাম হাইওয়ে সংলগ্ন)',
    size_decimals: 80,
    total_valuation: 12000000, // ৳ ১,২০,০০,০০০
    price_per_share: 60000, // ৳ ৬০,০০০
    monthly_installment: 5000, // ৳ ৫,০০০ / মাস
    total_shares: 200,
    sold_shares: 140,
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'ongoing',
    description: 'মেঘনা নদীর তীরবর্তী মনোরম প্রাকৃতিক পরিবেশে পরিবেশবান্ধব সমবায় ইকো-রিসোর্ট ও বাগানবাড়ি প্রকল্প। বিনিয়োগের পাশাপাশি বাৎসরিক অবকাশ যাপন ও মুনাফার সুবর্ণ সুযোগ।',
    features: ['নদীর তীরবর্তী মনোরম পরিবেশ', 'ঢাকা থেকে মাত্র ৪৫ মিনিটের দূরত্ব', 'রিসোর্ট শেয়ারহোল্ডারদের বাৎসরিক লভ্যাংশ', 'নিরাপদ বাউন্ডারি ও গার্ড শেড'],
    shareholders: [
      { member_id: 'BOB-ADM-001', member_name: 'সজিব মোল্লা', shares_count: 10, allotted_date: '2024-06-01' },
      { member_id: 'BOB-M-104', member_name: 'নুসরাত জাহান', shares_count: 5, allotted_date: '2024-07-15' }
    ]
  },
  {
    id: 'LAND-03',
    title: 'সাভার হেমায়েতপুর কমার্শিয়াল হাফ',
    location: 'হেমায়েতপুর বাসস্ট্যান্ড সংলগ্ন, সাভার, ঢাকা',
    size_decimals: 25,
    total_valuation: 6000000, // ৳ ৬০,০০,০০০
    price_per_share: 50000, // ৳ ৫০,০০০
    monthly_installment: 4000, // ৳ ৪,০০০ / মাস
    total_shares: 120,
    sold_shares: 60,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'upcoming',
    description: 'ভবিষ্যত বাণিজ্যিক মার্কেট ও ওয়্যারহাউজ নির্মাণের লক্ষ্যে প্রধান সড়কের মুখে অবস্থিত অত্যন্ত সম্ভাবনাময় বাণিজ্যিক প্লট।',
    features: ['প্রধান মহাসড়ক সংলগ্ন ফ্রন্টেজ', 'কমার্শিয়াল জোন পারমিশন', 'উচ্চ মূল্যায়নের নিশ্চয়তা', 'সহজ মাসিক কিস্তি সুবিধা'],
    shareholders: []
  }
];

export const initialDirectors: Director[] = [
  {
    id: 'DIR-01',
    name: 'সজিব মোল্লা',
    designation: 'ব্যবস্থাপনা পরিচালক ও প্রতিষ্ঠাতা',
    phone: '+880 1712-345678',
    email: 'sajib.molla@bob.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    quote: 'একক প্রচেষ্টায় যা দুঃসাধ্য, সমবায়ের যৌথ শক্তিতে তা অতি সহজ। সততা ও স্বচ্ছতাই আমাদের বন্ধনের মূল ভিত্তি।',
    order: 1
  },
  {
    id: 'DIR-02',
    name: 'ইঞ্জিনিয়ার তানজিম হাসান',
    designation: 'পরিচালক (প্রকল্প ও প্রকৌশল)',
    phone: '+880 1819-001122',
    email: 'tanzim.hasan@bob.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    quote: 'ভূমির সঠিক অবস্থান এবং আইনি সত্যতা যাচাই নিশ্চিত করাই আমাদের প্রধান প্রকৌশলগত অঙ্গীকার।',
    order: 2
  },
  {
    id: 'DIR-03',
    name: 'এডভোকেট সাইদুর রহমান',
    designation: 'পরিচালক (আইন ও নিরীক্ষা)',
    phone: '+880 1912-334455',
    email: 'saidur.law@bob.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    quote: 'প্রতিটি জমির সিএস, এসএ, আরএস ও নামজারি খতিয়ান পুঙ্খানুপুঙ্খ যাচাই করেই আমরা সম্পত্তিতে হাত দিই।',
    order: 3
  },
  {
    id: 'DIR-04',
    name: 'নাজমুন নাহার',
    designation: 'পরিচালক (অর্থ ও বিনিয়োগ)',
    phone: '+880 1688-556677',
    email: 'nazmun.nahar@bob.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    quote: 'সদস্যদের প্রতিটি টাকার নিরাপদ বিনিয়োগ এবং স্বচ্ছ হিসাব রক্ষণে আমরা সর্বোচ্চ আধুনিক প্রযুক্তি ব্যবহার করি।',
    order: 4
  }
];

export const initialPublicSubmissions: PublicLandSubmission[] = [
  {
    id: 'SUB-2026-001',
    seller_name: 'হাজী মোজাম্মেল হক',
    mobile: '01711223344',
    address: 'রূপগঞ্জ, নারায়ণগঞ্জ',
    land_location: 'কাঞ্চন ব্রিজ সংলগ্ন, পূর্বাচল এক্সপ্রেস লিংক রোড',
    size_decimals: 40,
    expected_price: 4200000,
    description: 'একদাগের উঁচু নাল জমি। রাস্তা লাগোয়া, কোনো আইনি বিরোধ নেই। জরুরি টাকার প্রয়োজনে বিক্রি করতে চাই।',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'],
    created_at: '2026-09-24',
    status: 'pending'
  }
];

export const initialBuyProposals: LandBuyProposal[] = [
  {
    id: 'BUY-2026-001',
    proposer_name: 'কাজী আরিফুল ইসলাম',
    mobile: '01815667788',
    address: 'উত্তরা সেক্টর ৩, ঢাকা',
    land_id: 'LAND-01',
    land_title: 'পূর্বাচল গ্রিন ভ্যালি ফেজ-১',
    proposed_shares_or_amount: '২টি শেয়ার',
    proposed_price: 150000,
    message: 'আমি এই প্রকল্পে ২ শেয়ারের কিস্তিতে বিনিয়োগ করতে বিশেষভাবে আগ্রহী। দ্রুত যোগাযোগ প্রত্যাশা করছি।',
    created_at: '2026-09-25',
    status: 'pending'
  }
];

export const initialMemberProposals: MemberLandProposal[] = [
  {
    id: 'MEM-PROP-001',
    member_id: 'BOB-M-101',
    member_name: 'সজিব আহমেদ',
    title: 'ময়মনসিংহ ভালুকায় ১০ বিঘা কৃষি ও কমার্শিয়াল জমি ক্রয়ের প্রস্তাব',
    location: 'ভালুকা মাস্টারবাড়ি সংলগ্ন, ময়মনসিংহ',
    estimated_budget: 3500000,
    size_decimals: 100,
    feasibility_rationale: 'জায়গাটি ঢাকা-ময়মনসিংহ ৪-লেন মহাসড়কের মাত্র ১ কিলোমিটারের মধ্যে। দ্রুত বর্ধনশীল শিল্প ও কৃষি বেল্ট হওয়ায় আগামী ৩ বছরে দ্বিগুণ লাভের সম্ভাবনা।',
    images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'],
    created_at: '2026-09-22',
    status: 'converted_to_poll'
  }
];

export const initialPolls: LandPoll[] = [
  {
    id: 'POLL-2026-001',
    title: 'ময়মনসিংহ ভালুকায় ১০০ শতাংশ কৃষি ও কমার্শিয়াল জমি অধিগ্রহণ পোল',
    proposal_type: 'member_proposal',
    proposal_ref_id: 'MEM-PROP-001',
    description: 'ভালুকা মাস্টারবাড়ি সংলগ্ন ১০০ শতাংশ জমি মোট ৩৫,০০,০০০ ৳ বাজেটে সমবায়ের অধীনে কেনার বিষয়ে সদস্যদের সুচিন্তিত মতামত ও ভোটাভুটি আহ্বান করা হচ্ছে।',
    location: 'ভালুকা মাস্টারবাড়ি সংলগ্ন, ময়মনসিংহ',
    size: '১০০ শতাংশ (৩ বিঘা প্রায়)',
    price_or_budget: 3500000,
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    status: 'active',
    created_at: '2026-09-23',
    ends_at: '2026-10-15',
    votes: {
      'BOB-ADM-001': {
        member_id: 'BOB-ADM-001',
        member_name: 'সজিব মোল্লা',
        decision: 'yes',
        comment: 'জায়গাটি ব্যক্তিগতভাবে দেখে এসেছি, কাগজপত্র ১০০% নিষ্কণ্টক। সমবায়ের জন্য চমৎকার বিনিয়োগ।',
        timestamp: '2026-09-23 11:30'
      },
      'BOB-M-103': {
        member_id: 'BOB-M-103',
        member_name: 'তানভীর হোসেন',
        decision: 'yes',
        comment: 'বাজেট সাশ্রয়ী এবং ভবিষ্যতে ভালো মূল্যায়ন হবে। আমার পূর্ণ সমর্থন রইল।',
        timestamp: '2026-09-24 14:10'
      },
      'BOB-M-104': {
        member_id: 'BOB-M-104',
        member_name: 'নুসরাত জাহান',
        decision: 'review',
        comment: 'পাকা রাস্তার সাথে সংযোগ ঠিক আছে কিনা তা আরেকবার সরেজমিনে যাচাই করা দরকার।',
        timestamp: '2026-09-25 09:45'
      }
    }
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'NOTIF-001',
    target_member_id: 'all',
    title: 'নতুন জমি ক্রয় প্রস্তাব ও পোল ভোটাভুটি!',
    message: 'ময়মনসিংহ ভালুকায় ১০০ শতাংশ জমি ক্রয়ের প্রস্তাবে আপনার মতামত ও ভোট দিন।',
    type: 'proposal_poll',
    created_at: '2026-09-23',
    read: false,
    link_tab: 'polling'
  },
  {
    id: 'NOTIF-002',
    target_member_id: 'BOB-M-101',
    title: 'মাসিক কিস্তির নোটিফিকেশন',
    message: 'সম্মানিত সজিব আহমেদ, চলতি মাসের মাসিক সঞ্চয় কিস্তি জমা দিয়ে আপনার হিসাব হালনাগাদ রাখুন।',
    type: 'due_alert',
    created_at: '2026-09-25',
    read: false,
    link_tab: 'dashboard'
  }
];
