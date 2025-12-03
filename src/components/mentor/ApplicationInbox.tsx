import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ApplicationCard } from "./ApplicationCard";
import { StartupProfileView } from "./StartupProfileView";
import { ApplicationFilters } from "./ApplicationFilters";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  requestedFunding: number;
  aiScore: number;
  marketScore: number;
  teamScore: number;
  ideaScore: number;
  fitScore: number;
  submittedAt: string;
  status: "pending" | "reviewing" | "interview-scheduled" | "accepted" | "rejected";
  pitchDeck?: string;
  description: string;
  teamSize: number;
  previousFunding: number;
  revenueStage: string;
}

interface ApplicationInboxProps {
  onNavigateToProfile?: (userId: string) => void;
}

// Mock data for applications
const mockApplications: Application[] = [
  {
    id: "1",
    startupName: "EcoTech Solutions",
    founderName: "Sarah Chen",
    founderEmail: "sarah@ecotech.com",
    industry: "CleanTech",
    stage: "Seed",
    location: "San Francisco, CA",
    requestedFunding: 500000,
    aiScore: 92,
    marketScore: 95,
    teamScore: 88,
    ideaScore: 94,
    fitScore: 91,
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    description: "Developing AI-powered solar panel optimization systems for residential and commercial use.",
    teamSize: 4,
    previousFunding: 50000,
    revenueStage: "Pre-revenue",
  },
  {
    id: "2",
    startupName: "HealthAI",
    founderName: "Dr. Michael Rodriguez",
    founderEmail: "michael@healthai.com",
    industry: "HealthTech",
    stage: "Pre-Seed",
    location: "Boston, MA",
    requestedFunding: 250000,
    aiScore: 87,
    marketScore: 90,
    teamScore: 85,
    ideaScore: 88,
    fitScore: 85,
    submittedAt: "2024-01-14T14:20:00Z",
    status: "reviewing",
    description: "AI-powered diagnostic tool for early detection of cardiovascular diseases.",
    teamSize: 3,
    previousFunding: 0,
    revenueStage: "Pre-revenue",
  },
  {
    id: "3",
    startupName: "AgriBot",
    founderName: "James Kim",
    founderEmail: "james@agribot.com",
    industry: "AgTech",
    stage: "Seed",
    location: "Austin, TX",
    requestedFunding: 750000,
    aiScore: 84,
    marketScore: 82,
    teamScore: 87,
    ideaScore: 85,
    fitScore: 83,
    submittedAt: "2024-01-13T09:15:00Z",
    status: "interview-scheduled",
    description: "Autonomous farming robots for precision agriculture and crop monitoring.",
    teamSize: 6,
    previousFunding: 100000,
    revenueStage: "Early revenue",
  },
  {
    id: "4",
    startupName: "FinFlow",
    founderName: "Lisa Wang",
    founderEmail: "lisa@finflow.com",
    industry: "FinTech",
    stage: "Pre-Seed",
    location: "New York, NY",
    requestedFunding: 300000,
    aiScore: 79,
    marketScore: 85,
    teamScore: 75,
    ideaScore: 80,
    fitScore: 77,
    submittedAt: "2024-01-12T16:45:00Z",
    status: "pending",
    description: "B2B cash flow management platform for small and medium enterprises.",
    teamSize: 2,
    previousFunding: 25000,
    revenueStage: "Pre-revenue",
  },
  {
    id: "5",
    startupName: "EduVR",
    founderName: "Alex Thompson",
    founderEmail: "alex@eduvr.com",
    industry: "EdTech",
    stage: "Seed",
    location: "Seattle, WA",
    requestedFunding: 600000,
    aiScore: 76,
    marketScore: 78,
    teamScore: 80,
    ideaScore: 75,
    fitScore: 72,
    submittedAt: "2024-01-11T11:30:00Z",
    status: "rejected",
    description: "Virtual reality platform for immersive educational experiences in K-12.",
    teamSize: 5,
    previousFunding: 75000,
    revenueStage: "Early revenue",
  },
];

export function ApplicationInbox({ onNavigateToProfile }: ApplicationInboxProps) {
  const [applications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"aiScore" | "submittedAt" | "requestedFunding">("aiScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort applications
  const filteredAndSortedApplications = useMemo(() => {
    let filtered = applications.filter((app) => {
      const matchesSearch = 
        app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesIndustry = industryFilter === "all" || app.industry === industryFilter;
      const matchesStage = stageFilter === "all" || app.stage === stageFilter;
      const matchesScore = app.aiScore >= minScore;

      return matchesSearch && matchesStatus && matchesIndustry && matchesStage && matchesScore;
    });

    // Sort applications
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case "aiScore":
          compareValue = a.aiScore - b.aiScore;
          break;
        case "submittedAt":
          compareValue = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
          break;
        case "requestedFunding":
          compareValue = a.requestedFunding - b.requestedFunding;
          break;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [applications, searchTerm, sortBy, sortOrder, statusFilter, industryFilter, stageFilter, minScore]);

  const pendingCount = applications.filter(app => app.status === "pending").length;
  const highScoreCount = applications.filter(app => app.aiScore >= 85).length;

  if (selectedApplication) {
    return (
      <StartupProfileView
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        onNavigateToProfile={onNavigateToProfile}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with alerts */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Inbox</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedApplications.length} applications
            {pendingCount > 0 && (
              <span className="ml-2">
                • <span className="text-orange-600 font-medium">{pendingCount} pending review</span>
              </span>
            )}
            {highScoreCount > 0 && (
              <span className="ml-2">
                • <span className="text-green-600 font-medium">{highScoreCount} high-potential</span>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {pendingCount} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Star className="w-3 h-3 mr-1" />
            {highScoreCount} High-Potential
          </Badge>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by startup name, founder, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aiScore">AI Score</SelectItem>
                  <SelectItem value="submittedAt">Date Submitted</SelectItem>
                  <SelectItem value="requestedFunding">Funding Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {showFilters && (
            <ApplicationFilters
              statusFilter={statusFilter}
              industryFilter={industryFilter}
              stageFilter={stageFilter}
              minScore={minScore}
              onStatusChange={setStatusFilter}
              onIndustryChange={setIndustryFilter}
              onStageChange={setStageFilter}
              onMinScoreChange={setMinScore}
            />
          )}
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredAndSortedApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find applications.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={() => setSelectedApplication(application)}
              onNavigateToProfile={onNavigateToProfile}
            />
          ))
        )}
      </div>
    </div>
  );
}