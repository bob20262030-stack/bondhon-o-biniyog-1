import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  uploadElementToDrive,
  uploadJsonBackupToDrive,
  DriveUploadResult,
  getAccessToken
} from '../services/googleDrive';

interface GoogleDriveContextType {
  googleUser: User | null;
  isConnected: boolean;
  isAuthenticating: boolean;
  isSaving: boolean;
  lastSavedFile: DriveUploadResult | null;
  savedFiles: DriveUploadResult[];
  connectGoogleDrive: () => Promise<string | null>;
  disconnectGoogleDrive: () => Promise<void>;
  saveDocumentToDrive: (
    elementId: string,
    filename: string,
    format?: 'pdf' | 'jpg'
  ) => Promise<DriveUploadResult | null>;
  saveBackupToDrive: (data: any, filename: string) => Promise<DriveUploadResult | null>;
  clearLastSavedFile: () => void;
}

const GoogleDriveContext = createContext<GoogleDriveContextType | undefined>(undefined);

export const GoogleDriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedFile, setLastSavedFile] = useState<DriveUploadResult | null>(null);
  const [savedFiles, setSavedFiles] = useState<DriveUploadResult[]>([]);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, _token) => {
        setGoogleUser(user);
      },
      () => {
        setGoogleUser(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const connectGoogleDrive = useCallback(async (): Promise<string | null> => {
    setIsAuthenticating(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        return result.accessToken;
      }
      return null;
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        return null;
      }
      console.error('Google Drive connection failed:', err);
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const disconnectGoogleDrive = useCallback(async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setLastSavedFile(null);
  }, []);

  const saveDocumentToDrive = useCallback(
    async (
      elementId: string,
      filename: string,
      format: 'pdf' | 'jpg' = 'pdf'
    ): Promise<DriveUploadResult | null> => {
      setIsSaving(true);
      try {
        let token = await getAccessToken();
        if (!token) {
          token = await connectGoogleDrive();
          if (!token) {
            // User cancelled or closed the login popup
            return null;
          }
        }

        const result = await uploadElementToDrive(elementId, filename, format, token);
        setLastSavedFile(result);
        setSavedFiles((prev) => [result, ...prev.filter((f) => f.id !== result.id)]);
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [connectGoogleDrive]
  );

  const saveBackupToDrive = useCallback(
    async (data: any, filename: string): Promise<DriveUploadResult | null> => {
      setIsSaving(true);
      try {
        let token = await getAccessToken();
        if (!token) {
          token = await connectGoogleDrive();
          if (!token) {
            // User cancelled or closed the login popup
            return null;
          }
        }

        const result = await uploadJsonBackupToDrive(data, filename, token);
        setLastSavedFile(result);
        setSavedFiles((prev) => [result, ...prev.filter((f) => f.id !== result.id)]);
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [connectGoogleDrive]
  );

  const clearLastSavedFile = useCallback(() => {
    setLastSavedFile(null);
  }, []);

  return (
    <GoogleDriveContext.Provider
      value={{
        googleUser,
        isConnected: !!googleUser,
        isAuthenticating,
        isSaving,
        lastSavedFile,
        savedFiles,
        connectGoogleDrive,
        disconnectGoogleDrive,
        saveDocumentToDrive,
        saveBackupToDrive,
        clearLastSavedFile
      }}
    >
      {children}
    </GoogleDriveContext.Provider>
  );
};

export const useGoogleDrive = () => {
  const context = useContext(GoogleDriveContext);
  if (!context) {
    throw new Error('useGoogleDrive must be used within a GoogleDriveProvider');
  }
  return context;
};
