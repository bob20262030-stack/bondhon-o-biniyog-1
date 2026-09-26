/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GoogleDriveProvider } from './context/GoogleDriveContext';
import { SplashScreen } from './components/common/SplashScreen';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/home/HomeView';
import { LandSection } from './components/home/LandSection';
import { RoiCalculator } from './components/home/RoiCalculator';
import { DirectorsSection } from './components/home/DirectorsSection';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { PollingSection } from './components/dashboard/PollingSection';
import { AuthModal } from './components/auth/AuthModal';
import { PublicLandSubmissionModal } from './components/home/PublicLandSubmissionModal';

const AppContent: React.FC = () => {
  const { splashDismissed, currentTab, setCurrentTab, serverToast, dismissServerToast } = useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [sellModalOpen, setSellModalOpen] = useState(false);

  // Sync /admin URL path or hash to Admin Panel view
  React.useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin') || hash === '#/admin' || hash === '#admin') {
        setCurrentTab('admin');
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('hashchange', handleRoute);
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('hashchange', handleRoute);
    };
  }, [setCurrentTab]);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-bengali selection:bg-amber-500 selection:text-slate-950">
      {/* 5-second Animated Splash Screen */}
      {!splashDismissed && <SplashScreen />}

      {/* Global Header with Logo, RTL Marquee, Member Name, Demo Switcher */}
      <Header onOpenAuthModal={openAuth} />

      {/* Dynamic Main View */}
      <main className="flex-1">
        {currentTab === 'home' && <HomeView onOpenAuthModal={openAuth} />}

        {currentTab === 'projects' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            <LandSection onOpenSellModal={() => setSellModalOpen(true)} />
            <RoiCalculator />
          </div>
        )}

        {currentTab === 'marketplace' && <MarketplaceView />}

        {currentTab === 'polling' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PollingSection />
          </div>
        )}

        {currentTab === 'directors' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DirectorsSection />
          </div>
        )}

        {currentTab === 'dashboard' && <MemberDashboard />}

        {currentTab === 'admin' && <AdminPanel />}
      </main>

      {/* Global Footer with Required Copyright & Centered Manager Badge */}
      <Footer />

      {/* Auth Modal (Login / Sign Up with Camera & min ৳1000 check) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Standalone Public Sell Modal for header/project quick actions */}
      <PublicLandSubmissionModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />

      {/* Floating Server Sync Notification */}
      {serverToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl shadow-emerald-950/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>সার্ভার ক্লাউড আপডেট</span>
            </div>
            <div className="text-slate-300 mt-0.5">{serverToast}</div>
          </div>
          <button
            onClick={dismissServerToast}
            className="text-slate-400 hover:text-white p-1 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <GoogleDriveProvider>
        <AppContent />
      </GoogleDriveProvider>
    </AppProvider>
  );
}
