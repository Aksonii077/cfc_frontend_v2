import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { PortfolioStartup } from "./PortfolioManagement";
import {
  FileText,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Edit,
  Eye,
  Download,
  Filter,
  Search,
  Flame,
  X,
} from "lucide-react";

interface InvestorUpdate {
  id: string;
  month: string;
  year: number;
  status: "draft" | "submitted" | "reviewed";
  submittedAt?: string;
  submittedBy: string;
  
  // Key Metrics
  metrics: {
    mrr: number;
    mrrGrowth: number;
    burnRate: number;
    cashRunway: number;
    userGrowth: number;
    customerChurn: number;
    cac: number;
    ltv: number;
    newCustomers: number;
    activeUsers: number;
  };
  
  // Qualitative Updates
  highlights: string;
  challenges: string;
  keyMilestones: string[];
  upcomingMilestones: string[];
  teamUpdates: string;
  fundraisingUpdate: string;
  askFromInvestors: string;
  
  // Additional Data
  attachments: string[];
  notes: string;
}

interface InvestorUpdatesProps {
  startup: PortfolioStartup;
}

export function InvestorUpdates({ startup }: InvestorUpdatesProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [showNewUpdate, setShowNewUpdate] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock investor updates data - in real app, this would come from the database
  const [investorUpdates, setInvestorUpdates] = useState<InvestorUpdate[]>([
    {
      id: "1",
      month: "January",
      year: 2024,
      status: "submitted",
      submittedAt: "2024-01-15T10:00:00Z",
      submittedBy: "Sarah Chen",
      metrics: {
        mrr: 25000,
        mrrGrowth: 13.6,
        burnRate: 45000,
        cashRunway: 18,
        userGrowth: 23,
        customerChurn: 5.2,
        cac: 150,
        ltv: 2400,
        newCustomers: 145,
        activeUsers: 1250,
      },
      highlights: "Successfully closed our largest enterprise deal worth $120k ARR. Launched new analytics dashboard feature which has seen 40% adoption rate among existing customers. Team expanded with two senior engineers.",
      challenges: "Customer acquisition costs increased due to competitive market conditions. Some challenges with customer onboarding flow leading to slight increase in early churn.",
      keyMilestones: [
        "Closed $120k enterprise deal with TechCorp",
        "Launched analytics dashboard feature",
        "Hired 2 senior engineers",
        "Reached 1,250 active users milestone"
      ],
      upcomingMilestones: [
        "Launch mobile app beta",
        "Close Series A funding round",
        "Expand to European market",
        "Release API v2.0"
      ],
      teamUpdates: "Added Sarah Kim as Head of Sales and John Doe as Senior Backend Engineer. Team is now 12 people strong.",
      fundraisingUpdate: "Series A round progressing well. Have term sheets from 2 VCs, expecting to close $3M round by end of Q1.",
      askFromInvestors: "Introductions to potential enterprise customers in fintech space. Guidance on European market entry strategy.",
      attachments: ["pitch-deck-jan-2024.pdf", "financial-report-jan-2024.xlsx"],
      notes: "Strong month overall despite some CAC challenges. Team morale high with recent hires."
    },
    {
      id: "2",
      month: "December",
      year: 2023,
      status: "submitted",
      submittedAt: "2023-12-15T10:00:00Z",
      submittedBy: "Sarah Chen",
      metrics: {
        mrr: 22000,
        mrrGrowth: 18.9,
        burnRate: 42000,
        cashRunway: 19,
        userGrowth: 28,
        customerChurn: 4.8,
        cac: 135,
        ltv: 2250,
        newCustomers: 128,
        activeUsers: 1105,
      },
      highlights: "Record month for new customer acquisitions. Product-market fit metrics continue to improve. Successful launch of enterprise tier pricing.",
      challenges: "Scaling customer support with rapid growth. Need to hire more engineers for upcoming features.",
      keyMilestones: [
        "Launched enterprise pricing tier",
        "128 new customers (record month)",
        "Achieved product-market fit score of 40%"
      ],
      upcomingMilestones: [
        "Close enterprise deals in pipeline",
        "Hire 2 senior engineers",
        "Launch analytics dashboard"
      ],
      teamUpdates: "Actively interviewing for engineering and sales roles. Strong candidate pipeline.",
      fundraisingUpdate: "Starting Series A process in Q1 2024. Initial investor conversations scheduled.",
      askFromInvestors: "Recommendations for Series A lead investors. Help with scaling engineering team.",
      attachments: ["metrics-dec-2023.xlsx"],
      notes: "Excellent momentum heading into 2024. Ready to scale."
    }
  ]);

  const [newUpdate, setNewUpdate] = useState<Partial<InvestorUpdate>>({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    status: "draft",
    metrics: {
      mrr: startup.metrics.mrr,
      mrrGrowth: 0,
      burnRate: startup.metrics.burnRate,
      cashRunway: startup.metrics.cashRunway,
      userGrowth: startup.metrics.userGrowth,
      customerChurn: startup.metrics.customerChurn,
      cac: startup.metrics.cac,
      ltv: 0,
      newCustomers: 0,
      activeUsers: 0,
    },
    highlights: "",
    challenges: "",
    keyMilestones: [],
    upcomingMilestones: [],
    teamUpdates: "",
    fundraisingUpdate: "",
    askFromInvestors: "",
    attachments: [],
    notes: "",
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted": return "bg-[#06CB1D]/10 text-[#06CB1D] border-[#06CB1D]/30";
      case "reviewed": return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "draft": return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
      default: return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted": return <CheckCircle className="w-4 h-4" />;
      case "reviewed": return <Eye className="w-4 h-4" />;
      case "draft": return <Edit className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-[#06CB1D]" />;
    if (change < 0) return <TrendingDown className="w-3 h-3 text-[#FF220E]" />;
    return <div className="w-3 h-3" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-[#06CB1D]";
    if (change < 0) return "text-[#FF220E]";
    return "text-gray-600";
  };

  const handleSubmitUpdate = () => {
    const update: InvestorUpdate = {
      id: Date.now().toString(),
      month: newUpdate.month || "",
      year: newUpdate.year || new Date().getFullYear(),
      status: "submitted",
      submittedAt: new Date().toISOString(),
      submittedBy: "Current User",
      metrics: newUpdate.metrics || {
        mrr: 0, mrrGrowth: 0, burnRate: 0, cashRunway: 0,
        userGrowth: 0, customerChurn: 0, cac: 0, ltv: 0,
        newCustomers: 0, activeUsers: 0
      },
      highlights: newUpdate.highlights || "",
      challenges: newUpdate.challenges || "",
      keyMilestones: newUpdate.keyMilestones || [],
      upcomingMilestones: newUpdate.upcomingMilestones || [],
      teamUpdates: newUpdate.teamUpdates || "",
      fundraisingUpdate: newUpdate.fundraisingUpdate || "",
      askFromInvestors: newUpdate.askFromInvestors || "",
      attachments: newUpdate.attachments || [],
      notes: newUpdate.notes || "",
    };

    setInvestorUpdates([update, ...investorUpdates]);
    setNewUpdate({
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      status: "draft",
      metrics: {
        mrr: startup.metrics.mrr,
        mrrGrowth: 0,
        burnRate: startup.metrics.burnRate,
        cashRunway: startup.metrics.cashRunway,
        userGrowth: startup.metrics.userGrowth,
        customerChurn: startup.metrics.customerChurn,
        cac: startup.metrics.cac,
        ltv: 0,
        newCustomers: 0,
        activeUsers: 0,
      },
      highlights: "",
      challenges: "",
      keyMilestones: [],
      upcomingMilestones: [],
      teamUpdates: "",
      fundraisingUpdate: "",
      askFromInvestors: "",
      attachments: [],
      notes: "",
    });
    setShowNewUpdate(false);
  };

  const filteredUpdates = investorUpdates.filter(update => 
    update.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.highlights.toLowerCase().includes(searchQuery.toLowerCase()) ||
    update.challenges.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Investor Updates</h2>
          <p className="text-gray-600">Standardized monthly updates for investors and stakeholders</p>
        </div>
        <Button onClick={() => setShowNewUpdate(true)} className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Plus className="w-4 h-4" />
          Create Update
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#114DFF]" />
              <div>
                <p className="text-sm text-gray-600">Total Updates</p>
                <p className="text-lg text-gray-900">{investorUpdates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-lg text-gray-900">{investorUpdates.filter(u => u.status === "submitted").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3CE5A7]" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-lg text-gray-900">
                  {investorUpdates.some(u => u.month === new Date().toLocaleString('default', { month: 'long' }) && u.year === new Date().getFullYear()) ? "Complete" : "Pending"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#06CB1D]" />
              <div>
                <p className="text-sm text-gray-600">Avg MRR Growth</p>
                <p className="text-lg text-gray-900">
                  {investorUpdates.length > 0 
                    ? `${(investorUpdates.reduce((sum, u) => sum + u.metrics.mrrGrowth, 0) / investorUpdates.length).toFixed(1)}%`
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#114DFF]" />
          <Input
            placeholder="Search updates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#C8D6FF]"
          />
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border border-[#C8D6FF] rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="current">Current Year</option>
          <option value="last6">Last 6 Months</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {filteredUpdates.map((update) => (
          <Card key={update.id} className="border-[#C8D6FF] hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg text-gray-900">{update.month} {update.year} Update</h3>
                  <Badge variant="outline" className={getStatusColor(update.status)}>
                    {getStatusIcon(update.status)}
                    <span className="ml-1 capitalize">{update.status}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {update.submittedAt && (
                    <span className="text-sm text-gray-500">
                      Submitted {formatDate(update.submittedAt)}
                    </span>
                  )}
                  <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div>
                <h4 className="mb-3">Key Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-[#06CB1D]/10 rounded-lg border border-[#06CB1D]/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-[#06CB1D]" />
                      <span className="text-xs text-[#06CB1D]">MRR</span>
                    </div>
                    <p className="text-gray-900">{formatCurrency(update.metrics.mrr)}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {getChangeIcon(update.metrics.mrrGrowth)}
                      <span className={`text-xs ${getChangeColor(update.metrics.mrrGrowth)}`}>
                        {update.metrics.mrrGrowth > 0 ? "+" : ""}{update.metrics.mrrGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-[#114DFF]" />
                      <span className="text-xs text-[#114DFF]">Users</span>
                    </div>
                    <p className="text-gray-900">{update.metrics.activeUsers.toLocaleString()}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {getChangeIcon(update.metrics.userGrowth)}
                      <span className={`text-xs ${getChangeColor(update.metrics.userGrowth)}`}>
                        {update.metrics.userGrowth > 0 ? "+" : ""}{update.metrics.userGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-center p-3 bg-[#FF220E]/5 rounded-lg border border-[#FF220E]/30">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="w-4 h-4 text-[#FF220E]" />
                      <span className="text-xs text-[#FF220E]">Runway</span>
                    </div>
                    <p className="text-gray-900">{update.metrics.cashRunway}mo</p>
                    <p className="text-xs text-gray-700">{formatCurrency(update.metrics.burnRate)}/mo</p>
                  </div>

                  <div className="text-center p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="w-4 h-4 text-[#3CE5A7]" />
                      <span className="text-xs text-[#3CE5A7]">CAC</span>
                    </div>
                    <p className="text-gray-900">{formatCurrency(update.metrics.cac)}</p>
                    <p className="text-xs text-gray-700">LTV: {formatCurrency(update.metrics.ltv)}</p>
                  </div>
                </div>
              </div>

              {/* Highlights & Challenges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#06CB1D]" />
                    Key Highlights
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{update.highlights}</p>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FF220E]" />
                    Challenges
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{update.challenges}</p>
                </div>
              </div>

              {/* Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="mb-2">Key Milestones Achieved</h4>
                  <ul className="space-y-1">
                    {update.keyMilestones.map((milestone, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-[#06CB1D] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2">Upcoming Milestones</h4>
                  <ul className="space-y-1">
                    {update.upcomingMilestones.map((milestone, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-[#114DFF] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Updates */}
              {(update.teamUpdates || update.fundraisingUpdate || update.askFromInvestors) && (
                <div className="space-y-4 pt-4 border-t border-[#C8D6FF]">
                  {update.teamUpdates && (
                    <div>
                      <h4 className="mb-2">Team Updates</h4>
                      <p className="text-sm text-gray-700">{update.teamUpdates}</p>
                    </div>
                  )}

                  {update.fundraisingUpdate && (
                    <div>
                      <h4 className="mb-2">Fundraising Update</h4>
                      <p className="text-sm text-gray-700">{update.fundraisingUpdate}</p>
                    </div>
                  )}

                  {update.askFromInvestors && (
                    <div>
                      <h4 className="mb-2">Ask from Investors</h4>
                      <p className="text-sm text-gray-700">{update.askFromInvestors}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUpdates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-[#C8D6FF] mb-4" />
          <h3 className="text-lg text-gray-900 mb-2">No investor updates found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? "Try adjusting your search query"
              : "Create your first monthly investor update"
            }
          </p>
          <Button onClick={() => setShowNewUpdate(true)} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Update
          </Button>
        </div>
      )}

      {/* New Update Modal */}
      {showNewUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-[#C8D6FF]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create Investor Update</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowNewUpdate(false)} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Period Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Month</label>
                  <select
                    value={newUpdate.month}
                    onChange={(e) => setNewUpdate({ ...newUpdate, month: e.target.value })}
                    className="w-full border border-[#C8D6FF] rounded-md px-3 py-2 bg-white"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                      return <option key={month} value={month}>{month}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="text-sm">Year</label>
                  <Input
                    type="number"
                    value={newUpdate.year}
                    onChange={(e) => setNewUpdate({ ...newUpdate, year: Number(e.target.value) })}
                    className="border-[#C8D6FF]"
                  />
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="mb-3">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(newUpdate.metrics || {}).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setNewUpdate({
                          ...newUpdate,
                          metrics: { ...newUpdate.metrics!, [key]: Number(e.target.value) }
                        })}
                        className="border-[#C8D6FF]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualitative Updates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm">Key Highlights</label>
                  <Textarea
                    value={newUpdate.highlights}
                    onChange={(e) => setNewUpdate({ ...newUpdate, highlights: e.target.value })}
                    placeholder="What went well this month?"
                    rows={4}
                    className="border-[#C8D6FF]"
                  />
                </div>
                <div>
                  <label className="text-sm">Challenges</label>
                  <Textarea
                    value={newUpdate.challenges}
                    onChange={(e) => setNewUpdate({ ...newUpdate, challenges: e.target.value })}
                    placeholder="What challenges did you face?"
                    rows={4}
                    className="border-[#C8D6FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm">Team Updates</label>
                  <Textarea
                    value={newUpdate.teamUpdates}
                    onChange={(e) => setNewUpdate({ ...newUpdate, teamUpdates: e.target.value })}
                    placeholder="Team changes, hires, etc."
                    rows={3}
                    className="border-[#C8D6FF]"
                  />
                </div>
                <div>
                  <label className="text-sm">Fundraising Update</label>
                  <Textarea
                    value={newUpdate.fundraisingUpdate}
                    onChange={(e) => setNewUpdate({ ...newUpdate, fundraisingUpdate: e.target.value })}
                    placeholder="Fundraising progress and plans"
                    rows={3}
                    className="border-[#C8D6FF]"
                  />
                </div>
                <div>
                  <label className="text-sm">Ask from Investors</label>
                  <Textarea
                    value={newUpdate.askFromInvestors}
                    onChange={(e) => setNewUpdate({ ...newUpdate, askFromInvestors: e.target.value })}
                    placeholder="How can investors help?"
                    rows={3}
                    className="border-[#C8D6FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm">Additional Notes</label>
                <Textarea
                  value={newUpdate.notes}
                  onChange={(e) => setNewUpdate({ ...newUpdate, notes: e.target.value })}
                  placeholder="Any additional context or notes"
                  rows={2}
                  className="border-[#C8D6FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#C8D6FF]">
                <Button variant="outline" onClick={() => setShowNewUpdate(false)} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  Cancel
                </Button>
                <Button onClick={handleSubmitUpdate} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}