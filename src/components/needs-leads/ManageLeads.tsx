import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Calendar, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  Search,
  MoreHorizontal,
  MessageSquare,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Label } from '../ui/label'
import { Need, Lead, getLeadStatusInfo, getTimeAgo } from '../../config/needsLeads.config'
import { projectId } from '../../utils/supabase/info'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true

// Mock Lead Data
const MOCK_LEADS: Record<string, Lead[]> = {
  'need-1': [ // Website UI/UX Design for HealthTech Startup
    {
      id: 'lead-1',
      needId: 'need-1',
      applicantId: 'designer-1',
      applicantName: 'Maya Chen',
      applicantEmail: 'maya.chen@design.com',
      applicantRole: 'Service Provider',
      applicantCompany: 'DesignFlow Studio',
      coverMessage: 'Hi Alex! I\'m excited about your HealthTech project. As a UX designer with 5+ years of experience, I\'ve worked on several healthcare applications and understand the unique challenges of designing for wellness platforms. I love your focus on AI-powered personalization.',
      proposedSolution: 'I would start with user research to understand your target audience\'s pain points, then create user personas and journey maps. I\'d design wireframes for key user flows, followed by high-fidelity mockups in Figma. I\'ll also provide a comprehensive design system to ensure consistency across your platform.',
      portfolio: 'https://mayachen.design',
      relevantExperience: 'I\'ve designed UIs for 3 healthcare startups including MedTrack (patient monitoring) and WellnessAI (nutrition tracking). I specialize in accessibility-first design and have experience with HIPAA compliance requirements for healthcare applications.',
      availability: 'Available to start immediately. Can commit 25-30 hours per week for the next 6 weeks.',
      skillsOffering: ['UI/UX Design', 'User Research', 'Figma', 'Design Systems', 'Healthcare UX'],
      status: 'shortlisted',
      appliedAt: '2024-08-11T09:30:00Z',
      statusUpdatedAt: '2024-08-12T14:20:00Z',
      notes: 'Excellent portfolio with strong healthcare focus. Portfolio shows clean, accessible designs. Strong candidate for our project. Scheduled video call for tomorrow.',
      messageCount: 3
    },
    {
      id: 'lead-2',
      needId: 'need-1',
      applicantId: 'designer-2',
      applicantName: 'Jordan Park',
      applicantEmail: 'jordan.park@freelance.com',
      applicantRole: 'Freelancer',
      coverMessage: 'Hello! I\'m a freelance UI/UX designer passionate about creating beautiful, user-centered interfaces. Your AI wellness platform sounds amazing and I\'d love to contribute to making wellness more accessible through great design.',
      proposedSolution: 'I would focus on creating an intuitive interface that makes AI recommendations feel natural and trustworthy. I\'d design for mobile-first to ensure accessibility, and create interactive prototypes to test user flows before final implementation.',
      portfolio: 'https://jordanpark.portfolio.com',
      relevantExperience: 'I have 3 years of freelance experience designing for various startups. While I haven\'t worked specifically in healthcare, I\'ve designed several wellness and fitness apps that focus on behavior change and user engagement.',
      availability: 'Can start within one week. Available 15-20 hours per week.',
      skillsOffering: ['UI/UX Design', 'Mobile Design', 'Prototyping', 'User Testing'],
      status: 'pending',
      appliedAt: '2024-08-12T16:45:00Z',
      statusUpdatedAt: '2024-08-12T16:45:00Z',
      notes: '',
      messageCount: 0
    },
    {
      id: 'lead-3',
      needId: 'need-1',
      applicantId: 'designer-3',
      applicantName: 'Sam Wilson',
      applicantEmail: 'sam@creativestudio.com',
      applicantRole: 'Service Provider',
      applicantCompany: 'Creative Studio',
      coverMessage: 'Hi there! We\'re a design studio that specializes in branding and web design. We\'d love to help with your HealthTech platform design. We have a team approach that could deliver results quickly.',
      proposedSolution: 'Our team would assign 2 designers to your project - one for UX research and wireframing, another for visual design. We\'d deliver in sprints with regular check-ins and revisions.',
      portfolio: 'https://creativestudio.com/portfolio',
      relevantExperience: 'Our studio has completed 50+ web design projects for various industries. We\'re newer to healthcare but excited to expand into this space.',
      availability: 'Can start next week with full team allocation.',
      skillsOffering: ['Web Design', 'Branding', 'Team Collaboration', 'Fast Delivery'],
      status: 'rejected',
      appliedAt: '2024-08-11T11:20:00Z',
      statusUpdatedAt: '2024-08-13T10:15:00Z',
      notes: 'While the team approach is interesting, they lack specific healthcare/wellness experience which is crucial for our project. The portfolio shows more traditional web design rather than the modern, mobile-first approach we need.',
      messageCount: 1
    }
  ],
  'need-2': [ // React Developer for E-commerce Platform
    {
      id: 'lead-4',
      needId: 'need-2',
      applicantId: 'dev-1',
      applicantName: 'Alex Kumar',
      applicantEmail: 'alex.kumar@dev.com',
      applicantRole: 'Freelancer',
      coverMessage: 'Hi Sarah! I\'m a React developer with extensive e-commerce experience. I\'ve built several online stores and am excited about your platform. The tech stack you mentioned aligns perfectly with my expertise.',
      proposedSolution: 'I would start by setting up the project architecture with Next.js 13+ using the app router. I\'d implement the product catalog with search/filtering, shopping cart with state management (Zustand), and integrate with Stripe for payments. I\'d also ensure mobile responsiveness and performance optimization.',
      portfolio: 'https://alexkumar.dev',
      relevantExperience: 'I\'ve built 5 e-commerce platforms in the last 2 years, including a fashion store that handles 1000+ orders per day. I\'m experienced with payment integrations (Stripe, PayPal), inventory management, and performance optimization for high-traffic sites.',
      availability: 'Available to start immediately. Can work full-time (40 hours/week) for the next 10 weeks.',
      proposedRate: '$4,500 total (within your budget range)',
      status: 'accepted',
      appliedAt: '2024-08-13T10:30:00Z',
      statusUpdatedAt: '2024-08-14T09:15:00Z',
      notes: 'Perfect fit! Strong portfolio with relevant e-commerce projects. Rate is within budget and timeline works perfectly. Already started preliminary discussions about architecture.',
      messageCount: 5
    },
    {
      id: 'lead-5',
      needId: 'need-2',
      applicantId: 'dev-2',
      applicantName: 'Lisa Zhang',
      applicantEmail: 'lisa.zhang@tech.com',
      applicantRole: 'Service Provider',
      applicantCompany: 'WebTech Solutions',
      coverMessage: 'Hello! Our development team specializes in React and e-commerce solutions. We have a proven track record with similar projects and can deliver high-quality results.',
      proposedSolution: 'We would assign a senior React developer to lead the project with support from our UX and backend teams. We use agile methodology with bi-weekly sprints and regular demos.',
      portfolio: 'https://webtech-solutions.com/portfolio',
      relevantExperience: 'Our team has delivered 20+ e-commerce projects using React/Next.js. We specialize in scalable architectures and have experience with high-volume platforms.',
      availability: 'Can start within 2 weeks with dedicated team allocation.',
      proposedRate: '$8,000 - team-based approach with additional features included',
      status: 'on_hold',
      appliedAt: '2024-08-13T14:20:00Z',
      statusUpdatedAt: '2024-08-14T16:30:00Z',
      notes: 'Strong team but significantly over budget. Good backup option if individual contractor doesn\'t work out. Team approach might be overkill for current project scope.',
      messageCount: 2
    }
  ]
}

interface ManageLeadsProps {
  need: Need
  onBack: () => void
  onRefresh: () => void
}

export function ManageLeads({ need, onBack, onRefresh }: ManageLeadsProps) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_MODE ? (MOCK_LEADS[need.id] || []) : [])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [notes, setNotes] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (MOCK_MODE) {
      setLeads(MOCK_LEADS[need.id] || [])
      setLoading(false)
    } else {
      fetchLeads()
    }
  }, [need.id])

  const fetchLeads = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/needs/${need.id}/leads`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLeads(data.leads || [])
      } else {
        console.error('Failed to fetch leads:', response.statusText)
        toast.error('Failed to load leads')
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Error loading leads')
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: string, newStatus: string, notesText?: string) => {
    setUpdatingStatus(leadId)
    try {
      if (MOCK_MODE) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus as any, notes: notesText || lead.notes, statusUpdatedAt: new Date().toISOString() }
            : lead
        ))
        toast.success(`Lead ${newStatus === 'accepted' ? 'accepted' : newStatus === 'rejected' ? 'rejected' : newStatus === 'shortlisted' ? 'shortlisted' : 'updated'}`)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notesText || ''
        })
      })

      if (response.ok) {
        setLeads(prev => prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus as any, notes: notesText || lead.notes, statusUpdatedAt: new Date().toISOString() }
            : lead
        ))
        
        toast.success(`Lead ${newStatus === 'accepted' ? 'accepted' : newStatus === 'rejected' ? 'rejected' : newStatus === 'shortlisted' ? 'shortlisted' : 'updated'}`)
        onRefresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update lead status')
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
      toast.error('Error updating lead status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleAddNotes = (lead: Lead) => {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
    setShowNotesDialog(true)
  }

  const saveNotes = async () => {
    if (!selectedLead) return
    
    await updateLeadStatus(selectedLead.id, selectedLead.status, notes)
    setShowNotesDialog(false)
    setSelectedLead(null)
    setNotes('')
  }

  const getStatusColor = (status: string) => {
    const statusInfo = getLeadStatusInfo(status)
    return statusInfo.color
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.applicantCompany && lead.applicantCompany.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: leads.length,
    pending: leads.filter(lead => lead.status === 'pending').length,
    shortlisted: leads.filter(lead => lead.status === 'shortlisted').length,
    accepted: leads.filter(lead => lead.status === 'accepted').length,
    rejected: leads.filter(lead => lead.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Loading Leads...</h2>
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
          <h2 className="text-2xl font-semibold">Manage Leads</h2>
          <p className="text-muted-foreground">{need.title}</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {leads.length} lead{leads.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {MOCK_MODE && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> You're viewing {leads.length} demo leads with realistic applications. 
            Try managing lead statuses, adding notes, and using the pipeline view!
          </p>
        </div>
      )}

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No leads yet</h3>
            <p className="text-muted-foreground">
              When people express interest in your need, you'll see their applications here.
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
                    placeholder="Search by name, email, or company..."
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
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Leads */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredLeads.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No leads match your search criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {lead.applicantName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{lead.applicantName}</h3>
                                <Badge className={getStatusColor(lead.status)}>
                                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {lead.applicantEmail}
                              </p>
                              
                              {lead.applicantCompany && (
                                <p className="text-sm text-muted-foreground mb-3">
                                  {lead.applicantRole} at {lead.applicantCompany}
                                </p>
                              )}

                              <div className="mb-3">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">COVER MESSAGE</h4>
                                <p className="text-sm line-clamp-2">{lead.coverMessage}</p>
                              </div>

                              <div className="mb-3">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">PROPOSED SOLUTION</h4>
                                <p className="text-sm line-clamp-2">{lead.proposedSolution}</p>
                              </div>

                              <div className="mb-3">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">RELEVANT EXPERIENCE</h4>
                                <p className="text-sm line-clamp-2">{lead.relevantExperience}</p>
                              </div>

                              {/* Barter Skills or Proposed Rate */}
                              {need.type === 'barter' && lead.skillsOffering && lead.skillsOffering.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">SKILLS OFFERING</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {lead.skillsOffering.map((skill, index) => (
                                      <Badge key={index} className="bg-green-100 text-green-800 text-xs">
                                        <RefreshCw className="w-2 h-2 mr-1" />
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {need.type === 'paid' && lead.proposedRate && (
                                <div className="mb-3">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">PROPOSED RATE</h4>
                                  <p className="text-sm text-blue-700">
                                    <DollarSign className="w-3 h-3 inline mr-1" />
                                    {lead.proposedRate}
                                  </p>
                                </div>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Applied {getTimeAgo(lead.appliedAt)}
                                </span>
                                {lead.portfolio && (
                                  <a 
                                    href={lead.portfolio} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Portfolio
                                  </a>
                                )}
                                {lead.messageCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {lead.messageCount} message{lead.messageCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>

                              <div className="mb-3">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">AVAILABILITY</h4>
                                <p className="text-sm">{lead.availability}</p>
                              </div>

                              {lead.notes && (
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">NOTES</h4>
                                  <p className="text-sm">{lead.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {lead.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => updateLeadStatus(lead.id, 'shortlisted')}
                                  disabled={updatingStatus === lead.id}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Shortlist
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => updateLeadStatus(lead.id, 'accepted')}
                                  disabled={updatingStatus === lead.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateLeadStatus(lead.id, 'rejected')}
                                  disabled={updatingStatus === lead.id}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {lead.status !== 'pending' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {lead.status !== 'pending' && (
                                    <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'pending')}>
                                      <Clock className="w-3 h-3 mr-2" />
                                      Mark as Pending
                                    </DropdownMenuItem>
                                  )}
                                  {lead.status !== 'shortlisted' && (
                                    <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'shortlisted')}>
                                      <Star className="w-3 h-3 mr-2" />
                                      Shortlist
                                    </DropdownMenuItem>
                                  )}
                                  {lead.status !== 'accepted' && (
                                    <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'accepted')}>
                                      <CheckCircle className="w-3 h-3 mr-2" />
                                      Accept
                                    </DropdownMenuItem>
                                  )}
                                  {lead.status !== 'rejected' && (
                                    <DropdownMenuItem 
                                      onClick={() => updateLeadStatus(lead.id, 'rejected')}
                                      className="text-red-600"
                                    >
                                      <XCircle className="w-3 h-3 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddNotes(lead)}
                            >
                              Notes
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {['pending', 'shortlisted', 'accepted', 'rejected'].map((status) => (
                  <Card key={status}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span className="capitalize">{status}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {leads.filter(lead => lead.status === status).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {leads
                        .filter(lead => lead.status === status)
                        .map((lead) => (
                          <Card key={lead.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {lead.applicantName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{lead.applicantName}</p>
                                  <p className="text-xs text-muted-foreground truncate">{lead.applicantEmail}</p>
                                  {lead.applicantCompany && (
                                    <p className="text-xs text-muted-foreground truncate">{lead.applicantCompany}</p>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Applied {getTimeAgo(lead.appliedAt)}
                              </p>
                            </div>
                          </Card>
                        ))}
                      {leads.filter(lead => lead.status === status).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No leads
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
            <DialogDescription>
              Add internal notes about {selectedLead?.applicantName}'s application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts about this candidate, evaluation feedback, or any other relevant information..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}