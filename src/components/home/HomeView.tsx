import React, { useState } from 'react';
import { HeroSection } from './HeroSection';
import { PromoBanner } from './PromoBanner';
import { LandSection } from './LandSection';
import { RoiCalculator } from './RoiCalculator';
import { DirectorsSection } from './DirectorsSection';
import { PublicLandSubmissionModal } from './PublicLandSubmissionModal';
import { BondhonItemsSection } from './BondhonItemsSection';
import { useApp } from '../../context/AppContext';

interface HomeViewProps {
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onOpenAuthModal }) => {
  const { currentUser, setCurrentTab } = useApp();
  const [sellModalOpen, setSellModalOpen] = useState(false);

  const handleJoinClick = () => {
    if (currentUser) {
      setCurrentTab(currentUser.role === 'admin' ? 'admin' : 'dashboard');
    } else {
      onOpenAuthModal('signup');
    }
  };

  const handleExploreProjects = () => {
    setCurrentTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Hero Section with Real-Time Capital Progress Counter & Call CTA */}
      <HeroSection
        onJoinClick={handleJoinClick}
        onExploreProjects={handleExploreProjects}
      />

      {/* 2. Special Promotional Offer Banner (Admin Controlled) */}
      <PromoBanner onActionClick={handleExploreProjects} />

      {/* 2.5 Cloudflare D1 Database Table: bondhon_items Showcase */}
      <BondhonItemsSection />

      {/* 3. Land Projects Showcase & Share Allocation */}
      <div id="land-projects-section">
        <LandSection onOpenSellModal={() => setSellModalOpen(true)} />
      </div>

      {/* 4. Interactive Land ROI Appreciation Simulator */}
      <RoiCalculator />

      {/* 5. Board of Directors & Leadership */}
      <DirectorsSection />

      {/* Public Land Submission Modal */}
      <PublicLandSubmissionModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />
    </div>
  );
};
