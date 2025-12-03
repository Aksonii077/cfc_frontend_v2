import { useState, useEffect } from "react";
import { ApplicationCard } from "../ApplicationCard";
import { ApplicationReviewFlow } from "../ApplicationReviewFlow";
import { AgreementFlow } from "../AgreementFlow";
import { DatabaseSetup } from "./DatabaseSetup";
import { PortfolioManagement } from "../PortfolioManagement";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { 
  RefreshCw, 
  CheckCircle, 
  Eye,
  Building,
  Database,
  Loader,
  X,
  FileText
} from "lucide-react";
import { MentorApplicationService, type Application } from "../../../utils/supabase/mentorApplicationService";
import { useAuth } from "../../../hooks/useAuth";

export function ApplicationReviewDemo() {
  const { user } = useAuth();
  
  // Mock data with CloudSync Analytics (accepted startup with agreement started)
  const mockAcceptedStartup: Application = {
    id: 'mock-cloudsync-001',
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
    status: "accepted",
    description: "Enterprise-grade cloud data analytics platform that provides real-time insights across multi-cloud environments. Our platform unifies data from AWS, Azure, and Google Cloud, offering advanced analytics, predictive modeling, and automated reporting. With 150+ enterprise clients, we're processing 10TB+ of data daily with 99.99% uptime.",
    teamSize: 14,
    previousFunding: 350000,
    revenueStage: "$400K ARR",
    mentorId: user?.id || '',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const [applications, setApplications] = useState<Application[]>([mockAcceptedStartup]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);


  // Load applications from Supabase and merge with mock data
  const loadApplications = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const apps = await MentorApplicationService.getApplicationsForMentor(user.id);
      
      // Merge Supabase data with mock accepted startup (avoid duplicates)
      const allApps = [...apps];
      const hasCloudSync = apps.some(app => app.startupName === "CloudSync Analytics");
      if (!hasCloudSync) {
        allApps.unshift(mockAcceptedStartup);
      }
      
      setApplications(allApps);
      

    } catch (error) {
      console.error('Error loading applications:', error);
      // On error, just show mock data
      setApplications([mockAcceptedStartup]);
    } finally {
      setIsLoading(false);
    }
  };

  // Seed demo data
  const seedDemoData = async () => {
    if (!user) return;

    try {
      setIsSeeding(true);
      await MentorApplicationService.seedDemoData(user.id);
      toast.success('Demo data seeded successfully!');
      await loadApplications(); // Reload applications
    } catch (error) {
      console.error('Error seeding demo data:', error);
      toast.error('Failed to seed demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  // Seed comprehensive pending test data
  const seedPendingTestData = async () => {
    if (!user) return;

    try {
      setIsSeeding(true);
      await MentorApplicationService.seedPendingTestData(user.id);
      toast.success('Pending test data created successfully! 10 applications ready for review.');
      await loadApplications(); // Reload applications
    } catch (error) {
      console.error('Error seeding pending test data:', error);
      toast.error('Failed to seed pending test data');
    } finally {
      setIsSeeding(false);
    }
  };

  // Clear all demo data
  const clearDemoData = async () => {
    if (!user) return;
    
    if (!confirm('Are you sure you want to clear all demo data? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSeeding(true);
      await MentorApplicationService.clearDemoData(user.id);
      toast.success('All demo data cleared successfully!');
      await loadApplications(); // Reload applications
    } catch (error) {
      console.error('Error clearing demo data:', error);
      toast.error('Failed to clear demo data');
    } finally {
      setIsSeeding(false);
    }
  };

  // Load applications on component mount
  useEffect(() => {
    loadApplications();
  }, [user]);

  // Original demo applications fallback (not used when Supabase data is available)
  const originalDemoApplications: Application[] = [
    {
      id: "1",
      startupName: "EcoCharge Solutions",
      founderName: "Sarah Chen",
      founderEmail: "sarah@ecocharge.com",
      industry: "Clean Energy",
      stage: "Seed",
      location: "San Francisco, CA",
      requestedFunding: 250000,
      aiScore: 87,
      marketScore: 92,
      teamScore: 78,
      ideaScore: 85,
      fitScore: 89,
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      description: "Revolutionary AI-powered solar panel optimization system that increases energy efficiency by 40% through real-time weather prediction and grid balancing.",
      teamSize: 5,
      previousFunding: 50000,
      revenueStage: "Pre-revenue",
      mentorId: "demo-mentor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      startupName: "HealthAI Diagnostics",
      founderName: "Dr. Michael Rodriguez",
      founderEmail: "michael@healthai.com",
      industry: "Healthcare",
      stage: "Series A",
      location: "Boston, MA",
      requestedFunding: 500000,
      aiScore: 93,
      marketScore: 95,
      teamScore: 88,
      ideaScore: 91,
      fitScore: 94,
      submittedAt: "2024-01-10T14:15:00Z",
      status: "interview-completed",
      description: "AI-powered medical imaging platform that can detect early-stage diseases with 99.2% accuracy, reducing diagnosis time from weeks to minutes.",
      teamSize: 12,
      previousFunding: 1200000,
      revenueStage: "$500K ARR",
      mentorId: "demo-mentor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      startupName: "FinFlow Analytics",
      founderName: "Alex Kumar",
      founderEmail: "alex@finflow.com",
      industry: "FinTech",
      stage: "Seed",
      location: "New York, NY",
      requestedFunding: 300000,
      aiScore: 76,
      marketScore: 82,
      teamScore: 72,
      ideaScore: 75,
      fitScore: 77,
      submittedAt: "2024-01-20T09:45:00Z",
      status: "accepted",
      description: "Small business cash flow prediction platform using machine learning to help SMEs optimize their financial planning and avoid cash crunches.",
      teamSize: 8,
      previousFunding: 150000,
      revenueStage: "$100K ARR",
      mentorId: "demo-mentor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      startupName: "AgriTech Innovations",
      founderName: "Maria Gonzalez",
      founderEmail: "maria@agritech.com",
      industry: "Agriculture",
      stage: "Pre-Seed",
      location: "Austin, TX",
      requestedFunding: 180000,
      aiScore: 69,
      marketScore: 75,
      teamScore: 65,
      ideaScore: 68,
      fitScore: 71,
      submittedAt: "2024-01-25T16:20:00Z",
      status: "interview-scheduled",
      description: "IoT-based precision farming solution that uses soil sensors and satellite imagery to optimize crop yields while reducing water usage by 30%.",
      teamSize: 4,
      previousFunding: 25000,
      revenueStage: "Pre-revenue",
      mentorId: "demo-mentor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const [activeReviewApplication, setActiveReviewApplication] = useState<Application | null>(null);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [activeAgreementApplication, setActiveAgreementApplication] = useState<Application | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string, data?: any) => {
    try {
      // Update local state immediately for better UX
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus as any, ...data }
          : app
      ));
      
      // Reload applications and stats from database to ensure consistency
      await loadApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
      // Revert local state if database update failed
      await loadApplications();
    }
  };

  const handleReviewDecide = (application: Application) => {
    setActiveReviewApplication(application);
  };

  const handleStartAgreement = async (application: Application) => {
    setActiveAgreementApplication(application);
  };

  const handleViewDetails = (application: Application) => {
    setViewingApplication(application);
  };

  const filterApplicationsByStatus = (status: string) => {
    if (status === "all") return applications;
    return applications.filter(app => app.status === status);
  };

  // Show Portfolio Management if requested
  if (showPortfolio) {
    return (
      <PortfolioManagement onBack={() => setShowPortfolio(false)} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Review System</h1>
          <p className="text-gray-600 mt-1">Comprehensive mentor application review workflow with Supabase integration</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowPortfolio(true)}
            className="gap-2 bg-[#114DFF] hover:bg-[#0d3eb8]"
          >
            <Building className="w-4 h-4" />
            Portfolio Management
          </Button>
          {applications.length === 0 ? (
            <Button
              onClick={seedPendingTestData}
              disabled={isSeeding}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSeeding ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Database className="w-4 h-4" />
              )}
              {isSeeding ? 'Creating...' : 'Create Test Applications'}
            </Button>
          ) : (
            <>
              <Button
                onClick={seedPendingTestData}
                disabled={isSeeding}
                className="gap-2 bg-[#114DFF] hover:bg-[#0d3eb8]"
                variant="outline"
              >
                {isSeeding ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                {isSeeding ? 'Resetting...' : 'Reset Test Data'}
              </Button>
              <Button
                onClick={clearDemoData}
                disabled={isSeeding}
                variant="destructive"
                className="gap-2"
              >
                {isSeeding ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                Clear All
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={loadApplications}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>



      {/* Applications Tabs */}
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="setup">Database Setup</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="interview-scheduled">Interview Scheduled</TabsTrigger>
          <TabsTrigger value="interview-completed">Interview Completed</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="agreement-ongoing">Agreement Process</TabsTrigger>
        </TabsList>

        {/* Database Setup Tab */}
        <TabsContent value="setup" className="space-y-4">
          <DatabaseSetup 
            mentorId={user?.id || "demo-mentor"} 
            onSetupComplete={() => loadApplications()}
          />
        </TabsContent>

        {["all", "pending", "interview-scheduled", "interview-completed", "accepted", "agreement-ongoing"].map(status => (
          <TabsContent key={status} value={status} className="space-y-4">
            <div className="grid grid-cols-1 gap-6">
              {filterApplicationsByStatus(status).map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={() => handleViewDetails(application)}
                  onReviewDecide={() => handleReviewDecide(application)}
                  onStartAgreement={() => handleStartAgreement(application)}
                />
              ))}
              
              {/* Loading State */}
              {isLoading && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <Loader className="w-12 h-12 mx-auto animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Loading applications...</h3>
                    <p className="text-gray-600">
                      Fetching data from Supabase database
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!isLoading && filterApplicationsByStatus(status).length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <Building className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                    <p className="text-gray-600 mb-4">
                      {status === "all" 
                        ? "No applications available in the system."
                        : `No applications with status "${status.replace('-', ' ')}" found.`
                      }
                    </p>
                    {status === "all" && applications.length === 0 && !isSeeding && (
                      <Button
                        onClick={seedPendingTestData}
                        disabled={isSeeding}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Database className="w-4 h-4" />
                        Create Test Applications
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Review Flow */}
      {activeReviewApplication && (
        <ApplicationReviewFlow
          application={activeReviewApplication}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
          onClose={() => setActiveReviewApplication(null)}
        />
      )}

      {/* Application Details Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  {viewingApplication.startupName} - Full Details
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => setViewingApplication(null)}
                  className="p-2"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Founder Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {viewingApplication.founderName}</div>
                    <div><strong>Email:</strong> {viewingApplication.founderEmail}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Industry:</strong> {viewingApplication.industry}</div>
                    <div><strong>Stage:</strong> {viewingApplication.stage}</div>
                    <div><strong>Location:</strong> {viewingApplication.location}</div>
                    <div><strong>Team Size:</strong> {viewingApplication.teamSize}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{viewingApplication.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Financial Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Requested Funding:</strong> ${viewingApplication.requestedFunding.toLocaleString()}</div>
                  <div><strong>Previous Funding:</strong> ${viewingApplication.previousFunding.toLocaleString()}</div>
                  <div><strong>Revenue Stage:</strong> {viewingApplication.revenueStage}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">AI Assessment Scores</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Overall AI Score:</span>
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF]">{viewingApplication.aiScore}/100</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Score:</span>
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D]">{viewingApplication.marketScore}/100</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Score:</span>
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF]">{viewingApplication.teamScore}/100</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Innovation Score:</span>
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF]">{viewingApplication.ideaScore}/100</Badge>
                  </div>
                </div>
              </div>

              {/* Review & Decide Button */}
              {(viewingApplication.status === "pending" || viewingApplication.status === "interview-completed") && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => {
                      setViewingApplication(null);
                      handleReviewDecide(viewingApplication);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Review & Decide
                  </Button>
                </div>
              )}

              {/* Start Agreement Button */}
              {viewingApplication.status === "accepted" && (
                <div className="pt-4 border-t">
                  <Button 
                    onClick={() => {
                      setViewingApplication(null);
                      handleStartAgreement(viewingApplication);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Agreement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agreement Flow */}
      {activeAgreementApplication && (
        <AgreementFlow
          application={activeAgreementApplication}
          isOpen={true}
          onClose={() => setActiveAgreementApplication(null)}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      )}

      {/* Demo Instructions */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-900 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Supabase Integration Active
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-800 space-y-3">
          <p><strong>🎉 All data is now persisted to Supabase!</strong></p>
          
          <div>
            <p><strong>Available Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Full application lifecycle management with database persistence</li>
              <li>Interview notes capture and storage</li>
              <li>Email template system with send history</li>
              <li>Rejection tracking with reasons</li>
              <li>Real-time statistics from database</li>
              <li>Multi-user support (mentor-specific data)</li>
            </ul>
          </div>

          <div>
            <p><strong>🚀 Test the Complete 15-Step Review Workflow:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4 text-sm">
              <li><strong>View Details</strong> - Click "View Details" on any application</li>
              <li><strong>Review & Decide</strong> - Click "Review & Decide" button in details modal</li>
              <li><strong>Pending Status</strong> - See two options: "Reject" or "Schedule Interview"</li>
              <li><strong>Reject Flow</strong> - Choose reject to enter rejection reason</li>
              <li><strong>Schedule Interview</strong> - Choose to schedule interview with founder</li>
              <li><strong>Interview Completion</strong> - Mark interview as completed when done</li>
              <li><strong>Interview Notes</strong> - Capture detailed interview assessment</li>
              <li><strong>Final Decision</strong> - After notes, choose "Accept" or "Reject"</li>
              <li><strong>Acceptance Email</strong> - Send customized acceptance email to founder</li>
              <li><strong>Agreement Module</strong> - Access agreement flow after acceptance</li>
              <li><strong>Start Agreement</strong> - Choose appropriate agreement template</li>
              <li><strong>Agreement Templates</strong> - Different templates based on startup stage</li>
              <li><strong>Digital Signing</strong> - Both mentor and founder sign digitally</li>
              <li><strong>Agreement Successful</strong> - Complete the engagement process</li>
              <li><strong>Portfolio Management</strong> - Startup added to mentor's portfolio</li>
            </ol>
          </div>

          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="font-medium text-blue-900 mb-2">🎯 Perfect for Testing:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
              <span>• 10 Applications - All "Pending"</span>
              <span>• 10 Different Industries</span>
              <span>• Various Funding Stages</span>
              <span>• Diverse AI Score Ranges</span>
              <span>• Different Team Sizes</span>
              <span>• Mixed Revenue Stages</span>
            </div>
          </div>

          <div className="bg-green-100 border border-green-300 rounded-lg p-3">
            <p className="font-medium text-green-900 mb-1">Database Schema Includes:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <span>• mentor_applications</span>
              <span>• interview_notes</span>
              <span>• acceptance_emails</span>
              <span>• application_rejections</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
