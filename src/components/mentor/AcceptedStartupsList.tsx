import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { OnboardingWorkflow } from "./OnboardingWorkflow";
import {
  CheckCircle,
  Clock,
  Users,
  Settings,
  Rocket,
  ArrowRight,
  Calendar,
  FileText,
} from "lucide-react";

interface AcceptedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  requestedFunding: number;
  aiScore: number;
  description: string;
  teamSize: number;
  acceptedAt: string;
  onboardingStatus: "pending" | "in-progress" | "completed";
  progressPercentage: number;
}

interface AcceptedStartupsListProps {
  onNavigateToProfile?: (userId: string) => void;
}

// Mock accepted startups data
const mockAcceptedStartups: AcceptedStartup[] = [
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
    description: "Developing AI-powered solar panel optimization systems for residential and commercial use.",
    teamSize: 4,
    acceptedAt: "2024-01-15T10:30:00Z",
    onboardingStatus: "in-progress",
    progressPercentage: 60,
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
    description: "AI-powered diagnostic tool for early detection of cardiovascular diseases.",
    teamSize: 3,
    acceptedAt: "2024-01-10T14:20:00Z",
    onboardingStatus: "completed",
    progressPercentage: 100,
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
    description: "Autonomous farming robots for precision agriculture and crop monitoring.",
    teamSize: 6,
    acceptedAt: "2024-01-08T09:15:00Z",
    onboardingStatus: "pending",
    progressPercentage: 0,
  },
];

export function AcceptedStartupsList({ onNavigateToProfile }: AcceptedStartupsListProps) {
  const [selectedStartup, setSelectedStartup] = useState<AcceptedStartup | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Setup Required",
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: Clock,
        };
      case "in-progress":
        return {
          label: "In Progress", 
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Settings,
        };
      case "completed":
        return {
          label: "Completed",
          color: "bg-green-50 text-green-700 border-green-200", 
          icon: CheckCircle,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-50 text-gray-700 border-gray-200",
          icon: Clock,
        };
    }
  };

  const handleManageOnboarding = (startup: AcceptedStartup) => {
    setSelectedStartup(startup);
    setShowOnboarding(true);
  };

  if (showOnboarding && selectedStartup) {
    // Convert to Application format for OnboardingWorkflow
    const applicationData = {
      id: selectedStartup.id,
      startupName: selectedStartup.startupName,
      founderName: selectedStartup.founderName,
      founderEmail: selectedStartup.founderEmail,
      industry: selectedStartup.industry,
      stage: selectedStartup.stage,
      location: selectedStartup.location,
      requestedFunding: selectedStartup.requestedFunding,
      aiScore: selectedStartup.aiScore,
      description: selectedStartup.description,
      teamSize: selectedStartup.teamSize,
      marketScore: 90,
      teamScore: 88,
      ideaScore: 94,
      fitScore: 91,
      submittedAt: selectedStartup.acceptedAt,
      status: "accepted" as const,
      previousFunding: 50000,
      revenueStage: "Pre-revenue",
    };

    return (
      <OnboardingWorkflow
        application={applicationData}
        onBack={() => {
          setShowOnboarding(false);
          setSelectedStartup(null);
        }}
        onComplete={() => {
          setShowOnboarding(false);
          setSelectedStartup(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accepted Startups</h2>
          <p className="text-gray-600 mt-1">
            Manage onboarding for {mockAcceptedStartups.length} accepted companies
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {mockAcceptedStartups.filter(s => s.onboardingStatus === "completed").length} Complete
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <Clock className="w-3 h-3 mr-1" />
            {mockAcceptedStartups.filter(s => s.onboardingStatus === "pending").length} Pending
          </Badge>
        </div>
      </div>

      {/* Startups List */}
      <div className="space-y-4">
        {mockAcceptedStartups.map((startup) => {
          const statusConfig = getStatusConfig(startup.onboardingStatus);
          
          return (
            <Card key={startup.id} className="border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {startup.startupName}
                      </h3>
                      <Badge variant="outline" className={statusConfig.color}>
                        <statusConfig.icon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      Founded by {startup.founderName} • {startup.industry} • {startup.stage}
                    </p>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                      {startup.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{startup.teamSize} team members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Accepted {new Date(startup.acceptedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Rocket className="w-4 h-4" />
                        <span>AI Score: {startup.aiScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center ml-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-700">{startup.progressPercentage}%</div>
                        <div className="text-xs text-purple-600">Complete</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Onboarding Progress</span>
                    <span className="text-sm text-gray-600">{startup.progressPercentage}%</span>
                  </div>
                  <Progress value={startup.progressPercentage} className="h-2" />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{startup.founderEmail}</span>
                    <span>{startup.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button 
                      onClick={() => handleManageOnboarding(startup)}
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Onboarding
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {mockAcceptedStartups.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Accepted Startups Yet
            </h3>
            <p className="text-gray-600">
              Startups you accept will appear here for onboarding management.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}