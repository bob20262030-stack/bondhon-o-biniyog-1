import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
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

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with auto-detect long polling for optimal connection inside iframe sandboxes & restrictive networks
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
  });
} catch {
  dbInstance = getFirestore(app);
}
export const db = dbInstance;

// Helper to remove undefined fields which Firestore rejects
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_, v) => (v === undefined ? null : v)));
}

// Test server connection safely with timeout without crashing or throwing
export async function testServerConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );
    const checkPromise = getDoc(doc(db, 'system_settings', 'config'));
    await Promise.race([checkPromise, timeoutPromise]);
    return true;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// COLLECTIONS DEFINITION
// -------------------------------------------------------------
export const COLLECTIONS = {
  SETTINGS: 'system_settings',
  MEMBERS: 'members',
  DEPOSITS: 'deposits',
  LAND_PROJECTS: 'land_projects',
  DIRECTORS: 'directors',
  PUBLIC_SUBMISSIONS: 'public_submissions',
  BUY_PROPOSALS: 'buy_proposals',
  MEMBER_PROPOSALS: 'member_proposals',
  POLLS: 'polls',
  NOTIFICATIONS: 'notifications'
} as const;

// -------------------------------------------------------------
// REALTIME LISTENERS WITH ERROR TOLERANCE
// -------------------------------------------------------------
export function subscribeToSettings(onData: (data: SystemSettings) => void) {
  const settingsDoc = doc(db, COLLECTIONS.SETTINGS, 'config');
  return onSnapshot(settingsDoc, (snapshot) => {
    if (snapshot.exists()) {
      onData(snapshot.data() as SystemSettings);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToMembers(onData: (data: Member[]) => void) {
  const membersCol = collection(db, COLLECTIONS.MEMBERS);
  return onSnapshot(membersCol, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as Member);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToDeposits(onData: (data: Deposit[]) => void) {
  const depositsCol = collection(db, COLLECTIONS.DEPOSITS);
  return onSnapshot(depositsCol, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as Deposit);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToLandProjects(onData: (data: LandProject[]) => void) {
  const col = collection(db, COLLECTIONS.LAND_PROJECTS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as LandProject);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToDirectors(onData: (data: Director[]) => void) {
  const col = collection(db, COLLECTIONS.DIRECTORS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as Director);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToPublicSubmissions(onData: (data: PublicLandSubmission[]) => void) {
  const col = collection(db, COLLECTIONS.PUBLIC_SUBMISSIONS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as PublicLandSubmission);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToBuyProposals(onData: (data: LandBuyProposal[]) => void) {
  const col = collection(db, COLLECTIONS.BUY_PROPOSALS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as LandBuyProposal);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToMemberProposals(onData: (data: MemberLandProposal[]) => void) {
  const col = collection(db, COLLECTIONS.MEMBER_PROPOSALS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as MemberLandProposal);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToPolls(onData: (data: LandPoll[]) => void) {
  const col = collection(db, COLLECTIONS.POLLS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as LandPoll);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

export function subscribeToNotifications(onData: (data: AppNotification[]) => void) {
  const col = collection(db, COLLECTIONS.NOTIFICATIONS);
  return onSnapshot(col, (snapshot) => {
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => d.data() as AppNotification);
      onData(list);
    }
  }, () => {
    // Suppress unhandled offline / unavailable errors
  });
}

// -------------------------------------------------------------
// SERVER WRITE METHODS (ADMIN & USER UPDATES) WITH SAFE ERROR CATCHING
// -------------------------------------------------------------

export async function saveSettingsToServer(settings: SystemSettings): Promise<void> {
  try {
    const settingsDoc = doc(db, COLLECTIONS.SETTINGS, 'config');
    await setDoc(settingsDoc, sanitizeForFirestore(settings), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveMemberToServer(member: Member): Promise<void> {
  try {
    const memberDoc = doc(db, COLLECTIONS.MEMBERS, member.id);
    await setDoc(memberDoc, sanitizeForFirestore(member), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function deleteMemberFromServer(id: string): Promise<void> {
  try {
    const memberDoc = doc(db, COLLECTIONS.MEMBERS, id);
    await deleteDoc(memberDoc);
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveDepositToServer(deposit: Deposit): Promise<void> {
  try {
    const depositDoc = doc(db, COLLECTIONS.DEPOSITS, deposit.id);
    await setDoc(depositDoc, sanitizeForFirestore(deposit), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveLandProjectToServer(project: LandProject): Promise<void> {
  try {
    const projectDoc = doc(db, COLLECTIONS.LAND_PROJECTS, project.id);
    await setDoc(projectDoc, sanitizeForFirestore(project), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function deleteLandProjectFromServer(id: string): Promise<void> {
  try {
    const projectDoc = doc(db, COLLECTIONS.LAND_PROJECTS, id);
    await deleteDoc(projectDoc);
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveDirectorToServer(director: Director): Promise<void> {
  try {
    const directorDoc = doc(db, COLLECTIONS.DIRECTORS, director.id);
    await setDoc(directorDoc, sanitizeForFirestore(director), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function deleteDirectorFromServer(id: string): Promise<void> {
  try {
    const directorDoc = doc(db, COLLECTIONS.DIRECTORS, id);
    await deleteDoc(directorDoc);
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function savePublicSubmissionToServer(submission: PublicLandSubmission): Promise<void> {
  try {
    const subDoc = doc(db, COLLECTIONS.PUBLIC_SUBMISSIONS, submission.id);
    await setDoc(subDoc, sanitizeForFirestore(submission), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveBuyProposalToServer(proposal: LandBuyProposal): Promise<void> {
  try {
    const propDoc = doc(db, COLLECTIONS.BUY_PROPOSALS, proposal.id);
    await setDoc(propDoc, sanitizeForFirestore(proposal), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveMemberProposalToServer(proposal: MemberLandProposal): Promise<void> {
  try {
    const propDoc = doc(db, COLLECTIONS.MEMBER_PROPOSALS, proposal.id);
    await setDoc(propDoc, sanitizeForFirestore(proposal), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function savePollToServer(poll: LandPoll): Promise<void> {
  try {
    const pollDoc = doc(db, COLLECTIONS.POLLS, poll.id);
    await setDoc(pollDoc, sanitizeForFirestore(poll), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

export async function saveNotificationToServer(notification: AppNotification): Promise<void> {
  try {
    const notifDoc = doc(db, COLLECTIONS.NOTIFICATIONS, notification.id);
    await setDoc(notifDoc, sanitizeForFirestore(notification), { merge: true });
  } catch (e) {
    // Handled silently for offline mode
  }
}

// -------------------------------------------------------------
// INITIAL SEEDING OR COMPLETE BACKUP TO SERVER
// -------------------------------------------------------------
export async function seedServerIfEmpty(seeds: {
  settings: SystemSettings;
  members: Member[];
  deposits: Deposit[];
  landProjects: LandProject[];
  directors: Director[];
  publicSubmissions: PublicLandSubmission[];
  buyProposals: LandBuyProposal[];
  memberProposals: MemberLandProposal[];
  polls: LandPoll[];
  notifications: AppNotification[];
}): Promise<{ initialized: boolean; message: string }> {
  try {
    const settingsDoc = await getDocs(collection(db, COLLECTIONS.SETTINGS));
    if (settingsDoc.empty) {
      await uploadFullDatabaseToServer(seeds);
      return { initialized: true, message: 'সার্ভারে প্রাথমিক ডেটা সেটআপ সম্পন্ন হয়েছে!' };
    }
    return { initialized: false, message: 'সার্ভার ডেটা সক্রিয় রয়েছে।' };
  } catch {
    return { initialized: false, message: 'সার্ভার অফলাইন মোডে চলছে।' };
  }
}

export async function uploadFullDatabaseToServer(data: {
  settings: SystemSettings;
  members: Member[];
  deposits: Deposit[];
  landProjects: LandProject[];
  directors: Director[];
  publicSubmissions: PublicLandSubmission[];
  buyProposals: LandBuyProposal[];
  memberProposals: MemberLandProposal[];
  polls: LandPoll[];
  notifications: AppNotification[];
}): Promise<void> {
  const batch = writeBatch(db);

  // Settings
  const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'config');
  batch.set(settingsRef, sanitizeForFirestore(data.settings), { merge: true });

  // Members
  data.members.forEach((m) => {
    const ref = doc(db, COLLECTIONS.MEMBERS, m.id);
    batch.set(ref, sanitizeForFirestore(m), { merge: true });
  });

  // Deposits
  data.deposits.forEach((d) => {
    const ref = doc(db, COLLECTIONS.DEPOSITS, d.id);
    batch.set(ref, sanitizeForFirestore(d), { merge: true });
  });

  // Land Projects
  data.landProjects.forEach((lp) => {
    const ref = doc(db, COLLECTIONS.LAND_PROJECTS, lp.id);
    batch.set(ref, sanitizeForFirestore(lp), { merge: true });
  });

  // Directors
  data.directors.forEach((dir) => {
    const ref = doc(db, COLLECTIONS.DIRECTORS, dir.id);
    batch.set(ref, sanitizeForFirestore(dir), { merge: true });
  });

  // Public Submissions
  data.publicSubmissions.forEach((sub) => {
    const ref = doc(db, COLLECTIONS.PUBLIC_SUBMISSIONS, sub.id);
    batch.set(ref, sanitizeForFirestore(sub), { merge: true });
  });

  // Buy Proposals
  data.buyProposals.forEach((bp) => {
    const ref = doc(db, COLLECTIONS.BUY_PROPOSALS, bp.id);
    batch.set(ref, sanitizeForFirestore(bp), { merge: true });
  });

  // Member Proposals
  data.memberProposals.forEach((mp) => {
    const ref = doc(db, COLLECTIONS.MEMBER_PROPOSALS, mp.id);
    batch.set(ref, sanitizeForFirestore(mp), { merge: true });
  });

  // Polls
  data.polls.forEach((poll) => {
    const ref = doc(db, COLLECTIONS.POLLS, poll.id);
    batch.set(ref, sanitizeForFirestore(poll), { merge: true });
  });

  // Notifications
  data.notifications.forEach((notif) => {
    const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
    batch.set(ref, sanitizeForFirestore(notif), { merge: true });
  });

  await batch.commit();
}
