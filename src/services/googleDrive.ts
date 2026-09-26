import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { captureElementAsBlob } from '../utils/export';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth Provider with Drive scope
export const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory token cache (never stored in localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Google OAuth অ্যাক্সেস টোকেন পাওয়া যায়নি');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.message?.includes('popup-closed-by-user') ||
      error?.message?.includes('cancelled-popup-request')
    ) {
      // User closed the popup, cancel gracefully without logging an error
      return null;
    }
    console.error('Google Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  webContentLink?: string;
  folderName: string;
}

const BOB_FOLDER_NAME = 'বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG)';

/**
 * Finds or creates the dedicated BoB cooperative folder in the user's Google Drive.
 */
export async function getOrCreateBoBFolder(accessToken: string): Promise<string> {
  try {
    // Search for existing folder created by this app
    const query = encodeURIComponent(
      `name = '${BOB_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`;
    const searchRes = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return data.files[0].id;
      }
    }

    // Create new folder if not found
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: BOB_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG) সমবায় সংক্রান্ত মানি রিসিট, স্টেটমেন্ট ও নথিপত্র'
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.warn('Folder creation returned non-OK, using root:', errText);
      return '';
    }

    const folderData = await createRes.json();
    return folderData.id || '';
  } catch (err) {
    console.warn('Error handling Drive folder, uploading to root:', err);
    return '';
  }
}

/**
 * Uploads a binary blob to the user's Google Drive using multipart upload.
 */
export async function uploadBlobToDrive(
  blob: Blob,
  filename: string,
  mimeType: string,
  customAccessToken?: string
): Promise<DriveUploadResult> {
  const token = customAccessToken || cachedAccessToken;
  if (!token) {
    throw new Error('গুগল ড্রাইভ অ্যাক্সেস টোকেন পাওয়া যায়নি। অনুগ্রহ করে গুগল সাইন ইন করুন।');
  }

  // Get or create dedicated BoB folder
  const folderId = await getOrCreateBoBFolder(token);

  const metadata: Record<string, any> = {
    name: filename,
    mimeType: mimeType,
    description: `বন্ধন ও বিনিয়োগ (BONDHON O BINIYOG) স্বয়ংক্রিয় সংরক্ষণ • ${new Date().toLocaleString('bn-BD')}`
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const formData = new FormData();
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json; charset=UTF-8' })
  );
  formData.append('file', blob, filename);

  const uploadUrl =
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink';

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive আপলোড ব্যর্থ হয়েছে (${res.status}): ${errorText}`);
  }

  const fileData = await res.json();
  return {
    id: fileData.id,
    name: fileData.name,
    webViewLink: fileData.webViewLink,
    webContentLink: fileData.webContentLink,
    folderName: BOB_FOLDER_NAME
  };
}

/**
 * Captures an HTML element (voucher, statement, or financial report)
 * and uploads it directly to Google Drive as PDF or JPG.
 */
export async function uploadElementToDrive(
  elementId: string,
  filename: string,
  format: 'pdf' | 'jpg' = 'pdf',
  token?: string
): Promise<DriveUploadResult> {
  const captured = await captureElementAsBlob(elementId, filename, format);
  if (!captured) {
    throw new Error('নথি প্রস্তুত করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।');
  }

  return uploadBlobToDrive(captured.blob, captured.filename, captured.mimeType, token);
}

/**
 * Uploads a JSON backup of data to Google Drive.
 */
export async function uploadJsonBackupToDrive(
  data: any,
  filename: string,
  token?: string
): Promise<DriveUploadResult> {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const finalName = filename.endsWith('.json') ? filename : `${filename}.json`;
  return uploadBlobToDrive(blob, finalName, 'application/json', token);
}
