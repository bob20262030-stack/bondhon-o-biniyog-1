import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  AppNotification,
  VoteDecision
} from '../types';
import {
  initialSettings,
  initialMembers,
  initialDeposits,
  initialLandProjects,
  initialDirectors,
  initialPublicSubmissions,
  initialBuyProposals,
  initialMemberProposals,
  initialPolls,
  initialNotifications
} from '../data/seedData';
import {
  testServerConnection,
  subscribeToSettings,
  subscribeToMembers,
  subscribeToDeposits,
  subscribeToLandProjects,
  subscribeToDirectors,
  subscribeToPublicSubmissions,
  subscribeToBuyProposals,
  subscribeToMemberProposals,
  subscribeToPolls,
  subscribeToNotifications,
  saveSettingsToServer,
  saveMemberToServer,
  deleteMemberFromServer,
  saveDepositToServer,
  saveLandProjectToServer,
  deleteLandProjectFromServer,
  saveDirectorToServer,
  deleteDirectorFromServer,
  savePublicSubmissionToServer,
  saveBuyProposalToServer,
  saveMemberProposalToServer,
  savePollToServer,
  saveNotificationToServer,
  seedServerIfEmpty,
  uploadFullDatabaseToServer
} from '../services/db';

interface AppContextType {
  // Current user & auth
  currentUser: Member | null;
  setCurrentUser: (user: Member | null) => void;
  switchUser: (email: string) => void;
  login: (email: string, password: string) => { success: boolean; message: string };
  signup: (newMember: Omit<Member, 'id' | 'status' | 'joined_date' | 'owned_shares' | 'role'>) => { success: boolean; message: string };
  logout: () => void;
  
  // Settings & CMS
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Members CRUD
  members: Member[];
  addMember: (memberData: Omit<Member, 'id' | 'joined_date'>) => void;
  updateMember: (id: string, updatedData: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Deposits CRUD
  deposits: Deposit[];
  submitDeposit: (depositData: Omit<Deposit, 'id' | 'created_at' | 'status'>) => void;
  approveDeposit: (depositId: string, adminName: string) => void;
  rejectDeposit: (depositId: string, reason: string) => void;
  
  // Land Projects CRUD
  landProjects: LandProject[];
  addLandProject: (project: Omit<LandProject, 'id' | 'shareholders'>) => void;
  updateLandProject: (id: string, project: Partial<LandProject>) => void;
  deleteLandProject: (id: string) => void;
  
  // Directors CRUD
  directors: Director[];
  addDirector: (director: Omit<Director, 'id'>) => void;
  updateDirector: (id: string, director: Partial<Director>) => void;
  deleteDirector: (id: string) => void;
  
  // Proposals & Marketplace
  publicSubmissions: PublicLandSubmission[];
  submitPublicLand: (data: Omit<PublicLandSubmission, 'id' | 'created_at' | 'status'>) => void;
  updatePublicSubmissionStatus: (id: string, status: PublicLandSubmission['status'], adminNotes?: string) => void;
  
  buyProposals: LandBuyProposal[];
  submitBuyProposal: (data: Omit<LandBuyProposal, 'id' | 'created_at' | 'status'>) => void;
  updateBuyProposalStatus: (id: string, status: LandBuyProposal['status']) => void;
  
  memberProposals: MemberLandProposal[];
  submitMemberProposal: (data: Omit<MemberLandProposal, 'id' | 'created_at' | 'status'>) => void;
  updateMemberProposalStatus: (id: string, status: MemberLandProposal['status'], feedback?: string) => void;
  
  // Polls & Voting
  polls: LandPoll[];
  createPollFromProposal: (pollData: Omit<LandPoll, 'id' | 'created_at' | 'votes'>) => void;
  castVote: (pollId: string, decision: VoteDecision, comment?: string) => void;
  closePoll: (pollId: string) => void;
  
  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Navigation & UI
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  splashDismissed: boolean;
  dismissSplash: () => void;
  
  // Computed Financials
  totalApprovedCapital: number;
  getUserMonthlyPaidTotal: (memberId: string) => number;
  getUserLumpsumPaidTotal: (memberId: string) => number;
  getUserDueMonthsCount: (memberId: string) => number;
  getUserDueAmount: (memberId: string) => number;

  // Real-time Cloud Server Sync
  serverStatus: 'connected' | 'connecting' | 'offline' | 'error';
  lastServerSyncTime: string | null;
  syncAllToServer: () => Promise<boolean>;
  isServerSyncing: boolean;
  serverToast: string | null;
  dismissServerToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'bob_cooperative_v2_';

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('LocalStorage parse error for ' + key, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage save error for ' + key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => getStored('settings', initialSettings));
  const [members, setMembers] = useState<Member[]>(() => getStored('members', initialMembers));
  const [deposits, setDeposits] = useState<Deposit[]>(() => getStored('deposits', initialDeposits));
  const [landProjects, setLandProjects] = useState<LandProject[]>(() => getStored('landProjects', initialLandProjects));
  const [directors, setDirectors] = useState<Director[]>(() => getStored('directors', initialDirectors));
  const [publicSubmissions, setPublicSubmissions] = useState<PublicLandSubmission[]>(() => getStored('publicSubmissions', initialPublicSubmissions));
  const [buyProposals, setBuyProposals] = useState<LandBuyProposal[]>(() => getStored('buyProposals', initialBuyProposals));
  const [memberProposals, setMemberProposals] = useState<MemberLandProposal[]>(() => getStored('memberProposals', initialMemberProposals));
  const [polls, setPolls] = useState<LandPoll[]>(() => getStored('polls', initialPolls));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStored('notifications', initialNotifications));
  
  // Real-time Server Sync State
  const [serverStatus, setServerStatus] = useState<'connected' | 'connecting' | 'offline' | 'error'>('connecting');
  const [lastServerSyncTime, setLastServerSyncTime] = useState<string | null>(null);
  const [isServerSyncing, setIsServerSyncing] = useState<boolean>(false);
  const [serverToast, setServerToast] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const showServerToast = (msg: string) => {
    setServerToast(msg);
    setTimeout(() => {
      setServerToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const dismissServerToast = () => setServerToast(null);

  // Default logged-in demo user: Admin or Member
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_PREFIX + 'current_user_id');
    const all = getStored('members', initialMembers);
    if (savedId) {
      const found = all.find((m: Member) => m.id === savedId);
      if (found) return found;
    }
    // Default to Active Member sajib@bob.com for interactive exploration
    return all.find((m: Member) => m.email === 'sajib@bob.com') || all[1] || all[0];
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [splashDismissed, setSplashDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('bob_splash_dismissed') === 'true';
  });

  // Local storage synchronization as cache
  useEffect(() => { setStored('settings', settings); }, [settings]);
  useEffect(() => { setStored('members', members); }, [members]);
  useEffect(() => { setStored('deposits', deposits); }, [deposits]);
  useEffect(() => { setStored('landProjects', landProjects); }, [landProjects]);
  useEffect(() => { setStored('directors', directors); }, [directors]);
  useEffect(() => { setStored('publicSubmissions', publicSubmissions); }, [publicSubmissions]);
  useEffect(() => { setStored('buyProposals', buyProposals); }, [buyProposals]);
  useEffect(() => { setStored('memberProposals', memberProposals); }, [memberProposals]);
  useEffect(() => { setStored('polls', polls); }, [polls]);
  useEffect(() => { setStored('notifications', notifications); }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'current_user_id', currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_KEY_PREFIX + 'current_user_id');
    }
  }, [currentUser]);

  // --------------------------------------------------------------------------
  // INITIALIZE FIRESTORE REAL-TIME SUBSCRIPTIONS & SEED IF EMPTY
  // --------------------------------------------------------------------------
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    async function initCloudSync() {
      try {
        const isOnline = await testServerConnection();
        if (isOnline) {
          setServerStatus('connected');

          // Check if server is brand new and needs initial seed
          await seedServerIfEmpty({
            settings,
            members,
            deposits,
            landProjects,
            directors,
            publicSubmissions,
            buyProposals,
            memberProposals,
            polls,
            notifications
          });

          // Setup real-time listener for Settings
          const unsubSet = subscribeToSettings((remoteSettings) => {
            if (remoteSettings && remoteSettings.brandName) {
              setSettings(remoteSettings);
              setServerStatus('connected');
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            }
          });
          unsubs.push(unsubSet);

          // Setup real-time listener for Members
          const unsubMem = subscribeToMembers((remoteMembers) => {
            if (remoteMembers && remoteMembers.length > 0) {
              setMembers(remoteMembers);
              setServerStatus('connected');
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
              // Keep current user state in sync if modified on server
              setCurrentUser((current) => {
                if (!current) return current;
                const found = remoteMembers.find((m) => m.id === current.id);
                return found || current;
              });
            }
          });
          unsubs.push(unsubMem);

          // Setup real-time listener for Deposits
          const unsubDep = subscribeToDeposits((remoteDeposits) => {
            if (remoteDeposits && remoteDeposits.length > 0) {
              setDeposits(remoteDeposits);
              setServerStatus('connected');
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            }
          });
          unsubs.push(unsubDep);

          // Setup real-time listener for Land Projects
          const unsubProj = subscribeToLandProjects((remoteProjects) => {
            if (remoteProjects && remoteProjects.length > 0) {
              setLandProjects(remoteProjects);
              setServerStatus('connected');
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            }
          });
          unsubs.push(unsubProj);

          // Setup real-time listener for Directors
          const unsubDir = subscribeToDirectors((remoteDirectors) => {
            if (remoteDirectors && remoteDirectors.length > 0) {
              setDirectors(remoteDirectors);
              setServerStatus('connected');
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            }
          });
          unsubs.push(unsubDir);

          // Setup real-time listener for Public Submissions
          const unsubPub = subscribeToPublicSubmissions((remoteSubs) => {
            if (remoteSubs) {
              setPublicSubmissions(remoteSubs);
              setServerStatus('connected');
            }
          });
          unsubs.push(unsubPub);

          // Setup real-time listener for Buy Proposals
          const unsubBuy = subscribeToBuyProposals((remoteBuys) => {
            if (remoteBuys) {
              setBuyProposals(remoteBuys);
              setServerStatus('connected');
            }
          });
          unsubs.push(unsubBuy);

          // Setup real-time listener for Member Proposals
          const unsubMemProp = subscribeToMemberProposals((remoteProps) => {
            if (remoteProps) {
              setMemberProposals(remoteProps);
              setServerStatus('connected');
            }
          });
          unsubs.push(unsubMemProp);

          // Setup real-time listener for Polls
          const unsubPoll = subscribeToPolls((remotePolls) => {
            if (remotePolls) {
              setPolls(remotePolls);
              setServerStatus('connected');
            }
          });
          unsubs.push(unsubPoll);

          // Setup real-time listener for Notifications
          const unsubNotif = subscribeToNotifications((remoteNotifs) => {
            if (remoteNotifs) {
              setNotifications(remoteNotifs);
              setServerStatus('connected');
            }
          });
          unsubs.push(unsubNotif);

          setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
        } else {
          setServerStatus('offline');
        }
      } catch {
        setServerStatus('offline');
      }
    }

    initCloudSync();

    return () => {
      unsubs.forEach((fn) => fn && fn());
    };
  }, []);

  // Force sync entire database to server (admin tool)
  const syncAllToServer = async (): Promise<boolean> => {
    setIsServerSyncing(true);
    try {
      await uploadFullDatabaseToServer({
        settings,
        members,
        deposits,
        landProjects,
        directors,
        publicSubmissions,
        buyProposals,
        memberProposals,
        polls,
        notifications
      });
      setServerStatus('connected');
      setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      showServerToast('সার্ভারে সমবায়ের সকল ডেটা সফলভাবে সিঙ্ক ও আপডেট হয়েছে!');
      return true;
    } catch (err: any) {
      console.error('Manual server sync error:', err);
      showServerToast(`সার্ভারে আপলোডে সমস্যা: ${err?.message || 'সার্ভার সংযোগে ত্রুটি'}`);
      setServerStatus('error');
      return false;
    } finally {
      setIsServerSyncing(false);
    }
  };

  const dismissSplash = useCallback(() => {
    setSplashDismissed(true);
    sessionStorage.setItem('bob_splash_dismissed', 'true');
  }, []);

  const switchUser = (email: string) => {
    const target = members.find((m) => m.email.toLowerCase() === email.toLowerCase());
    if (target) {
      setCurrentUser(target);
      if (target.role === 'admin') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('dashboard');
      }
    }
  };

  const login = (email: string, password: string) => {
    const found = members.find(
      (m) => m.email.toLowerCase() === email.toLowerCase() && (m.password ? m.password === password : password === '123456')
    );
    if (!found) {
      return { success: false, message: 'ভুল ইমেইল বা পাসওয়ার্ড! পুনরায় চেষ্টা করুন।' };
    }
    if (found.status === 'blocked') {
      return { success: false, message: 'আপনার অ্যাকাউন্টটি স্থগিত বা ব্লক করা হয়েছে। অ্যাডমিনের সাথে যোগাযোগ করুন।' };
    }
    setCurrentUser(found);
    if (found.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('dashboard');
    }
    return { success: true, message: 'সফলভাবে লগইন হয়েছে!' };
  };

  const signup = (newMember: Omit<Member, 'id' | 'status' | 'joined_date' | 'owned_shares' | 'role'>) => {
    if (members.some((m) => m.email.toLowerCase() === newMember.email.toLowerCase())) {
      return { success: false, message: 'এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট নিবন্ধিত রয়েছে।' };
    }
    if (newMember.monthly_target < 1000) {
      return { success: false, message: 'মাসিক সঞ্চয় টার্গেট সর্বনিম্ন ১,০০০ টাকা হতে হবে।' };
    }

    const newId = `BOB-M-${100 + members.length + 1}`;
    const created: Member = {
      ...newMember,
      id: newId,
      status: 'pending',
      role: 'member',
      joined_date: new Date().toISOString().split('T')[0],
      owned_shares: 0
    };

    setMembers((prev) => [...prev, created]);
    setCurrentUser(created);
    setCurrentTab('dashboard');

    // Notify admins
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      target_member_id: 'all',
      title: 'নতুন সদস্যের আবেদন!',
      message: `${created.full_name} সমবায়ে যোগদানের আবেদন করেছেন। অনুমোদনের জন্য সদস্য তালিকা দেখুন।`,
      type: 'general',
      created_at: new Date().toISOString().split('T')[0],
      read: false,
      link_tab: 'admin'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Save to Server
    saveMemberToServer(created).catch((e) => console.error('Save member to server error:', e));
    saveNotificationToServer(newNotif).catch((e) => console.error('Save notif to server error:', e));

    return {
      success: true,
      message: 'রেজিস্ট্রেশন সফল হয়েছে! অ্যাডমিন অনুমোদনের পর সকল সুবিধা সক্রিয় হবে।'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
  };

  // --------------------------------------------------------------------------
  // ADMIN UPDATE SETTINGS -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // Save directly to Cloud Server
      saveSettingsToServer(updated)
        .then(() => {
          showServerToast('সার্ভার সেটিংস সফলভাবে আপডেট হয়েছে!');
          setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
        })
        .catch((e) => console.error('Settings server update error:', e));
      return updated;
    });
  };

  // --------------------------------------------------------------------------
  // ADMIN MEMBERS CRUD -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const addMember = (memberData: Omit<Member, 'id' | 'joined_date'>) => {
    const newId = `BOB-M-${100 + members.length + 1}`;
    const newMember: Member = {
      ...memberData,
      id: newId,
      joined_date: new Date().toISOString().split('T')[0]
    };
    setMembers((prev) => [...prev, newMember]);
    // Save to Server
    saveMemberToServer(newMember)
      .then(() => {
        showServerToast(`সদস্য "${newMember.full_name}" সার্ভারে সফলভাবে সংরক্ষিত হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Member server save error:', e));
  };

  const updateMember = (id: string, updatedData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updatedData };
          if (currentUser && currentUser.id === id) {
            setCurrentUser(updated);
          }
          // Save to Server
          saveMemberToServer(updated)
            .then(() => {
              showServerToast(`সদস্য "${updated.full_name}" এর তথ্য সার্ভারে আপডেট হয়েছে!`);
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            })
            .catch((e) => console.error('Member server update error:', e));
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMember = (id: string) => {
    const target = members.find((m) => m.id === id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
      setCurrentTab('home');
    }
    // Delete from Server
    deleteMemberFromServer(id)
      .then(() => {
        showServerToast(`সদস্য "${target?.full_name || id}" সার্ভার থেকে মুছে ফেলা হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Member server delete error:', e));
  };

  // --------------------------------------------------------------------------
  // DEPOSITS CRUD -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const submitDeposit = (depositData: Omit<Deposit, 'id' | 'created_at' | 'status'>) => {
    const newId = `DEP-${new Date().getFullYear()}-${String(deposits.length + 1).padStart(3, '0')}`;
    const newDeposit: Deposit = {
      ...depositData,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setDeposits((prev) => [newDeposit, ...prev]);

    // Admin notification
    const adminNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      target_member_id: 'BOB-ADM-001',
      title: 'নতুন জমার ভাউচার যাচাইকরণ',
      message: `${newDeposit.member_name} ৳ ${newDeposit.amount} এর জমার রসিদ জমা দিয়েছেন (TrxID: ${newDeposit.trx_id})।`,
      type: 'deposit_status',
      created_at: new Date().toISOString().split('T')[0],
      read: false,
      link_tab: 'admin'
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    // Save to Server
    saveDepositToServer(newDeposit).catch((e) => console.error('Deposit save server error:', e));
    saveNotificationToServer(adminNotif).catch((e) => console.error('Notification save server error:', e));
    showServerToast('জমার রসিদ সার্ভারে জমা হয়েছে!');
  };

  const approveDeposit = (depositId: string, adminName: string) => {
    let targetDep: Deposit | undefined;
    setDeposits((prev) =>
      prev.map((dep) => {
        if (dep.id === depositId) {
          const approved: Deposit = {
            ...dep,
            status: 'approved',
            approved_at: new Date().toISOString().split('T')[0],
            approved_by: adminName
          };
          targetDep = approved;
          // Save to Server
          saveDepositToServer(approved)
            .then(() => {
              showServerToast(`ভাউচার ${depositId} সার্ভারে অনুমোদিত হিসেবে সেভ হয়েছে!`);
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            })
            .catch((e) => console.error('Deposit approve server error:', e));
          return approved;
        }
        return dep;
      })
    );

    // Notify member
    if (targetDep) {
      const memberNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        target_member_id: (targetDep as Deposit).member_id,
        title: 'জমার ভাউচার অনুমোদিত হয়েছে!',
        message: `আপনার ৳ ${(targetDep as Deposit).amount} এর জমা (আইডি: ${(targetDep as Deposit).id}) সফলভাবে অনুমোদিত ও অ্যাকাউন্টে জমা হয়েছে।`,
        type: 'deposit_status',
        created_at: new Date().toISOString().split('T')[0],
        read: false,
        link_tab: 'dashboard'
      };
      setNotifications((prev) => [memberNotif, ...prev]);
      saveNotificationToServer(memberNotif).catch((e) => console.error(e));
    }
  };

  const rejectDeposit = (depositId: string, reason: string) => {
    let targetDep: Deposit | undefined;
    setDeposits((prev) =>
      prev.map((dep) => {
        if (dep.id === depositId) {
          const rejected: Deposit = {
            ...dep,
            status: 'rejected',
            rejection_reason: reason
          };
          targetDep = rejected;
          // Save to Server
          saveDepositToServer(rejected)
            .then(() => {
              showServerToast(`ভাউচার ${depositId} বাতিল হিসেবে সার্ভারে সংরক্ষিত হয়েছে!`);
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            })
            .catch((e) => console.error('Deposit reject server error:', e));
          return rejected;
        }
        return dep;
      })
    );

    if (targetDep) {
      const memberNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        target_member_id: (targetDep as Deposit).member_id,
        title: 'জমার ভাউচার বাতিল হয়েছে',
        message: `আপনার ৳ ${(targetDep as Deposit).amount} এর জমা বাতিল করা হয়েছে। কারণ: ${reason}`,
        type: 'deposit_status',
        created_at: new Date().toISOString().split('T')[0],
        read: false,
        link_tab: 'dashboard'
      };
      setNotifications((prev) => [memberNotif, ...prev]);
      saveNotificationToServer(memberNotif).catch((e) => console.error(e));
    }
  };

  // --------------------------------------------------------------------------
  // LAND PROJECTS CRUD -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const addLandProject = (projectData: Omit<LandProject, 'id' | 'shareholders'>) => {
    const newId = `LAND-${String(landProjects.length + 1).padStart(2, '0')}`;
    const newProject: LandProject = {
      ...projectData,
      id: newId,
      shareholders: []
    };
    setLandProjects((prev) => [...prev, newProject]);
    // Save to Server
    saveLandProjectToServer(newProject)
      .then(() => {
        showServerToast(`নতুন জমি প্রকল্প "${newProject.title}" সার্ভারে সেভ হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Project save server error:', e));
  };

  const updateLandProject = (id: string, updated: Partial<LandProject>) => {
    setLandProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === id) {
          const newProj = { ...proj, ...updated };
          // Save to Server
          saveLandProjectToServer(newProj)
            .then(() => {
              showServerToast(`প্রকল্প "${newProj.title}" সার্ভারে আপডেট হয়েছে!`);
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            })
            .catch((e) => console.error('Project update server error:', e));
          return newProj;
        }
        return proj;
      })
    );
  };

  const deleteLandProject = (id: string) => {
    const target = landProjects.find((p) => p.id === id);
    setLandProjects((prev) => prev.filter((proj) => proj.id !== id));
    // Delete from Server
    deleteLandProjectFromServer(id)
      .then(() => {
        showServerToast(`প্রকল্প "${target?.title || id}" সার্ভার থেকে মুছে ফেলা হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Project delete server error:', e));
  };

  // --------------------------------------------------------------------------
  // DIRECTORS CRUD -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const addDirector = (dirData: Omit<Director, 'id'>) => {
    const newId = `DIR-${String(directors.length + 1).padStart(2, '0')}`;
    const newDirector: Director = { ...dirData, id: newId };
    setDirectors((prev) => [...prev, newDirector]);
    // Save to Server
    saveDirectorToServer(newDirector)
      .then(() => {
        showServerToast(`পরিচালক "${newDirector.name}" সার্ভারে যুক্ত হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Director save server error:', e));
  };

  const updateDirector = (id: string, updated: Partial<Director>) => {
    setDirectors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const newDir = { ...d, ...updated };
          // Save to Server
          saveDirectorToServer(newDir)
            .then(() => {
              showServerToast(`পরিচালক "${newDir.name}" এর তথ্য সার্ভারে আপডেট হয়েছে!`);
              setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
            })
            .catch((e) => console.error('Director update server error:', e));
          return newDir;
        }
        return d;
      })
    );
  };

  const deleteDirector = (id: string) => {
    const target = directors.find((d) => d.id === id);
    setDirectors((prev) => prev.filter((d) => d.id !== id));
    // Delete from Server
    deleteDirectorFromServer(id)
      .then(() => {
        showServerToast(`পরিচালক "${target?.name || id}" সার্ভার থেকে অপসারণ করা হয়েছে!`);
        setLastServerSyncTime(new Date().toLocaleTimeString('bn-BD'));
      })
      .catch((e) => console.error('Director delete server error:', e));
  };

  // --------------------------------------------------------------------------
  // PROPOSALS & MARKETPLACE -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const submitPublicLand = (data: Omit<PublicLandSubmission, 'id' | 'created_at' | 'status'>) => {
    const newId = `SUB-${new Date().getFullYear()}-${String(publicSubmissions.length + 1).padStart(3, '0')}`;
    const newSub: PublicLandSubmission = {
      ...data,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setPublicSubmissions((prev) => [newSub, ...prev]);
    savePublicSubmissionToServer(newSub).catch((e) => console.error('Public sub server error:', e));
    showServerToast('জমির প্রস্তাব সার্ভারে সফলভাবে পাঠানো হয়েছে!');
  };

  const updatePublicSubmissionStatus = (id: string, status: PublicLandSubmission['status'], adminNotes?: string) => {
    setPublicSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === id) {
          const updated: PublicLandSubmission = { ...sub, status, admin_notes: adminNotes || sub.admin_notes };
          savePublicSubmissionToServer(updated)
            .then(() => showServerToast(`জমির প্রস্তাবের স্ট্যাটাস সার্ভারে আপডেট হয়েছে: ${status}`))
            .catch((e) => console.error('Public sub update server error:', e));
          return updated;
        }
        return sub;
      })
    );
  };

  const submitBuyProposal = (data: Omit<LandBuyProposal, 'id' | 'created_at' | 'status'>) => {
    const newId = `BUY-${new Date().getFullYear()}-${String(buyProposals.length + 1).padStart(3, '0')}`;
    const newBuy: LandBuyProposal = {
      ...data,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setBuyProposals((prev) => [newBuy, ...prev]);
    saveBuyProposalToServer(newBuy).catch((e) => console.error('Buy proposal server error:', e));
    showServerToast('ক্রয় প্রস্তাব সার্ভারে গৃহীত হয়েছে!');
  };

  const updateBuyProposalStatus = (id: string, status: LandBuyProposal['status']) => {
    setBuyProposals((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated: LandBuyProposal = { ...b, status };
          saveBuyProposalToServer(updated)
            .then(() => showServerToast(`ক্রয় প্রস্তাব স্ট্যাটাস সার্ভারে আপডেট হয়েছে: ${status}`))
            .catch((e) => console.error('Buy proposal update server error:', e));
          return updated;
        }
        return b;
      })
    );
  };

  const submitMemberProposal = (data: Omit<MemberLandProposal, 'id' | 'created_at' | 'status'>) => {
    const newId = `MEM-PROP-${String(memberProposals.length + 1).padStart(3, '0')}`;
    const newProp: MemberLandProposal = {
      ...data,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };
    setMemberProposals((prev) => [newProp, ...prev]);

    const notif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      target_member_id: 'all',
      title: 'নতুন ভূমি অধিগ্রহণ প্রস্তাব দাখিল!',
      message: `${newProp.member_name} একটি নতুন জমি ক্রয়ের প্রস্তাব দাখিল করেছেন (${newProp.title})। মতামত ও ভোটের জন্য প্রস্তুত থাকুন।`,
      type: 'proposal_poll',
      created_at: new Date().toISOString().split('T')[0],
      read: false,
      link_tab: 'polling'
    };
    setNotifications((prev) => [notif, ...prev]);

    // Save to Server
    saveMemberProposalToServer(newProp).catch((e) => console.error('Member proposal server error:', e));
    saveNotificationToServer(notif).catch((e) => console.error('Notif server error:', e));
    showServerToast('সদস্য প্রস্তাব সার্ভারে সংরক্ষিত হয়েছে!');
  };

  const updateMemberProposalStatus = (id: string, status: MemberLandProposal['status'], feedback?: string) => {
    setMemberProposals((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated: MemberLandProposal = { ...p, status, admin_feedback: feedback || p.admin_feedback };
          saveMemberProposalToServer(updated)
            .then(() => showServerToast(`প্রস্তাব স্ট্যাটাস সার্ভারে আপডেট হয়েছে!`))
            .catch((e) => console.error('Member proposal update server error:', e));
          return updated;
        }
        return p;
      })
    );
  };

  // --------------------------------------------------------------------------
  // POLLS & VOTING -> SAVES TO SERVER
  // --------------------------------------------------------------------------
  const createPollFromProposal = (pollData: Omit<LandPoll, 'id' | 'created_at' | 'votes'>) => {
    const newId = `POLL-${new Date().getFullYear()}-${String(polls.length + 1).padStart(3, '0')}`;
    const newPoll: LandPoll = {
      ...pollData,
      id: newId,
      created_at: new Date().toISOString().split('T')[0],
      votes: {}
    };
    setPolls((prev) => [newPoll, ...prev]);

    const pollNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      target_member_id: 'all',
      title: 'নতুন জমি ক্রয়-বিক্রয় পোল চালু হয়েছে!',
      message: `প্রকল্প: "${newPoll.title}" এ আপনার মতামত ও ভোট দিন। সমবায়ের প্রতিটি সদস্যের মতামত সমান মূল্যবান।`,
      type: 'proposal_poll',
      created_at: new Date().toISOString().split('T')[0],
      read: false,
      link_tab: 'polling'
    };
    setNotifications((prev) => [pollNotif, ...prev]);

    // Save to Server
    savePollToServer(newPoll).catch((e) => console.error('Poll save server error:', e));
    saveNotificationToServer(pollNotif).catch((e) => console.error('Notif server error:', e));
    showServerToast('পোলিং সার্ভারে তৈরি হয়েছে এবং সকল সদস্যকে জানানো হয়েছে!');
  };

  const castVote = (pollId: string, decision: VoteDecision, comment?: string) => {
    if (!currentUser) return;
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          const updatedVotes = {
            ...poll.votes,
            [currentUser.id]: {
              member_id: currentUser.id,
              member_name: currentUser.full_name,
              decision,
              comment: comment?.trim() || undefined,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          };
          const updatedPoll: LandPoll = { ...poll, votes: updatedVotes };
          // Save to Server
          savePollToServer(updatedPoll)
            .then(() => showServerToast('আপনার মতামত ও ভোট সার্ভারে সংরক্ষিত হয়েছে!'))
            .catch((e) => console.error('Vote save server error:', e));
          return updatedPoll;
        }
        return poll;
      })
    );
  };

  const closePoll = (pollId: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id === pollId) {
          const closedPoll: LandPoll = { ...p, status: 'closed' };
          savePollToServer(closedPoll)
            .then(() => showServerToast(`পোলিং ${pollId} সার্ভারে বন্ধ করা হয়েছে!`))
            .catch((e) => console.error('Close poll server error:', e));
          return closedPoll;
        }
        return p;
      })
    );
  };

  // --------------------------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------------------------
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated: AppNotification = { ...n, read: true };
          saveNotificationToServer(updated).catch((e) => console.error(e));
          return updated;
        }
        return n;
      })
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      updated.forEach((n) => saveNotificationToServer(n).catch((e) => console.error(e)));
      return updated;
    });
  };

  // Computed Financials
  const totalApprovedCapital = deposits
    .filter((d) => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const getUserMonthlyPaidTotal = (memberId: string) => {
    return deposits
      .filter((d) => d.member_id === memberId && d.type === 'monthly' && d.status === 'approved')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getUserLumpsumPaidTotal = (memberId: string) => {
    return deposits
      .filter((d) => d.member_id === memberId && d.type === 'lumpsum' && d.status === 'approved')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getUserDueMonthsCount = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member || member.status !== 'active') return 0;
    
    const approvedMonthlyCount = deposits.filter(
      (d) => d.member_id === memberId && d.type === 'monthly' && d.status === 'approved'
    ).length;

    const expected = 4;
    const dueCount = Math.max(0, expected - approvedMonthlyCount);
    return dueCount;
  };

  const getUserDueAmount = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return 0;
    const dueMonths = getUserDueMonthsCount(memberId);
    return dueMonths * member.monthly_target;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        login,
        signup,
        logout,
        settings,
        updateSettings,
        members,
        addMember,
        updateMember,
        deleteMember,
        deposits,
        submitDeposit,
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
        submitPublicLand,
        updatePublicSubmissionStatus,
        buyProposals,
        submitBuyProposal,
        updateBuyProposalStatus,
        memberProposals,
        submitMemberProposal,
        updateMemberProposalStatus,
        polls,
        createPollFromProposal,
        castVote,
        closePoll,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        currentTab,
        setCurrentTab,
        splashDismissed,
        dismissSplash,
        totalApprovedCapital,
        getUserMonthlyPaidTotal,
        getUserLumpsumPaidTotal,
        getUserDueMonthsCount,
        getUserDueAmount,
        serverStatus,
        lastServerSyncTime,
        syncAllToServer,
        isServerSyncing,
        serverToast,
        dismissServerToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
