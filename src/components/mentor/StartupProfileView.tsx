import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { ApplicationReviewFlow } from "./ApplicationReviewFlow";
import { CommunicationFlow } from "./CommunicationFlow";
import { RejectionCommunicationFlow } from "./RejectionCommunicationFlow";
import { StartupApplicationOverview } from "./StartupApplicationOverview";
import { getApplicationFormData } from "../../utils/mocks";
import { toast } from "sonner@2.0.3";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Briefcase,
  Mail,
  Phone,
  Globe,
  FileText,
  Download,
  Eye,
  MessageCircle,
  Video,
  ExternalLink as LinkedIn,
  ExternalLink as Twitter,
  ExternalLink,
  CheckCircle,
  Send,
  Clock,
  AlertCircle,
  Linkedin as LinkedinIcon,
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
  status: "pending" | "reviewing" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-pending" | "agreement-signed";
  description: string;
  teamSize: number;
  previousFunding: number;
  revenueStage: string;
}

interface StartupProfileViewProps {
  application: Application;
  onBack: () => void;
  onNavigateToProfile?: (userId: string) => void;
  onScheduleInterview?: () => void;
  onShowDecisionWorkflow?: () => void;
  onApplicationUpdate?: (updatedApplication: Application) => void;
  initialTab?: string;
}

export function StartupProfileView({ application, onBack, onNavigateToProfile, onScheduleInterview, onShowDecisionWorkflow, onApplicationUpdate, initialTab }: StartupProfileViewProps) {
  const [showDecisionWorkflow, setShowDecisionWorkflow] = useState(false);
  const [showCommunicationFlow, setShowCommunicationFlow] = useState(false);
  const [showRejectionCommunicationFlow, setShowRejectionCommunicationFlow] = useState(false);
  const [showAgreementTab, setShowAgreementTab] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  
  // Agreement Terms State
  const [tenure, setTenure] = useState("12");
  const [tenureOther, setTenureOther] = useState("");
  const [equityPercentage, setEquityPercentage] = useState("2.5");
  const [equityOther, setEquityOther] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("2-hours-month");
  const [timeCommitmentOther, setTimeCommitmentOther] = useState("");
  const [networkIntroductions, setNetworkIntroductions] = useState("yes");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseOther, setExpertiseOther] = useState("");
  const [deliverables, setDeliverables] = useState("");
  
  // Counter-proposal state for mentor to respond to founder's changes
  const [showMentorCounterProposal, setShowMentorCounterProposal] = useState(false);
  const [mentorCounterTenure, setMentorCounterTenure] = useState("12");
  const [mentorCounterEquity, setMentorCounterEquity] = useState("2.5");
  const [mentorCounterDeliverables, setMentorCounterDeliverables] = useState("");
  
  // Initialize with test data for accepted applications
  const getInitialTermsVersions = () => {
    // Add initial terms version for CloudSync Analytics (accepted startup)
    if (application.status === "accepted" && application.startupName === "CloudSync Analytics") {
      return [{
        version: 1,
        tenure: "12 months",
        equity: "2.5%",
        deliverables: `• Weekly 1-on-1 mentorship sessions (every Monday, 1 hour)
• Access to enterprise client network and warm introductions
• Strategic guidance on scaling cloud infrastructure operations
• Quarterly business reviews with detailed performance analysis
• Introduction to potential Series A investors in our network
• Access to mentor's technical advisory board
• Support with go-to-market strategy and enterprise sales
• Monthly workshops on SaaS metrics and growth strategies`,
        status: "pending-review",
        submittedBy: "mentor",
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()
      }];
    }
    return [];
  };
  
  const [termsVersions, setTermsVersions] = useState<any[]>(getInitialTermsVersions());

  // Handle initialTab to show Agreement tab automatically
  useEffect(() => {
    if (initialTab === "agreement") {
      setShowAgreementTab(true);
      setActiveTab("agreement");
    }
  }, [initialTab]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#06CB1D]";
    if (score >= 80) return "text-[#114DFF]";
    if (score >= 70) return "text-[#3CE5A7]";
    return "text-[#FF220E]";
  };

  const getEquityValidation = (equity: number) => {
    if (equity < 2) return { status: "too-low", message: "Equity percentage is lower than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity > 5) return { status: "too-high", message: "Equity percentage is higher than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity >= 2 && equity <= 3) return { status: "optimal", message: "Equity percentage is within optimal range", color: "text-[#06CB1D]" };
    return { status: "acceptable", message: "Equity percentage is acceptable", color: "text-[#114DFF]" };
  };

  const handleSubmitTerms = () => {
    // Get final values for tenure and equity
    const finalTenure = tenure === "other" ? tenureOther : tenure;
    const finalEquity = equityPercentage === "other" ? equityOther : equityPercentage;
    const finalTimeCommitment = timeCommitment === "other" ? timeCommitmentOther : 
      timeCommitment === "2-hours-month" ? "2 hours a Month" : "2 hours a Fortnight";
    
    // Build expertise list
    const expertiseLabels = {
      "product": "Guidance on Product Development",
      "marketing": "Guidance on Branding & Marketing",
      "finance": "Guidance on Finance",
      "operations": "Guidance on Operations",
      "gtm": "Guidance on Go To Market",
      "hiring": "Guidance on Hiring",
      "other": expertiseOther || "Other"
    };
    
    const expertiseList = expertise.map(id => expertiseLabels[id as keyof typeof expertiseLabels]).join("\n• ");
    
    // Build complete deliverables text
    const completeDeliverables = `Time Commitment: ${finalTimeCommitment}

Network Introductions: ${networkIntroductions === "yes" ? "Yes" : "No"}

Expertise & Guidance:
• ${expertiseList}${deliverables ? "\n\nAdditional Deliverables:\n" + deliverables : ""}`;
    
    const newVersion = {
      version: termsVersions.length + 1,
      tenure: finalTenure + " months",
      equity: finalEquity + "%",
      deliverables: completeDeliverables,
      status: "pending-review",
      submittedBy: "mentor",
      submittedAt: new Date().toISOString(),
      timestamp: new Date().toLocaleString()
    };
    
    setTermsVersions([...termsVersions, newVersion]);
    
    toast.success("Terms Submitted Successfully", {
      description: `Terms have been sent to ${application.founderName} for review. They will be notified via email and can view them in their Mentor Dashboard.`,
      duration: 5000,
    });
    
    // In production:
    // 1. Save terms to database
    // 2. Send email to founder via CFC ID
    // 3. Update founder's mentor dashboard
  };

  // Mock additional data that would come from the application
  const mockData = {
    website: "https://ecotech-solutions.com",
    linkedIn: "https://linkedin.com/company/ecotech-solutions",
    twitter: "https://twitter.com/ecotechsol",
    phone: "+1 (555) 123-4567",
    pitchDeckUrl: "/pitch-decks/ecotech-solutions.pdf",
    businessPlanUrl: "/business-plans/ecotech-solutions.pdf",
    financialProjectionsUrl: "/financials/ecotech-solutions.xlsx",
    videoPitchUrl: "https://youtube.com/watch?v=example",
    teamMembers: [
      {
        name: "Sarah Chen",
        role: "CEO & Co-Founder",
        experience: "Former Tesla Engineer, 8 years in clean energy",
        education: "Stanford MS Electrical Engineering",
      },
      {
        name: "Michael Torres",
        role: "CTO & Co-Founder",
        experience: "Ex-Google Senior Software Engineer, AI/ML expert",
        education: "MIT PhD Computer Science",
      },
      {
        name: "Lisa Kim",
        role: "Head of Business Development",
        experience: "Former McKinsey Consultant, renewable energy specialist",
        education: "Harvard MBA",
      },
      {
        name: "David Park",
        role: "Lead Hardware Engineer",
        experience: "Ex-Apple Hardware Engineer, IoT systems",
        education: "UC Berkeley MS Mechanical Engineering",
      },
    ],
    marketAnalysis: {
      marketSize: "$45.2B",
      targetMarket: "Residential and commercial solar installations",
      competitiveLandscape: "Competing with SolarEdge, Enphase Energy, but with superior AI optimization",
      uniqueAdvantage: "Proprietary machine learning algorithms that increase solar panel efficiency by 23%",
    },
    financials: {
      currentMRR: "$0 (Pre-revenue)",
      projectedYear1Revenue: "$2.4M",
      projectedYear3Revenue: "$28.5M",
      burnRate: "$45K/month",
      cashRunway: "14 months with current funding",
    },
    milestones: [
      "Completed MVP development",
      "Filed 3 patents for AI optimization technology",
      "Signed LOI with 2 major solar installers",
      "Completed pilot program with 50 residential installations",
      "Achieved 23% efficiency improvement in pilot",
    ],
  };

  const handleEmailSent = (emailData: any) => {
    // In a real implementation, this would:
    // 1. Save the email record to the database
    // 2. Update the application status to "interview-scheduled"
    // 3. Create a calendar event
    // 4. Send notifications
  };

  const handleReject = () => {
    // Update application status to rejected
    const updatedApplication = {
      ...application,
      status: "rejected" as const
    };

    // Notify parent component of the update
    if (onApplicationUpdate) {
      onApplicationUpdate(updatedApplication);
    }

    // Show success toast
    toast.success("Application Rejected", {
      description: `${application.startupName}'s application has been rejected.`,
    });

    // Navigate back to applications list
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const handleRejectionEmailSent = (emailData: any) => {
    // The database operations are now handled in RejectionCommunicationFlow
    // The status has been updated to "rejected" in the database
    
    // Close the rejection flow
    setShowRejectionCommunicationFlow(false);
    
    // Go back to applications list to see updated status
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  if (showCommunicationFlow) {
    return (
      <CommunicationFlow
        application={application}
        onClose={() => setShowCommunicationFlow(false)}
        onEmailSent={handleEmailSent}
      />
    );
  }

  if (showRejectionCommunicationFlow) {
    return (
      <RejectionCommunicationFlow
        application={application}
        onClose={() => setShowRejectionCommunicationFlow(false)}
        onEmailSent={handleRejectionEmailSent}
      />
    );
  }

  if (showDecisionWorkflow) {
    return (
      <ApplicationReviewFlow
        application={application}
        onUpdateApplicationStatus={(applicationId, newStatus, data) => {
          // Update the application status locally
          // In a real app, this would update the state/context
        }}
        onClose={() => setShowDecisionWorkflow(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* SCROLLABLE CONTENT AREA - All Sections */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Button>
        </div>

        {/* SECTION 1: Startup Header */}
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="w-16 h-16 ring-2 ring-[#C8D6FF]/30">
                  <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                    {application.startupName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 space-y-2">
                  <h1 className="text-gray-900 mb-1">
                    {application.startupName}
                  </h1>
                  <p className="text-gray-600 mb-2">
                    Founded by {application.founderName}
                  </p>
                  
                  {/* Location, Industry, Stage, Team */}
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{application.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{application.industry}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{application.stage}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{application.teamSize} Team</span>
                    </div>
                  </div>
                  
                  {/* Contact Icons */}
                  <TooltipProvider>
                    <div className="flex items-center gap-1 p-1.5 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg w-fit">
                      {/* Email */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `mailto:${application.founderEmail}`}
                            className="h-7 w-7 p-0 hover:bg-[#EDF2FF]"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#114DFF]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{application.founderEmail}</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="h-4 w-px bg-[#C8D6FF]"></div>

                      {/* Phone */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(mockData.phone);
                              toast.success("Phone number copied to clipboard", {
                                description: mockData.phone,
                              });
                            }}
                            className="h-7 w-7 p-0 hover:bg-[#EDF2FF]"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#114DFF]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{mockData.phone}</p>
                          <p className="text-gray-500">Click to copy</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="h-4 w-px bg-[#C8D6FF]"></div>

                      {/* Website */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(mockData.website, '_blank', 'noopener,noreferrer')}
                            className="h-7 w-7 p-0 hover:bg-[#EDF2FF]"
                          >
                            <Globe className="w-3.5 h-3.5 text-[#114DFF]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Visit Website</p>
                          <p className="text-gray-500">{mockData.website}</p>
                        </TooltipContent>
                      </Tooltip>

                      <div className="h-4 w-px bg-[#C8D6FF]"></div>

                      {/* LinkedIn */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(mockData.linkedIn, '_blank', 'noopener,noreferrer')}
                            className="h-7 w-7 p-0 hover:bg-[#EDF2FF]"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5 text-[#114DFF]" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View LinkedIn Profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              
              {/* Right Side: AI Score + Status & Date */}
              <div className="flex flex-col items-end gap-3">
                {/* AI Score */}
                <div className="text-center">
                  <div className="bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-3">
                    <div className={`${getScoreColor(application.aiScore)} mb-1`}>
                      {application.aiScore}
                    </div>
                    <div className="text-gray-600">AI Score</div>
                  </div>
                </div>

                {/* Status & Date */}
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {application.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <div className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Submitted {formatDate(application.submittedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>

        {/* SECTION 2: Help Looking for from Mentor */}
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-6 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-gray-900">Help Looking for from Mentor</h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-gray-900">Primary Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white text-[#114DFF] border-[#C8D6FF]">
                    Strategic Planning
                  </Badge>
                  <Badge variant="outline" className="bg-white text-[#114DFF] border-[#C8D6FF]">
                    Go-to-Market Strategy
                  </Badge>
                  <Badge variant="outline" className="bg-white text-[#06CB1D] border-[#C8D6FF]">
                    Fundraising Guidance
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-gray-900">Specific Support Needed</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white text-[#114DFF] border-[#CCCCCC]">
                    Investor Introductions
                  </Badge>
                  <Badge variant="outline" className="bg-white text-[#3CE5A7] border-[#C8D6FF]">
                    Product Development
                  </Badge>
                  <Badge variant="outline" className="bg-white text-[#114DFF] border-[#C8D6FF]">
                    Team Building
                  </Badge>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-white/50">
              <h4 className="text-gray-900 mb-2">Detailed Description</h4>
              <p className="text-gray-700 leading-relaxed">
                We're looking for guidance in scaling our operations and preparing for Series A funding. 
                Specifically need help with refining our go-to-market strategy, building strategic partnerships, 
                and getting introductions to potential investors who focus on {application.industry} startups. 
                We're also seeking advice on team expansion and product roadmap prioritization.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: Detailed Information Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full ${showAgreementTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="startup-overview">Startup Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          {showAgreementTab && (
            <TabsTrigger value="agreement" className="bg-purple-50 text-purple-700 border-purple-200">
              Agreement & Contract
            </TabsTrigger>
          )}
        </TabsList>

        {/* Application Overview - Submitted Application Data */}
        <TabsContent value="overview">
          <StartupApplicationOverview 
            applicationId={application.id}
            applicationData={getApplicationFormData(application.id) || {
              // Fallback to basic data if no mock data found
              contactName: application.founderName,
              email: application.founderEmail,
              startupName: application.startupName,
              hqLocation: application.location,
              currentStage: application.stage,
              summary: application.description,
              submittedAt: application.submittedAt,
              applicationFlow: 'deck-only'
            }}
          />
        </TabsContent>

        {/* Startup Overview - Comprehensive Single Page View */}
        <TabsContent value="startup-overview">
          <div className="space-y-6">
            {/* Company Description Section */}
            <Card>
              <CardHeader>
                <CardTitle>Company Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  {application.description}
                </p>
                
                <div>
                  <h4 className="font-semibold mb-3">Key Milestones Achieved</h4>
                  <ul className="space-y-2">
                    {mockData.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-[#06CB1D] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-[#C8D6FF] rounded-lg bg-[#F7F9FF]">
                      <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                        <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-[#114DFF] text-sm font-medium">{member.role}</p>
                        <p className="text-gray-600 text-sm mt-1">{member.experience}</p>
                        <p className="text-gray-500 text-sm">{member.education}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Section */}
            <Card>
              <CardHeader>
                <CardTitle>Market</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900">Market Size</h4>
                    <p className="text-2xl font-bold text-[#06CB1D]">{mockData.marketAnalysis.marketSize}</p>
                    <p className="text-gray-600 text-sm mt-1">Total Addressable Market</p>
                  </div>
                  <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900">Target Market</h4>
                    <p className="text-gray-700">{mockData.marketAnalysis.targetMarket}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-900">Competitive Landscape</h4>
                  <p className="text-gray-700">{mockData.marketAnalysis.competitiveLandscape}</p>
                </div>
                
                <div className="p-4 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                  <h4 className="font-semibold mb-2 text-gray-900">Unique Advantage</h4>
                  <p className="text-gray-700">{mockData.marketAnalysis.uniqueAdvantage}</p>
                </div>
              </CardContent>
            </Card>

            {/* Financials Section */}
            <Card>
              <CardHeader>
                <CardTitle>Financials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-900">Current Status</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Monthly Recurring Revenue:</span>
                        <span className="font-medium text-[#06CB1D]">{mockData.financials.currentMRR}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Burn Rate:</span>
                        <span className="font-medium text-[#FF220E]">{mockData.financials.burnRate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cash Runway:</span>
                        <span className="font-medium text-gray-900">{mockData.financials.cashRunway}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-900">Projections</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Year 1 Revenue:</span>
                        <span className="font-medium text-[#06CB1D]">{mockData.financials.projectedYear1Revenue}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Year 3 Revenue:</span>
                        <span className="font-medium text-[#06CB1D]">{mockData.financials.projectedYear3Revenue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Application Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-red-600" />
                    <div>
                      <h4 className="font-medium">Pitch Deck</h4>
                      <p className="text-sm text-gray-600">PDF • 2.3 MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Business Plan</h4>
                      <p className="text-sm text-gray-600">PDF • 1.8 MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Video Pitch</h4>
                      <p className="text-sm text-gray-600">3 minutes • HD</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-analysis">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Market Potential</span>
                      <span className={`${getScoreColor(application.marketScore)}`}>
                        {application.marketScore}/100
                      </span>
                    </div>
                    <Progress value={application.marketScore} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Team Strength</span>
                      <span className={`${getScoreColor(application.teamScore)}`}>
                        {application.teamScore}/100
                      </span>
                    </div>
                    <Progress value={application.teamScore} className="h-3" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Idea Innovation</span>
                      <span className={`${getScoreColor(application.ideaScore)}`}>
                        {application.ideaScore}/100
                      </span>
                    </div>
                    <Progress value={application.ideaScore} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Incubator Fit</span>
                      <span className={`${getScoreColor(application.fitScore)}`}>
                        {application.fitScore}/100
                      </span>
                    </div>
                    <Progress value={application.fitScore} className="h-3" />
                  </div>
                </div>
              </div>
              
              {/* AI Analysis Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <h4 className="text-[#06CB1D] mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Market Analysis (Score: {application.marketScore})
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Large addressable market ($45B+) with growing demand for clean energy solutions. 
                      Strong market timing as residential solar adoption accelerates. High growth potential 
                      in both residential and commercial segments.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                    <h4 className="text-[#114DFF] mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Assessment (Score: {application.teamScore})
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Strong technical background with Tesla and Google alumni. CEO has deep domain expertise.
                      CTO brings crucial AI/ML skills. Missing: Business development experience and 
                      sales leadership for scaling.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <h4 className="text-[#3CE5A7] mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Innovation Score (Score: {application.ideaScore})
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Proprietary AI optimization technology with proven 23% efficiency gains. 
                      Three patents filed. Clear differentiation from existing solutions. 
                      Strong technical moat with defensible IP.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                    <h4 className="text-[#114DFF] mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Incubator Fit (Score: {application.fitScore})
                    </h4>
                    <p className="text-gray-700 text-sm">
                      Perfect alignment with our cleantech investment thesis. Complements existing 
                      portfolio in renewable energy sector. Would benefit from our network of 
                      energy industry partners and customers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <h4 className="mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#3CE5A7]" />
                  Overall AI Recommendation
                </h4>
                <div className="text-gray-800 space-y-2">
                  <p className="text-lg">
                    🎯 <strong>High-Potential Investment Opportunity</strong> (Score: {application.aiScore}/100)
                  </p>
                  <p>
                    This startup demonstrates exceptional promise across all key metrics. The combination of 
                    innovative technology, experienced team, and large market opportunity creates a compelling 
                    investment case. Key strengths include proven technology with measurable results, strong IP 
                    portfolio, and clear market demand.
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#C8D6FF]">
                    <div className="flex items-center gap-1 text-[#06CB1D]">
                      <div className="w-2 h-2 bg-[#06CB1D] rounded-full"></div>
                      <span className="text-sm">Recommended Action: Schedule Interview</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#114DFF]">
                      <div className="w-2 h-2 bg-[#114DFF] rounded-full"></div>
                      <span className="text-sm">Risk Level: Low-Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agreement & Contract Tab */}
        {showAgreementTab && (
          <TabsContent value="agreement">
            <div className="space-y-6">
              {/* Submit Terms Section */}
              <Card className="border-[#C8D6FF]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#114DFF]" />
                    Submit Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Check if there are any versions submitted */}
                  {termsVersions.length === 0 ? (
                    /* Initial Terms Submission Form */
                    <>
                      {/* Process Overview */}
                      <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                        <h4 className="text-[#114DFF] mb-2">Agreement Negotiation Process</h4>
                        <p className="text-gray-700 text-sm">
                          Define the terms for your partnership with {application.founderName}. Once submitted, 
                          the founder will receive an email notification and can review the terms in their Mentor Dashboard. 
                          You can negotiate back and forth until both parties agree.
                        </p>
                      </div>

                      {/* Terms Form */}
                      <div className="space-y-6">
                        {/* Tenure */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label className="mb-3 block">Tenure (Months) *</Label>
                            <RadioGroup value={tenure} onValueChange={setTenure} className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="12" id="tenure-12" />
                                <Label htmlFor="tenure-12" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">12 Months</span>
                                  <span className="text-gray-500 text-xs ml-2">(1 year)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="18" id="tenure-18" />
                                <Label htmlFor="tenure-18" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">18 Months</span>
                                  <span className="text-gray-500 text-xs ml-2">(1.5 years)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="24" id="tenure-24" />
                                <Label htmlFor="tenure-24" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">24 Months</span>
                                  <span className="text-gray-500 text-xs ml-2">(2 years)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="other" id="tenure-other" />
                                <Label htmlFor="tenure-other" className="cursor-pointer flex-1 text-gray-900">Custom Duration</Label>
                              </div>
                            </RadioGroup>
                            
                            {tenure === "other" && (
                              <div className="mt-3 ml-8">
                                <Input
                                  type="number"
                                  value={tenureOther}
                                  onChange={(e) => setTenureOther(e.target.value)}
                                  placeholder="Enter months (e.g., 6, 30, 36)"
                                  className="bg-[#F7F9FF] border-[#C8D6FF]"
                                />
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-3">Duration of the mentorship/incubation program</p>
                          </CardContent>
                        </Card>

                        {/* Equity Percentage */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label className="mb-3 block">Equity Percentage *</Label>
                            <RadioGroup value={equityPercentage} onValueChange={setEquityPercentage} className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 border-2 border-[#114DFF] bg-[#EDF2FF] rounded-lg cursor-pointer">
                                <RadioGroupItem value="2.5" id="equity-2.5" />
                                <Label htmlFor="equity-2.5" className="cursor-pointer flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900">2.5%</span>
                                    <Badge variant="outline" className="bg-[#06CB1D]/10 text-[#06CB1D] border-[#06CB1D]/30 text-xs">
                                      Recommended
                                    </Badge>
                                  </div>
                                  <span className="text-gray-500 text-xs">Standard equity for incubation programs</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="other" id="equity-other" />
                                <Label htmlFor="equity-other" className="cursor-pointer flex-1 text-gray-900">Custom Percentage</Label>
                              </div>
                            </RadioGroup>
                            
                            {equityPercentage === "other" && (
                              <div className="mt-3 ml-8 space-y-2">
                                <div className="relative">
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={equityOther}
                                    onChange={(e) => setEquityOther(e.target.value)}
                                    placeholder="Enter percentage (e.g., 1.5, 3.0, 5.0)"
                                    className="bg-[#F7F9FF] border-[#C8D6FF] pr-8"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                </div>
                                
                                {/* Equity Validation */}
                                {equityOther && (
                                  <div className={`flex items-center gap-2 text-sm ${getEquityValidation(parseFloat(equityOther)).color}`}>
                                    {getEquityValidation(parseFloat(equityOther)).status === "optimal" && <CheckCircle className="w-4 h-4" />}
                                    {(getEquityValidation(parseFloat(equityOther)).status === "too-low" || 
                                      getEquityValidation(parseFloat(equityOther)).status === "too-high") && <AlertCircle className="w-4 h-4" />}
                                    <span>{getEquityValidation(parseFloat(equityOther)).message}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-3">Standard equity is 2.5%. Adjust based on program value and startup stage.</p>
                          </CardContent>
                        </Card>

                        {/* Time Commitment */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label className="mb-3 block">Time Commitment *</Label>
                            <RadioGroup value={timeCommitment} onValueChange={setTimeCommitment} className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="2-hours-month" id="time-month" />
                                <Label htmlFor="time-month" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">2 hours a Month</span>
                                  <span className="text-gray-500 text-xs ml-2">(~30 min/week)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="2-hours-fortnight" id="time-fortnight" />
                                <Label htmlFor="time-fortnight" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">2 hours a Fortnight</span>
                                  <span className="text-gray-500 text-xs ml-2">(~1 hour/week)</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="other" id="time-other" />
                                <Label htmlFor="time-other" className="cursor-pointer flex-1 text-gray-900">Custom Time Commitment</Label>
                              </div>
                            </RadioGroup>
                            
                            {timeCommitment === "other" && (
                              <div className="mt-3 ml-8">
                                <Input
                                  value={timeCommitmentOther}
                                  onChange={(e) => setTimeCommitmentOther(e.target.value)}
                                  placeholder="e.g., 4 hours a week, 1 hour daily"
                                  className="bg-[#F7F9FF] border-[#C8D6FF]"
                                />
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-3">Time you will dedicate to mentoring this startup</p>
                          </CardContent>
                        </Card>

                        {/* Introductions to Network */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label className="mb-3 block">Introductions to Network *</Label>
                            <RadioGroup value={networkIntroductions} onValueChange={setNetworkIntroductions} className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="yes" id="intro-yes" />
                                <Label htmlFor="intro-yes" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">Yes</span>
                                  <span className="text-gray-500 text-xs ml-2">I will provide network introductions</span>
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors cursor-pointer">
                                <RadioGroupItem value="no" id="intro-no" />
                                <Label htmlFor="intro-no" className="cursor-pointer flex-1">
                                  <span className="text-gray-900">No</span>
                                  <span className="text-gray-500 text-xs ml-2">Network introductions not included</span>
                                </Label>
                              </div>
                            </RadioGroup>
                            <p className="text-xs text-gray-500 mt-3">Will you provide introductions to investors, partners, or customers?</p>
                          </CardContent>
                        </Card>

                        {/* Expertise */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label className="mb-3 block">Expertise & Guidance Areas *</Label>
                            <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: "product", label: "Product Development" },
                                { id: "marketing", label: "Branding & Marketing" },
                                { id: "finance", label: "Finance" },
                                { id: "operations", label: "Operations" },
                                { id: "gtm", label: "Go To Market" },
                                { id: "hiring", label: "Hiring" },
                                { id: "other", label: "Other" }
                              ].map((item) => (
                                <div 
                                  key={item.id} 
                                  className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors cursor-pointer ${
                                    expertise.includes(item.id) 
                                      ? 'border-[#114DFF] bg-[#EDF2FF]' 
                                      : 'border-[#C8D6FF] hover:bg-[#F7F9FF]'
                                  }`}
                                >
                                  <Checkbox
                                    id={`expertise-${item.id}`}
                                    checked={expertise.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setExpertise([...expertise, item.id]);
                                      } else {
                                        setExpertise(expertise.filter(e => e !== item.id));
                                      }
                                    }}
                                  />
                                  <Label htmlFor={`expertise-${item.id}`} className="cursor-pointer flex-1 text-gray-900">
                                    Guidance on {item.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            
                            {expertise.includes("other") && (
                              <div className="mt-3">
                                <Input
                                  value={expertiseOther}
                                  onChange={(e) => setExpertiseOther(e.target.value)}
                                  placeholder="Specify other expertise areas (e.g., Legal, IP, International expansion)"
                                  className="bg-[#F7F9FF] border-[#C8D6FF]"
                                />
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-3">Select all areas where you will provide guidance (select at least one)</p>
                          </CardContent>
                        </Card>

                        {/* Additional Deliverables */}
                        <Card className="border-[#C8D6FF] bg-white">
                          <CardContent className="p-5">
                            <Label htmlFor="deliverables" className="mb-3 block">Additional Deliverables (Optional)</Label>
                            <textarea
                              id="deliverables"
                              value={deliverables}
                              onChange={(e) => setDeliverables(e.target.value)}
                              placeholder="Enter any additional specific deliverables:
• Access to investor network
• Quarterly business reviews
• Introduction to potential customers
• Monthly workshops on specific topics"
                              className="w-full min-h-[120px] p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#114DFF]"
                            />
                            <p className="text-xs text-gray-500 mt-2">List any additional specific services beyond the core commitment</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                        <Button
                          onClick={handleSubmitTerms}
                          disabled={
                            !tenure || 
                            (tenure === "other" && !tenureOther) ||
                            !equityPercentage || 
                            (equityPercentage === "other" && !equityOther) ||
                            !timeCommitment ||
                            (timeCommitment === "other" && !timeCommitmentOther) ||
                            expertise.length === 0 ||
                            (expertise.includes("other") && !expertiseOther)
                          }
                          className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Terms to {application.founderName}
                        </Button>
                      </div>

                      {/* Info Note */}
                      <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                        <h5 className="text-gray-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-[#114DFF]" />
                          Important Information
                        </h5>
                        <ul className="text-gray-700 text-sm space-y-1">
                          <li>• Terms will be sent to {application.founderName} via email</li>
                          <li>• Founder can accept or propose counter-terms</li>
                          <li>• All versions will be tracked in the negotiation history</li>
                          <li>• Agreement finalizes once both parties accept the same terms</li>
                          <li>• When terms are finalized, our team will coordinate to complete agreement closure</li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    /* Show Current Terms and Response Options */
                    <>
                      {/* Process Overview */}
                      <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                        <h4 className="text-[#114DFF] mb-2">Terms Negotiation</h4>
                        <p className="text-gray-700 text-sm">
                          Review the latest terms in the negotiation. You can accept the current terms or propose changes.
                        </p>
                      </div>

                      {/* Current Terms Display (Latest Version) */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3>Current Terms (Version {termsVersions.length})</h3>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            <Clock className="w-3 h-3 mr-1" />
                            {termsVersions[termsVersions.length - 1].status === "pending-review" ? "Pending Your Response" : "Under Review"}
                          </Badge>
                        </div>

                        <Card className="border-[#C8D6FF] bg-[#F7F9FF]">
                          <CardContent className="p-6 space-y-5">
                            {/* Terms Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Tenure</p>
                                <p className="text-xl font-semibold text-gray-900">{termsVersions[termsVersions.length - 1].tenure}</p>
                              </div>
                              <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Equity Percentage</p>
                                <p className="text-xl font-semibold text-[#114DFF]">{termsVersions[termsVersions.length - 1].equity}</p>
                              </div>
                              <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                                <p className="text-xl font-semibold text-gray-900 capitalize">{termsVersions[termsVersions.length - 1].submittedBy}</p>
                              </div>
                            </div>

                            {/* Deliverables */}
                            <div>
                              <p className="text-sm text-gray-900 font-semibold mb-2">Deliverables:</p>
                              <div className="bg-white border border-[#C8D6FF] rounded-lg p-4">
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {termsVersions[termsVersions.length - 1].deliverables}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons - Only show if latest version is from founder */}
                            {termsVersions[termsVersions.length - 1].submittedBy === "founder" && (
                              <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                                <Button 
                                  className="flex-1 bg-[#06CB1D] hover:bg-[#059e17] text-white"
                                  onClick={() => {
                                    toast.success("Terms Accepted!", {
                                      description: `You have accepted the terms from ${application.founderName}. Final agreement documents will be prepared.`,
                                      duration: 5000,
                                    });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept Terms
                                </Button>
                                <Button 
                                  variant="outline"
                                  className="flex-1 border-[#114DFF] text-[#114DFF] hover:bg-[#EDF2FF]"
                                  onClick={() => {
                                    // Pre-fill with current values
                                    const latest = termsVersions[termsVersions.length - 1];
                                    setMentorCounterTenure(latest.tenure.replace(" months", ""));
                                    setMentorCounterEquity(latest.equity.replace("%", ""));
                                    setMentorCounterDeliverables(latest.deliverables);
                                    setShowMentorCounterProposal(true);
                                  }}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Propose Changes
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Version History Section */}
              {termsVersions.length > 0 && (
                <Card className="border-[#C8D6FF]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#114DFF]" />
                      Negotiation History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {termsVersions.map((version, index) => (
                        <div key={index} className="border border-[#C8D6FF] rounded-lg p-4 bg-[#F7F9FF]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                                Version {version.version}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={`${
                                  version.status === "pending-review" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                  version.status === "accepted" ? "bg-green-50 text-[#06CB1D] border-green-200" :
                                  "bg-gray-50 text-gray-700 border-gray-200"
                                }`}
                              >
                                {version.status.replace("-", " ").toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">{version.timestamp}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Tenure</p>
                              <p className="font-medium text-gray-900">{version.tenure}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Equity</p>
                              <p className="font-medium text-gray-900">{version.equity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                              <p className="font-medium text-gray-900 capitalize">{version.submittedBy}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-500 mb-2">Deliverables</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{version.deliverables}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
      </div>
      {/* End of Scrollable Content Area */}

      {/* Mentor Counter-Proposal Modal */}
      {showMentorCounterProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto border-[#C8D6FF]">
            <CardHeader className="border-b border-[#C8D6FF]">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#114DFF]" />
                  Propose Counter-Terms
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowMentorCounterProposal(false)} className="border-[#C8D6FF]">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Modify the terms and send your counter-proposal to {application.founderName}
              </p>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Process Overview */}
              <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                <h4 className="text-[#114DFF] mb-2">Counter-Proposal</h4>
                <p className="text-gray-700 text-sm">
                  Adjust the terms below to propose your counter-offer. Once submitted, {application.founderName} will be notified and can review your proposed changes.
                </p>
              </div>

              {/* Counter-Proposal Form */}
              <div className="space-y-5">
                {/* Tenure */}
                <div className="space-y-2">
                  <Label htmlFor="mentor-counter-tenure">Tenure (Months) *</Label>
                  <Input
                    id="mentor-counter-tenure"
                    type="number"
                    value={mentorCounterTenure}
                    onChange={(e) => setMentorCounterTenure(e.target.value)}
                    placeholder="12"
                    className="bg-[#F7F9FF] border-[#C8D6FF]"
                  />
                  <p className="text-xs text-gray-500">Duration of the mentorship/incubation program</p>
                </div>

                {/* Equity Percentage */}
                <div className="space-y-2">
                  <Label htmlFor="mentor-counter-equity">Equity Percentage *</Label>
                  <div className="relative">
                    <Input
                      id="mentor-counter-equity"
                      type="number"
                      step="0.1"
                      value={mentorCounterEquity}
                      onChange={(e) => setMentorCounterEquity(e.target.value)}
                      placeholder="2.5"
                      className="bg-[#F7F9FF] border-[#C8D6FF] pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  
                  {/* Equity Validation Indicator */}
                  {mentorCounterEquity && (
                    <div className={`flex items-center gap-2 text-sm ${getEquityValidation(parseFloat(mentorCounterEquity)).color}`}>
                      {getEquityValidation(parseFloat(mentorCounterEquity)).status === "optimal" && <CheckCircle className="w-4 h-4" />}
                      {(getEquityValidation(parseFloat(mentorCounterEquity)).status === "too-low" || 
                        getEquityValidation(parseFloat(mentorCounterEquity)).status === "too-high") && <AlertCircle className="w-4 h-4" />}
                      <span>{getEquityValidation(parseFloat(mentorCounterEquity)).message}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Standard equity is 2.5%. Adjust based on the program value.</p>
                </div>

                {/* Deliverables */}
                <div className="space-y-2">
                  <Label htmlFor="mentor-counter-deliverables">Deliverables from Mentor *</Label>
                  <textarea
                    id="mentor-counter-deliverables"
                    value={mentorCounterDeliverables}
                    onChange={(e) => setMentorCounterDeliverables(e.target.value)}
                    placeholder="Enter each deliverable on a new line:
• Weekly 1-on-1 mentorship sessions
• Access to investor network
• Strategic guidance on product development"
                    className="w-full min-h-[200px] p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#114DFF]"
                  />
                  <p className="text-xs text-gray-500">List all services and support you will provide to the startup</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                <Button
                  variant="outline"
                  className="flex-1 border-[#CCCCCC] hover:bg-[#F5F5F5]"
                  onClick={() => setShowMentorCounterProposal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Create new version
                    const newVersion = {
                      version: termsVersions.length + 1,
                      tenure: mentorCounterTenure + " months",
                      equity: mentorCounterEquity + "%",
                      deliverables: mentorCounterDeliverables,
                      status: "pending-review",
                      submittedBy: "mentor",
                      submittedAt: new Date().toISOString(),
                      timestamp: new Date().toLocaleString()
                    };
                    
                    setTermsVersions([...termsVersions, newVersion]);
                    
                    toast.success("Counter-Proposal Submitted!", {
                      description: `Your proposed changes have been sent to ${application.founderName}. They will be notified via email and can review your counter-offer in their dashboard.`,
                      duration: 5000,
                    });
                    
                    setShowMentorCounterProposal(false);
                    
                    // In production:
                    // 1. Create new version with mentor's proposed changes
                    // 2. Send email notification to founder
                    // 3. Update founder's dashboard with new version
                  }}
                  disabled={!mentorCounterTenure || !mentorCounterEquity || !mentorCounterDeliverables}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Counter-Proposal
                </Button>
              </div>

              {/* Info Note */}
              <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                <h5 className="text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#114DFF]" />
                  Important Information
                </h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Your counter-proposal will be sent to {application.founderName} via email</li>
                  <li>• This will create Version {termsVersions.length + 1} in the negotiation history</li>
                  <li>• The founder can accept or propose further changes</li>
                  <li>• All versions are tracked for transparency</li>
                  <li>• Agreement finalizes when both parties accept the same terms</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STICKY ACTION BAR - Always Visible */}
      <div className="sticky bottom-0 left-0 right-0 z-50 bg-white border-t border-[#C8D6FF] shadow-lg mt-auto">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side: Application Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10 ring-2 ring-[#C8D6FF]/30">
                <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                  {application.startupName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-gray-900">{application.startupName}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {application.status.replace("-", " ").toUpperCase()}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">AI Score: {application.aiScore}</span>
                </div>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex gap-3">
              {/* Review Pending - Schedule Interview & Reject */}
              {application.status === "review-pending" && (
                <>
                  <Button 
                    onClick={() => setShowCommunicationFlow(true)} 
                    className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-11 px-6"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                  <Button 
                    onClick={handleReject} 
                    className="bg-white border-2 border-[#C8D6FF] text-[#FF220E] hover:bg-[#EDF2FF] h-11 px-6"
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {/* Interview Completed - Accept & Reject */}
              {application.status === "interview-completed" && (
                <>
                  <Button 
                    onClick={() => setShowCommunicationFlow(true)} 
                    className="bg-[#06CB1D] hover:bg-[#059e17] text-white h-11 px-6"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Application
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success("Rejection Sent to the Founder", {
                        description: `A rejection email has been sent to ${application.founderName} via CFC ID with a professional template.`,
                        duration: 4000,
                      });
                    }} 
                    className="bg-white border-2 border-[#C8D6FF] text-[#FF220E] hover:bg-[#EDF2FF] h-11 px-6"
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {/* Accepted - Start Agreement */}
              {application.status === "accepted" && (
                <Button 
                  onClick={() => {
                    setShowAgreementTab(true);
                    setActiveTab("agreement");
                  }} 
                  className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-11 px-6"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Start Agreement Process
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}