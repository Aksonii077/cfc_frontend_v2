import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ApplicationManagement } from "./ApplicationManagement";
import { MentorCalendar } from "./MentorCalendar";
import { MentorStats } from "./MentorStats";
import { AcceptedStartupsList } from "./AcceptedStartupsList";
import {
  Inbox,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Filter,
  Search,
  Building2,
  Rocket,
} from "lucide-react";

interface MentorDashboardProps {
  onNavigateToProfile?: (userId: string) => void;
}

export function MentorDashboard({ onNavigateToProfile }: MentorDashboardProps) {
  const [activeTab, setActiveTab] = useState("application-center");
  const [stats] = useState({
    totalApplications: 87,
    pendingReview: 23,
    interviewsScheduled: 8,
    accepted: 12,
    currentPortfolio: 34,
    avgRating: 4.8,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] to-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-gray-900">Mentor & Incubator Hub</h1>
                  <p className="text-gray-600">
                    Powered by RACE AI • Evaluate, Guide, and Scale Startups
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                <Star className="w-4 h-4 mr-1" />
                {stats.avgRating} Rating
              </Badge>
              <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                <Users className="w-4 h-4 mr-1" />
                {stats.currentPortfolio} Portfolio
              </Badge>
              <Badge variant="outline" className="bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]">
                <Clock className="w-4 h-4 mr-1" />
                {stats.pendingReview} Pending
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <MentorStats stats={stats} />

        {/* Main Content */}
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="application-center" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Applications
                {stats.pendingReview > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 text-xs">
                    {stats.pendingReview}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                My Calendar
              </TabsTrigger>
              <TabsTrigger value="startup-portfolio" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Portfolio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="application-center">
              <ApplicationManagement onNavigateToProfile={onNavigateToProfile} />
            </TabsContent>

            <TabsContent value="calendar">
              <MentorCalendar />
            </TabsContent>

            <TabsContent value="startup-portfolio">
              <AcceptedStartupsList onNavigateToProfile={onNavigateToProfile} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}