// React & Hooks
import { useState } from "react";

// UI Components
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";

// Components
import { ApplicationProgressBar } from "./ApplicationProgressBar";
import { StartupProfileView } from "./StartupProfileView";
import { CommunicationFlow } from "./CommunicationFlow";

// Toast
import { toast } from "sonner@2.0.3";

// Icons
import {
  Search,
  Mail,
  Target,
  Brain,
  TrendingUp,
  Users as UsersIcon,
  Eye,
  Calendar,
  CheckCircle,
  XIcon,
  FileSignature,
  BarChart3,
  MessageSquare,
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
  status: "review-pending" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-started" | "agreement-in-progress" | "agreement-complete";
  description: string;
  teamSize: number;
  previousFunding: number;
  revenueStage: string;
  interviewDate?: string;
  interviewNotes?: string;
  decisionReason?: string;
  agreementTerms?: {
    version?: number;
    tenure?: string;
    equity?: string;
    equityPercentage?: number;
    deliverables?: string;
    status?: "pending-review" | "counter-proposed" | "accepted";
  };
}

interface ApplicationManagementProps {
  onNavigateToProfile?: (userId: string) => void;
  initialTab?: string;
  hideTabNavigation?: boolean;
}

// Mock data with various statuses
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
    status: "review-pending",
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
    status: "interview-scheduled",
    description: "AI-powered diagnostic tool for early detection of cardiovascular diseases using ECG pattern analysis.",
    teamSize: 3,
    previousFunding: 0,
    revenueStage: "Pre-revenue",
    interviewDate: "2024-01-22T15:00:00Z",
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
    status: "interview-completed",
    description: "Autonomous farming robots for precision agriculture and crop monitoring using computer vision and IoT sensors.",
    teamSize: 6,
    previousFunding: 100000,
    revenueStage: "Early revenue",
    interviewDate: "2024-01-18T10:00:00Z",
    interviewNotes: "Strong technical team, proven pilot customers, but high capital requirements for scaling.",
  },
  {
    id: "4",
    startupName: "DataFlow Analytics",
    founderName: "Alex Thompson",
    founderEmail: "alex@dataflow.com",
    industry: "Data Analytics",
    stage: "Seed",
    location: "Seattle, WA",
    requestedFunding: 600000,
    aiScore: 89,
    marketScore: 91,
    teamScore: 92,
    ideaScore: 87,
    fitScore: 88,
    submittedAt: "2024-01-11T11:30:00Z",
    status: "accepted",
    description: "Real-time data pipeline and analytics platform for enterprise customers with ML-powered insights.",
    teamSize: 8,
    previousFunding: 200000,
    revenueStage: "Growing revenue",
  },
  {
    id: "5",
    startupName: "CloudSync Analytics",
    founderName: "Ryan Foster",
    founderEmail: "ryan@cloudsync.com",
    industry: "SaaS & Cloud Computing",
    stage: "Seed",
    location: "San Diego, CA",
    requestedFunding: 450000,
    aiScore: 88,
    marketScore: 90,
    teamScore: 86,
    ideaScore: 87,
    fitScore: 89,
    submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "agreement-in-progress",
    description: "Enterprise-grade cloud data analytics platform that provides real-time insights across multi-cloud environments.",
    teamSize: 14,
    previousFunding: 350000,
    revenueStage: "$400K ARR",
    agreementTerms: {
      version: 2,
      tenure: "12 months",
      equity: "2.5%",
      equityPercentage: 2.5,
      deliverables: "Weekly mentorship sessions, network access, strategic guidance",
      status: "counter-proposed",
    }
  },
];

export function ApplicationManagement({ onNavigateToProfile, initialTab = "inbox", hideTabNavigation = false }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplicationTab, setSelectedApplicationTab] = useState<string | undefined>(undefined);
  const [showCommunicationFlow, setShowCommunicationFlow] = useState(false);
  const [communicationFlowApplication, setCommunicationFlowApplication] = useState<Application | null>(null);

  // Handle application status updates
  const handleApplicationUpdate = (updatedApp: Application) => {
    setApplications(prev => prev.map(app => 
      app.id === updatedApp.id ? updatedApp : app
    ));
  };

  // Accept application from interview-completed
  const handleAcceptApplication = (application: Application) => {
    const updatedApp = { ...application, status: "accepted" as const };
    handleApplicationUpdate(updatedApp);

    toast.success("Application Accepted", {
      description: `${application.startupName} has been accepted. An acceptance email has been sent to ${application.founderEmail}.`,
      duration: 5000,
    });
  };

  // Reject application
  const handleRejectApplication = (application: Application) => {
    const updatedApp = { ...application, status: "rejected" as const };
    handleApplicationUpdate(updatedApp);

    toast.success("Application Rejected", {
      description: `${application.startupName} has been rejected. A notification email has been sent.`,
      duration: 5000,
    });
  };

  // Schedule interview
  const handleScheduleInterview = (application: Application) => {
    setCommunicationFlowApplication(application);
    setShowCommunicationFlow(true);
  };

  // Start agreement
  const handleStartAgreement = (application: Application) => {
    setSelectedApplicationTab("agreement");
    setSelectedApplication(application);
  };

  // View progress for in-progress agreements
  const handleViewProgress = (application: Application) => {
    setSelectedApplicationTab("agreement");
    setSelectedApplication(application);
  };

  // Filter applications by search term
  const filteredApplications = applications.filter(app => 
    app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get action buttons based on status
  const getActionButtons = (application: Application) => {
    switch (application.status) {
      case "review-pending":
        return (
          <>
            <Button
              onClick={() => handleScheduleInterview(application)}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button
              onClick={() => handleRejectApplication(application)}
              className="bg-white border-2 border-[#C8D6FF] text-[#FF220E] hover:bg-[#EDF2FF] flex-1"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </>
        );

      case "interview-scheduled":
        return (
          <>
            <Button
              variant="outline"
              className="border-[#C8D6FF] hover:bg-[#EDF2FF] flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Founder
            </Button>
          </>
        );

      case "interview-completed":
        return (
          <>
            <Button
              onClick={() => handleAcceptApplication(application)}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={() => handleRejectApplication(application)}
              className="bg-white border-2 border-[#C8D6FF] text-[#FF220E] hover:bg-[#EDF2FF] flex-1"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </>
        );

      case "accepted":
        return (
          <>
            <Button
              onClick={() => handleStartAgreement(application)}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white flex-1"
            >
              <FileSignature className="w-4 h-4 mr-2" />
              Start Agreement
            </Button>
          </>
        );

      case "agreement-started":
      case "agreement-in-progress":
        return (
          <>
            <Button
              onClick={() => handleViewProgress(application)}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white flex-1"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          </>
        );

      case "agreement-complete":
        return (
          <>
            <Badge className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
              <CheckCircle className="w-3 h-3 mr-1" />
              Agreement Complete
            </Badge>
          </>
        );

      case "rejected":
        return null;

      default:
        return null;
    }
  };

  // If showing communication flow for interview scheduling
  if (showCommunicationFlow && communicationFlowApplication) {
    return (
      <CommunicationFlow
        application={communicationFlowApplication}
        onClose={() => {
          setShowCommunicationFlow(false);
          setCommunicationFlowApplication(null);
        }}
        onEmailSent={(emailData) => {
          // Update application status to interview-scheduled
          const updatedApp = { ...communicationFlowApplication, status: "interview-scheduled" as const };
          handleApplicationUpdate(updatedApp);
          
          toast.success("Interview Scheduled", {
            description: `Interview with ${communicationFlowApplication.startupName} has been scheduled successfully.`,
            duration: 5000,
          });
          
          // Close the communication flow
          setShowCommunicationFlow(false);
          setCommunicationFlowApplication(null);
        }}
      />
    );
  }

  // If viewing an application profile
  if (selectedApplication) {
    return (
      <StartupProfileView
        application={selectedApplication}
        onBack={() => {
          setSelectedApplication(null);
          setSelectedApplicationTab(undefined);
        }}
        onNavigateToProfile={onNavigateToProfile}
        onScheduleInterview={() => handleScheduleInterview(selectedApplication)}
        onApplicationUpdate={handleApplicationUpdate}
        initialTab={selectedApplicationTab}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Applications</h2>
          <p className="text-gray-600">
            All startup applications in one place
          </p>
        </div>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#C8D6FF] md:col-span-4">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by startup name, founder, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-[#C8D6FF]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-12 text-center">
              <FileSignature className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No Applications Found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "No applications have been received yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="border-[#C8D6FF] hover:border-[#114DFF] transition-colors">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-[#C8D6FF]">
                      <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                        {application.startupName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-900">{application.startupName}</h3>
                        <Button
                          onClick={() => setSelectedApplication(application)}
                          variant="outline"
                          className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {application.founderName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {application.industry}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>

                      {/* AI Score Section */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-[#114DFF]" />
                          <span className="text-gray-700">AI Score:</span>
                          <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white">
                            {application.aiScore}/100
                          </Badge>
                        </div>
                        <div className="h-4 w-px bg-[#CCCCCC]"></div>
                        <div className="flex gap-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-[#114DFF]" />
                            <span>Market: <span className="text-gray-900">{application.marketScore}</span></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3 text-[#114DFF]" />
                            <span>Team: <span className="text-gray-900">{application.teamScore}</span></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Brain className="w-3 h-3 text-[#114DFF]" />
                            <span>Idea: <span className="text-gray-900">{application.ideaScore}</span></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-3 h-3 text-[#114DFF]" />
                            <span>Fit: <span className="text-gray-900">{application.fitScore}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <ApplicationProgressBar status={application.status} />

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {getActionButtons(application)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
