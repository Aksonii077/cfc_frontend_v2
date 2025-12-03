import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner@2.0.3'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Shield, 
  Eye, 
  Database, 
  AlertTriangle,
  Trash2,
  Save,
  Settings as SettingsIcon,
  Users,
  Lock,
  Globe,
  UserMinus
} from 'lucide-react'

interface SettingsSectionProps {
  userProfile?: any
}

export function SettingsSection({ userProfile }: SettingsSectionProps) {
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [inAppNotifications, setInAppNotifications] = useState(true)
  const [mentorUpdates, setMentorUpdates] = useState(true)
  const [investorUpdates, setInvestorUpdates] = useState(false)
  const [systemUpdates, setSystemUpdates] = useState(true)
  
  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [dataSharing, setDataSharing] = useState(false)
  const [analyticsSharing, setAnalyticsSharing] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  
  // Account Management
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSaveSettings = () => {
    // In a real app, this would save to the database
    toast.success('Settings saved successfully!')
  }

  const handleAccountDeactivation = async () => {
    setIsDeactivating(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Account deactivated successfully. You can reactivate anytime by logging in.')
      // In a real app, this would redirect to login page
    } catch (error) {
      toast.error('Failed to deactivate account. Please try again.')
    } finally {
      setIsDeactivating(false)
    }
  }

  const handleAccountDeletion = async () => {
    setIsDeleting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success('Account deletion initiated. You will receive a confirmation email.')
      // In a real app, this would handle the deletion process
    } catch (error) {
      toast.error('Failed to delete account. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center">
          <SettingsIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-[#114DFF]" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications on mobile</p>
                  </div>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <div>
                    <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                    <p className="text-sm text-gray-500">Show notifications within the app</p>
                  </div>
                </div>
                <Switch
                  id="in-app-notifications"
                  checked={inAppNotifications}
                  onCheckedChange={setInAppNotifications}
                />
              </div>
            </div>

            <Separator className="bg-[#C8D6FF]" />

            {/* Specific Notification Types */}
            <div className="space-y-4">
              <h4 className="text-gray-900">Notification Types</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mentor-updates">Mentor Updates</Label>
                  <p className="text-sm text-gray-500">Updates from your mentors and incubators</p>
                </div>
                <Switch
                  id="mentor-updates"
                  checked={mentorUpdates}
                  onCheckedChange={setMentorUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="investor-updates">Investor Updates</Label>
                  <p className="text-sm text-gray-500">Updates about funding opportunities</p>
                </div>
                <Switch
                  id="investor-updates"
                  checked={investorUpdates}
                  onCheckedChange={setInvestorUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="system-updates">System Updates</Label>
                  <p className="text-sm text-gray-500">Platform updates and announcements</p>
                </div>
                <Switch
                  id="system-updates"
                  checked={systemUpdates}
                  onCheckedChange={setSystemUpdates}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#06CB1D]" />
              <span>Privacy & Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Visibility */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="profile-visibility">Profile Visibility</Label>
                <p className="text-sm text-gray-500 mb-3">Control who can see your profile</p>
                <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                  <SelectTrigger className="border-[#C8D6FF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Public - Visible to everyone</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="network">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Network - Visible to your connections</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Private - Only visible to you</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="data-sharing">Data Sharing with Partners</Label>
                  <p className="text-sm text-gray-500">Share anonymized data with trusted partners</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={dataSharing}
                  onCheckedChange={setDataSharing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="analytics-sharing">Analytics & Insights</Label>
                  <p className="text-sm text-gray-500">Help improve RACE AI with usage analytics</p>
                </div>
                <Switch
                  id="analytics-sharing"
                  checked={analyticsSharing}
                  onCheckedChange={setAnalyticsSharing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Marketing Communications</Label>
                  <p className="text-sm text-gray-500">Receive marketing emails and newsletters</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>

            <Separator className="bg-[#C8D6FF]" />

            {/* Data Rights */}
            <div className="space-y-3">
              <h4 className="text-gray-900">Data Rights</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="justify-start border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Database className="w-4 h-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" size="sm" className="justify-start border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Eye className="w-4 h-4 mr-2" />
                  View Privacy Policy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Account Management */}
      <Card className="border-[#C8D6FF]">
        <CardHeader className="bg-gradient-to-r from-[#FF220E]/10 to-[#FF220E]/5 border-b border-[#C8D6FF]">
          <CardTitle className="flex items-center space-x-2 text-[#FF220E]">
            <AlertTriangle className="w-5 h-5" />
            <span>Account Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Deactivation */}
            <div className="p-4 border border-[#C8D6FF] rounded-lg bg-[#F7F9FF]">
              <div className="flex items-start space-x-3">
                <UserMinus className="w-5 h-5 text-gray-700 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-gray-900">Deactivate Account</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Temporarily disable your account. You can reactivate it anytime by logging in.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-3 border-[#CCCCCC] text-gray-700 hover:bg-[#F5F5F5]">
                        Deactivate Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-[#C8D6FF]">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to deactivate your account? This will:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Hide your profile from other users</li>
                            <li>Pause all notifications</li>
                            <li>Temporarily disable access to your data</li>
                            <li>Allow you to reactivate anytime by logging in</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#C8D6FF]">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAccountDeactivation}
                          disabled={isDeactivating}
                          className="bg-gray-600 hover:bg-gray-700"
                        >
                          {isDeactivating ? 'Deactivating...' : 'Deactivate Account'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>

            {/* Account Deletion */}
            <div className="p-4 border border-[#FF220E]/30 rounded-lg bg-[#FF220E]/5">
              <div className="flex items-start space-x-3">
                <Trash2 className="w-5 h-5 text-[#FF220E] mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-[#FF220E]">Delete Account</h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-3 border-[#FF220E]/50 text-[#FF220E] hover:bg-[#FF220E]/10">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-[#C8D6FF]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#FF220E]">Delete Account Permanently</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="space-y-3">
                            <p className="text-[#FF220E]">
                              This action is permanent and cannot be undone. By deleting your account:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              <li>All your profile data will be permanently deleted</li>
                              <li>Your startup ideas and progress will be lost</li>
                              <li>All connections and messages will be removed</li>
                              <li>You will no longer have access to RACE AI services</li>
                            </ul>
                            <div className="bg-[#FF220E]/10 p-3 rounded-md border border-[#FF220E]/30">
                              <p className="text-sm text-gray-800">
                                <strong>Note:</strong> We are not responsible for collecting PII or securing sensitive data. 
                                Please ensure you have backed up any important information before proceeding.
                              </p>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-[#C8D6FF]">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAccountDeletion}
                          disabled={isDeleting}
                          className="bg-[#FF220E] hover:bg-[#d11d0c]"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete Account Permanently'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
            <p className="text-sm text-gray-700">
              <strong>Privacy Notice:</strong> RACE AI is designed for business development and networking. 
              We do not collect personally identifiable information (PII) or store sensitive personal data. 
              For questions about data handling, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}