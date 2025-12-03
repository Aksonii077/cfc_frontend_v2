'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { FounderAgreementFlow } from './mentor/FounderAgreementFlow'
import { toast } from 'sonner@2.0.3'
import { 
  Search, 
  MapPin, 
  Users, 
  DollarSign, 
  Star,
  Target,
  MessageSquare,
  Heart,
  Share,
  TrendingUp,
  X,
  Mail,
  ExternalLink,
  Briefcase,
  Globe,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  Phone,
  Video,
  Send,
  AlertCircle,
  Eye,
  UserPlus,
  BarChart3,
  Upload,
  FileCheck,
  Edit3,
  Plus,
  Download,
  ArrowUp,
  ArrowDown,
  Activity,
  Percent,
  User,
  Linkedin,
  Twitter
} from 'lucide-react'

interface MentorsSectionProps {
  showOnlyMyApplications?: boolean;
  subSection?: string;
  onNavigateToApplicationForm?: (mentorName: string, programName: string) => void;
}

export function MentorsSection({ showOnlyMyApplications = false, subSection, onNavigateToApplicationForm }: MentorsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  const [showMentorProfile, setShowMentorProfile] = useState(false)
  // Set initial tab based on subsection or default behavior
  const getInitialTab = () => {
    if (subSection === 'my-applications') return 'my-applications';
    if (subSection === 'my-mentors') return 'my-mentors';
    if (showOnlyMyApplications) return 'my-applications';
    return 'find-mentor';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab())
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showAgreements, setShowAgreements] = useState(false)
  const [selectedAgreementApp, setSelectedAgreementApp] = useState<any>(null)
  const [showMentorDashboard, setShowMentorDashboard] = useState(false)
  const [selectedMentorForDashboard, setSelectedMentorForDashboard] = useState<any>(null)
  const [dashboardActiveTab, setDashboardActiveTab] = useState('kpis')
  const [showAgreementFlow, setShowAgreementFlow] = useState(false)
  const [selectedAgreementFlowApp, setSelectedAgreementFlowApp] = useState<any>(null)
  const [showMetricsUploadModal, setShowMetricsUploadModal] = useState(false)
  const [selectedMetricsFile, setSelectedMetricsFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showMonthlyUpdateForm, setShowMonthlyUpdateForm] = useState(false)
  const [selectedUpdateToView, setSelectedUpdateToView] = useState<any>(null)
  
  // Counter-proposal state
  const [showCounterProposal, setShowCounterProposal] = useState(false)
  const [counterTenure, setCounterTenure] = useState("12")
  const [counterEquity, setCounterEquity] = useState("2.5")
  const [counterDeliverables, setCounterDeliverables] = useState("")

  // Equity validation helper
  const getEquityValidation = (equity: number) => {
    if (equity < 2) return { status: "too-low", message: "Equity percentage is lower than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity > 5) return { status: "too-high", message: "Equity percentage is higher than standard (2.5%)", color: "text-[#FF220E]" };
    if (equity >= 2 && equity <= 3) return { status: "optimal", message: "Equity percentage is within optimal range", color: "text-[#06CB1D]" };
    return { status: "acceptable", message: "Equity percentage is acceptable", color: "text-[#114DFF]" };
  };

  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Former VP of Product, Google",
      expertise: ["Product Strategy", "User Experience", "Growth Hacking"],
      experience: "15+ years",
      mentees: 47,
      rating: 4.9,
      location: "Mountain View, CA",
      avatar: "SC",
      bio: "Led product teams at Google, Uber, and Airbnb. Specialist in 0-1 product development and scaling.",
      availability: "2-3 startups",
      industries: ["Tech", "SaaS", "Mobile Apps"],
      email: "sarah.chen@gmail.com",
      linkedin: "linkedin.com/in/sarahchen",
      twitter: "@sarahchen",
      website: "sarahchen.com"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      title: "Wellness Industry Expert",
      expertise: ["Wellness Business", "Product Development", "Market Strategy"],
      experience: "12+ years",
      mentees: 28,
      rating: 4.8,
      location: "Miami, FL",
      avatar: "MR",
      bio: "Built and sold two wellness companies. Expert in Ayurveda, holistic health, and wellness market dynamics.",
      availability: "1-2 startups",
      industries: ["Wellness", "Health", "Beauty", "Lifestyle"],
      email: "dr.rodriguez@wellnessventures.com",
      linkedin: "linkedin.com/in/michaelrodriguez",
      twitter: "@drwellness",
      website: "michaelrodriguez.health"
    },
    {
      id: 3,
      name: "James Thompson",
      title: "Serial Entrepreneur & Investor",
      expertise: ["Fundraising", "Business Strategy", "Operations"],
      experience: "20+ years",
      mentees: 89,
      rating: 4.7,
      location: "New York, NY",
      avatar: "JT",
      bio: "Founded 3 successful startups, raised $150M+ in funding. Now angel investor and mentor.",
      availability: "3-4 startups",
      industries: ["Fintech", "SaaS", "E-commerce"],
      email: "james@thompsonventures.com",
      linkedin: "linkedin.com/in/jamesthompson",
      twitter: "@jthompson",
      website: "jamesthompson.ventures"
    }
  ]

  // Mock data for applications - Updated for 8-state flow
  const applications = [
    {
      id: 1,
      mentorName: "Sarah Chen",
      mentorTitle: "Former VP of Product, Google",
      appliedDate: "2024-01-15",
      status: "review-pending",
      statusText: "Review Pending",
      message: "I'm really interested in learning from your product strategy experience at Google...",
      mentorAvatar: "SC",
      lastUpdate: "2024-01-18",
      nextStep: "Waiting for mentor to review application"
    },
    {
      id: 2,
      mentorName: "James Thompson",
      mentorTitle: "Serial Entrepreneur & Investor",
      appliedDate: "2024-01-10",
      status: "agreement-in-progress",
      statusText: "Agreement In Progress",
      message: "Looking forward to discussing fundraising strategies with you...",
      mentorAvatar: "JT",
      lastUpdate: "2024-01-19",
      nextStep: "Review terms and finalize mentorship agreement",
      termsVersion: 2,
      agreementStatus: "counter-proposed"
    },
    {
      id: 3,
      mentorName: "Dr. Michael Rodriguez",
      mentorTitle: "Wellness Industry Expert",
      appliedDate: "2024-01-05",
      status: "rejected",
      statusText: "Not Selected",
      message: "I'd love to learn about wellness market dynamics...",
      mentorAvatar: "MR",
      lastUpdate: "2024-01-12",
      nextStep: "Consider applying to other wellness mentors"
    },
    {
      id: 4,
      mentorName: "Lisa Chang",
      mentorTitle: "HealthTech Investor",
      appliedDate: "2024-01-08",
      status: "interview-scheduled",
      statusText: "Interview Scheduled",
      message: "Excited to discuss my HealthTech startup...",
      mentorAvatar: "LC",
      lastUpdate: "2024-01-17",
      nextStep: "Interview on Jan 22nd at 3:00 PM",
      interviewDate: "2024-01-22T15:00:00"
    },
    {
      id: 5,
      mentorName: "David Park",
      mentorTitle: "E-commerce Expert",
      appliedDate: "2024-01-12",
      status: "accepted",
      statusText: "Accepted",
      message: "Looking to scale my e-commerce business...",
      mentorAvatar: "DP",
      lastUpdate: "2024-01-20",
      nextStep: "Awaiting agreement initiation from mentor"
    }
  ]

  // Mock agreements data
  const agreementsData = {
    2: [ // For James Thompson application
      {
        id: 1,
        title: "Mentorship Agreement",
        description: "Main mentorship terms and conditions",
        type: "main",
        status: "pending",
        pages: 8,
        lastModified: "2024-01-19",
        priority: "high"
      },
      {
        id: 2,
        title: "Non-Disclosure Agreement (NDA)",
        description: "Confidentiality and information protection",
        type: "legal",
        status: "pending", 
        pages: 3,
        lastModified: "2024-01-19",
        priority: "high"
      },
      {
        id: 3,
        title: "Intellectual Property Agreement",
        description: "IP ownership and sharing guidelines",
        type: "legal",
        status: "pending",
        pages: 5,
        lastModified: "2024-01-19",
        priority: "medium"
      },
      {
        id: 4,
        title: "Communication Guidelines",
        description: "Meeting schedules and communication preferences",
        type: "guidelines",
        status: "pending",
        pages: 2,
        lastModified: "2024-01-19",
        priority: "low"
      }
    ]
  }

  // Mock KPI data for mentor dashboard
  const kpiData = {
    1: {
      metrics: [
        { name: "Monthly Revenue", current: 45000, previous: 38000, target: 50000, unit: "$", trend: "up" },
        { name: "Users", current: 1250, previous: 980, target: 1500, unit: "", trend: "up" },
        { name: "Customer Acquisition Cost", current: 85, previous: 92, target: 75, unit: "$", trend: "down" },
        { name: "Monthly Burn Rate", current: 28000, previous: 32000, target: 25000, unit: "$", trend: "down" },
        { name: "Product Development Progress", current: 75, previous: 65, target: 85, unit: "%", trend: "up" },
        { name: "Team Size", current: 8, previous: 6, target: 10, unit: "", trend: "up" }
      ],
      lastUpdated: "2024-09-05",
      nextUpdate: "2024-09-20"
    }
  }

  // Mock updates data
  const updatesData = {
    1: [
      {
        id: 1,
        month: "September 2024",
        created: "2024-09-15",
        status: "sent",
        highlights: "Closed Series A funding, launched new feature, expanded team",
        challenges: "Scaling infrastructure, hiring challenges in engineering",
        nextGoals: "Focus on user acquisition, product optimization",
        metrics: "45K MRR, 1.2K users, 8 team members",
        content: "We've had an incredible month with major milestones achieved..."
      },
      {
        id: 2,
        month: "August 2024", 
        created: "2024-08-15",
        status: "sent",
        highlights: "Product beta launch, initial user traction",
        challenges: "User onboarding flow optimization",
        nextGoals: "Fundraising, feature development",
        metrics: "38K MRR, 980 users, 6 team members",
        content: "August was focused on launching our beta and gathering initial feedback..."
      }
    ]
  }

  // Mock documents data
  const documentsData = {
    1: [
      // Signed Agreements (Auto-populated)
      {
        id: 1,
        name: "Mentorship Agreement - Signed",
        type: "agreement",
        category: "Legal",
        size: "2.1 MB",
        uploadDate: "2024-01-20",
        status: "signed",
        isAgreement: true
      },
      {
        id: 2,
        name: "NDA Agreement - Signed", 
        type: "agreement",
        category: "Legal",
        size: "850 KB",
        uploadDate: "2024-01-20",
        status: "signed",
        isAgreement: true
      },
      // User uploaded documents
      {
        id: 3,
        name: "Business Plan v2.1",
        type: "pdf",
        category: "Strategy",
        size: "4.2 MB",
        uploadDate: "2024-09-10",
        status: "active"
      },
      {
        id: 4,
        name: "Financial Projections Q3",
        type: "xlsx",
        category: "Finance",
        size: "1.8 MB", 
        uploadDate: "2024-09-08",
        status: "active"
      },
      {
        id: 5,
        name: "Product Roadmap 2024",
        type: "pdf",
        category: "Product",
        size: "3.1 MB",
        uploadDate: "2024-09-05",
        status: "active"
      },
      {
        id: 6,
        name: "Team Structure & Roles",
        type: "docx",
        category: "HR",
        size: "945 KB",
        uploadDate: "2024-09-01",
        status: "active"
      }
    ]
  }

  // Mock data for accepted mentors
  const acceptedMentors = [
    {
      id: 1,
      name: "Alex Rivera",
      title: "E-commerce Growth Expert",
      expertise: ["E-commerce", "Growth Marketing", "Operations"],
      mentorshipStart: "2023-12-01",
      nextMeeting: "2024-01-25",
      progress: 85,
      avatar: "AR",
      bio: "Scaled 3 e-commerce companies to 8-figure revenue. Expert in growth marketing and operational efficiency.",
      achievements: ["Launched 2 successful campaigns", "Improved conversion by 40%", "Built mentor relationship"],
      upcomingTasks: ["Review Q1 marketing strategy", "Analyze competitor landscape", "Plan product launch"]
    },
    {
      id: 2,
      name: "Linda Park",
      title: "Tech Startup Advisor",
      expertise: ["Product Development", "Team Building", "Tech Strategy"],
      mentorshipStart: "2023-11-15",
      nextMeeting: "2024-01-23",
      progress: 65,
      avatar: "LP",
      bio: "Former CTO at 2 unicorn startups. Specialist in technical team scaling and product architecture.",
      achievements: ["Hired 3 key engineers", "Defined technical roadmap", "Implemented agile processes"],
      upcomingTasks: ["Technical architecture review", "Team performance evaluation", "Plan engineering hiring"]
    }
  ]

  const handleViewProfile = (mentor: any) => {
    setSelectedMentor(mentor)
    setShowMentorProfile(true)
  }

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  })

  const MentorCard = ({ mentor, onViewProfile }: { mentor: any; onViewProfile: (mentor: any) => void }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="p-6 relative">
          {/* Verified Badge - Top Right Corner */}
          <Badge variant="outline" className="absolute top-4 right-4 bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified Mentor
          </Badge>

          <div className="flex gap-5">
            {/* Left: Avatar */}
            <Avatar className="w-16 h-16 ring-2 ring-[#C8D6FF]/30 flex-shrink-0">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-lg">
                {mentor.avatar}
              </AvatarFallback>
            </Avatar>

            {/* Middle: Main Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Header Row */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{mentor.name}</h3>
                <p className="text-sm text-gray-600 truncate mt-0.5">{mentor.title}</p>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{mentor.location}</span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm py-2">
                <div className="text-center">
                  <p className="font-semibold text-gray-900 mb-0.5">{mentor.experience}</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900 mb-0.5">{mentor.mentees}</p>
                  <p className="text-xs text-gray-500">Startups</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[#06CB1D] mb-0.5">{mentor.availability}</p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {mentor.bio}
              </p>

              {/* Expertise & Industries - Single Row */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 flex-shrink-0">Expertise:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise.slice(0, 3).map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] px-2.5 py-0.5">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-[#F5F5F5] text-gray-600 border-[#CCCCCC] px-2.5 py-0.5">
                        +{mentor.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 flex-shrink-0">Industries:</span>
                  <div className="flex gap-1.5">
                    {mentor.industries.slice(0, 2).map((industry: string) => (
                      <Badge key={industry} variant="outline" className="text-xs bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] px-2.5 py-0.5">
                        {industry}
                      </Badge>
                    ))}
                    {mentor.industries.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-[#F5F5F5] text-gray-600 border-[#CCCCCC] px-2.5 py-0.5">
                        +{mentor.industries.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <Button 
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-10 text-sm" 
                  onClick={() => {
                    if (onNavigateToApplicationForm) {
                      onNavigateToApplicationForm(mentor.name, mentor.title)
                    }
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Apply for Mentorship
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onViewProfile(mentor)} 
                  className="border-[#C8D6FF] hover:bg-[#EDF2FF] h-10 px-5 text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
               
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  // Helper function to render My Applications content
  const renderMyApplicationsContent = () => {
    // Show FounderAgreementFlow if active
    if (showAgreementFlow && selectedAgreementFlowApp) {
      return (
        <FounderAgreementFlow
          application={selectedAgreementFlowApp}
          onClose={() => {
            setShowAgreementFlow(false)
            setSelectedAgreementFlowApp(null)
          }}
        />
      );
    }

    return (
      <>
        {applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No applications yet</h3>
            <p className="text-sm text-muted-foreground">Your mentor applications will appear here once you start applying.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                      {application.mentorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4>{application.mentorName}</h4>
                        <p className="text-sm text-gray-500">{application.mentorTitle}</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant="outline"
                          className={
                            application.status === 'review-pending' ? 'bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]' :
                            application.status === 'interview-scheduled' ? 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]' :
                            application.status === 'interview-completed' ? 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]' :
                            application.status === 'accepted' ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]' :
                            application.status === 'agreement-started' ? 'bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]' :
                            application.status === 'agreement-in-progress' ? 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]' :
                            application.status === 'agreement-complete' ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]' :
                            'bg-[#FFE5E5] text-[#FF220E] border-[#FF220E]/30'
                          }
                        >
                          {application.status === 'review-pending' && <Clock className="w-3 h-3 mr-1" />}
                          {application.status === 'interview-scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                          {application.status === 'interview-completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {application.status === 'accepted' && <UserPlus className="w-3 h-3 mr-1" />}
                          {application.status === 'agreement-started' && <FileText className="w-3 h-3 mr-1" />}
                          {application.status === 'agreement-in-progress' && <Activity className="w-3 h-3 mr-1" />}
                          {application.status === 'agreement-complete' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {application.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                          {application.statusText}
                        </Badge>
                        <p className="text-xs text-gray-500">Applied {application.appliedDate}</p>
                      </div>
                    </div>

                    {/* Status Progress Line */}
                    <div className="bg-[#F7F9FF] rounded-xl p-5 border border-[#C8D6FF]">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm text-gray-700">Application Progress</h5>
                        <span className="text-xs text-gray-500">
                          {application.status === 'rejected' ? 'Application Closed' : 
                           application.status === 'agreement-complete' ? 'Completed' :
                           `Step ${
                            application.status === 'review-pending' ? '1' :
                            application.status === 'interview-scheduled' ? '2' :
                            application.status === 'interview-completed' ? '3' :
                            application.status === 'accepted' ? '4' :
                            application.status === 'agreement-started' ? '5' :
                            application.status === 'agreement-in-progress' ? '6' :
                            '1'
                          } of 7`}
                        </span>
                      </div>
                      
                      <div className="relative">
                        {/* Progress Line Background */}
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#C8D6FF]"></div>
                        
                        {/* Active Progress Line */}
                        <div 
                          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] transition-all duration-500"
                          style={{ 
                            width: `${
                              application.status === 'review-pending' ? '0%' :
                              application.status === 'interview-scheduled' ? '16.6%' :
                              application.status === 'interview-completed' ? '33.3%' :
                              application.status === 'accepted' ? '50%' :
                              application.status === 'agreement-started' ? '66.6%' :
                              application.status === 'agreement-in-progress' ? '83.3%' :
                              application.status === 'agreement-complete' ? '100%' :
                              application.status === 'rejected' ? '16.6%' : '0%'
                            }` 
                          }}
                        ></div>
                        
                        {/* Progress Steps */}
                        <div className="flex justify-between items-center relative">
                          {[
                            { 
                              id: '1', 
                              label: 'Review Pending', 
                              icon: Clock, 
                              status: application.status === 'review-pending' ? 'current' : 
                                      ['interview-scheduled', 'interview-completed', 'accepted', 'agreement-started', 'agreement-in-progress', 'agreement-complete', 'rejected'].includes(application.status) ? 'completed' : 'pending' 
                            },
                            { 
                              id: '2', 
                              label: application.status === 'rejected' ? 'Rejected' : 'Interview Scheduled', 
                              icon: application.status === 'rejected' ? X : Calendar, 
                              status: application.status === 'interview-scheduled' ? 'current' : 
                                      application.status === 'rejected' ? 'rejected' :
                                      ['interview-completed', 'accepted', 'agreement-started', 'agreement-in-progress', 'agreement-complete'].includes(application.status) ? 'completed' : 'pending'
                            },
                            { 
                              id: '3', 
                              label: 'Interview Completed', 
                              icon: CheckCircle2, 
                              status: application.status === 'interview-completed' ? 'current' :
                                      ['accepted', 'agreement-started', 'agreement-in-progress', 'agreement-complete'].includes(application.status) ? 'completed' : 'pending'
                            },
                            { 
                              id: '4', 
                              label: 'Accepted', 
                              icon: UserPlus, 
                              status: application.status === 'accepted' ? 'current' :
                                      ['agreement-started', 'agreement-in-progress', 'agreement-complete'].includes(application.status) ? 'completed' : 'pending'
                            },
                            { 
                              id: '5', 
                              label: 'Agreement Started', 
                              icon: FileText, 
                              status: application.status === 'agreement-started' ? 'current' :
                                      ['agreement-in-progress', 'agreement-complete'].includes(application.status) ? 'completed' : 'pending'
                            },
                            { 
                              id: '6', 
                              label: 'Agreement In Progress', 
                              icon: Activity, 
                              status: application.status === 'agreement-in-progress' ? 'current' :
                                      application.status === 'agreement-complete' ? 'completed' : 'pending'
                            },
                            { 
                              id: '7', 
                              label: 'Agreement Complete', 
                              icon: CheckCircle2, 
                              status: application.status === 'agreement-complete' ? 'current' : 'pending'
                            }
                          ].map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center space-y-2 relative">
                              {/* Step Circle */}
                              <div 
                                className={`
                                  w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                  ${step.status === 'current' 
                                    ? 'bg-[#114DFF] border-[#114DFF] text-white shadow-lg' 
                                    : step.status === 'completed' 
                                      ? 'bg-[#06CB1D] border-[#06CB1D] text-white' 
                                      : step.status === 'rejected'
                                        ? 'bg-[#FF220E] border-[#FF220E] text-white'
                                        : 'bg-white border-[#CCCCCC] text-gray-400'
                                  }
                                `}
                              >
                                <step.icon className="w-3 h-3" />
                              </div>
                              
                              {/* Step Label */}
                              <div className="text-center min-w-0">
                                <p className={`
                                  text-xs leading-tight
                                  ${step.status === 'current' 
                                    ? 'text-[#114DFF]' 
                                    : step.status === 'completed' 
                                      ? 'text-[#06CB1D]' 
                                      : step.status === 'rejected'
                                        ? 'text-[#FF220E]'
                                        : 'text-gray-500'
                                  }
                                `}>
                                  {step.label}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F5F5F5] rounded-lg p-4 border border-[#CCCCCC]">
                      <p className="text-sm text-gray-700 line-clamp-2">{application.message}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-gray-500">
                        <span>Next:</span> {application.nextStep}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                          onClick={() => {
                            if (application.status === 'agreement-in-progress') {
                              // Transform application data for FounderAgreementFlow
                              const transformedApp = {
                                id: application.id.toString(),
                                startupName: "My Startup", // This should come from user's profile
                                founderName: "Current User", // This should come from user's profile
                                founderEmail: "user@example.com", // This should come from user's profile
                                mentorName: application.mentorName,
                                mentorCompany: application.mentorTitle,
                                status: application.status
                              }
                              setSelectedAgreementFlowApp(transformedApp)
                              setShowAgreementFlow(true)
                            }
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {application.status === 'interview' && (
                          <Button size="sm" className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                            <Video className="w-4 h-4 mr-1" />
                            Join Interview
                          </Button>
                        )}
                        {application.status === 'agreement-started' && (
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedAgreementApp(application)
                              setShowAgreements(true)
                            }}
                            className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Agreements
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </>
    );
  };

  // Helper function to render My Mentors content
  const renderMyMentorsContent = () => (
    <>
      {acceptedMentors.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No active mentorships</h3>
            <p className="text-sm text-muted-foreground">Once your applications are accepted, they'll appear here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {acceptedMentors.map((mentor) => (
            <Card key={mentor.id}>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Mentor Header */}
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16 ring-2 ring-[#C8D6FF]/30">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-lg">
                        {mentor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg">{mentor.name}</h4>
                          <p className="text-gray-500">{mentor.title}</p>
                          <p className="text-sm text-gray-700 mt-2 line-clamp-2">{mentor.bio}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] mb-2">
                            Active since {mentor.mentorshipStart}
                          </Badge>
                          <p className="text-sm text-gray-500">Next meeting: {mentor.nextMeeting}</p>
                        </div>
                      </div>

                      {/* Expertise */}
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}


                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                    <Button className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedMentorForDashboard(mentor)
                        setShowMentorDashboard(true)
                      }}
                      className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Mentor Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
     
      

      {/* Conditionally render tabs or show specific subsection */}
      {subSection === 'my-applications' ? (
        // Show only My Applications content without tabs when accessed from left nav
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">My Applications</h3>
            <p className="text-muted-foreground">Track your mentor application progress and manage communications</p>
          </div>
          {renderMyApplicationsContent()}
        </div>
      ) : subSection === 'my-mentors' ? (
        // Show only My Mentors content without tabs when accessed from left nav
        <div className="space-y-6">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">My Mentors</h3>
            <p className="text-muted-foreground">Manage your active mentorship relationships and track progress</p>
          </div>
          {renderMyMentorsContent()}
        </div>
      ) : (
        // Show full tabs interface for normal navigation
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="find-mentor" className="space-x-2">
              <Search className="w-4 h-4" />
              <span>Find a Mentor</span>
            </TabsTrigger>
            <TabsTrigger value="my-applications" className="space-x-2">
              <FileText className="w-4 h-4" />
              <span>My Applications</span>
            </TabsTrigger>
            <TabsTrigger value="my-mentors" className="space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>My Mentors</span>
            </TabsTrigger>
          </TabsList>

        {/* Find a Mentor Tab */}
        <TabsContent value="find-mentor" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search mentors by name, expertise, or industry..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Mentors Grid */}
          <div className="space-y-4">
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>

          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No mentors found</h3>
              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </TabsContent>

          {/* My Applications Tab */}
          <TabsContent value="my-applications" className="space-y-6">
            {renderMyApplicationsContent()}
          </TabsContent>

          {/* My Mentors Tab */}
          <TabsContent value="my-mentors" className="space-y-6">
            {renderMyMentorsContent()}
          </TabsContent>
        </Tabs>
      )}

      {/* Mentor Profile Modal */}
      {showMentorProfile && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-[#C8D6FF] bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-16 h-16 ring-2 ring-[#EDF2FF] border-2 border-[#C8D6FF]">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-xl">
                        {selectedMentor.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold text-gray-900 mb-0.5">{selectedMentor.name}</h2>
                    <p className="text-sm text-gray-600">{selectedMentor.title}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] text-xs">
                    Verified Mentor
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setShowMentorProfile(false)} className="h-7 w-7 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3 pt-3 px-4 pb-4">
              {/* Basic Information */}
              <div className="border-2 border-[#C8D6FF] rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#114DFF] rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Basic information</h3>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-[#C8D6FF]">
                    <AvatarFallback className="bg-[#F5F5F5] text-gray-600 text-xl">
                      {selectedMentor.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMentor.name}</p>
                    <p className="text-sm text-gray-600">{selectedMentor.title}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>Mumbai, India</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="border-2 border-[#C8D6FF] rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#114DFF] rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">About</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  15+ years building financial technology solutions across India. Founded two successful fintech 
                  startups, with expertise in digital payments, lending platforms, and regulatory compliance. Passionate 
                  about mentoring the next generation of entrepreneurs.
                </p>
              </div>

              {/* Experience */}
              <div className="border-2 border-[#C8D6FF] rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#114DFF] rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
                      <div className="w-px h-full bg-[#C8D6FF] mt-1"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-gray-900">Co-Founder & CEO</p>
                      <p className="text-sm text-[#114DFF]">PayNext Solutions</p>
                      <p className="text-xs text-gray-500 mt-1">2019 - Present</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Leading India's fastest-growing B2B payment platform with $50M+ ARR
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
                      <div className="w-px h-full bg-[#C8D6FF] mt-1"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-gray-900">Co-Founder & CEO</p>
                      <p className="text-sm text-[#114DFF]">PayNext Solutions</p>
                      <p className="text-xs text-gray-500 mt-1">2019 - Present</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Leading India's fastest-growing B2B payment platform with $50M+ ARR
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-[#114DFF] rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Co-Founder & CEO</p>
                      <p className="text-sm text-[#114DFF]">PayNext Solutions</p>
                      <p className="text-xs text-gray-500 mt-1">2019 - Present</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Leading India's fastest-growing B2B payment platform with $50M+ ARR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mentorship Focus */}
              <div className="border-2 border-[#C8D6FF] rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#114DFF] rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Mentorship Focus</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Industry Focus</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-[#114DFF] text-white border-[#114DFF]">
                        Fintech
                      </Badge>
                      <Badge variant="outline" className="bg-[#114DFF] text-white border-[#114DFF]">
                        SaaS
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Functional Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                        Product Management
                      </Badge>
                      <Badge variant="outline" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                        Strategy
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-[#06CB1D] rounded-full"></div>
                    <span className="text-gray-600">Availability: 17h / wk</span>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="border-2 border-[#C8D6FF] rounded-2xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-[#114DFF] rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Socials</h3>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-[#C8D6FF] hover:bg-[#EDF2FF]" title="LinkedIn">
                    <Linkedin className="w-5 h-5 text-[#114DFF]" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-[#C8D6FF] hover:bg-[#EDF2FF]" title="Website">
                    <Globe className="w-5 h-5 text-[#114DFF]" />
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-[#C8D6FF] hover:bg-[#EDF2FF]" title="X (Twitter)">
                    <Twitter className="w-5 h-5 text-[#114DFF]" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]" size="lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Request Mentorship
                </Button>
                
                
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Agreements Modal */}
      {showAgreements && selectedAgreementApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto border-[#C8D6FF]">
            <CardHeader className="border-b border-[#C8D6FF]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                      {selectedAgreementApp.mentorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Agreement Terms Negotiation</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedAgreementApp.mentorName} • {selectedAgreementApp.mentorTitle}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAgreements(false)} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 p-6">
              {/* Process Overview */}
              <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                <h4 className="text-[#114DFF] mb-2">Terms Negotiation</h4>
                <p className="text-gray-700 text-sm">
                  {selectedAgreementApp.mentorName} has proposed terms for your mentorship. Review the terms below and either accept or propose changes.
                </p>
              </div>

              {/* Current Terms (Latest Version) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3>Current Terms (Version 1)</h3>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending Your Response
                  </Badge>
                </div>

                <Card className="border-[#C8D6FF] bg-[#F7F9FF]">
                  <CardContent className="p-6 space-y-5">
                    {/* Terms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Tenure</p>
                        <p className="text-xl font-semibold text-gray-900">12 months</p>
                      </div>
                      <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Equity Percentage</p>
                        <p className="text-xl font-semibold text-[#114DFF]">2.5%</p>
                      </div>
                      <div className="p-4 bg-white border border-[#C8D6FF] rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                        <p className="text-xl font-semibold text-gray-900">Mentor</p>
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <p className="text-sm text-gray-900 font-semibold mb-2">Mentor Deliverables:</p>
                      <div className="bg-white border border-[#C8D6FF] rounded-lg p-4">
                        <p className="text-sm text-gray-700 whitespace-pre-line">
{`• Weekly 1-on-1 mentorship sessions (every Monday, 1 hour)
• Access to enterprise client network and warm introductions
• Strategic guidance on scaling operations
• Quarterly business reviews with detailed performance analysis
• Introduction to potential investors in our network
• Access to mentor's technical advisory board`}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                      <Button 
                        className="flex-1 bg-[#06CB1D] hover:bg-[#059e17] text-white"
                        onClick={() => {
                          toast.success("Terms Accepted!", {
                            description: `You have accepted the terms from ${selectedAgreementApp.mentorName}. The mentor will be notified and final agreement documents will be prepared.`,
                            duration: 5000,
                          });
                          setShowAgreements(false);
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Accept Terms
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-[#114DFF] text-[#114DFF] hover:bg-[#EDF2FF]"
                        onClick={() => {
                          // Pre-fill with current values
                          setCounterTenure("12");
                          setCounterEquity("2.5");
                          setCounterDeliverables(`• Weekly 1-on-1 mentorship sessions (every Monday, 1 hour)
• Access to enterprise client network and warm introductions
• Strategic guidance on scaling operations
• Quarterly business reviews with detailed performance analysis
• Introduction to potential investors in our network
• Access to mentor's technical advisory board`);
                          setShowCounterProposal(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Propose Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Version History */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#114DFF]" />
                  Negotiation History
                </h3>

                <div className="space-y-3">
                  {/* Version 1 */}
                  <Card className="border-[#C8D6FF]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                            Version 1
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                            Pending Your Response
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Tenure</p>
                          <p className="font-medium text-gray-900">12 months</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Equity</p>
                          <p className="font-medium text-gray-900">2.5%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Submitted By</p>
                          <p className="font-medium text-gray-900">Mentor</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Info Note */}
              <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                <h5 className="text-gray-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#114DFF]" />
                  Important Information
                </h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• Review all terms carefully before accepting</li>
                  <li>• You can propose changes which will be sent back to the mentor</li>
                  <li>• All negotiation versions are tracked and visible to both parties</li>
                  <li>• Once both parties agree on the same terms, final documents will be prepared</li>
                  <li>• When terms are finalized, our team will coordinate to complete agreement closure</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                <Button variant="outline" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact {selectedAgreementApp.mentorName}
                </Button>
                <Button variant="outline" onClick={() => setShowAgreements(false)} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Counter-Proposal Modal */}
      <Dialog open={showCounterProposal} onOpenChange={setShowCounterProposal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#114DFF]" />
              Propose Counter-Terms
            </DialogTitle>
            <DialogDescription>
              Modify the terms and propose changes to your mentor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Process Overview */}
            <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
              <h4 className="text-[#114DFF] mb-2">Counter-Proposal</h4>
              <p className="text-gray-700 text-sm">
                Adjust the terms below to propose your counter-offer. Once submitted, your mentor will be notified and can review your proposed changes.
              </p>
            </div>

            {/* Counter-Proposal Form */}
            <div className="space-y-5">
              {/* Tenure */}
              <div className="space-y-2">
                <Label htmlFor="counter-tenure">Tenure (Months) *</Label>
                <Input
                  id="counter-tenure"
                  type="number"
                  value={counterTenure}
                  onChange={(e) => setCounterTenure(e.target.value)}
                  placeholder="12"
                  className="bg-[#F7F9FF] border-[#C8D6FF]"
                />
                <p className="text-xs text-gray-500">Duration of the mentorship/incubation program</p>
              </div>

              {/* Equity Percentage */}
              <div className="space-y-2">
                <Label htmlFor="counter-equity">Equity Percentage *</Label>
                <div className="relative">
                  <Input
                    id="counter-equity"
                    type="number"
                    step="0.1"
                    value={counterEquity}
                    onChange={(e) => setCounterEquity(e.target.value)}
                    placeholder="2.5"
                    className="bg-[#F7F9FF] border-[#C8D6FF] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                
                {/* Equity Validation Indicator */}
                {counterEquity && (
                  <div className={`flex items-center gap-2 text-sm ${getEquityValidation(parseFloat(counterEquity)).color}`}>
                    {getEquityValidation(parseFloat(counterEquity)).status === "optimal" && <CheckCircle2 className="w-4 h-4" />}
                    {(getEquityValidation(parseFloat(counterEquity)).status === "too-low" || 
                      getEquityValidation(parseFloat(counterEquity)).status === "too-high") && <AlertCircle className="w-4 h-4" />}
                    <span>{getEquityValidation(parseFloat(counterEquity)).message}</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">Standard equity is 2.5%. Adjust based on your needs.</p>
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <Label htmlFor="counter-deliverables">Deliverables from Mentor *</Label>
                <textarea
                  id="counter-deliverables"
                  value={counterDeliverables}
                  onChange={(e) => setCounterDeliverables(e.target.value)}
                  placeholder="Enter each deliverable on a new line:
• Weekly 1-on-1 mentorship sessions
• Access to investor network
• Strategic guidance on product development"
                  className="w-full min-h-[200px] p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#114DFF]"
                />
                <p className="text-xs text-gray-500">List all services and support you expect from the mentor</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
              <Button
                variant="outline"
                className="flex-1 border-[#CCCCCC] hover:bg-[#F5F5F5]"
                onClick={() => {
                  setShowCounterProposal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // In production, this would submit counter-proposal
                  toast.success("Counter-Proposal Submitted!", {
                    description: `Your proposed changes have been sent to ${selectedAgreementApp?.mentorName || 'your mentor'}. They will be notified via email and can review your counter-offer in their dashboard.`,
                    duration: 5000,
                  });
                  setShowCounterProposal(false);
                  
                  // In production:
                  // 1. Create Version 2 with founder's proposed changes
                  // 2. Send email notification to mentor
                  // 3. Update mentor's dashboard with new version
                  // 4. Update founder's agreement view with Version 2
                }}
                disabled={!counterTenure || !counterEquity || !counterDeliverables}
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
                <li>• Your counter-proposal will be sent to your mentor via email</li>
                <li>• This will create Version 2 in the negotiation history</li>
                <li>• Your mentor can accept or propose further changes</li>
                <li>• All versions are tracked for transparency</li>
                <li>• Agreement finalizes when both parties accept the same terms</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mentor Dashboard Modal */}
      {showMentorDashboard && selectedMentorForDashboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-lg">
                      {selectedMentorForDashboard.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">Mentor Dashboard</CardTitle>
                    <p className="text-muted-foreground">
                      Mentorship with {selectedMentorForDashboard.name} • {selectedMentorForDashboard.title}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowMentorDashboard(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <div className="flex flex-col h-[calc(95vh-120px)]">
              {/* Dashboard Navigation */}
              <Tabs value={dashboardActiveTab} onValueChange={setDashboardActiveTab} className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3 m-6 mb-0 flex-shrink-0">
                  <TabsTrigger value="kpis" className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4" />
                    <span>KPIs & Metrics</span>
                  </TabsTrigger>
                  <TabsTrigger value="updates" className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Monthly Updates</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Documents</span>
                  </TabsTrigger>
                </TabsList>

                {/* KPIs Tab */}
                <TabsContent value="kpis" className="flex-1 overflow-y-auto p-6 pt-4 min-h-0">
                  <div className="space-y-6">
                    {/* KPI Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Key Performance Indicators</h3>
                        <p className="text-muted-foreground">Track your startup's progress and share metrics with your mentor</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Activity className="w-3 h-3 mr-1" />
                          Last Updated: {kpiData[1]?.lastUpdated}
                        </Badge>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Next Update: {kpiData[1]?.nextUpdate}
                        </Badge>
                        <Button size="sm" onClick={() => setShowMetricsUploadModal(true)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Update Metrics
                        </Button>
                      </div>
                    </div>

                    {/* KPI Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kpiData[1]?.metrics.map((metric, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{metric.name}</h4>
                                <div className={`
                                  flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                                  ${metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                `}>
                                  {metric.trend === 'up' ? 
                                    <ArrowUp className="w-3 h-3" /> : 
                                    <ArrowDown className="w-3 h-3" />
                                  }
                                  <span>
                                    {Math.abs(((metric.current - metric.previous) / metric.previous) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl font-bold text-gray-900">
                                    {metric.unit === '$' ? '$' : ''}{metric.current.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    vs {metric.unit === '$' ? '$' : ''}{metric.previous.toLocaleString()}{metric.unit === '%' ? '%' : ''} last month
                                  </span>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-gray-600">
                                    <span>Progress to Target</span>
                                    <span>
                                      {metric.unit === '$' ? '$' : ''}{metric.target.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`
                                        h-2 rounded-full transition-all duration-300
                                        ${(metric.current / metric.target) >= 1 ? 'bg-green-500' : 
                                          (metric.current / metric.target) >= 0.8 ? 'bg-blue-500' : 'bg-orange-500'}
                                      `}
                                      style={{ 
                                        width: `${Math.min((metric.current / metric.target) * 100, 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-blue-900">Metrics Update Reminder</h4>
                            <p className="text-blue-700 mt-1">Keep your mentor informed with regular updates every 15 days</p>
                          </div>
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              View Trends
                            </Button>
                            <Button size="sm">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Update Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Updates Tab */}
                <TabsContent value="updates" className="flex-1 overflow-y-auto p-6 pt-4 min-h-0">
                  <div className="space-y-6">
                    {/* Updates Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Monthly Updates</h3>
                        <p className="text-muted-foreground">Send comprehensive updates to your mentor every month</p>
                      </div>
                      <Button onClick={() => setShowMonthlyUpdateForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Update
                      </Button>
                    </div>

                    {/* Create Update Form */}
                    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <Edit3 className="w-8 h-8 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">Ready for Your September Update?</h4>
                            <p className="text-blue-700 mt-1">Share your progress, challenges, and goals with {selectedMentorForDashboard.name}</p>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowMonthlyUpdateForm(true)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Start Writing Update
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Previous Updates */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Previous Updates</h4>
                      
                      {updatesData[1]?.map((update) => (
                        <Card key={update.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-semibold text-lg">{update.month}</h5>
                                  <p className="text-sm text-gray-500">Sent on {update.created}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Sent
                                  </Badge>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedUpdateToView(update)}>
                                    <Eye className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h6 className="font-medium text-green-800 mb-2">Key Highlights</h6>
                                  <p className="text-sm text-gray-700">{update.highlights}</p>
                                </div>
                                <div>
                                  <h6 className="font-medium text-orange-800 mb-2">Main Challenges</h6>
                                  <p className="text-sm text-gray-700">{update.challenges}</p>
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h6 className="font-medium mb-2">Key Metrics</h6>
                                <p className="text-sm text-gray-700">{update.metrics}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="flex-1 overflow-y-auto p-6 pt-4 min-h-0">
                  <div className="space-y-6">
                    {/* Documents Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">Document Repository</h3>
                        <p className="text-muted-foreground">Manage and share important documents with your mentor</p>
                      </div>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>

                    {/* Upload Area */}
                    <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
                      <CardContent className="p-8">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700">Drag and drop files here</h4>
                            <p className="text-gray-500 text-sm mt-1">or click to browse your computer</p>
                          </div>
                          <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Files
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Document Categories */}
                    <div className="space-y-4">
                      {/* Agreements Section */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                          Signed Agreements (2)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {documentsData[1]?.filter(doc => doc.isAgreement).map((doc) => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                      <FileCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium">{doc.name}</h5>
                                      <p className="text-sm text-gray-500">{doc.category} • {doc.size}</p>
                                      <p className="text-xs text-gray-400 mt-1">Signed on {doc.uploadDate}</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Other Documents */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          Shared Documents (4)
                        </h4>
                        <div className="space-y-3">
                          {documentsData[1]?.filter(doc => !doc.isAgreement).map((doc) => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className={`
                                      w-10 h-10 rounded-lg flex items-center justify-center
                                      ${doc.category === 'Strategy' ? 'bg-purple-100 text-purple-600' :
                                        doc.category === 'Finance' ? 'bg-green-100 text-green-600' :
                                        doc.category === 'Product' ? 'bg-blue-100 text-blue-600' :
                                        'bg-gray-100 text-gray-600'}
                                    `}>
                                      <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h5 className="font-medium">{doc.name}</h5>
                                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <span>{doc.category}</span>
                                        <span>•</span>
                                        <span>{doc.size}</span>
                                        <span>•</span>
                                        <span>Uploaded {doc.uploadDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                    <Button variant="outline" size="sm">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      )}

      {/* Metrics Upload Modal */}
      <Dialog open={showMetricsUploadModal} onOpenChange={setShowMetricsUploadModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Upload className="w-6 h-6 text-[#114DFF]" />
              Update Metrics
            </DialogTitle>
            <DialogDescription>
              Upload your metrics sheet to keep your mentor informed of your progress
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Sample Format Download */}
            <Card className="bg-[#EDF2FF] border-[#C8D6FF]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#114DFF] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Download Sample Format</h4>
                      <p className="text-sm text-gray-600">Use this template to format your metrics correctly</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-[#C8D6FF] hover:bg-[#F7F9FF]"
                    onClick={() => {
                      // In production, this would trigger actual file download
                      const link = document.createElement('a');
                      link.href = '#'; // Replace with actual template file URL
                      link.download = 'metrics_template.xlsx';
                      // link.click();
                      alert('Sample format download would start here. Template includes columns: Metric Name, Current Value, Previous Value, Target Value, Unit');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* File Upload Area */}
            <div
              className={`
                border-2 border-dashed rounded-xl p-8 transition-all duration-200
                ${isDragging 
                  ? 'border-[#114DFF] bg-[#EDF2FF]' 
                  : selectedMetricsFile 
                    ? 'border-[#06CB1D] bg-green-50' 
                    : 'border-[#C8D6FF] bg-[#F7F9FF]'
                }
              `}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                  setSelectedMetricsFile(files[0]);
                }
              }}
            >
              <div className="text-center space-y-4">
                {selectedMetricsFile ? (
                  <>
                    {/* File Selected State */}
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-[#06CB1D]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-lg">{selectedMetricsFile.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">
                        {(selectedMetricsFile.size / 1024).toFixed(2)} KB • Ready to upload
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMetricsFile(null)}
                      className="border-[#CCCCCC]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove File
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Upload State */}
                    <div className="w-16 h-16 bg-[#EDF2FF] rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-[#114DFF]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-lg">Drag and drop your metrics file here</h4>
                      <p className="text-gray-500 mt-1">or click to browse your computer</p>
                      <p className="text-xs text-gray-400 mt-2">Supports: .xlsx, .xls, .csv (Max 10MB)</p>
                    </div>
                    <Input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setSelectedMetricsFile(files[0]);
                        }
                      }}
                      className="hidden"
                      id="metrics-file-input"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('metrics-file-input')?.click()}
                      className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 border-[#CCCCCC] hover:bg-[#F5F5F5]"
                onClick={() => {
                  setShowMetricsUploadModal(false);
                  setSelectedMetricsFile(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                disabled={!selectedMetricsFile}
                onClick={() => {
                  // In production, this would upload the file
                  if (selectedMetricsFile) {
                    alert(`Metrics file "${selectedMetricsFile.name}" would be uploaded here. The file would be processed and metrics would be updated in the dashboard.`);
                    setShowMetricsUploadModal(false);
                    setSelectedMetricsFile(null);
                  }
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Metrics
              </Button>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1">Upload Guidelines:</p>
                <ul className="space-y-1 list-disc list-inside text-gray-600">
                  <li>Use the provided template format for best results</li>
                  <li>Include metrics: Revenue, Users, MRR, Burn Rate, Growth Rate, etc.</li>
                  <li>Metrics will be visible to your mentor immediately after upload</li>
                  <li>You can update metrics every 15 days</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Monthly Update Form Modal */}
      <Dialog open={showMonthlyUpdateForm} onOpenChange={setShowMonthlyUpdateForm}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Edit3 className="w-6 h-6 text-[#114DFF]" />
              Create Monthly Update
            </DialogTitle>
            <DialogDescription>
              Share comprehensive progress update with your mentor
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pt-4">
            {/* Month Selection */}
            <div className="space-y-2">
              <Label htmlFor="update-month">Update Month *</Label>
              <Input 
                id="update-month" 
                type="month" 
                className="bg-[#F7F9FF] border-[#C8D6FF]"
                placeholder="Select month"
              />
            </div>

            {/* Key Metrics Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#114DFF]" />
                <h3 className="font-semibold text-lg">Key Metrics</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* MRR Metric */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-green-800 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      MRR (Monthly Recurring Revenue)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Current Value ($)</Label>
                        <Input type="number" placeholder="25000" className="bg-white border-green-300 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Change (%)</Label>
                        <Input type="number" placeholder="+13.6" className="bg-white border-green-300 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Users Metric */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-blue-800 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Active Users
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Current Value</Label>
                        <Input type="number" placeholder="1250" className="bg-white border-blue-300 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Change (%)</Label>
                        <Input type="number" placeholder="+23.0" className="bg-white border-blue-300 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Runway Metric */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-red-800 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Runway (Months)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Months</Label>
                        <Input type="number" placeholder="18" className="bg-white border-red-300 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Burn Rate ($k/mo)</Label>
                        <Input type="number" placeholder="45.0" className="bg-white border-red-300 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CAC Metric */}
                <Card className="bg-teal-50 border-teal-200">
                  <CardContent className="p-4 space-y-3">
                    <Label className="text-teal-800 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      CAC (Customer Acquisition Cost)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-gray-600">Current Value ($)</Label>
                        <Input type="number" placeholder="150" className="bg-white border-teal-300 mt-1" />
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">LTV ($k)</Label>
                        <Input type="number" placeholder="2.4" className="bg-white border-teal-300 mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="space-y-3">
              <Label htmlFor="highlights" className="flex items-center gap-2 text-[#06CB1D]">
                <CheckCircle2 className="w-5 h-5" />
                Key Highlights *
              </Label>
              <Textarea 
                id="highlights"
                placeholder="Successfully closed our largest enterprise deal worth $120k ARR. Launched new analytics dashboard feature which has seen 40% adoption rate among existing customers. Team expanded with two senior engineers."
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[100px]"
              />
            </div>

            {/* Challenges */}
            <div className="space-y-3">
              <Label htmlFor="challenges" className="flex items-center gap-2 text-[#FF220E]">
                <AlertCircle className="w-5 h-5" />
                Challenges *
              </Label>
              <Textarea 
                id="challenges"
                placeholder="Customer acquisition costs increased due to competitive market conditions. Some challenges with customer onboarding flow leading to slight increase in early churn."
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[100px]"
              />
            </div>

            {/* Key Milestones Achieved */}
            <div className="space-y-3">
              <Label htmlFor="milestones" className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#06CB1D]" />
                Key Milestones Achieved *
              </Label>
              <Textarea 
                id="milestones"
                placeholder="Enter each milestone on a new line:
• Closed $120k enterprise deal with TechCorp
• Launched analytics dashboard feature
• Hired 2 senior engineers
• Reached 1,250 active users milestone"
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[120px]"
              />
              <p className="text-xs text-gray-500">Enter each milestone on a new line starting with •</p>
            </div>

            {/* Upcoming Milestones */}
            <div className="space-y-3">
              <Label htmlFor="upcoming-milestones" className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#114DFF]" />
                Upcoming Milestones *
              </Label>
              <Textarea 
                id="upcoming-milestones"
                placeholder="Enter each milestone on a new line:
• Launch mobile app beta
• Close Series A funding round
• Expand to European market
• Release API v2.0"
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[120px]"
              />
              <p className="text-xs text-gray-500">Enter each milestone on a new line starting with •</p>
            </div>

            {/* Team Updates */}
            <div className="space-y-3">
              <Label htmlFor="team-updates" className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#114DFF]" />
                Team Updates
              </Label>
              <Textarea 
                id="team-updates"
                placeholder="Added Sarah Kim as Head of Sales and John Doe as Senior Backend Engineer. Team is now 12 people strong."
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[80px]"
              />
            </div>

            {/* Fundraising Update */}
            <div className="space-y-3">
              <Label htmlFor="fundraising" className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#06CB1D]" />
                Fundraising Update
              </Label>
              <Textarea 
                id="fundraising"
                placeholder="Series A round progressing well. Have term sheets from 2 VCs, expecting to close $3M round by end of Q1."
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[80px]"
              />
            </div>

            {/* Ask from Investors */}
            <div className="space-y-3">
              <Label htmlFor="ask-investors" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#114DFF]" />
                Ask from Investors/Mentor
              </Label>
              <Textarea 
                id="ask-investors"
                placeholder="Introductions to potential enterprise customers in fintech space. Guidance on European market entry strategy."
                className="bg-[#F7F9FF] border-[#C8D6FF] min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
              <Button
                variant="outline"
                className="flex-1 border-[#CCCCCC] hover:bg-[#F5F5F5]"
                onClick={() => setShowMonthlyUpdateForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                onClick={() => {
                  // In production, this would save the update
                  alert('Monthly update would be saved and sent to your mentor. The update will appear in the "Previous Updates" section with a "Submitted" badge.');
                  setShowMonthlyUpdateForm(false);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Update
              </Button>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-3 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900 mb-1">Update Guidelines:</p>
                <ul className="space-y-1 list-disc list-inside text-gray-600">
                  <li>Fill in all required fields marked with *</li>
                  <li>Be specific and quantify achievements where possible</li>
                  <li>Updates are shared directly with your mentor</li>
                  <li>You can submit one update per month</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Monthly Update View Modal */}
      {selectedUpdateToView && (
        <Dialog open={!!selectedUpdateToView} onOpenChange={() => setSelectedUpdateToView(null)}>
          <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="w-6 h-6 text-[#114DFF]" />
                    Monthly Update - {selectedUpdateToView.month}
                  </DialogTitle>
                  <DialogDescription>
                    Submitted on {selectedUpdateToView.created}
                  </DialogDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-[#06CB1D] border-green-200">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  {selectedUpdateToView.status === 'sent' ? 'Sent' : 'Draft'}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Key Metrics Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#C8D6FF]">
                  <BarChart3 className="w-5 h-5 text-[#114DFF]" />
                  <h3 className="font-semibold text-lg">Key Metrics</h3>
                </div>
                
                <Card className="bg-[#F7F9FF] border-[#C8D6FF]">
                  <CardContent className="p-5">
                    <p className="text-gray-700">{selectedUpdateToView.metrics}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Key Highlights */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#06CB1D]" />
                  <h3 className="font-semibold text-lg text-[#06CB1D]">Key Highlights</h3>
                </div>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-5">
                    <p className="text-gray-700 leading-relaxed">{selectedUpdateToView.highlights}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Challenges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#FF220E]" />
                  <h3 className="font-semibold text-lg text-[#FF220E]">Challenges</h3>
                </div>
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-5">
                    <p className="text-gray-700 leading-relaxed">{selectedUpdateToView.challenges}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Next Goals / Upcoming Milestones */}
              {selectedUpdateToView.nextGoals && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#114DFF]" />
                    <h3 className="font-semibold text-lg">Upcoming Milestones</h3>
                  </div>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-5">
                      <p className="text-gray-700 leading-relaxed">{selectedUpdateToView.nextGoals}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Full Content Section */}
              {selectedUpdateToView.content && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#C8D6FF]">
                    <MessageSquare className="w-5 h-5 text-[#114DFF]" />
                    <h3 className="font-semibold text-lg">Full Update</h3>
                  </div>
                  <Card className="bg-[#F7F9FF] border-[#C8D6FF]">
                    <CardContent className="p-5">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedUpdateToView.content}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                <Button
                  variant="outline"
                  className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                  onClick={() => setSelectedUpdateToView(null)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                  onClick={() => {
                    // In production, this would trigger print/PDF export
                    alert('Export functionality would generate a PDF of this update.');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                  onClick={() => {
                    // In production, this would open email composer
                    alert('Email functionality would allow you to send this update to additional recipients.');
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Share Update
                </Button>
              </div>

              {/* Info Note */}
              <div className="flex items-start gap-3 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-1">Update Status:</p>
                  <ul className="space-y-1 list-disc list-inside text-gray-600">
                    <li>This update has been sent to your mentor</li>
                    <li>Submitted on {selectedUpdateToView.created}</li>
                    <li>Your mentor can view this update in their portfolio dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}