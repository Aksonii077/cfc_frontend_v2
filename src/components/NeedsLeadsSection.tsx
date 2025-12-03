import { useState, useEffect } from 'react'
import { Plus, Users, Lightbulb, MessageSquare, Search, Briefcase } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { PostNeedForm } from './needs-leads/PostNeedForm'
import { NeedsGrid } from './needs-leads/NeedsGrid'
import { NeedDetails } from './needs-leads/NeedDetails'
import { LeadForm } from './needs-leads/LeadForm'
import { ManageLeads } from './needs-leads/ManageLeads'
import { MyLeads } from './needs-leads/MyLeads'
import { NeedsFilters } from './needs-leads/NeedsFilters'
import { 
  Need,
  canUserPostNeeds, 
  canUserRespondToNeeds, 
  filterNeeds 
} from '../config/needsLeads.config'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true // Set to false when server is deployed

// Mock Needs Data for Testing
const MOCK_NEEDS: Need[] = [
  {
    id: 'need-1',
    title: 'Website UI/UX Design for HealthTech Startup',
    description: 'Looking for an experienced UI/UX designer to create a modern, user-friendly interface for our wellness platform. The design should be clean, accessible, and mobile-responsive. We need wireframes, mockups, and a complete design system.',
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
  },
  {
    id: 'need-2',
    title: 'React Developer for E-commerce Platform',
    description: 'Need a skilled React developer to build the frontend for our new e-commerce platform. Must have experience with Next.js, TypeScript, and modern state management. The project includes product catalog, shopping cart, and payment integration.',
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
  },
  {
    id: 'need-3',
    title: 'Content Marketing Strategy & Blog Writing',
    description: 'Looking for a content marketing expert to develop our content strategy and write engaging blog posts. Need someone who understands B2B SaaS marketing and can create SEO-optimized content that drives organic traffic and conversions.',
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
  },
  {
    id: 'need-4',
    title: 'Business Plan Review & Investment Pitch Deck',
    description: 'Seeking an experienced business consultant to review our business plan and help create a compelling pitch deck for Series A fundraising. Need someone with experience in fintech and understanding of investor expectations.',
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
  },
  {
    id: 'need-5',
    title: 'Mobile App Development Mentorship',
    description: 'CS student looking for mentorship in mobile app development. Want to learn best practices, code review, and guidance on building my first iOS app. Can offer web development skills and help with frontend projects in exchange.',
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
  },
  {
    id: 'need-6',
    title: 'Legal Review for Terms of Service',
    description: 'Need a tech lawyer to review and help draft terms of service and privacy policy for our SaaS platform. Must understand GDPR, CCPA, and general SaaS legal requirements. Looking for ongoing legal support relationship.',
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
]

interface NeedsLeadsSectionProps {
  userProfile: any
}

export function NeedsLeadsSection({ userProfile }: NeedsLeadsSectionProps) {
  const [needs, setNeeds] = useState<Need[]>(MOCK_MODE ? MOCK_NEEDS : [])
  const [myNeeds, setMyNeeds] = useState<Need[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [currentView, setCurrentView] = useState<'browse' | 'post' | 'details' | 'respond' | 'manage' | 'my-leads'>('browse')
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeTab, setActiveTab] = useState('leads')

  const supabase = createClient()
  
  const canPostNeeds = canUserPostNeeds(userProfile)
  const canRespondToNeeds = canUserRespondToNeeds(userProfile)

  useEffect(() => {
    if (MOCK_MODE) {
      // In mock mode, set needs immediately and filter myNeeds based on current user
      setNeeds(MOCK_NEEDS)
      if (canPostNeeds && userProfile?.roleId) {
        // Filter needs posted by current user - check both role and roleType for compatibility
        const userRole = userProfile.role || userProfile.roleType
        const userNeeds = MOCK_NEEDS.filter(need => 
          need.postedBy === userProfile.roleId || 
          (userRole === 'founder' && ['founder-1', 'founder-2', 'founder-3', 'founder-4'].includes(need.postedBy)) ||
          (userRole === 'service_provider' && ['service-provider-1'].includes(need.postedBy)) ||
          (userRole === 'student' && ['student-1'].includes(need.postedBy))
        )
        setMyNeeds(userNeeds)
      }
      setLoading(false)
    } else {
      fetchNeeds()
      if (canPostNeeds) {
        fetchMyNeeds()
      }
    }
  }, [refreshTrigger, userProfile?.roleId, userProfile?.role, canPostNeeds])

  const fetchNeeds = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/needs`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNeeds(data.needs || [])
      } else {
        console.error('Failed to fetch needs:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching needs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyNeeds = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/my-needs`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMyNeeds(data.needs || [])
      }
    } catch (error) {
      console.error('Error fetching my needs:', error)
    }
  }

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1)
  
  const handleNeedClick = (need: Need) => {
    setSelectedNeed(need)
    setCurrentView('details')
  }
  
  const handleRespondClick = (need: Need) => {
    setSelectedNeed(need)
    setCurrentView('respond')
  }
  
  const handleManageLeads = (need: Need) => {
    setSelectedNeed(need)
    setCurrentView('manage')
  }

  const filteredNeeds = filterNeeds(needs, searchTerm, categoryFilter, typeFilter, urgencyFilter, locationFilter)

  // Handle different views
  if (currentView === 'post') {
    return (
      <PostNeedForm
        onSuccess={() => {
          setCurrentView('browse')
          handleRefresh()
          toast.success('Need posted successfully!')
        }}
        onCancel={() => setCurrentView('browse')}
        userProfile={userProfile}
      />
    )
  }

  if (currentView === 'details' && selectedNeed) {
    return (
      <NeedDetails
        need={selectedNeed}
        onBack={() => setCurrentView('browse')}
        onRespond={() => handleRespondClick(selectedNeed)}
        onManage={() => handleManageLeads(selectedNeed)}
        canRespond={canRespondToNeeds}
        userProfile={userProfile}
      />
    )
  }

  if (currentView === 'respond' && selectedNeed) {
    return (
      <LeadForm
        need={selectedNeed}
        onSuccess={() => {
          setCurrentView('browse')
          toast.success('Interest submitted successfully!')
        }}
        onCancel={() => setCurrentView('browse')}
        userProfile={userProfile}
      />
    )
  }

  if (currentView === 'manage' && selectedNeed) {
    return (
      <ManageLeads
        need={selectedNeed}
        onBack={() => setCurrentView('browse')}
        onRefresh={handleRefresh}
      />
    )
  }

  if (currentView === 'my-leads') {
    return (
      <MyLeads
        onBack={() => setCurrentView('browse')}
        userProfile={userProfile}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] bg-clip-text text-transparent">
              Needs & Leads
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Connect with opportunities and manage your requirements
            </p>
          </div>
        </div>
      </div>

      {MOCK_MODE && (
        <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-xl p-4">
          <p className="text-sm text-[#114DFF]">
            <strong>Demo Mode:</strong> Try the complete interest submission flow! Click on any requirement card, then "Express Interest" to see the application form. After submitting, check "My Applications" to track your application status.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Leads
          </TabsTrigger>
          <TabsTrigger value="needs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Needs
          </TabsTrigger>
        </TabsList>

        {/* LEADS TAB - Browse and Apply to Requirements */}
        <TabsContent value="leads" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Available Opportunities</h3>
              <p className="text-sm text-gray-500">
                Browse requirements and apply to opportunities that match your skills
              </p>
            </div>
            {canRespondToNeeds && (
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('my-leads')}
                className="flex items-center gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
              >
                <MessageSquare className="w-4 h-4" />
                My Applications
              </Button>
            )}
          </div>
          
          <NeedsFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            urgencyFilter={urgencyFilter}
            setUrgencyFilter={setUrgencyFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {filteredNeeds.length} requirement{filteredNeeds.length !== 1 ? 's' : ''} available
              </p>
            </div>

            <NeedsGrid
              needs={filteredNeeds}
              onNeedClick={handleNeedClick}
              onRespondClick={canRespondToNeeds ? handleRespondClick : undefined}
              userProfile={userProfile}
              loading={loading}
            />
          </div>
        </TabsContent>

        {/* NEEDS TAB - Create and Manage Requirements */}
        <TabsContent value="needs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3>Your Requirements</h3>
              <p className="text-sm text-gray-500">
                {canPostNeeds 
                  ? "Post new requirements and manage applicants" 
                  : "View requirements from others"
                }
              </p>
            </div>
            {canPostNeeds && (
              <Button 
                onClick={() => setCurrentView('post')}
                className="flex items-center gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
              >
                <Plus className="w-4 h-4" />
                Post Requirement
              </Button>
            )}
          </div>

          {canPostNeeds ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {myNeeds.length} requirement{myNeeds.length !== 1 ? 's' : ''} posted
                </p>
                <Button size="sm" variant="outline" onClick={handleRefresh} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  Refresh
                </Button>
              </div>

              {myNeeds.length === 0 ? (
                <Card className="border-[#C8D6FF]">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="mb-2">No requirements posted yet</h3>
                    <p className="text-gray-500 mb-5">
                      Start by posting your first requirement or project need.
                    </p>
                    <Button onClick={() => setCurrentView('post')} className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Requirement
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <NeedsGrid
                  needs={myNeeds}
                  onNeedClick={handleNeedClick}
                  onManageClick={handleManageLeads}
                  userProfile={userProfile}
                  showManageButton={true}
                  loading={false}
                />
              )}
            </div>
          ) : (
            <Card className="border-[#C8D6FF]">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="mb-2">Requirements from others</h3>
                <p className="text-gray-500 mb-5">
                  You can view requirements posted by others in the Leads tab and apply to opportunities that match your skills.
                </p>
                <Button variant="outline" onClick={() => setActiveTab('leads')} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Opportunities
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}