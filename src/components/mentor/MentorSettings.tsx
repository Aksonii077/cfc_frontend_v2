import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { useState } from "react";

export function MentorSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    applicationNotifications: true,
    interviewReminders: true,
    portfolioUpdates: true,
    weeklyDigest: false,

    // Privacy Settings
    profileVisible: true,
    showEmail: false,
    showPhone: false,

    // Availability Settings
    acceptingApplications: true,
    maxMentorships: 15,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      {/* Account Settings */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#114DFF]" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                defaultValue="james.peterson@techstars.com"
                className="border-[#C8D6FF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="border-[#C8D6FF]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="border-[#C8D6FF] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                className="border-[#C8D6FF]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                className="border-[#C8D6FF]"
              />
            </div>
          </div>

          <Button variant="outline" className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <Lock className="w-4 h-4" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#114DFF]" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-600">Receive email updates about your account</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="application-notifications">New Application Alerts</Label>
              <p className="text-sm text-gray-600">Get notified when new applications arrive</p>
            </div>
            <Switch
              id="application-notifications"
              checked={settings.applicationNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, applicationNotifications: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="interview-reminders">Interview Reminders</Label>
              <p className="text-sm text-gray-600">Reminders for upcoming interviews</p>
            </div>
            <Switch
              id="interview-reminders"
              checked={settings.interviewReminders}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, interviewReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="portfolio-updates">Portfolio Updates</Label>
              <p className="text-sm text-gray-600">Updates from your portfolio startups</p>
            </div>
            <Switch
              id="portfolio-updates"
              checked={settings.portfolioUpdates}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, portfolioUpdates: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-gray-600">Receive a weekly summary of activities</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, weeklyDigest: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#114DFF]" />
            Privacy & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profile-visible">Profile Visibility</Label>
              <p className="text-sm text-gray-600">Make your profile visible to founders</p>
            </div>
            <Switch
              id="profile-visible"
              checked={settings.profileVisible}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, profileVisible: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-email">Show Email Address</Label>
              <p className="text-sm text-gray-600">Display email on public profile</p>
            </div>
            <Switch
              id="show-email"
              checked={settings.showEmail}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showEmail: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-phone">Show Phone Number</Label>
              <p className="text-sm text-gray-600">Display phone on public profile</p>
            </div>
            <Switch
              id="show-phone"
              checked={settings.showPhone}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, showPhone: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#114DFF]" />
            Availability Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="accepting-applications">Accepting Applications</Label>
                {settings.acceptingApplications && (
                  <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">Accept new mentorship applications</p>
            </div>
            <Switch
              id="accepting-applications"
              checked={settings.acceptingApplications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, acceptingApplications: checked })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-mentorships">Maximum Active Mentorships</Label>
            <div className="flex items-center gap-4">
              <Input
                id="max-mentorships"
                type="number"
                value={settings.maxMentorships}
                onChange={(e) =>
                  setSettings({ ...settings, maxMentorships: parseInt(e.target.value) || 0 })
                }
                className="border-[#C8D6FF] w-32"
                min="0"
                max="50"
              />
              <p className="text-sm text-gray-600">Currently: 12 active</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]">
          <Save className="w-4 h-4" />
          Save All Settings
        </Button>
      </div>
    </div>
  );
}