import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { PortfolioStartup } from "./PortfolioManagement";
import { KPIDashboard } from "./KPIDashboard";
import { DocumentRepository } from "./DocumentRepository";
import { InvestorUpdates } from "./InvestorUpdates";
import { StartupApplicationOverview } from "./StartupApplicationOverview";
import { getApplicationFormData } from "../../utils/mocks";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageCircle,
  FileText,
  Target,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  Flame,
  Eye,
  Edit,
  Download,
  Plus,
  Send,
} from "lucide-react";

interface StartupWorkspaceProps {
  startup: PortfolioStartup;
  onBack: () => void;
}

export function StartupWorkspace({ startup, onBack }: StartupWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("startup-details");

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getHealthScoreColor = (score: string) => {
    switch (score) {
      case "green": return "text-green-600 bg-green-100 border-green-200";
      case "yellow": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "red": return "text-red-600 bg-red-100 border-red-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getHealthScoreIcon = (score: string) => {
    switch (score) {
      case "green": return <CheckCircle className="w-4 h-4" />;
      case "yellow": return <Clock className="w-4 h-4" />;
      case "red": return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
          <div>
            <h1 className="text-gray-900">{startup.companyName}</h1>
            <p className="text-gray-600">Startup Workspace & Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getHealthScoreColor(startup.healthScore)}>
            {getHealthScoreIcon(startup.healthScore)}
            <span className="ml-1 capitalize">{startup.healthScore} Health</span>
          </Badge>
          {startup.unreadMessages > 0 && (
            <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
              <MessageCircle className="w-3 h-3 mr-1" />
              {startup.unreadMessages} Messages
            </Badge>
          )}
        </div>
      </div>

      {/* Startup Info Card */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 ring-2 ring-[#C8D6FF]">
                <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                  {startup.companyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-gray-900 mb-1">{startup.companyName}</h2>
                <p className="text-gray-600 mb-2">Founded by {startup.founderName}</p>
                <div className="flex items-center gap-4 text-gray-600">
                  <span>{startup.industry}</span>
                  <span>•</span>
                  <span>{startup.stage} Stage</span>
                  <span>•</span>
                  <span>{startup.agreementType} Program</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Agreement Date</p>
              <p className="text-gray-900">{formatDate(startup.agreementDate)}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
              <DollarSign className="w-6 h-6 text-[#06CB1D] mx-auto mb-2" />
              <div className="text-[#06CB1D]">{formatCurrency(startup.metrics.mrr)}</div>
              <div className="text-gray-700">Monthly Recurring Revenue</div>
            </div>

            <div className="text-center p-4 bg-[#F5F5F5] rounded-lg border border-[#CCCCCC]">
              <Flame className="w-6 h-6 text-[#FF220E] mx-auto mb-2" />
              <div className="text-[#FF220E]">{startup.metrics.cashRunway}mo</div>
              <div className="text-gray-700">Cash Runway</div>
            </div>

            <div className="text-center p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <Users className="w-6 h-6 text-[#114DFF] mx-auto mb-2" />
              <div className="text-[#114DFF]">
                {startup.metrics.userGrowth > 0 ? "+" : ""}{startup.metrics.userGrowth}%
              </div>
              <div className="text-gray-700">User Growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workspace Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="startup-details">Startup Details</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kpis">KPI Dashboard</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="updates">Investor Updates</TabsTrigger>
        </TabsList>

        {/* Startup Details Tab - Application Form Data */}
        <TabsContent value="startup-details">
          <StartupApplicationOverview 
            applicationId={startup.id}
            applicationData={getApplicationFormData(startup.id) || {
              // Fallback to basic data if no mock data found
              contactName: startup.founderName,
              email: `${startup.founderName.toLowerCase().replace(' ', '.')}@${startup.companyName.toLowerCase().replace(' ', '')}.com`,
              startupName: startup.companyName,
              hqLocation: 'Location not specified',
              currentStage: startup.stage,
              summary: `${startup.companyName} is a ${startup.stage} stage startup in the ${startup.industry} industry.`,
              submittedAt: startup.agreementDate,
              applicationFlow: 'deck-only'
            }}
          />
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Score Analysis */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#114DFF]" />
                  Health Score Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Overall Health</span>
                    <Badge variant="outline" className={getHealthScoreColor(startup.healthScore)}>
                      {getHealthScoreIcon(startup.healthScore)}
                      <span className="ml-1 capitalize">{startup.healthScore}</span>
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Revenue Growth</span>
                      <span className={startup.metrics.userGrowth >= 15 ? "text-[#06CB1D]" : startup.metrics.userGrowth >= 5 ? "text-gray-700" : "text-[#FF220E]"}>
                        {startup.metrics.userGrowth >= 15 ? "Strong" : startup.metrics.userGrowth >= 5 ? "Moderate" : "Weak"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cash Runway</span>
                      <span className={startup.metrics.cashRunway >= 18 ? "text-[#06CB1D]" : startup.metrics.cashRunway >= 12 ? "text-gray-700" : "text-[#FF220E]"}>
                        {startup.metrics.cashRunway >= 18 ? "Healthy" : startup.metrics.cashRunway >= 12 ? "Moderate" : "Critical"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Customer Retention</span>
                      <span className={startup.metrics.customerChurn <= 5 ? "text-[#06CB1D]" : startup.metrics.customerChurn <= 10 ? "text-gray-700" : "text-[#FF220E]"}>
                        {startup.metrics.customerChurn <= 5 ? "Excellent" : startup.metrics.customerChurn <= 10 ? "Good" : "Needs Improvement"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#114DFF]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">KPI Update Submitted</p>
                      <p className="text-gray-600">Updated MRR and user metrics for January</p>
                      <p className="text-gray-500">{formatDate(startup.lastUpdate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <div className="w-8 h-8 bg-[#06CB1D] rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">Milestone Completed</p>
                      <p className="text-gray-600">Q1 Product roadmap finalized</p>
                      <p className="text-gray-500">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                    <div className="w-8 h-8 bg-[#114DFF] rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">New Discussion</p>
                      <p className="text-gray-600">Funding strategy discussion started</p>
                      <p className="text-gray-500">{formatDate(startup.lastCommunication)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kpis">
          <KPIDashboard startup={startup} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentRepository startup={startup} />
        </TabsContent>

        <TabsContent value="updates">
          <InvestorUpdates startup={startup} />
        </TabsContent>
      </Tabs>
    </div>
  );
}