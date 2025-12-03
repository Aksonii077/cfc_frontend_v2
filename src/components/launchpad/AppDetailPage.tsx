import React, { useState } from 'react';
import {
  ArrowLeft, ExternalLink, Star, Download, Shield,
  CheckCircle, AlertTriangle, Link as LinkIcon
} from 'lucide-react';
import { useAppDetails } from '../../hooks/useMarketplace';
import { useAppInstallation } from '../../hooks/useIntegrations';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { marketplaceApi } from '../../services/marketplaceApi';
import { InstallFlowModal } from './InstallFlowModal';

interface AppDetailPageProps {
  slug: string;
  onBack: () => void;
  onLogin?: () => void;
}

export function AppDetailPage({ slug, onBack, onLogin }: AppDetailPageProps) {
  const { user, session } = useAuth();
  const { app, isLoading, error } = useAppDetails(slug);
  const { isInstalled, installation } = useAppInstallation(app?.id || '');
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallFlowModal, setShowInstallFlowModal] = useState(false);

  const handleInstall = async () => {
    if (!user) {
      if (onLogin) {
        onLogin();
      } else {
        alert('Please log in to install apps');
      }
      return;
    }

    if (!app) return;

    // Show install flow modal
    setShowInstallFlowModal(true);
  };

  const handleInstallComplete = () => {
    // Installation complete - could refresh installations or show success message
    console.log('Installation completed for:', app?.name);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#114DFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
        <Card className="max-w-md p-8 text-center border-2 border-[#FF220E]">
          <AlertTriangle className="w-16 h-16 text-[#FF220E] mx-auto mb-4" />
          <h2 className="mb-2">App Not Found</h2>
          <p className="text-gray-700 mb-6">{error || 'This app does not exist'}</p>
          <Button onClick={onBack}>
            Back to Launchpad
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Launchpad
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
        
        {/* App Header Card */}
        <Card className="p-8 border-2 border-[#C8D6FF] mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-24 h-24 rounded-lg bg-white border-2 border-[#C8D6FF] flex items-center justify-center overflow-hidden flex-shrink-0">
              {app.logo_url ? (
                <img src={app.logo_url} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">📦</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="mb-2">{app.name}</h1>
                  <p className="text-gray-700 mb-3">{app.tagline}</p>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {app.featured && (
                      <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-0">
                        Featured
                      </Badge>
                    )}
                    <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                      {app.category}
                    </Badge>
                    <Badge className={
                      app.pricing_type === 'free' ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]' :
                      app.pricing_type === 'freemium' ? 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]' :
                      'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]'
                    }>
                      {app.pricing_type === 'free' ? 'Free' :
                       app.pricing_type === 'freemium' ? 'Freemium' :
                       'Paid'}
                    </Badge>
                  </div>
                </div>

                {/* Install Button */}
                <div className="flex flex-col gap-3">
                  {isInstalled ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#EDF2FF] border-2 border-[#06CB1D] rounded-lg">
                      <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
                      <span className="text-[#06CB1D]">Installed</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleInstall}
                      disabled={isInstalling}
                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white px-8"
                    >
                      {isInstalling ? 'Installing...' : 'Install App'}
                    </Button>
                  )}
                  
                  <a
                    href={app.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t-2 border-[#C8D6FF]">
                {app.average_rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#FF8C00] fill-[#FF8C00]" />
                    <span className="text-gray-700">
                      {app.average_rating.toFixed(1)} ({app.total_reviews} reviews)
                    </span>
                  </div>
                )}
                
                {app.total_installs > 0 && (
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">
                      {app.total_installs.toLocaleString()} installs
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#06CB1D]" />
                  <span className="text-gray-700">Verified Partner</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="p-6 border-2 border-[#C8D6FF]">
                  <h3 className="mb-4">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{app.description}</p>
                </Card>

                {/* Screenshots */}
                {app.screenshots && app.screenshots.length > 0 && (
                  <Card className="p-6 border-2 border-[#C8D6FF]">
                    <h3 className="mb-4">Screenshots</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {app.screenshots.map((screenshot, index) => (
                        <img
                          key={index}
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="rounded-lg border-2 border-[#C8D6FF] w-full"
                        />
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pricing */}
                <Card className="p-6 border-2 border-[#C8D6FF]">
                  <h4 className="mb-3">Pricing</h4>
                  <p className="text-gray-700 mb-2 capitalize">{app.pricing_type}</p>
                  {app.pricing_details && (
                    <p className="text-gray-600">{app.pricing_details}</p>
                  )}
                </Card>

                {/* Quick Info */}
                <Card className="p-6 border-2 border-[#C8D6FF]">
                  <h4 className="mb-3">Quick Info</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600 mb-1">Category</p>
                      <p className="text-gray-900">{app.category}</p>
                    </div>
                    {app.partner && (
                      <div>
                        <p className="text-gray-600 mb-1">Developer</p>
                        <p className="text-gray-900">{app.partner.company_name}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Links */}
                <Card className="p-6 border-2 border-[#C8D6FF]">
                  <h4 className="mb-3">Resources</h4>
                  <div className="space-y-2">
                    <a
                      href={app.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Website
                    </a>
                    <a
                      href={app.privacy_policy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                    >
                      <Shield className="w-4 h-4" />
                      Privacy Policy
                    </a>
                    <a
                      href={app.terms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Terms of Service
                    </a>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions">
            <Card className="p-6 border-2 border-[#C8D6FF]">
              <h3 className="mb-4">Required Permissions</h3>
              <p className="text-gray-600 mb-6">
                This app will request the following permissions when you install it:
              </p>

              <div className="space-y-3">
                {app.requested_scopes.map((scope) => (
                  <div
                    key={scope}
                    className="flex items-start gap-3 p-4 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                    <div>
                      <p>{formatScopeTitle(scope)}</p>
                      <p className="text-gray-600">{formatScopeDescription(scope)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#F7F9FF] border-2 border-[#C8D6FF] rounded-lg">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="mb-2">Your data is secure</h4>
                    <p className="text-gray-700">
                      You can revoke these permissions at any time from your Integrations dashboard.
                      {app.name} can only access the data listed above.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card className="p-6 border-2 border-[#C8D6FF]">
              <h3 className="mb-4">About {app.name}</h3>
              
              <div className="space-y-6">
                {app.partner && (
                  <div>
                    <h4 className="mb-2">Developer</h4>
                    <p className="text-gray-700">{app.partner.company_name}</p>
                  </div>
                )}

                <div>
                  <h4 className="mb-2">Category</h4>
                  <p className="text-gray-700">{app.category}</p>
                </div>

                <div>
                  <h4 className="mb-2">Pricing Model</h4>
                  <p className="text-gray-700 capitalize">{app.pricing_type}</p>
                  {app.pricing_details && (
                    <p className="text-gray-600 mt-1">{app.pricing_details}</p>
                  )}
                </div>

                <div className="pt-6 border-t-2 border-[#C8D6FF]">
                  <h4 className="mb-3">Legal</h4>
                  <div className="space-y-2">
                    <a
                      href={app.privacy_policy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                    >
                      <Shield className="w-4 h-4" />
                      Privacy Policy
                    </a>
                    <a
                      href={app.terms_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#114DFF] hover:text-[#0d3eb8]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Install Flow Modal */}
      {app && (
        <InstallFlowModal
          app={app}
          isOpen={showInstallFlowModal}
          onClose={() => setShowInstallFlowModal(false)}
          onComplete={handleInstallComplete}
        />
      )}
    </div>
  );
}

function formatScopeTitle(scope: string): string {
  const titles: Record<string, string> = {
    'profile:read': 'View your profile',
    'profile:write': 'Update your profile',
    'startup:read': 'View your startup information',
    'startup:write': 'Update your startup information',
    'startup:metrics': 'Access your KPIs and metrics',
    'mentors:read': 'View your mentor connections',
    'activities:write': 'Create activities in your timeline',
    'webhooks:read': 'Receive real-time updates'
  };
  return titles[scope] || scope;
}

function formatScopeDescription(scope: string): string {
  const descriptions: Record<string, string> = {
    'profile:read': 'Access your name, email, role, and avatar',
    'profile:write': 'Make changes to your basic profile information',
    'startup:read': 'Access your startup name, stage, industry, and description',
    'startup:write': 'Update your startup details like tagline and website',
    'startup:metrics': 'Read and write KPI data and performance metrics',
    'mentors:read': 'See your mentor relationships and connections',
    'activities:write': 'Add events to your RACE AI activity timeline',
    'webhooks:read': 'Get notified when your RACE AI data changes'
  };
  return descriptions[scope] || 'Access related to: ' + scope;
}