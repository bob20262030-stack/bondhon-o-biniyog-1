import React, { useState } from 'react';
import { useGoogleDrive } from '../../context/GoogleDriveContext';
import { Cloud, Check, Loader2, ExternalLink, AlertCircle } from 'lucide-react';

interface GoogleDriveSaveButtonProps {
  elementId: string;
  filename: string;
  format?: 'pdf' | 'jpg';
  label?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  onSaved?: (link: string) => void;
}

export const GoogleDriveSaveButton: React.FC<GoogleDriveSaveButtonProps> = ({
  elementId,
  filename,
  format = 'pdf',
  label = 'গুগল ড্রাইভে সেভ করুন',
  variant = 'secondary',
  onSaved
}) => {
  const { saveDocumentToDrive, isSaving } = useGoogleDrive();
  const [localSaving, setLocalSaving] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);
    setLocalSaving(true);
    try {
      const result = await saveDocumentToDrive(elementId, filename, format);
      if (result && result.webViewLink) {
        setDriveLink(result.webViewLink);
        if (onSaved) onSaved(result.webViewLink);
      }
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user') ||
        err?.message?.includes('cancelled-popup-request')
      ) {
        // User deliberately closed popup, silently return
        return;
      }
      console.error('Failed to save to Google Drive:', err);
      setErrorMsg(err.message || 'ড্রাইভে সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setLocalSaving(false);
    }
  };

  if (driveLink) {
    return (
      <div className="inline-flex items-center gap-2">
        <a
          href={driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          title="গুগল ড্রাইভে ফাইলটি খুলুন"
        >
          <Check className="w-3.5 h-3.5" />
          <span>ড্রাইভে সংরক্ষিত</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
        </a>
      </div>
    );
  }

  const isLoading = localSaving || isSaving;

  if (variant === 'compact') {
    return (
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="p-1.5 rounded-xl bg-emerald-700/30 hover:bg-emerald-700/50 border border-emerald-600/40 text-emerald-300 hover:text-white transition cursor-pointer disabled:opacity-50"
        title="গুগল ড্রাইভে সংরক্ষণ করুন"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
        ) : (
          <Cloud className="w-4 h-4" />
        )}
      </button>
    );
  }

  const baseStyle =
    variant === 'primary'
      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
      : 'bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 hover:text-emerald-100';

  return (
    <div className="relative inline-flex flex-col">
      <button
        onClick={handleSave}
        disabled={isLoading}
        type="button"
        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${baseStyle}`}
        title="সরাসরি আপনার গুগল ড্রাইভে ফোল্ডারে সংরক্ষণ করুন"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
            <span>ড্রাইভে সেভ হচ্ছে...</span>
          </>
        ) : (
          <>
            {/* Google Drive SVG Icon */}
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 87.3 78" fill="none">
              <path
                d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                fill="#0066da"
              />
              <path
                d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z"
                fill="#00ac47"
              />
              <path
                d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                fill="#ea4335"
              />
              <path
                d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                fill="#00832d"
              />
              <path
                d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                fill="#2684fc"
              />
              <path
                d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                fill="#ffba00"
              />
            </svg>
            <span>{label}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <span className="absolute top-full left-0 mt-1 whitespace-nowrap text-[11px] text-red-400 bg-slate-900 border border-red-800/80 px-2 py-0.5 rounded shadow-lg z-50 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-red-400" />
          <span>{errorMsg}</span>
        </span>
      )}
    </div>
  );
};
