import React, { useState } from 'react';
import { AlertTriangle, Loader } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { useIntegrations } from '../../hooks/useIntegrations';
import { AppInstallation } from '../../services/marketplaceApi';

interface DisconnectDialogProps {
  installation: AppInstallation;
  onClose: () => void;
  onSuccess: () => void;
}

export function DisconnectDialog({ installation, onClose, onSuccess }: DisconnectDialogProps) {
  const { disconnectApp } = useIntegrations();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    setError(null);

    try {
      const success = await disconnectApp(installation.id);

      if (success) {
        onSuccess();
      } else {
        setError('Failed to disconnect app. Please try again.');
      }
    } catch (err: any) {
      console.error('Disconnect error:', err);
      setError(err.message || 'An error occurred while disconnecting');
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="border-2 border-[#C8D6FF]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-[#FFE5E5] border-2 border-[#FF220E] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#FF220E]" />
            </div>
            <AlertDialogTitle>Disconnect {installation.app?.name}?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-700">
            This will revoke {installation.app?.name}'s access to your RACE AI data. You can reconnect 
            the app at any time from the Launchpad.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Permissions that will be revoked */}
        <div className="my-4">
          <p className="text-gray-600 mb-3">The following permissions will be revoked:</p>
          <div className="space-y-2">
            {installation.granted_scopes.map((scope) => (
              <div
                key={scope}
                className="flex items-center gap-2 p-2 bg-[#F7F9FF] border border-[#C8D6FF] rounded"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF220E]"></div>
                <span className="text-gray-700">{formatScopeTitle(scope)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#FFE5E5] border-2 border-[#FF220E] rounded-lg p-4">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF220E] flex-shrink-0 mt-0.5" />
              <p className="text-[#FF220E]">{error}</p>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDisconnecting}
            className="border-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="bg-[#FF220E] text-white hover:bg-[#cc1b0b]"
          >
            {isDisconnecting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect App'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
