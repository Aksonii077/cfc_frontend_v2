import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { OnboardingChecklist } from "./OnboardingChecklist";
import { AcceptanceEmailTemplate } from "./AcceptanceEmailTemplate";
import { DocumentSigning } from "./DocumentSigning";
import { OnboardingProgress } from "./OnboardingProgress";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  Users,
  Calendar,
  Target,
  Send,
  AlertCircle,
  Rocket,
  BookOpen,
} from "lucide-react";

interface OnboardedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  acceptedAt: string;
  onboardingStatus: "pending" | "in-progress" | "completed";
  checklist: {
    agreementSigned: boolean;
    welcomeCallCompleted: boolean;
    onboardingMaterialsSent: boolean;
    initialGoalsSet: boolean;
    mentorIntroductionsMade: boolean;
  };
  documents: {
    investmentAgreement?: { status: "pending" | "signed"; url?: string };
    safeNote?: { status: "pending" | "signed"; url?: string };
    programAgreement?: { status: "pending" | "signed"; url?: string };
  };
  welcomeCallScheduled?: {
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  };
  assignedMentor?: {
    name: string;
    email: string;
    expertise: string[];
  };
  initialGoals?: string[];
  notes?: string;
}

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
  description: string;
  teamSize: number;
}

interface OnboardingWorkflowProps {
  application: Application;
  onBack: () => void;
  onComplete: () => void;
}

export function OnboardingWorkflow({ application, onBack, onComplete }: OnboardingWorkflowProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [onboardedStartup, setOnboardedStartup] = useState<OnboardedStartup>({
    id: application.id,
    startupName: application.startupName,
    founderName: application.founderName,
    founderEmail: application.founderEmail,
    acceptedAt: new Date().toISOString(),
    onboardingStatus: "pending",
    checklist: {
      agreementSigned: false,
      welcomeCallCompleted: false,
      onboardingMaterialsSent: false,
      initialGoalsSet: false,
      mentorIntroductionsMade: false,
    },
    documents: {
      investmentAgreement: { status: "pending" },
      programAgreement: { status: "pending" },
    },
  });

  const [isInitiatingOnboarding, setIsInitiatingOnboarding] = useState(false);

  const handleInitiateOnboarding = async () => {
    setIsInitiatingOnboarding(true);
    
    try {
      // Simulate API calls for onboarding initiation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send acceptance email
      toast.success("Acceptance email sent successfully!");
      
      // Update onboarding status
      setOnboardedStartup(prev => ({
        ...prev,
        onboardingStatus: "in-progress",
        checklist: {
          ...prev.checklist,
          onboardingMaterialsSent: true,
        }
      }));
      
      toast.success("Onboarding process initiated successfully!");
      setActiveTab("checklist");
      
    } catch (error) {
      toast.error("Failed to initiate onboarding. Please try again.");
    } finally {
      setIsInitiatingOnboarding(false);
    }
  };

  const handleChecklistUpdate = (updatedChecklist: typeof onboardedStartup.checklist) => {
    setOnboardedStartup(prev => ({
      ...prev,
      checklist: updatedChecklist,
      onboardingStatus: Object.values(updatedChecklist).every(Boolean) ? "completed" : "in-progress"
    }));
  };

  const handleDocumentUpdate = (documentType: keyof typeof onboardedStartup.documents, status: "pending" | "signed", url?: string) => {
    setOnboardedStartup(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: { status, url }
      }
    }));
  };

  const getOnboardingStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Setup",
          color: "bg-orange-50 text-orange-700 border-orange-200",
          icon: Clock,
        };
      case "in-progress":
        return {
          label: "In Progress",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: Target,
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

  const statusConfig = getOnboardingStatusConfig(onboardedStartup.onboardingStatus);
  const completedTasks = Object.values(onboardedStartup.checklist).filter(Boolean).length;
  const totalTasks = Object.keys(onboardedStartup.checklist).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Button>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={statusConfig.color}>
            <statusConfig.icon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </Badge>
          <div className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} tasks completed
          </div>
        </div>
      </div>

      {/* Startup Info Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {onboardedStartup.startupName} Onboarding
              </h1>
              <p className="text-gray-600 mb-4">
                Founded by {onboardedStartup.founderName} • {application.industry} • {application.stage}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Accepted: {new Date(onboardedStartup.acceptedAt).toLocaleDateString()}</span>
                <span>Email: {onboardedStartup.founderEmail}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-3">
                <Rocket className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-sm font-medium text-gray-900">
                {progressPercentage.toFixed(0)}% Complete
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Actions */}
      {onboardedStartup.onboardingStatus === "pending" && (
        <Card className="border border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Onboarding Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-800 mb-4">
              This startup has been accepted but onboarding hasn't been initiated yet. Click below to send the acceptance pack and begin the onboarding process.
            </p>
            <Button 
              onClick={handleInitiateOnboarding}
              disabled={isInitiatingOnboarding}
              className="gap-2"
            >
              {isInitiatingOnboarding ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isInitiatingOnboarding ? "Initiating..." : "Initiate Onboarding Process"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Onboarding Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Checklist
            {onboardedStartup.onboardingStatus !== "pending" && (
              <Badge variant="secondary" className="ml-1 h-5 text-xs">
                {completedTasks}/{totalTasks}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="communications" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="outline" className={statusConfig.color}>
                    {statusConfig.label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accepted:</span>
                  <span className="font-medium">
                    {new Date(onboardedStartup.acceptedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium">
                    {Object.values(onboardedStartup.documents).filter(doc => doc?.status === "signed").length}/
                    {Object.keys(onboardedStartup.documents).length} signed
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Next Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardedStartup.onboardingStatus === "pending" ? (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Send className="w-5 h-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-orange-900">Initiate Onboarding</div>
                        <div className="text-sm text-orange-700">Send acceptance pack to founder</div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!onboardedStartup.checklist.agreementSigned && (
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">Follow up on Agreement</div>
                            <div className="text-sm text-blue-700">Program agreement pending signature</div>
                          </div>
                        </div>
                      )}
                      {!onboardedStartup.checklist.welcomeCallCompleted && (
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium text-purple-900">Schedule Welcome Call</div>
                            <div className="text-sm text-purple-700">Initial onboarding conversation</div>
                          </div>
                        </div>
                      )}
                      {!onboardedStartup.checklist.mentorIntroductionsMade && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Users className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">Assign Mentors</div>
                            <div className="text-sm text-green-700">Connect with relevant mentors</div>
                          </div>
                        </div>
                      )}
                      {Object.values(onboardedStartup.checklist).every(Boolean) && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium text-green-900">Onboarding Complete!</div>
                            <div className="text-sm text-green-700">All tasks completed successfully</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <OnboardingChecklist
            startup={onboardedStartup}
            onUpdate={handleChecklistUpdate}
          />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentSigning
            startup={onboardedStartup}
            onDocumentUpdate={handleDocumentUpdate}
          />
        </TabsContent>

        <TabsContent value="communications">
          <AcceptanceEmailTemplate
            startup={onboardedStartup}
            application={application}
          />
        </TabsContent>

        <TabsContent value="progress">
          <OnboardingProgress
            startup={onboardedStartup}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}