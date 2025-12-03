import React, { useState } from 'react';
import { 
  MoreVertical, Settings, ExternalLink, 
  Unlink, CheckCircle, Clock, AlertCircle, Package 
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DisconnectDialog } from './DisconnectDialog';
import { AppInstallation } from '../../services/marketplaceApi';

interface IntegrationCardProps {
  installation: AppInstallation;
  onUpdate: () => void;
}

export function IntegrationCard({ installation, onUpdate }: IntegrationCardProps) {
  const [showDisconnect, setShowDisconnect] = useState(false);

  const getSyncStatusIcon = () => {
    if (!installation.last_sync_at) {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }

    const lastSync = new Date(installation.last_sync_at);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);

    if (diffMinutes < 10) {
      return <CheckCircle className="w-4 h-4 text-[#06CB1D]" />;
    } else if (diffMinutes < 60) {
      return <Clock className="w-4 h-4 text-[#FF8C00]" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-[#FF220E]" />;
    }
  };

  const getSyncStatusText = () => {
    if (!installation.last_sync_at) {
      return 'Never synced';
    }

    const lastSync = new Date(installation.last_sync_at);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <>
      <Card className="border-2 border-[#C8D6FF] hover:border-[#114DFF] transition-colors overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] border-2 border-[#C8D6FF] flex items-center justify-center overflow-hidden flex-shrink-0">
                {installation.app?.logo_url ? (
                  <img 
                    src={installation.app.logo_url} 
                    alt={installation.app.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="mb-1">{installation.app?.name}</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    installation.status === 'active' ? 'bg-[#06CB1D]' :
                    installation.status === 'error' ? 'bg-[#FF220E]' :
                    'bg-gray-400'
                  }`}></div>
                  <span className="text-gray-600 capitalize">
                    {installation.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => installation.app?.website_url && window.open(installation.app.website_url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open App
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDisconnect(true)}
                  className="text-[#FF220E]"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sync Status */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
            {getSyncStatusIcon()}
            <span className="text-gray-700">
              {getSyncStatusText()}
            </span>
          </div>

          {/* Permissions */}
          <div>
            <p className="text-gray-600 mb-2">Permissions:</p>
            <div className="flex flex-wrap gap-1">
              {installation.granted_scopes.slice(0, 3).map((scope) => (
                <span
                  key={scope}
                  className="px-2 py-1 bg-[#EDF2FF] text-[#114DFF] rounded border border-[#C8D6FF]"
                >
                  {formatScopeLabel(scope)}
                </span>
              ))}
              {installation.granted_scopes.length > 3 && (
                <span className="px-2 py-1 bg-[#F5F5F5] text-gray-600 rounded">
                  +{installation.granted_scopes.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Installed Date */}
          <p className="text-gray-500 mt-4">
            Installed {formatInstallDate(installation.installed_at)}
          </p>
        </div>
      </Card>

      {/* Disconnect Dialog */}
      {showDisconnect && (
        <DisconnectDialog
          installation={installation}
          onClose={() => setShowDisconnect(false)}
          onSuccess={() => {
            setShowDisconnect(false);
            onUpdate();
          }}
        />
      )}
    </>
  );
}

function formatScopeLabel(scope: string): string {
  const labels: Record<string, string> = {
    'profile:read': 'Profile',
    'startup:read': 'Startup',
    'startup:write': 'Edit Startup',
    'startup:metrics': 'Metrics',
    'mentors:read': 'Mentors',
    'activities:write': 'Activities'
  };
  return labels[scope] || scope.split(':')[0];
}

function formatInstallDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  
  return date.toLocaleDateString();
}
