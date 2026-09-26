import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Member,
  Deposit,
  LandProject,
  Director,
  SystemSettings,
  PublicLandSubmission,
  LandBuyProposal,
  MemberLandProposal
} from '../../types';
import { Logo } from '../common/Logo';
import { VoucherModal } from '../dashboard/VoucherModal';
import { useGoogleDrive } from '../../context/GoogleDriveContext';
import { GoogleSignInButton } from '../common/GoogleSignInButton';
import { BondhonD1AdminSection } from './BondhonD1AdminSection';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  PlusCircle,
  Edit2,
  Trash2,
  Upload,
  Receipt,
  MapPin,
  Coins,
  Settings,
  Megaphone,
  CreditCard,
  UserCheck,
  Eye,
  Key,
  PhoneCall,
  Vote,
  AlertTriangle,
  FileSignature,
  FileCheck,
  Sparkles,
  Cloud,
  Database,
  ExternalLink,
  Server,
  RefreshCw
} from 'lucide-react';
import {
  toBengaliNumber,
  formatCurrencyBengali,
  formatBengaliDate,
  BENGALI_MONTHS
} from '../../utils/bengali';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    members,
    addMember,
    updateMember,
    deleteMember,
    deposits,
    approveDeposit,
    rejectDeposit,
    landProjects,
    addLandProject,
    updateLandProject,
    deleteLandProject,
    directors,
    addDirector,
    updateDirector,
    deleteDirector,
    publicSubmissions,
    updatePublicSubmissionStatus,
    buyProposals,
    updateBuyProposalStatus,
    memberProposals,
    updateMemberProposalStatus,
    createPollFromProposal,
    settings,
    updateSettings,
    totalApprovedCapital,
    serverStatus,
    lastServerSyncTime,
    syncAllToServer,
    isServerSyncing
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'deposits' | 'members' | 'lands' | 'proposals' | 'branding' | 'offers' | 'payment' | 'directors' | 'drive_backup' | 'd1_items'
  >('deposits');

  // Google Drive integration
  const {
    googleUser,
    isConnected: isDriveConnected,
    saveBackupToDrive,
    savedFiles: driveSavedFiles,
    isSaving: isDriveSaving
  } = useGoogleDrive();
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [lastBackupLink, setLastBackupLink] = useState<string | null>(null);

  const handleExportFullBackupToDrive = async () => {
    setBackupStatus(null);
    try {
      const backupPayload = {
        exportedAt: new Date().toISOString(),
        exportedBy: currentUser?.full_name || 'Admin',
        brand: settings.brandName,
        totalCapital: totalApprovedCapital,
        membersCount: members.length,
        settings,
        members,
        deposits,
        landProjects,
        directors,
        publicSubmissions,
        buyProposals,
        memberProposals
      };

      const filename = `bob-cooperative-full-backup-${new Date().toISOString().split('T')[0]}.json`;
      const res = await saveBackupToDrive(backupPayload, filename);
      if (res) {
        setBackupStatus('সম্পূর্ণ সমবায় ব্যাকআপ গুগল ড্রাইভে সফলভাবে সংরক্ষিত হয়েছে!');
        if (res.webViewLink) {
          setLastBackupLink(res.webViewLink);
        }
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        return;
      }
      console.error(err);
      setBackupStatus(`ড্রাইভে ব্যাকআপ ব্যর্থ: ${err.message || 'অপ্রত্যাশিত ত্রুটি'}`);
    }
  };

  // Modals & form states
  const [selectedVoucherDeposit, setSelectedVoucherDeposit] = useState<Deposit | null>(null);
  const [rejectModalDeposit, setRejectModalDeposit] = useState<Deposit | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberFormData, setMemberFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    avatar: '',
    role: 'member' as 'member' | 'admin',
    status: 'active' as 'active' | 'pending' | 'blocked',
    monthly_target: 5000,
    owned_shares: 0,
    address: '',
    nid: ''
  });

  // Land Project Modal State
  const [landModalOpen, setLandModalOpen] = useState(false);
  const [editingLand, setEditingLand] = useState<LandProject | null>(null);
  const [landFormData, setLandFormData] = useState({
    title: '',
    location: '',
    size_decimals: 30,
    total_valuation: 5000000,
    price_per_share: 50000,
    monthly_installment: 5000,
    total_shares: 100,
    sold_shares: 50,
    status: 'ongoing' as 'ongoing' | 'completed' | 'upcoming',
    description: '',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
    features: ['৩০ ফিট প্রশস্থ সংযোগ সড়ক', '১০০% নির্ভেজাল সাব-কবলা দলিল']
  });

  // Director Modal State
  const [directorModalOpen, setDirectorModalOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [dirFormData, setDirFormData] = useState({
    name: '',
    designation: '',
    phone: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    quote: '',
    order: 1
  });

  // New Marquee Notice Input
  const [newNoticeText, setNewNoticeText] = useState('');

  // Pending deposits count
  const pendingDeposits = deposits.filter((d) => d.status === 'pending');

  // --- ACTIONS ---
  const handleApproveDeposit = (deposit: Deposit) => {
    approveDeposit(deposit.id, currentUser?.full_name || 'Admin');
  };

  const handleConfirmReject = () => {
    if (rejectModalDeposit && rejectionReason.trim()) {
      rejectDeposit(rejectModalDeposit.id, rejectionReason.trim());
      setRejectModalDeposit(null);
      setRejectionReason('');
    }
  };

  // Open Add/Edit Member Modal
  const handleOpenMemberModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setMemberFormData({
        full_name: member.full_name,
        email: member.email,
        phone: member.phone,
        password: member.password || '123456',
        avatar: member.avatar,
        role: member.role,
        status: member.status,
        monthly_target: member.monthly_target,
        owned_shares: member.owned_shares,
        address: member.address || '',
        nid: member.nid || ''
      });
    } else {
      setEditingMember(null);
      setMemberFormData({
        full_name: '',
        email: '',
        phone: '',
        password: 'member123',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        role: 'member',
        status: 'active',
        monthly_target: 5000,
        owned_shares: 0,
        address: '',
        nid: ''
      });
    }
    setMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMember(editingMember.id, memberFormData);
    } else {
      addMember(memberFormData);
    }
    setMemberModalOpen(false);
  };

  // Delete Member Confirmation
  const handleDeleteMember = (member: Member) => {
    const confirmed = window.confirm(
      `আপনি কি নিশ্চিত যে সদস্য "${member.full_name}" (${member.id}) এর সদস্যপদ বাতিল ও স্থায়ীভাবে মুছে ফেলতে চান?`
    );
    if (confirmed) {
      deleteMember(member.id);
    }
  };

  // Open Add/Edit Land Modal
  const handleOpenLandModal = (land?: LandProject) => {
    if (land) {
      setEditingLand(land);
      setLandFormData({
        title: land.title,
        location: land.location,
        size_decimals: land.size_decimals,
        total_valuation: land.total_valuation,
        price_per_share: land.price_per_share,
        monthly_installment: land.monthly_installment,
        total_shares: land.total_shares,
        sold_shares: land.sold_shares,
        status: land.status,
        description: land.description,
        images: land.images || [],
        features: land.features || []
      });
    } else {
      setEditingLand(null);
      setLandFormData({
        title: '',
        location: '',
        size_decimals: 30,
        total_valuation: 5000000,
        price_per_share: 50000,
        monthly_installment: 5000,
        total_shares: 100,
        sold_shares: 0,
        status: 'ongoing',
        description: '',
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
        features: ['৩০ ফিট প্রশস্থ পাকা সংযোগ সড়ক', '১০০% নির্ভেজাল সাব-কবলা দলিল']
      });
    }
    setLandModalOpen(true);
  };

  const handleSaveLand = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLand) {
      updateLandProject(editingLand.id, landFormData);
    } else {
      addLandProject(landFormData);
    }
    setLandModalOpen(false);
  };

  // Convert submission / proposal to Member Poll
  const handleCreatePollFromSubmission = (sub: PublicLandSubmission) => {
    createPollFromProposal({
      title: `${sub.seller_name} কর্তৃক প্রস্তাবিত ${toBengaliNumber(sub.size_decimals)} শতাংশ জমি ক্রয় পোল`,
      proposal_type: 'sell',
      proposal_ref_id: sub.id,
      description: sub.description,
      location: sub.land_location,
      size: `${toBengaliNumber(sub.size_decimals)} শতাংশ`,
      price_or_budget: sub.expected_price,
      image_url: sub.images[0] || undefined,
      status: 'active'
    });
    updatePublicSubmissionStatus(sub.id, 'converted_to_poll');
    alert('সফলভাবে সাধারণ সদস্যদের জন্য পোল ভোটাভুটি তৈরি হয়েছে এবং সকলকে নোটিফিকেশন পাঠানো হয়েছে!');
  };

  const handleCreatePollFromMemberProposal = (prop: MemberLandProposal) => {
    createPollFromProposal({
      title: prop.title,
      proposal_type: 'member_proposal',
      proposal_ref_id: prop.id,
      description: prop.feasibility_rationale,
      location: prop.location,
      size: `${toBengaliNumber(prop.size_decimals)} শতাংশ`,
      price_or_budget: prop.estimated_budget,
      image_url: prop.images[0] || undefined,
      status: 'active'
    });
    updateMemberProposalStatus(prop.id, 'converted_to_poll');
    alert('সফলভাবে সাধারণ সদস্যদের জন্য পোল ভোটাভুটি তৈরি হয়েছে এবং সকলকে নোটিফিকেশন পাঠানো হয়েছে!');
  };

  // Add Notice Ticker Item
  const handleAddNotice = () => {
    if (newNoticeText.trim()) {
      updateSettings({
        marqueeNotices: [...settings.marqueeNotices, newNoticeText.trim()]
      });
      setNewNoticeText('');
    }
  };

  const handleRemoveNotice = (index: number) => {
    const updated = settings.marqueeNotices.filter((_, i) => i !== index);
    updateSettings({ marqueeNotices: updated });
  };

  // Handle Logo Upload / Base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSettings({ logoUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Signature Upload / Base64
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateSettings({
            authSignature: {
              ...settings.authSignature,
              signatureUrl: reader.result
            }
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Panel Header & Status Ribbon */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-blue-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>সেন্ট্রাল এডমিন কন্ট্রোল রুম (A to Z পরিচালনা)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            বন্ধন ও বিনিয়োগ অ্যাডমিন প্যানেল
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            সদস্য, ভাউচার অনুমোদন, ভূমি প্রকল্প, শেয়ার, নোটিশ, পেমেন্ট তথ্য ও ডিজিটাল স্বাক্ষর পরিচালনা করুন
          </p>
        </div>

        {/* Top Controls & Financial Live Snapshot */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Server Real-time Cloud Sync Card */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${serverStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`} />
                  <span className="text-xs font-bold text-emerald-300">সার্ভার রিয়েলটাইম সিঙ্ক</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {serverStatus === 'connected' ? 'ক্লাউড সক্রিয় (Firestore)' : 'সংযোগ হচ্ছে...'}
                  {lastServerSyncTime ? ` • ${lastServerSyncTime}` : ''}
                </span>
              </div>
            </div>
            <button
              onClick={() => syncAllToServer()}
              disabled={isServerSyncing}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="সার্ভারে সমবায়ের সম্পূর্ণ তথ্য পুনরায় আপলোড বা সিঙ্ক করুন"
            >
              <RefreshCw className={`w-3 h-3 text-emerald-400 ${isServerSyncing ? 'animate-spin' : ''}`} />
              <span>{isServerSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভার সিঙ্ক'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">মোট সঞ্চিত মূলধন</span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-inter">
                {formatCurrencyBengali(totalApprovedCapital)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">অপেক্ষমাণ জমা</span>
              <span className="text-base sm:text-lg font-black text-rose-400 font-inter">
                {toBengaliNumber(pendingDeposits.length)} টি
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          onClick={() => setActiveTab('deposits')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'deposits'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>ভাউচার ও জমা অনুমোদন</span>
          {pendingDeposits.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-inter">
              {pendingDeposits.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'members'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>সদস্য ব্যবস্থাপনা</span>
        </button>

        <button
          onClick={() => setActiveTab('lands')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'lands'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>ভূমি প্রকল্প ও শেয়ার</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'proposals'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>জমি প্রস্তাব ও পোলিং</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>লগো, স্বাক্ষর ও নোটিশ</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'offers'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>বিজ্ঞাপন ও অফার</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'payment'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>অফিশিয়াল পেমেন্ট তথ্য</span>
        </button>

        <button
          onClick={() => setActiveTab('directors')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'directors'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>পরিচালনা পর্ষদ</span>
        </button>

        <button
          onClick={() => setActiveTab('drive_backup')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'drive_backup'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-400" />
          <span>গুগল ড্রাইভ ব্যাকআপ</span>
        </button>

        <button
          onClick={() => setActiveTab('d1_items')}
          className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'd1_items'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-blue-400" />
          <span>D1 ডেটাবেজ আইটেম</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: VOUCHER & DEPOSIT APPROVALS SUITE                       */}
      {/* ============================================================== */}
      {activeTab === 'deposits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-amber-400" />
              <span>জমা ভাউচার যাচাইকরণ ও অনুমোদন ড্যাশবোর্ড</span>
            </h3>
            <span className="text-xs text-slate-400">
              মোট জমা রেকর্ড: {toBengaliNumber(deposits.length)}টি
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ভাউচার নং</th>
                    <th className="p-3.5">সদস্যের নাম ও আইডি</th>
                    <th className="p-3.5">খাত / বিবরণ</th>
                    <th className="p-3.5">পরিমাণ</th>
                    <th className="p-3.5">পদ্ধতি ও TrxID</th>
                    <th className="p-3.5">রিসিট স্লিপ</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {deposits.map((dep) => (
                    <tr key={dep.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-blue-400 font-inter font-bold">
                        {dep.id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{dep.member_name}</div>
                        <div className="text-[10px] text-slate-500 font-inter">{dep.member_id}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-200 block">
                          {dep.type === 'monthly' ? `মাসিক (${dep.target_month || 'নিয়মিত'})` : 'এককালীন শেয়ার'}
                        </span>
                        {dep.target_land_title && (
                          <span className="text-[10px] text-amber-400 line-clamp-1">
                            {dep.target_land_title}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-black text-white font-inter text-sm">
                        {formatCurrencyBengali(dep.amount)}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{dep.payment_method}</div>
                        <div className="font-mono text-[10px] text-blue-300 font-inter">{dep.trx_id}</div>
                      </td>
                      <td className="p-3.5">
                        {dep.receipt_url ? (
                          <a
                            href={dep.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:underline bg-slate-950 px-2 py-1 rounded-lg border border-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>স্লিপ দেখুন</span>
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-600">নেই</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            dep.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : dep.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 animate-pulse'
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
                        {dep.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveDeposit(dep)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                              title="অনুমোদন করুন"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>অনুমোদন</span>
                            </button>
                            <button
                              onClick={() => setRejectModalDeposit(dep)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 font-bold text-xs cursor-pointer"
                              title="বাতিল করুন"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : dep.status === 'approved' ? (
                          <button
                            onClick={() => setSelectedVoucherDeposit(dep)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-slate-700 cursor-pointer"
                          >
                            ভাউচার রিসিট
                          </button>
                        ) : (
                          <span className="text-[10px] text-rose-400">{dep.rejection_reason || 'বাতিলকৃত'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: MEMBERS MASTER & CREDENTIALS MANAGEMENT                 */}
      {/* ============================================================== */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>সদস্য মাস্টার ও ইউজার আইডি/পাসওয়ার্ড নিয়ন্ত্রণ</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                সদস্য তৈরি, ডাটা ও ছবি এডিট, টার্গেট নির্ধারণ, আইডি/পাসওয়ার্ড পরিবর্তন ও সদস্য বাতিল
              </p>
            </div>

            <button
              onClick={() => handleOpenMemberModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন সদস্য যোগ করুন</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ছবি ও নাম</th>
                    <th className="p-3.5">আইডি ও ইমেইল (User ID)</th>
                    <th className="p-3.5">মোবাইল</th>
                    <th className="p-3.5">পাসওয়ার্ড</th>
                    <th className="p-3.5">মাসিক টার্গেট</th>
                    <th className="p-3.5">মালিকানাধীন শেয়ার</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-amber-400/50"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{member.full_name}</span>
                              {member.role === 'admin' && (
                                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-inter">
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 font-inter">
                              যোগদান: {member.joined_date}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-blue-400 font-inter font-bold">{member.id}</div>
                        <div className="text-slate-400 text-[11px] font-inter">{member.email}</div>
                      </td>
                      <td className="p-3.5 font-inter text-slate-300">{member.phone}</td>
                      <td className="p-3.5 font-mono text-slate-400">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 font-inter text-[11px]">
                          {member.password || '••••••'}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-400 font-inter">
                        {formatCurrencyBengali(member.monthly_target)}
                      </td>
                      <td className="p-3.5 font-bold text-amber-400 font-inter">
                        {toBengaliNumber(member.owned_shares)} টি
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            member.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : member.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {member.status === 'active'
                            ? 'সক্রিয়'
                            : member.status === 'pending'
                            ? 'পেন্ডিং'
                            : 'ব্লক'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Member Button */}
                          <button
                            onClick={() => handleOpenMemberModal(member)}
                            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                            title="তথ্য ও পাসওয়ার্ড সম্পাদনা"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          {/* 
                            REQUIREMENT SPEC:
                            "সদস্য বাতিল ও মুছে ফেলা: মেম্বার লিস্টের অ্যাকশন কলামে "সদস্য বাতিল" (Cancel/Delete Member) অপশন যুক্ত করা হয়েছে। বাতিল করার আগে কনফার্মেশন প্রম্পট প্রদর্শিত হয়।"
                          */}
                          {member.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteMember(member)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                              title="সদস্য বাতিল"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>সদস্য বাতিল</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LAND PROJECTS & SHARES                                  */}
      {/* ============================================================== */}
      {activeTab === 'lands' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>ভূমি প্রকল্প ও শেয়ার আর্থিক হিসেব</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                প্রতি শেয়ার মূল্য, কিস্তি, মোট ও অবশিষ্ট শেয়ার এবং মোট দাম পরিবর্তন
              </p>
            </div>

            <button
              onClick={() => handleOpenLandModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন ভূমি প্রকল্প যুক্ত করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {landProjects.map((land) => {
              const remaining = Math.max(0, land.total_shares - land.sold_shares);
              const remainingVal = remaining * land.price_per_share;

              return (
                <div
                  key={land.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-blue-400 font-bold text-xs">{land.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          land.status === 'ongoing'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {land.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{land.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{land.location}</p>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">প্রতি শেয়ার মূল্য:</span>
                        <span className="font-bold text-amber-400 font-inter">
                          {formatCurrencyBengali(land.price_per_share)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">মাসিক কিস্তি:</span>
                        <span className="font-bold text-emerald-400 font-inter">
                          {formatCurrencyBengali(land.monthly_installment)} / মাস
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">মোট শেয়ার:</span>
                        <span className="font-bold text-white font-inter">{toBengaliNumber(land.total_shares)} টি</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">অবশিষ্ট শেয়ার (খালি):</span>
                        <span className="font-black text-rose-400 font-inter">{toBengaliNumber(remaining)} টি</span>
                      </div>

                      <div className="flex justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">অবশিষ্ট শেয়ার মোট দাম:</span>
                        <span className="font-bold text-amber-300 font-inter text-xs">
                          {formatCurrencyBengali(remainingVal)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">মোট মূলধন:</span>
                        <span className="font-black text-white font-inter">
                          {formatCurrencyBengali(land.total_valuation)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleOpenLandModal(land)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>তথ্য ও মূল্য পরিবর্তন</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`প্রকল্প "${land.title}" মুছে ফেলতে চান?`)) {
                          deleteLandProject(land.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 cursor-pointer"
                      title="মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LAND PROPOSALS & MARKETPLACE SUBMISSIONS                */}
      {/* ============================================================== */}
      {activeTab === 'proposals' && (
        <div className="space-y-8">
          {/* Section 1: Public Land Submissions (from sellers) */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>পাবলিক জমি বিক্রির আবেদনসমূহ ({toBengaliNumber(publicSubmissions.length)})</span>
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">মালিকের নাম ও ফোন</th>
                      <th className="p-3.5">জমির অবস্থান</th>
                      <th className="p-3.5">পরিমাণ ও প্রত্যাশিত মূল্য</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">পোলিং অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {publicSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{sub.seller_name}</div>
                          <div className="text-slate-400 font-inter">{sub.mobile}</div>
                        </td>
                        <td className="p-3.5 text-slate-300 max-w-xs">{sub.land_location}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-amber-400 font-inter">
                            {formatCurrencyBengali(sub.expected_price)}
                          </div>
                          <div className="text-[11px] text-slate-400 font-inter">
                            {toBengaliNumber(sub.size_decimals)} শতাংশ
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400 font-inter">{sub.created_at}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                            {sub.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {sub.status !== 'converted_to_poll' ? (
                            <button
                              onClick={() => handleCreatePollFromSubmission(sub)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow cursor-pointer"
                              title="সদস্যদের ভোটাভুটির জন্য উন্মুক্ত করুন"
                            >
                              <Vote className="w-3.5 h-3.5" />
                              <span>পোল চালু করুন</span>
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-semibold text-[11px]">✓ পোল চলমান</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Member Land Purchase Proposals */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>সদস্য কর্তৃক দাখিলকৃত নতুন জমি ক্রয়ের প্রস্তাব ({toBengaliNumber(memberProposals.length)})</span>
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">প্রস্তাবক সদস্য</th>
                      <th className="p-3.5">প্রস্তাবের বিবরণ</th>
                      <th className="p-3.5">অবস্থান ও বাজেট</th>
                      <th className="p-3.5">তারিখ</th>
                      <th className="p-3.5">স্ট্যাটাস</th>
                      <th className="p-3.5 text-right">পোলিং অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {memberProposals.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5">
                          <div className="font-bold text-white">{prop.member_name}</div>
                          <div className="text-[10px] text-slate-500 font-inter">{prop.member_id}</div>
                        </td>
                        <td className="p-3.5 max-w-sm">
                          <div className="font-bold text-white">{prop.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{prop.feasibility_rationale}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-amber-400 font-inter">
                            {formatCurrencyBengali(prop.estimated_budget)}
                          </div>
                          <div className="text-[10px] text-slate-400">{prop.location}</div>
                        </td>
                        <td className="p-3.5 text-slate-400 font-inter">{prop.created_at}</td>
                        <td className="p-3.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                            {prop.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {prop.status !== 'converted_to_poll' ? (
                            <button
                              onClick={() => handleCreatePollFromMemberProposal(prop)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs flex items-center gap-1.5 ml-auto shadow cursor-pointer"
                            >
                              <Vote className="w-3.5 h-3.5" />
                              <span>পোল তৈরি করুন</span>
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-semibold text-[11px]">✓ পোল চলমান</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: LOGO, SIGNATURE, TICKER & SITE CMS                      */}
      {/* ============================================================== */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo & Authorized Signature Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-amber-400" />
              <span>অফিশিয়াল লগো ও ডিজিটাল স্বাক্ষর আপলোড</span>
            </h3>

            {/* Official Logo Upload */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">সমবায় সেন্ট্রাল লগো (All-in-One Logo)</h4>
                  <p className="text-[11px] text-slate-400">
                    হেডার, ফুটার, স্প্ল্যাশ স্ক্রিন, লগইন/সাইন ইন ও ভাউচারে এই লগো দৃশ্যমান হবে
                  </p>
                </div>
                <Logo size="md" />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ইমেজ URL দিন..."
                  value={settings.logoUrl}
                  onChange={(e) => updateSettings({ logoUrl: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
              {settings.logoUrl && (
                <button
                  onClick={() => updateSettings({ logoUrl: '' })}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  ডিফল্ট BoB ভেক্টর লগোতে ফিরুন
                </button>
              )}
            </div>

            {/* 
              REQUIREMENT SPEC:
              "ভাউচার সাক্ষরের ছবি ডমিন পেনেল থেকে আবরোট করার একটি অপশন থাকবে। সেটি বাউচারে থাকবে"
              "স্বাক্ষরের ছবি, স্বাক্ষরকারীর নাম, পদবী ও অনুমোদিত অফিস সিল সদস্যদের প্রতিটি প্রিন্টযোগ্য ভাউচার ও মানি রিসিটে দৃশ্যমান হয়।"
            */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white">ভাউচার ডিজিটাল স্বাক্ষর ও কর্মকর্তা</h4>
                <p className="text-[11px] text-slate-400">
                  সদস্যদের প্রতিটি মানি রিসিট ও স্টেটমেন্টে এই অনুমোদিত স্বাক্ষর ও নাম দৃশ্যমান হবে
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">অনুমোদিত কর্মকর্তার নাম</label>
                  <input
                    type="text"
                    value={settings.authSignature.signatoryName}
                    onChange={(e) =>
                      updateSettings({
                        authSignature: { ...settings.authSignature, signatoryName: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">পদবী</label>
                  <input
                    type="text"
                    value={settings.authSignature.designation}
                    onChange={(e) =>
                      updateSettings({
                        authSignature: { ...settings.authSignature, designation: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="স্বাক্ষরের ছবি URL (বা নিচের বোতাম চেপে ফাইল আপলোড করুন)..."
                  value={settings.authSignature.signatureUrl}
                  onChange={(e) =>
                    updateSettings({
                      authSignature: { ...settings.authSignature, signatureUrl: e.target.value }
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <label className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
              </div>

              {settings.authSignature.signatureUrl && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-[11px] text-slate-400">বর্তমান আপলোডকৃত স্বাক্ষর:</span>
                  <img
                    src={settings.authSignature.signatureUrl}
                    alt="Signature preview"
                    className="max-h-8 object-contain bg-white/90 p-1 rounded border border-slate-700"
                  />
                </div>
              )}
            </div>

            {/* Hotline & Contact CTA */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white">যোগাযোগ, হটলাইন ও সরাসরি কল (Call CTA)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">হটলাইন নম্বর</label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => updateSettings({ hotline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">কল বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={settings.callBtnText}
                    onChange={(e) => updateSettings({ callBtnText: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RTL Scrolling Notice Ticker CMS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-400" />
                <span>ডান থেকে বামে স্ক্রলিং বিজ্ঞপ্তি (RTL Marquee CMS)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                বিজ্ঞপ্তি ডান দিক থেকে বামে প্রবাহিত হবে এবং মাউস রাখলে স্বয়ংক্রিয়ভাবে থেমে যাবে।
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="নতুন নোটিশ লিখুন..."
                  value={newNoticeText}
                  onChange={(e) => setNewNoticeText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddNotice}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>যোগ করুন</span>
                </button>
              </div>

              <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden max-h-72 overflow-y-auto">
                {settings.marqueeNotices.map((notice, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-200">{notice}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveNotice(idx)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer shrink-0"
                      title="মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Capital Setting */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">
                সমবায়ের লক্ষ্যমাত্রা মূলধন (Target Capital BDT)
              </label>
              <input
                type="number"
                step={500000}
                value={settings.targetCapital}
                onChange={(e) =>
                  updateSettings({ targetCapital: parseInt(e.target.value) || 10000000 })
                }
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: SPECIAL PROMOTIONAL OFFER & ADVERTISEMENT CMS          */}
      {/* ============================================================== */}
      {activeTab === 'offers' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              <span>বিশেষ বিজ্ঞাপন ও প্রমোশনাল অফার ব্যবস্থাপনা</span>
            </h3>
            <p className="text-slate-400 mt-1">
              হোম পেজে বিশেষ অফার প্রদর্শন, সক্রিয়/নিষ্ক্রিয়করণ এবং ব্যানার টেক্সট পরিবর্তন করুন
            </p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-white">বিশেষ অফার সক্রিয় রাখুন:</span>
            <input
              type="checkbox"
              checked={settings.promoOffer.enabled}
              onChange={(e) =>
                updateSettings({
                  promoOffer: { ...settings.promoOffer, enabled: e.target.checked }
                })
              }
              className="w-5 h-5 accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">অফার ব্যাজ টেক্সট</label>
              <input
                type="text"
                value={settings.promoOffer.badge}
                onChange={(e) =>
                  updateSettings({
                    promoOffer: { ...settings.promoOffer, badge: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">অফারের শিরোনাম</label>
              <input
                type="text"
                value={settings.promoOffer.title}
                onChange={(e) =>
                  updateSettings({
                    promoOffer: { ...settings.promoOffer, title: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">অফারের বিস্তারিত বিবরণ</label>
              <textarea
                rows={3}
                value={settings.promoOffer.description}
                onChange={(e) =>
                  updateSettings({
                    promoOffer: { ...settings.promoOffer, description: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">মেয়াদ / সময়সীমা</label>
                <input
                  type="text"
                  value={settings.promoOffer.deadline}
                  onChange={(e) =>
                    updateSettings({
                      promoOffer: { ...settings.promoOffer, deadline: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">বাটন টেক্সট</label>
                <input
                  type="text"
                  value={settings.promoOffer.btnText}
                  onChange={(e) =>
                    updateSettings({
                      promoOffer: { ...settings.promoOffer, btnText: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: OFFICIAL PAYMENT INFO CMS                               */}
      {/* ============================================================== */}
      {activeTab === 'payment' && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>অফিশিয়াল পেমেন্ট তথ্য ও গেটওয়ে সেটিংস</span>
            </h3>
            <p className="text-slate-400 mt-1">
              ব্যাংক অ্যাকাউন্ট এবং বিকাশ/নগদ/রকেট মোবাইল নম্বর পরিবর্তন করুন
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2">
              ব্যাংক অ্যাকাউন্ট তথ্য
            </h4>

            <div>
              <label className="block text-slate-400 mb-1">ব্যাংকের নাম</label>
              <input
                type="text"
                value={settings.paymentInfo.bank.bankName}
                onChange={(e) =>
                  updateSettings({
                    paymentInfo: {
                      ...settings.paymentInfo,
                      bank: { ...settings.paymentInfo.bank, bankName: e.target.value }
                    }
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">হিসাবের নাম (Account Name)</label>
                <input
                  type="text"
                  value={settings.paymentInfo.bank.accountName}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        bank: { ...settings.paymentInfo.bank, accountName: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">হিসাব নম্বর (Account Number)</label>
                <input
                  type="text"
                  value={settings.paymentInfo.bank.accountNumber}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        bank: { ...settings.paymentInfo.bank, accountNumber: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">শাখা (Branch)</label>
                <input
                  type="text"
                  value={settings.paymentInfo.bank.branch}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        bank: { ...settings.paymentInfo.bank, branch: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">রাউটিং নম্বর (Routing)</label>
                <input
                  type="text"
                  value={settings.paymentInfo.bank.routing}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        bank: { ...settings.paymentInfo.bank, routing: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 pt-4">
              মোবাইল ফিন্যান্সিয়াল সার্ভিসেস (MFS)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">বিকাশ নম্বর</label>
                <input
                  type="text"
                  value={settings.paymentInfo.mobile.bkash}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        mobile: { ...settings.paymentInfo.mobile, bkash: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">নগদ নম্বর</label>
                <input
                  type="text"
                  value={settings.paymentInfo.mobile.nagad}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        mobile: { ...settings.paymentInfo.mobile, nagad: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">রকেট নম্বর</label>
                <input
                  type="text"
                  value={settings.paymentInfo.mobile.rocket}
                  onChange={(e) =>
                    updateSettings({
                      paymentInfo: {
                        ...settings.paymentInfo,
                        mobile: { ...settings.paymentInfo.mobile, rocket: e.target.value }
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">জমার সাধারণ নির্দেশনা</label>
              <textarea
                rows={2}
                value={settings.paymentInfo.instructions}
                onChange={(e) =>
                  updateSettings({
                    paymentInfo: { ...settings.paymentInfo, instructions: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 8: DIRECTORS & LEADERSHIP CMS                              */}
      {/* ============================================================== */}
      {activeTab === 'directors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>পরিচালনা পর্ষদের তথ্য, বাণী ও নেতৃত্ব ব্যবস্থাপনা</span>
            </h3>

            <button
              onClick={() => {
                setEditingDirector(null);
                setDirFormData({
                  name: '',
                  designation: '',
                  phone: '',
                  email: '',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                  quote: '',
                  order: directors.length + 1
                });
                setDirectorModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs flex items-center gap-2 shadow transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>নতুন পরিচালক যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {directors.map((dir) => (
              <div
                key={dir.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <img
                    src={dir.avatar}
                    alt={dir.name}
                    className="w-20 h-20 mx-auto rounded-2xl object-cover border-2 border-amber-500/50 shadow"
                  />
                  <div className="text-center">
                    <h4 className="font-bold text-white">{dir.name}</h4>
                    <p className="text-xs text-amber-400">{dir.designation}</p>
                  </div>
                  <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800 line-clamp-3">
                    "{dir.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setEditingDirector(dir);
                      setDirFormData({
                        name: dir.name,
                        designation: dir.designation,
                        phone: dir.phone,
                        email: dir.email,
                        avatar: dir.avatar,
                        quote: dir.quote,
                        order: dir.order
                      });
                      setDirectorModalOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    সম্পাদনা
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`পরিচালক "${dir.name}" কে মুছে ফেলতে চান?`)) {
                        deleteDirector(dir.id);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600/40 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: GOOGLE DRIVE BACKUP & CLOUD STORAGE                       */}
      {/* ============================================================== */}
      {activeTab === 'drive_backup' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="w-5 h-5 text-emerald-400" />
                <span>Google Drive ক্লাউড ব্যাকআপ ও নথি সংরক্ষণ</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                সমবায়ের সকল আর্থিক হিসাব, ভাউচার, লেজার ও সদস্যদের ডেটা নিরাপদে সরাসরি আপনার গুগল ড্রাইভে ফোল্ডারে ব্যাকআপ করুন
              </p>
            </div>

            {/* Export full backup button */}
            <button
              onClick={handleExportFullBackupToDrive}
              disabled={isDriveSaving}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Database className="w-4 h-4" />
              <span>{isDriveSaving ? 'ব্যাকআপ তৈরি ও আপলোড হচ্ছে...' : 'সম্পূর্ণ ডেটা ড্রাইভে ব্যাকআপ করুন'}</span>
            </button>
          </div>

          {/* Backup Status Toast/Notice */}
          {backupStatus && (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-200 text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{backupStatus}</span>
              </div>
              {lastBackupLink && (
                <a
                  href={lastBackupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <span>ড্রাইভে ফাইলটি দেখুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Connection status card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Google Drive সংযোগ স্থিতি</h4>
                  <p className="text-xs text-slate-400">অফিশিয়াল Google Drive API ইন্টিগ্রেশন</p>
                </div>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                <GoogleSignInButton className="w-full" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  গুগল ড্রাইভ কানেক্ট থাকলে মানি রিসিট, মাসিক কিস্তির ভাউচার এবং আর্থিক লেজার স্টেটমেন্ট এক ক্লিকে সরাসরি আপনার ড্রাইভের <strong className="text-emerald-400">"বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)"</strong> ফোল্ডারে সংরক্ষিত হবে।
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-400">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">স্বয়ংক্রিয় ক্লাউড ফোল্ডার</h4>
                  <p className="text-xs text-slate-400">ড্রাইভে সুরক্ষিত সাংগঠনিক ডিরেক্টরি</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">ফোল্ডার নাম:</span>
                  <span className="font-bold text-amber-400">বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">অনুমোদিত স্কোপ:</span>
                  <span className="font-mono text-[11px] text-emerald-300">drive.file (নিরাপদ ও সীমিত)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">সঞ্চয় ফরম্যাট:</span>
                  <span className="font-bold text-slate-200">PDF, JPG ও JSON ব্যাকআপ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Session Saved Files in Drive */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>এই সেশনে Google Drive এ সংরক্ষিত নথিপত্র</span>
              </span>
              <span className="text-xs text-slate-400 font-normal">
                মোট সংরক্ষিত: {driveSavedFiles.length} টি
              </span>
            </h4>

            {driveSavedFiles.length > 0 ? (
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden">
                {driveSavedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-slate-950/60 hover:bg-slate-950 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Cloud className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-white truncate max-w-sm">
                        {file.name}
                      </span>
                    </div>
                    {file.webViewLink && (
                      <a
                        href={file.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 font-semibold text-[11px] flex items-center gap-1 transition"
                      >
                        <span>ড্রাইভে খুলুন</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                এখনও কোনো নথি সরাসরি ড্রাইভে সেভ করা হয়নি। ভাউচার বা স্টেটমেন্টের "গুগল ড্রাইভে সেভ" বোতাম ব্যবহার করুন।
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CLOUDFLARE D1 DATABASE (bondhon_items)                    */}
      {/* ============================================================== */}
      {activeTab === 'd1_items' && (
        <BondhonD1AdminSection />
      )}

      {/* ============================================================== */}
      {/* MODALS SECTION                                                 */}
      {/* ============================================================== */}

      {/* MEMBER ADD / EDIT MODAL */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingMember ? 'সদস্যের তথ্য ও ক্রেডেনশিয়াল পরিবর্তন' : 'নতুন সদস্য যোগ করুন'}
            </h3>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">পূর্ণ নাম</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.full_name}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, full_name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={memberFormData.phone}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ইমেইল (User ID)
                  </label>
                  <input
                    type="email"
                    required
                    value={memberFormData.email}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">পাসওয়ার্ড</label>
                  <input
                    type="text"
                    required
                    value={memberFormData.password}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, password: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    মাসিক সঞ্চয় টার্গেট (টাকা)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    required
                    value={memberFormData.monthly_target}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        monthly_target: Math.max(1000, parseInt(e.target.value) || 1000)
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    মালিকানাধীন শেয়ার সংখ্যা
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={memberFormData.owned_shares}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        owned_shares: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">রোল (Role)</label>
                  <select
                    value={memberFormData.role}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        role: e.target.value as 'member' | 'admin'
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="member">সাধারণ সদস্য (Member)</option>
                    <option value="admin">অ্যাডমিন (Admin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">স্ট্যাটাস</label>
                  <select
                    value={memberFormData.status}
                    onChange={(e) =>
                      setMemberFormData({
                        ...memberFormData,
                        status: e.target.value as 'active' | 'pending' | 'blocked'
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="active">সক্রিয় (Active)</option>
                    <option value="pending">পেন্ডিং (Pending)</option>
                    <option value="blocked">স্থগিত/ব্লক (Blocked)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ছবি URL বা Base64</label>
                <input
                  type="text"
                  value={memberFormData.avatar}
                  onChange={(e) =>
                    setMemberFormData({ ...memberFormData, avatar: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMemberModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LAND ADD / EDIT MODAL */}
      {landModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingLand ? 'ভূমি প্রকল্পের তথ্য ও শেয়ার মূল্য পরিবর্তন' : 'নতুন ভূমি প্রকল্প যুক্তকরণ'}
            </h3>

            <form onSubmit={handleSaveLand} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">প্রকল্পের নাম</label>
                <input
                  type="text"
                  required
                  value={landFormData.title}
                  onChange={(e) => setLandFormData({ ...landFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">অবস্থান</label>
                <input
                  type="text"
                  required
                  value={landFormData.location}
                  onChange={(e) => setLandFormData({ ...landFormData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">জমির আয়তন (শতাংশ)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={landFormData.size_decimals}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        size_decimals: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">মোট মূল্যায়ন (টাকা)</label>
                  <input
                    type="number"
                    min={100000}
                    step={100000}
                    required
                    value={landFormData.total_valuation}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        total_valuation: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">প্রতি শেয়ার মূল্য (টাকা)</label>
                  <input
                    type="number"
                    min={5000}
                    step={5000}
                    required
                    value={landFormData.price_per_share}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        price_per_share: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">মাসিক কিস্তির পরিমাণ</label>
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    required
                    value={landFormData.monthly_installment}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        monthly_installment: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">সর্বমোট শেয়ার</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={landFormData.total_shares}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        total_shares: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">বিক্রীত শেয়ার</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={landFormData.sold_shares}
                    onChange={(e) =>
                      setLandFormData({
                        ...landFormData,
                        sold_shares: parseInt(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-inter focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">প্রকল্পের বিবরণ</label>
                <textarea
                  rows={2}
                  value={landFormData.description}
                  onChange={(e) =>
                    setLandFormData({ ...landFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setLandModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">
              জমা বাতিলের কারণ উল্লেখ করুন
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              সদস্য {rejectModalDeposit.member_name} (ভাউচার: {rejectModalDeposit.id}) এর জমার রসিদ কেন বাতিল করা হচ্ছে লিখুন:
            </p>

            <textarea
              rows={3}
              required
              placeholder="যেমন: ভুল ট্রানজেকশন আইডি অথবা ব্যাংক স্টেটমেন্টে টাকা জমা হয়নি..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 mb-4"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setRejectModalDeposit(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow disabled:opacity-50 cursor-pointer"
              >
                বাতিল নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER PREVIEW MODAL */}
      <VoucherModal
        isOpen={!!selectedVoucherDeposit}
        deposit={selectedVoucherDeposit}
        onClose={() => setSelectedVoucherDeposit(null)}
      />
    </div>
  );
};
