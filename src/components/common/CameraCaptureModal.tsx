import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, Upload } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Photo: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('আপনার ব্রাউজারে লাইভ ক্যামেরা সাপোর্ট নেই। নিচে থেকে ফাইল আপলোড করুন।');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 640 },
          facingMode: 'user'
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access failed:', err);
      setCameraError(
        err.message || 'ক্যামেরা চালু করা সম্ভব হয়নি। ক্যামেরা পারমিশন চেক করুন অথবা সরাসরি ছবি আপলোড করুন।'
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 480;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply horizontal mirror flip for natural webcam mirror feel
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    const base64 = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(base64);
  };

  const retakeSnapshot = () => {
    setCapturedImage(null);
    if (!stream) {
      startCamera();
    }
  };

  const confirmAndSave = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCapturedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">লাইভ ক্যামেরা ছবি ক্যাপচার</h3>
              <p className="text-xs text-slate-400">সদস্য পরিচিতির জন্য তাৎক্ষণিক ছবি তুলুন</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Capture Canvas */}
        <div className="p-6 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 border-dashed border-amber-500/50 bg-slate-950 flex items-center justify-center shadow-inner">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full h-full object-cover"
              />
            ) : cameraError ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
                <p className="text-xs text-rose-300 mb-3">{cameraError}</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow">
                  <Upload className="w-4 h-4" />
                  <span>ছবি ফাইল সিলেক্ট করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {/* Viewfinder Guideline Frame */}
                <div className="absolute inset-4 border border-amber-400/40 rounded-xl pointer-events-none flex items-center justify-center">
                  <div className="w-32 h-44 rounded-full border border-dashed border-white/40" />
                </div>
                {isInitializing && (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                    <span>ক্যামেরা প্রস্তুত হচ্ছে...</span>
                  </div>
                )}
              </>
            )}

            {/* Hidden canvas for snapshot rendering */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <p className="text-xs text-slate-400 mt-3 text-center">
            {capturedImage
              ? 'ছবিটি পরিষ্কার এসেছে কিনা দেখুন। সন্তুষ্ট হলে নিশ্চিত করুন।'
              : 'চেহারা স্পষ্ট ও বৃত্তাকার ফ্রেমের ভেতরে রাখুন'}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-3 w-full mt-6">
            {!capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={takeSnapshot}
                  disabled={!!cameraError || isInitializing}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>ছবি তুলুন (Snapshot)</span>
                </button>

                <label className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 cursor-pointer transition flex items-center justify-center" title="ফাইল থেকে আপলোড">
                  <Upload className="w-5 h-5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={retakeSnapshot}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>পুনরায় তুলুন</span>
                </button>

                <button
                  type="button"
                  onClick={confirmAndSave}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>এই ছবি নিশ্চিত করুন</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
