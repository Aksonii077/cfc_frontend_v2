import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Calendar, 
  ExternalLink, 
  MessageSquare,
  Eye,
  DollarSign,
  RefreshCw,
  Search,
  Building2,
  MapPin,
  Clock
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  LeadWithNeed,
  getLeadStatusInfo, 
  getTimeAgo, 
  getCategoryInfo, 
  getTypeInfo, 
  formatBudget, 
  formatSkillsOffered 
} from '../../config/needsLeads.config'
import { projectId } from '../../utils/supabase/info'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true

// Mock MyLeads Data (leads I submitted)
const MOCK_MY_LEADS: LeadWithNeed[] = [
  {
    id: 'my-lead-1',
    needId: 'need-1',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Freelancer',
    coverMessage: 'Hi Alex! I\'m excited about your HealthTech project. As a UX designer with 5+ years of experience, I\'ve worked on several healthcare applications and understand the unique challenges of designing for wellness platforms.',
    proposedSolution: 'I would start with user research to understand your target audience\'s pain points, then create user personas and journey maps. I\'d design wireframes for key user flows, followed by high-fidelity mockups in Figma.',
    portfolio: 'https://myportfolio.com',
    relevantExperience: 'I\'ve designed UIs for 3 healthcare startups including MedTrack (patient monitoring) and WellnessAI (nutrition tracking). I specialize in accessibility-first design.',
    availability: 'Available to start immediately. Can commit 25-30 hours per week for the next 6 weeks.',
    skillsOffering: ['UI/UX Design', 'User Research', 'Figma', 'Design Systems', 'Healthcare UX'],
    status: 'shortlisted',
    appliedAt: '2024-08-11T09:30:00Z',
    statusUpdatedAt: '2024-08-12T14:20:00Z',
    notes: 'Great portfolio review! Looking forward to the next steps.',
    messageCount: 3,
    need: {
      id: 'need-1',
      title: 'Website UI/UX Design for HealthTech Startup',
      description: 'Looking for an experienced UI/UX designer to create a modern, user-friendly interface for our wellness platform.',
      category: 'design',
      skillsRequired: ['UI/UX Design', 'Figma', 'Design Systems', 'Mobile Design', 'Accessibility'],
      type: 'barter',
      skillsOffered: ['Marketing Strategy', 'Growth Hacking', 'SEO Optimization', 'Content Strategy'],
      duration: '4-6 weeks',
      urgency: 'medium',
      location: 'San Francisco, CA',
      isRemote: true,
      postedBy: 'founder-1',
      posterName: 'Alex Rodriguez',
      posterRole: 'Founder',
      posterCompany: 'AI Wellness Solutions',
      status: 'active',
      createdAt: '2024-08-10T10:30:00Z',
      updatedAt: '2024-08-10T10:30:00Z',
      expiresAt: '2024-09-10T10:30:00Z',
      leadCount: 8,
      viewCount: 45
    }
  },
  {
    id: 'my-lead-2',
    needId: 'need-3',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Freelancer',
    coverMessage: 'Hello! I\'m interested in helping with your content marketing strategy. I have experience in B2B SaaS content and would love to contribute to your growth.',
    proposedSolution: 'I would start by conducting a content audit of your existing materials, then develop a comprehensive content strategy aligned with your business goals. I\'d create a content calendar and begin producing high-quality blog posts.',
    portfolio: 'https://mycontentportfolio.com',
    relevantExperience: 'I\'ve created content strategies for 5 SaaS companies, resulting in 150% average increase in organic traffic. I specialize in technical content that converts.',
    availability: 'Can start next week and commit 15-20 hours per week for ongoing collaboration.',
    skillsOffering: ['Content Writing', 'SEO Strategy', 'Analytics', 'Email Marketing'],
    status: 'pending',
    appliedAt: '2024-08-13T16:30:00Z',
    statusUpdatedAt: '2024-08-13T16:30:00Z',
    notes: '',
    messageCount: 0,
    need: {
      id: 'need-3',
      title: 'Content Marketing Strategy & Blog Writing',
      description: 'Looking for a content marketing expert to develop our content strategy and write engaging blog posts.',
      category: 'marketing',
      skillsRequired: ['Content Marketing', 'Blog Writing', 'SEO', 'B2B Marketing', 'Analytics'],
      type: 'barter',
      skillsOffered: ['Product Design', 'User Research', 'Prototyping', 'Design Thinking'],
      duration: '3 months (ongoing)',
      urgency: 'low',
      isRemote: true,
      postedBy: 'service-provider-1',
      posterName: 'Michael Chen',
      posterRole: 'Service Provider',
      posterCompany: 'DesignFlow Studio',
      status: 'active',
      createdAt: '2024-08-08T09:15:00Z',
      updatedAt: '2024-08-08T09:15:00Z',
      expiresAt: '2024-10-08T09:15:00Z',
      leadCount: 6,
      viewCount: 32
    }
  },
  {
    id: 'my-lead-3',
    needId: 'need-2',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Freelancer',
    coverMessage: 'Hi Sarah! I\'m a React developer with extensive e-commerce experience. I\'ve built several online stores and am excited about your platform.',
    proposedSolution: 'I would set up the project with Next.js 13+ using the app router, implement the product catalog with search/filtering, shopping cart with state management, and integrate with Stripe for payments.',
    portfolio: 'https://mydevportfolio.com',
    relevantExperience: 'I\'ve built 3 e-commerce platforms in the last year, including a fashion store that handles 500+ orders per day. Experienced with payment integrations and performance optimization.',
    availability: 'Available to start immediately. Can work 30-35 hours/week for the next 10 weeks.',
    proposedRate: '$5,000 total (within your budget range)',
    status: 'rejected',
    appliedAt: '2024-08-12T11:15:00Z',
    statusUpdatedAt: '2024-08-14T10:30:00Z',
    notes: 'Thank you for your interest. We decided to go with another candidate who had more specific experience with our tech stack.',
    messageCount: 1,
    need: {
      id: 'need-2',
      title: 'React Developer for E-commerce Platform',
      description: 'Need a skilled React developer to build the frontend for our new e-commerce platform.',
      category: 'development',
      skillsRequired: ['React', 'Next.js', 'TypeScript', 'E-commerce', 'Payment Integration'],
      type: 'paid',
      budget: '$4,000 - $6,000',
      budgetType: 'fixed',
      duration: '8-10 weeks',
      urgency: 'high',
      isRemote: true,
      postedBy: 'founder-2',
      posterName: 'Sarah Kim',
      posterRole: 'Founder',
      posterCompany: 'RetailTech Innovations',
      status: 'active',
      createdAt: '2024-08-12T14:20:00Z',
      updatedAt: '2024-08-12T14:20:00Z',
      expiresAt: '2024-09-12T14:20:00Z',
      leadCount: 12,
      viewCount: 78
    }
  },
  {
    id: 'my-lead-4',
    needId: 'need-4',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Service Provider',
    applicantCompany: 'Business Consulting Pro',
    coverMessage: 'Hi Jessica! I\'m a business consultant with extensive experience in fintech startups and Series A fundraising. I\'ve helped 12 startups successfully raise funding in the past 3 years.',
    proposedSolution: 'I would start with a comprehensive review of your current business plan, then refine your value proposition and financial projections. I\'d create a compelling pitch deck that tells your story and highlights your traction.',
    portfolio: 'https://biz-consulting-pro.com/portfolio',
    relevantExperience: 'I\'ve helped fintech startups like PayStream ($8M Series A) and CryptoWallet ($12M Series A) secure funding. I understand investor expectations and have relationships with top VCs.',
    availability: 'Available to start this week. This project would take 2-3 weeks with daily collaboration.',
    proposedRate: '$100/hour - flexible on total scope',
    status: 'accepted',
    appliedAt: '2024-08-14T08:00:00Z',
    statusUpdatedAt: '2024-08-14T20:15:00Z',
    notes: 'Perfect fit! Impressed by your fintech portfolio and understanding of our space. Let\'s schedule a kick-off call for Monday.',
    messageCount: 4,
    need: {
      id: 'need-4',
      title: 'Business Plan Review & Investment Pitch Deck',
      description: 'Seeking an experienced business consultant to review our business plan and help create a compelling pitch deck for Series A fundraising.',
      category: 'business',
      skillsRequired: ['Business Strategy', 'Pitch Deck Creation', 'Financial Modeling', 'Investor Relations'],
      type: 'paid',
      budget: '$80 - $120',
      budgetType: 'hourly',
      duration: '2-3 weeks',
      urgency: 'high',
      location: 'New York, NY',
      isRemote: false,
      postedBy: 'founder-3',
      posterName: 'Jessica Wong',
      posterRole: 'Founder',
      posterCompany: 'FinanceFlow',
      status: 'active',
      createdAt: '2024-08-14T16:45:00Z',
      updatedAt: '2024-08-14T16:45:00Z',
      expiresAt: '2024-09-14T16:45:00Z',
      leadCount: 4,
      viewCount: 28
    }
  },
  {
    id: 'my-lead-5',
    needId: 'need-5',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Mentor',
    coverMessage: 'Hi Emma! I\'d love to mentor you in iOS development. As a senior iOS developer with 8 years of experience, I enjoy helping students learn mobile development best practices.',
    proposedSolution: 'We could set up weekly 1-hour video calls where I review your code, provide guidance on architecture, and help you understand iOS design patterns. I\'d also be available for async Q&A via Slack.',
    portfolio: 'https://github.com/senior-ios-dev',
    relevantExperience: 'I\'ve built 15+ iOS apps that are live on the App Store, including 3 apps with 1M+ downloads. I\'ve mentored 8 junior developers in the past 2 years.',
    availability: 'Available for weekly sessions, preferably evenings PST. Can commit for 3 months initially.',
    skillsOffering: ['iOS Development', 'Swift', 'Code Review', 'Architecture Design', 'App Store Optimization'],
    status: 'on_hold',
    appliedAt: '2024-08-12T19:30:00Z',
    statusUpdatedAt: '2024-08-13T11:20:00Z',
    notes: 'Great mentorship offer! I\'m currently evaluating a few mentors. Will get back to you by Friday with a decision.',
    messageCount: 2,
    need: {
      id: 'need-5',
      title: 'Mobile App Development Mentorship',
      description: 'CS student looking for mentorship in mobile app development. Want to learn best practices, code review, and guidance on building my first iOS app.',
      category: 'development',
      skillsRequired: ['iOS Development', 'Swift', 'Mobile Design', 'Mentoring', 'Code Review'],
      type: 'barter',
      skillsOffered: ['Frontend Development', 'React', 'JavaScript', 'Web Design'],
      duration: '2-3 months',
      urgency: 'low',
      isRemote: true,
      postedBy: 'student-1',
      posterName: 'Emma Thompson',
      posterRole: 'Student',
      status: 'active',
      createdAt: '2024-08-11T12:30:00Z',
      updatedAt: '2024-08-11T12:30:00Z',
      expiresAt: '2024-11-11T12:30:00Z',
      leadCount: 3,
      viewCount: 19
    }
  },
  {
    id: 'my-lead-6',
    needId: 'need-6',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@email.com',
    applicantRole: 'Service Provider',
    applicantCompany: 'Tech Law Associates',
    coverMessage: 'Hello David! I\'m a tech lawyer specializing in SaaS agreements and privacy compliance. I\'ve helped 50+ SaaS companies with their legal documentation and GDPR/CCPA compliance.',
    proposedSolution: 'I would review your current platform architecture and data flows, then draft comprehensive Terms of Service and Privacy Policy that cover all use cases. I\'d ensure GDPR and CCPA compliance and provide templates for ongoing updates.',
    portfolio: 'https://techlawassociates.com/saas-portfolio',
    relevantExperience: 'I specialize in SaaS legal issues and have drafted ToS/Privacy policies for companies like DataStream, CloudAnalytics, and SaaSMetrics. I stay current with evolving privacy regulations.',
    availability: 'Available to start immediately. Initial review would take 1 week, then 2-3 days for final documentation.',
    proposedRate: '$200/hour - estimated 15-20 hours total',
    status: 'pending',
    appliedAt: '2024-08-14T14:15:00Z',
    statusUpdatedAt: '2024-08-14T14:15:00Z',
    notes: '',
    messageCount: 0,
    need: {
      id: 'need-6',
      title: 'Legal Review for Terms of Service',
      description: 'Need a tech lawyer to review and help draft terms of service and privacy policy for our SaaS platform.',
      category: 'legal',
      skillsRequired: ['Tech Law', 'Privacy Law', 'Contract Review', 'GDPR', 'SaaS Legal'],
      type: 'paid',
      budget: '$150 - $250',
      budgetType: 'hourly',
      duration: '1-2 weeks initial, ongoing',
      urgency: 'medium',
      isRemote: true,
      postedBy: 'founder-4',
      posterName: 'David Park',
      posterRole: 'Founder',
      posterCompany: 'CloudSync Pro',
      status: 'active',
      createdAt: '2024-08-13T11:00:00Z',
      updatedAt: '2024-08-13T11:00:00Z',
      expiresAt: '2024-09-13T11:00:00Z',
      leadCount: 2,
      viewCount: 15
    }
  }
]

interface MyLeadsProps {
  onBack: () => void
  userProfile: any
}

export function MyLeads({ onBack, userProfile }: MyLeadsProps) {
  const [myLeads, setMyLeads] = useState<LeadWithNeed[]>(MOCK_MODE ? MOCK_MY_LEADS : [])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    if (MOCK_MODE) {
      setMyLeads(MOCK_MY_LEADS)
      setLoading(false)
    } else {
      fetchMyLeads()
    }
  }, [])

  const fetchMyLeads = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/my-leads`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMyLeads(data.leads || [])
      } else {
        console.error('Failed to fetch my leads:', response.statusText)
        toast.error('Failed to load your applications')
      }
    } catch (error) {
      console.error('Error fetching my leads:', error)
      toast.error('Error loading your applications')
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = myLeads.filter(leadWithNeed => {
    if (!leadWithNeed.need) return false
    
    const matchesSearch = leadWithNeed.need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leadWithNeed.need.posterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (leadWithNeed.need.posterCompany && leadWithNeed.need.posterCompany.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || leadWithNeed.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: myLeads.length,
    pending: myLeads.filter(lead => lead.status === 'pending').length,
    shortlisted: myLeads.filter(lead => lead.status === 'shortlisted').length,
    accepted: myLeads.filter(lead => lead.status === 'accepted').length,
    rejected: myLeads.filter(lead => lead.status === 'rejected').length,
    on_hold: myLeads.filter(lead => lead.status === 'on_hold').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Loading Your Applications...</h2>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">My Leads & Applications</h2>
          <p className="text-muted-foreground">Track the status of your applications</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          {myLeads.length} application{myLeads.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {MOCK_MODE && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> You're viewing {myLeads.length} sample applications you've submitted. 
            In real mode, you'd see your actual applications and their status updates here!
          </p>
        </div>
      )}

      {myLeads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              When you express interest in needs, you'll see your applications and their status here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by need title, poster name, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted ({statusCounts.shortlisted})</SelectItem>
                    <SelectItem value="accepted">Accepted ({statusCounts.accepted})</SelectItem>
                    <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                    <SelectItem value="on_hold">On Hold ({statusCounts.on_hold})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <div className="space-y-4">
            {filteredLeads.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No applications match your search criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredLeads.map((leadWithNeed) => {
                if (!leadWithNeed.need) return null
                
                const need = leadWithNeed.need
                const lead = leadWithNeed
                const statusInfo = getLeadStatusInfo(lead.status)
                const categoryInfo = getCategoryInfo(need.category)
                const typeInfo = getTypeInfo(need.type)

                return (
                  <Card key={lead.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Need Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white">
                              <span className="text-lg">{categoryInfo.icon}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{need.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {need.posterName} • {need.posterCompany || need.posterRole}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {need.isRemote ? '🌐 Remote' : need.location || 'Location TBD'}
                                </span>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={typeInfo.value === 'barter' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                  {typeInfo.icon} {typeInfo.label}
                                </Badge>
                                <Badge className={statusInfo.color}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Exchange/Payment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {need.type === 'barter' && need.skillsOffered ? (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">SKILLS THEY'RE OFFERING</h4>
                              <p className="text-sm text-green-700">
                                <RefreshCw className="w-3 h-3 inline mr-1" />
                                {formatSkillsOffered(need.skillsOffered)}
                              </p>
                            </div>
                          ) : need.type === 'paid' && need.budget ? (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">THEIR BUDGET</h4>
                              <p className="text-sm text-blue-700">
                                <DollarSign className="w-3 h-3 inline mr-1" />
                                {formatBudget(need.budget, need.budgetType || 'fixed')}
                              </p>
                            </div>
                          ) : null}

                          {/* Your Offering */}
                          {need.type === 'barter' && lead.skillsOffering && lead.skillsOffering.length > 0 && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">YOUR SKILLS OFFERED</h4>
                              <div className="flex flex-wrap gap-1">
                                {lead.skillsOffering.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {lead.skillsOffering.length > 3 && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    +{lead.skillsOffering.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {need.type === 'paid' && lead.proposedRate && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-1">YOUR PROPOSED RATE</h4>
                              <p className="text-sm text-blue-700">
                                <DollarSign className="w-3 h-3 inline mr-1" />
                                {lead.proposedRate}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Application Details */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">YOUR COVER MESSAGE</h4>
                            <p className="text-sm line-clamp-2">{lead.coverMessage}</p>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">YOUR PROPOSED SOLUTION</h4>
                            <p className="text-sm line-clamp-2">{lead.proposedSolution}</p>
                          </div>
                        </div>

                        {/* Status and Notes */}
                        {lead.notes && (
                          <div className="p-3 bg-gray-50 rounded-md">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">FEEDBACK FROM POSTER</h4>
                            <p className="text-sm">{lead.notes}</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Applied {getTimeAgo(lead.appliedAt)}
                            </span>
                            {lead.statusUpdatedAt !== lead.appliedAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Updated {getTimeAgo(lead.statusUpdatedAt)}
                              </span>
                            )}
                            {lead.portfolio && (
                              <a 
                                href={lead.portfolio} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Your Portfolio
                              </a>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {lead.messageCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {lead.messageCount} message{lead.messageCount !== 1 ? 's' : ''}
                              </span>
                            )}
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View Need
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </>
      )}
    </div>
  )
}