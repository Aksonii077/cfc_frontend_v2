import React, { useEffect } from 'react';
import { Link as LinkIcon, Package, AlertCircle } from 'lucide-react';
import { useIntegrations } from '../../hooks/useIntegrations';
import { IntegrationCard } from './IntegrationCard';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface IntegrationsDashboardProps {
  onNavigateToLaunchpad?: () => void;
}

export function IntegrationsDashboard({ onNavigateToLaunchpad }: IntegrationsDashboardProps) {
  const { installations, isLoading, refresh } = useIntegrations();

  useEffect(() => {
    refresh();
  }, []);

  const activeInstallations = installations.filter(i => i.status === 'active');
  const errorInstallations = installations.filter(i => i.status === 'error');

  const handleBrowseApps = () => {
    if (onNavigateToLaunchpad) {
      onNavigateToLaunchpad();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#114DFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      {/* Header */}
      <div className="bg-white border-b-2 border-[#C8D6FF]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LinkIcon className="w-8 h-8 text-[#114DFF]" />
                <h1>My Integrations</h1>
              </div>
              <p className="text-gray-600">
                Manage all your connected apps in one place
              </p>
            </div>
            {onNavigateToLaunchpad && (
              <Button
                onClick={handleBrowseApps}
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Browse Apps
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Error Integrations Alert */}
        {errorInstallations.length > 0 && (
          <Card className="p-6 mb-6 border-2 border-[#FF220E] bg-[#FFE5E5]">
            <div className="flex gap-3">
              <AlertCircle className="w-6 h-6 text-[#FF220E] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="mb-2 text-[#FF220E]">
                  {errorInstallations.length} Integration{errorInstallations.length > 1 ? 's' : ''} Need Attention
                </h3>
                <p className="text-gray-700 mb-3">
                  Some of your integrations are experiencing issues. Please reconnect them to restore functionality.
                </p>
                <div className="space-y-2">
                  {errorInstallations.map((installation) => (
                    <div key={installation.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-[#FF220E]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-[#F5F5F5] flex items-center justify-center">
                          {installation.app?.logo_url ? (
                            <img src={installation.app.logo_url} alt="" className="w-full h-full object-cover rounded" />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p>{installation.app?.name}</p>
                          <p className="text-gray-600">{installation.error_message}</p>
                        </div>
                      </div>
                      {onNavigateToLaunchpad && (
                        <Button
                          size="sm"
                          onClick={handleBrowseApps}
                          className="bg-[#114DFF] text-white"
                        >
                          Reconnect
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Active Integrations */}
        {activeInstallations.length > 0 ? (
          <div>
            <h2 className="mb-6">
              Active Integrations ({activeInstallations.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeInstallations.map((installation) => (
                <IntegrationCard
                  key={installation.id}
                  installation={installation}
                  onUpdate={refresh}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center border-2 border-[#C8D6FF]">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="mb-2">No Active Integrations</h2>
            <p className="text-gray-600 mb-6">
              Connect apps from the launchpad to get started
            </p>
            {onNavigateToLaunchpad && (
              <Button
                onClick={handleBrowseApps}
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white"
              >
                Browse Launchpad
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
