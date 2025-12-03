import React, { useState } from 'react';
import { MarketplaceHome } from './MarketplaceHome';
import { AppDetailPage } from './AppDetailPage';

interface LaunchpadWrapperProps {
  onNavigateToIntegrations?: () => void;
}

export function LaunchpadWrapper({ onNavigateToIntegrations }: LaunchpadWrapperProps) {
  const [currentView, setCurrentView] = useState<'home' | 'app-detail'>('home');
  const [selectedAppSlug, setSelectedAppSlug] = useState<string>('');

  const handleAppClick = (slug: string) => {
    setSelectedAppSlug(slug);
    setCurrentView('app-detail');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedAppSlug('');
  };

  if (currentView === 'app-detail' && selectedAppSlug) {
    return (
      <AppDetailPage 
        slug={selectedAppSlug}
        onBack={handleBackToHome}
      />
    );
  }

  return <MarketplaceHome onAppClick={handleAppClick} />;
}
