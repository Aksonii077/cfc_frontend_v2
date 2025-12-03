import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PortfolioDashboard } from "./PortfolioDashboard";
import { StartupWorkspace } from "./StartupWorkspace";
import {
  ArrowLeft,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface PortfolioStartup {
  id: string;
  companyName: string;
  founderName: string;
  industry: string;
  stage: string;
  agreementDate: string;
  agreementType: "mentorship" | "incubator" | "accelerator";
  healthScore: "green" | "yellow" | "red";
  lastUpdate: string;
  // KPI Data
  metrics: {
    mrr: number;
    burnRate: number;
    cashRunway: number;
    userGrowth: number;
    customerChurn: number;
    cac: number;
  };
  // Milestone Data
  currentMilestones: {
    thirtyDay: { total: number; completed: number };
    sixtyDay: { total: number; completed: number };
    ninetyDay: { total: number; completed: number };
  };
  // Communication
  unreadMessages: number;
  lastCommunication: string;
}

interface PortfolioManagementProps {
  onBack: () => void;
}

export function PortfolioManagement({ onBack }: PortfolioManagementProps) {
  const [currentView, setCurrentView] = useState<"dashboard" | "workspace">("dashboard");
  const [selectedStartupId, setSelectedStartupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterBy, setFilterBy] = useState<"all" | "green" | "yellow" | "red">("all");

  // Mock portfolio data - in real app, this would come from the database
  const portfolioStartups: PortfolioStartup[] = [
    {
      id: "1",
      companyName: "EcoTech Solutions",
      founderName: "Sarah Chen",
      industry: "CleanTech",
      stage: "Seed",
      agreementDate: "2024-01-15",
      agreementType: "incubator",
      healthScore: "green",
      lastUpdate: "2024-01-18",
      metrics: {
        mrr: 25000,
        burnRate: 45000,
        cashRunway: 18,
        userGrowth: 23,
        customerChurn: 5.2,
        cac: 150
      },
      currentMilestones: {
        thirtyDay: { total: 5, completed: 4 },
        sixtyDay: { total: 8, completed: 5 },
        ninetyDay: { total: 12, completed: 3 }
      },
      unreadMessages: 3,
      lastCommunication: "2024-01-17"
    },
    {
      id: "2",
      companyName: "HealthAI Diagnostics",
      founderName: "Michael Rodriguez",
      industry: "HealthTech",
      stage: "Pre-Seed",
      agreementDate: "2024-01-10",
      agreementType: "accelerator",
      healthScore: "yellow",
      lastUpdate: "2024-01-16",
      metrics: {
        mrr: 12000,
        burnRate: 35000,
        cashRunway: 12,
        userGrowth: 15,
        customerChurn: 8.5,
        cac: 280
      },
      currentMilestones: {
        thirtyDay: { total: 6, completed: 3 },
        sixtyDay: { total: 10, completed: 4 },
        ninetyDay: { total: 15, completed: 2 }
      },
      unreadMessages: 1,
      lastCommunication: "2024-01-15"
    },
    {
      id: "3",
      companyName: "FinanceFlow Pro",
      founderName: "Lisa Wang",
      industry: "FinTech",
      stage: "Series A",
      agreementDate: "2023-12-20",
      agreementType: "mentorship",
      healthScore: "red",
      lastUpdate: "2024-01-12",
      metrics: {
        mrr: 45000,
        burnRate: 85000,
        cashRunway: 8,
        userGrowth: -5,
        customerChurn: 15.2,
        cac: 450
      },
      currentMilestones: {
        thirtyDay: { total: 4, completed: 1 },
        sixtyDay: { total: 7, completed: 2 },
        ninetyDay: { total: 10, completed: 1 }
      },
      unreadMessages: 7,
      lastCommunication: "2024-01-10"
    }
  ];

  const filteredStartups = portfolioStartups.filter(startup => {
    const matchesSearch = startup.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         startup.founderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         startup.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === "all" || startup.healthScore === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  // Calculate portfolio stats
  const portfolioStats = {
    totalStartups: portfolioStartups.length,
    healthyStartups: portfolioStartups.filter(s => s.healthScore === "green").length,
    atRiskStartups: portfolioStartups.filter(s => s.healthScore === "red").length,
    totalMRR: portfolioStartups.reduce((sum, s) => sum + s.metrics.mrr, 0),
    averageHealthScore: portfolioStartups.filter(s => s.healthScore === "green").length / portfolioStartups.length * 100
  };

  const handleStartupSelect = (startupId: string) => {
    setSelectedStartupId(startupId);
    setCurrentView("workspace");
  };

  const handleBackToDashboard = () => {
    setSelectedStartupId(null);
    setCurrentView("dashboard");
  };

  if (currentView === "workspace" && selectedStartupId) {
    const selectedStartup = portfolioStartups.find(s => s.id === selectedStartupId);
    if (selectedStartup) {
      return (
        <StartupWorkspace
          startup={selectedStartup}
          onBack={handleBackToDashboard}
        />
      );
    }
  }

  return (
    <div className="space-y-6">

      

      {/* Portfolio Overview Stats */}


      {/* Filters and Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#F7F9FF] border-[#C8D6FF]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="border border-[#C8D6FF] rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="all">All Health Scores</option>
              <option value="green">Healthy (Green)</option>
              <option value="yellow">Warning (Yellow)</option>
              <option value="red">At Risk (Red)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "border-[#C8D6FF] hover:bg-[#EDF2FF]"}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "border-[#C8D6FF] hover:bg-[#EDF2FF]"}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Portfolio Dashboard */}
      <PortfolioDashboard
        startups={filteredStartups}
        viewMode={viewMode}
        onStartupSelect={handleStartupSelect}
      />
    </div>
  );
}