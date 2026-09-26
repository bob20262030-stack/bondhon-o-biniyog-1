export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'pending' | 'blocked';
export type DepositType = 'monthly' | 'lumpsum';
export type DepositStatus = 'approved' | 'pending' | 'rejected';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash';
export type LandProjectStatus = 'ongoing' | 'completed' | 'upcoming';
export type VoteDecision = 'yes' | 'no' | 'review';

export interface Member {
  id: string;
  full_name: string;
  email: string; // Used as User ID
  phone: string;
  password?: string;
  avatar: string;
  role: UserRole;
  status: UserStatus;
  monthly_target: number; // minimum 1000 BDT
  joined_date: string;
  owned_shares: number;
  nid?: string;
  address?: string;
}

export interface Deposit {
  id: string;
  member_id: string;
  member_name: string;
  type: DepositType;
  amount: number;
  target_month?: string; // e.g. "জানুয়ারি ২০২৬"
  target_land_id?: string;
  target_land_title?: string;
  payment_method: PaymentMethod;
  trx_id: string;
  receipt_url?: string;
  status: DepositStatus;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  rejection_reason?: string;
  note?: string;
}

export interface Shareholder {
  member_id: string;
  member_name: string;
  shares_count: number;
  allotted_date: string;
}

export interface LandProject {
  id: string;
  title: string;
  location: string;
  size_decimals: number; // in শতাংশ / decimals
  total_valuation: number; // BDT
  price_per_share: number; // BDT
  monthly_installment: number; // e.g. 5,000 ৳/month
  total_shares: number;
  sold_shares: number;
  images: string[];
  status: LandProjectStatus;
  description: string;
  features: string[];
  shareholders: Shareholder[];
}

export interface PublicLandSubmission {
  id: string;
  seller_name: string;
  mobile: string;
  address: string;
  land_location: string;
  size_decimals: number;
  expected_price: number;
  description: string;
  images: string[];
  created_at: string;
  status: 'pending' | 'reviewed' | 'converted_to_poll' | 'rejected';
  admin_notes?: string;
}

export interface LandBuyProposal {
  id: string;
  proposer_name: string;
  mobile: string;
  address: string;
  land_id: string;
  land_title: string;
  proposed_shares_or_amount: string;
  proposed_price: number;
  message: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface MemberLandProposal {
  id: string;
  member_id: string;
  member_name: string;
  title: string;
  location: string;
  estimated_budget: number;
  size_decimals: number;
  feasibility_rationale: string;
  images: string[];
  created_at: string;
  status: 'submitted' | 'under_review' | 'converted_to_poll' | 'rejected';
  admin_feedback?: string;
}

export interface VoteRecord {
  member_id: string;
  member_name: string;
  decision: VoteDecision; // 'yes' | 'no' | 'review'
  comment?: string;
  timestamp: string;
}

export interface LandPoll {
  id: string;
  title: string;
  proposal_type: 'buy' | 'sell' | 'member_proposal';
  proposal_ref_id?: string;
  description: string;
  location: string;
  size: string;
  price_or_budget: number;
  image_url?: string;
  status: 'active' | 'closed';
  created_at: string;
  ends_at?: string;
  votes: Record<string, VoteRecord>; // member_id -> vote
}

export interface AppNotification {
  id: string;
  target_member_id: string; // 'all' or member ID
  title: string;
  message: string;
  type: 'due_alert' | 'proposal_poll' | 'deposit_status' | 'general';
  created_at: string;
  read: boolean;
  link_tab?: string;
}

export interface Director {
  id: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  avatar: string;
  quote: string;
  order: number;
}

export interface SystemSettings {
  brandName: string;
  slogan: string;
  logoUrl: string; // Can be base64 or URL
  hotline: string;
  callBtnText: string;
  supportHours: string;
  managerName: string;
  managerTitle: string;
  targetCapital: number; // e.g. 10,000,000 BDT
  marqueeNotices: string[];
  promoOffer: {
    enabled: boolean;
    badge: string;
    title: string;
    description: string;
    deadline: string;
    btnText: string;
    imageUrl: string;
  };
  paymentInfo: {
    bank: {
      bankName: string;
      accountName: string;
      accountNumber: string;
      branch: string;
      routing: string;
    };
    mobile: {
      bkash: string;
      nagad: string;
      rocket: string;
    };
    instructions: string;
  };
  authSignature: {
    signatureUrl: string; // uploaded digital signature
    signatoryName: string;
    designation: string;
    sealUrl: string; // official circular seal
  };
}
