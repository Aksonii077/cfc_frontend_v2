import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MarketplaceApp } from '../../services/marketplaceApi';
import { useIntegrations } from '../../hooks/useIntegrations';

interface InstallFlowModalProps {
  app: MarketplaceApp;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type InstallStep = 'permissions' | 'connecting' | 'installing' | 'success';

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  'profile:read': 'View your profile information',
  'profile:write': 'Update your profile',
  'startup:read': 'View your startup information and details',
  'startup:write': 'Update your startup information',
  'startup:metrics': 'Access your startup KPIs and metrics',
  'mentors:read': 'View your mentor connections',
  'activities:write': 'Create and update timeline activities',
  'webhooks:read': 'Receive real-time updates about changes'
};

export function InstallFlowModal({ app, isOpen, onClose, onComplete }: InstallFlowModalProps) {
  const [currentStep, setCurrentStep] = useState<InstallStep>('permissions');
  const [progress, setProgress] = useState(0);
  const { installApp } = useIntegrations();

  useEffect(() => {
    if (!isOpen) {
      // Reset when modal closes
      setCurrentStep('permissions');
      setProgress(0);
    }
  }, [isOpen]);

  const handleAuthorize = () => {
    setCurrentStep('connecting');
    
    // Simulate OAuth redirect and return
    setTimeout(() => {
      setCurrentStep('installing');
      
      // Simulate installation progress
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          
          // Actually install the app
          installApp(app.id).then(() => {
            setTimeout(() => {
              setCurrentStep('success');
            }, 300);
          });
        }
      }, 200);
    }, 2000);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'permissions' && 'Authorize Access'}
            {currentStep === 'connecting' && 'Connecting to ' + app.name}
            {currentStep === 'installing' && 'Installing ' + app.name}
            {currentStep === 'success' && 'Installation Complete!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permissions Step */}
          {currentStep === 'permissions' && (
            <>
              {/* App Info */}
              <div className="flex items-start gap-4 p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <img
                  src={app.logo_url}
                  alt={app.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3>{app.name}</h3>
                  <p className="text-gray-600">{app.tagline}</p>
                  <p className="text-gray-500 mt-2">
                    By {app.partner?.company_name}
                  </p>
                </div>
              </div>

              {/* Permissions List */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-[#114DFF]" />
                  <h4>This app will be able to:</h4>
                </div>
                <div className="space-y-3">
                  {app.requested_scopes.map((scope) => (
                    <div
                      key={scope}
                      className="flex items-start gap-3 p-3 bg-white border border-[#C8D6FF] rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-[#06CB1D] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{SCOPE_DESCRIPTIONS[scope] || scope}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Security Notice */}
              <div className="p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-gray-900">Your data is secure</h5>
                    <p className="text-gray-600 mt-1">
                      RACE AI uses industry-standard OAuth 2.0 to securely connect with {app.name}. 
                      You can revoke access at any time from your Integrations dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="flex items-center gap-4 text-gray-600">
                <a
                  href={app.privacy_policy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#114DFF] transition-colors"
                >
                  Privacy Policy
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>•</span>
                <a
                  href={app.terms_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#114DFF] transition-colors"
                >
                  Terms of Service
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleAuthorize}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white"
                >
                  Authorize & Install
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Connecting Step */}
          {currentStep === 'connecting' && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EDF2FF] rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-[#114DFF] animate-spin" />
              </div>
              <h3 className="mb-2">Connecting to {app.name}</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You'll be redirected to {app.name} to authorize access. 
                This window will update automatically once complete.
              </p>
            </div>
          )}

          {/* Installing Step */}
          {currentStep === 'installing' && (
            <div className="py-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EDF2FF] rounded-full mb-6">
                  <Loader2 className="w-10 h-10 text-[#114DFF] animate-spin" />
                </div>
                <h3 className="mb-2">Installing {app.name}</h3>
                <p className="text-gray-600">Setting up your integration...</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="h-2 bg-[#EDF2FF] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-gray-600">{progress}%</p>
              </div>

              {/* Installation Steps */}
              <div className="mt-8 space-y-3">
                <InstallationStep
                  label="Verifying credentials"
                  completed={progress > 25}
                  active={progress <= 25}
                />
                <InstallationStep
                  label="Configuring data sync"
                  completed={progress > 50}
                  active={progress > 25 && progress <= 50}
                />
                <InstallationStep
                  label="Setting up webhooks"
                  completed={progress > 75}
                  active={progress > 50 && progress <= 75}
                />
                <InstallationStep
                  label="Finalizing integration"
                  completed={progress === 100}
                  active={progress > 75 && progress < 100}
                />
              </div>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#EDF2FF] rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-[#06CB1D]" />
              </div>
              <h3 className="mb-2">{app.name} is now connected!</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Your integration is ready to use. Data will sync automatically in the background.
              </p>

              {/* Next Steps */}
              <div className="bg-[#F7F9FF] rounded-lg p-6 border border-[#C8D6FF] mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <h5 className="text-gray-900 mb-2">What's next?</h5>
                    <ul className="space-y-2 text-gray-600">
                      <li>• View your integration in the Integrations dashboard</li>
                      <li>• Monitor sync status and activity</li>
                      <li>• Manage permissions anytime</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white"
                >
                  View Integration
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InstallationStepProps {
  label: string;
  completed: boolean;
  active: boolean;
}

function InstallationStep({ label, completed, active }: InstallationStepProps) {
  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <CheckCircle className="w-5 h-5 text-[#06CB1D] flex-shrink-0" />
      ) : active ? (
        <Loader2 className="w-5 h-5 text-[#114DFF] animate-spin flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
      )}
      <span className={completed ? 'text-gray-900' : active ? 'text-[#114DFF]' : 'text-gray-500'}>
        {label}
      </span>
    </div>
  );
}