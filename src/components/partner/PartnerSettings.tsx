import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { usePartner } from '../../contexts/PartnerContext';
import {
  Bell,
  Mail,
  Shield,
  CreditCard,
  Users,
  Globe,
  CheckCircle,
  Settings as SettingsIcon,
} from 'lucide-react';

export function PartnerSettings() {
  const { partner } = usePartner();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newLeadAlerts, setNewLeadAlerts] = useState(true);
  const [partnershipUpdates, setPartnershipUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="mb-2">Partner Settings</h2>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Notification Settings */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-[#114DFF]" />
            <h3>Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex-1">
                <p className="text-gray-900">Email Notifications</p>
                <p className="text-gray-600 mt-1">Receive email updates about your account</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex-1">
                <p className="text-gray-900">New Lead Alerts</p>
                <p className="text-gray-600 mt-1">Get notified when you receive new inquiries</p>
              </div>
              <button
                onClick={() => setNewLeadAlerts(!newLeadAlerts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  newLeadAlerts ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    newLeadAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex-1">
                <p className="text-gray-900">Partnership Updates</p>
                <p className="text-gray-600 mt-1">Updates about active partnerships and collaborations</p>
              </div>
              <button
                onClick={() => setPartnershipUpdates(!partnershipUpdates)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  partnershipUpdates ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    partnershipUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex-1">
                <p className="text-gray-900">Marketing Emails</p>
                <p className="text-gray-600 mt-1">Tips, updates, and promotional content</p>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  marketingEmails ? 'bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    marketingEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Plan */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="w-5 h-5 text-[#114DFF]" />
            <h3>Subscription Plan</h3>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] rounded-lg border-2 border-[#C8D6FF]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-900 mb-1">
                  {partner?.planTier?.toUpperCase() || 'FREE'} Plan
                </h3>
                <p className="text-gray-600">
                  {partner?.planTier === 'premium' 
                    ? 'Access to all premium features'
                    : 'Limited features - Upgrade for full access'
                  }
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-0">
                Active
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#06CB1D]" />
                <span className="text-gray-700">Unlimited Services</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#06CB1D]" />
                <span className="text-gray-700">Lead Management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#06CB1D]" />
                <span className="text-gray-700">Analytics Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#06CB1D]" />
                <span className="text-gray-700">Priority Support</span>
              </div>
            </div>

            {partner?.planTier !== 'premium' && (
              <Button className="w-full gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
                Upgrade to Premium
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-[#114DFF]" />
            <h3>Privacy & Security</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <Shield className="w-4 h-4" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <Globe className="w-4 h-4" />
              Profile Visibility Settings
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <Users className="w-4 h-4" />
              Manage Team Access
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-[#114DFF]" />
            <h3>Support & Help</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <Mail className="w-4 h-4" />
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
              <SettingsIcon className="w-4 h-4" />
              Help Center
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[#FF220E]">
        <CardContent className="p-6">
          <h3 className="text-[#FF220E] mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 border-[#FF220E] text-[#FF220E] hover:bg-[#FFE5E5]">
              Deactivate Partner Account
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 border-[#FF220E] text-[#FF220E] hover:bg-[#FFE5E5]">
              Delete Account Permanently
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
