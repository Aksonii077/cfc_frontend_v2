'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { EnhancedAIChat } from './EnhancedAIChat'
import { WorkspaceSection } from './WorkspaceSection'
import { MyProfileSection } from './MyProfileSection'
import { SettingsSection } from './SettingsSection'
import { PartnersSection } from './PartnersSection'
import { MentorsSection } from './MentorsSection'
import { CFCSocialSection } from './CFCSocialSection'
import { ConnectionsModule } from './ConnectionsModule'
import { SpotlightSection } from './SpotlightSection'
import { NeedsLeadsSection } from './NeedsLeadsSection'
import { JobPortalSection } from './JobPortalSection'
import { MentorDashboard } from './mentor/MentorDashboard'
import { ApplicationManagement } from './mentor/ApplicationManagement'
import { AcceptedStartupsList } from './mentor/AcceptedStartupsList'
import { PortfolioManagement } from './mentor/PortfolioManagement'
import { MentorProfileSection } from './mentor/MentorProfileSection'
import { MentorCalendar } from './mentor/MentorCalendar'
import { MentorSettings } from './mentor/MentorSettings'
import { LaunchpadWrapper } from './launchpad/LaunchpadWrapper'
import { IntegrationsDashboard } from './integrations/IntegrationsDashboard'
import { PartnerHub } from './partner/PartnerHub'
import { LeadsInbox } from './partner/LeadsInbox'
import { ServicesManagement } from './partner/ServicesManagement'
import { PartnerProfileSection } from './partner/PartnerProfileSection'
import { PartnerSettings } from './partner/PartnerSettings'
import { PartnerProvider } from '../contexts/PartnerContext'

import { useAuth } from '../hooks/useAuth'
import { supabase } from '../utils/supabase/client'
import { projectId } from '../utils/supabase/info'
import { ideaValidationService, ValidationResult, TaskForRegistration } from '../utils/ideaValidationService'
import cofounderCircleLogo from 'figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png'
import { trackNavTabSwitch, trackSectionView } from '../utils/analytics'

// Edge functions disabled - using client-side functionality only

import { 
  LogOut, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Users, 
  DollarSign, 
  BookOpen, 
  Lightbulb,
  Building,
  Rocket,
  BarChart3,
  Settings,
  Sparkles,
  Zap,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  Heart,
  Network,
  ChevronDown,
  Plus,
  Check,
  Palette,
  Code,
  TrendingDown,
  Search,
  User,
  UserCircle,
  PlayCircle,
  Truck,
  Brain,
  Calendar,
  FileText,
  ClipboardList,
  FileSignature,
  Package,
  LayoutDashboard,
  Inbox
} from 'lucide-react'

interface RoleProfile {
  roleId: string
  roleName: string
  roleType: 'founder' | 'freelancer' | 'service_provider' | 'mentor' | 'investor' | 'student' | 'job_seeker' | 'supplier' | 'exploring'
  onboardingComplete: boolean
  profileData: {
    title?: string
    company?: string
    experience?: string
    skills?: string[]
    industries?: string[]
    bio?: string
    hasStartup?: boolean
    hasIdea?: boolean
    startupDetails?: any
    ideaDetails?: any
  }
  entrepreneurialStage: string
  isActive: boolean
  createdAt: string
  lastUsed: string
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  roles: RoleProfile[]
  activeRoleId: string
}

interface RaceAIDashboardProps {
  onNavigateToProfile?: (userId: string) => void
  initialSection?: 'idea-launch-pad' | 'growth-hub'
  onOpenOnboarding?: () => void
  onNavigateToApplicationForm?: (mentorName: string, programName: string) => void
}

export function RaceAIDashboard({ onNavigateToProfile, initialSection, onOpenOnboarding, onNavigateToApplicationForm }: RaceAIDashboardProps) {
  const { user, signOut } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState('ai-assistant')
  const [previousTab, setPreviousTab] = useState('ai-assistant')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showTourVideo, setShowTourVideo] = useState(false)
  
  // New state for spotlight functionality
  const [spotlightMode, setSpotlightMode] = useState<'validation' | 'tasks' | 'connections' | 'actions'>('actions')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [registrationTasks, setRegistrationTasks] = useState<TaskForRegistration[]>([])
  const [isValidatingIdea, setIsValidatingIdea] = useState(false)
  const [userIdea, setUserIdea] = useState<{ title: string; description: string } | null>(null)
  const [chatContext, setChatContext] = useState<string>('')
  const [hasAutoValidated, setHasAutoValidated] = useState(false)
  const [showPartnerDashboard, setShowPartnerDashboard] = useState(false)
  const [hasPartnerProfile, setHasPartnerProfile] = useState(false)

  // Track tab switches
  useEffect(() => {
    if (activeTab !== previousTab && userProfile) {
      trackNavTabSwitch(previousTab, activeTab, userProfile.activeRoleId)
      trackSectionView(activeTab, userProfile.activeRoleId)
      setPreviousTab(activeTab)
    }
  }, [activeTab, previousTab, userProfile])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      loadOnboardingIdea()
      checkPartnerProfile()
    }
  }, [user])

  // Check if user has a partner profile
  const checkPartnerProfile = async () => {
    if (!user) return
    
    // FOR TESTING: Always show partner profile option
    // TODO: Remove this line and uncomment database check when ready for production
    setHasPartnerProfile(true)
    return
    
    /* PRODUCTION CODE - Uncomment when database is ready:
    try {
      const { data: partner } = await supabase
        .from('partners')
        .select('id')
        .eq('user_id', user.id)
        .single()
      
      setHasPartnerProfile(!!partner)
    } catch (error) {
      setHasPartnerProfile(false)
    }
    */
  }

  // Load idea from onboarding if available and trigger validation
  const loadOnboardingIdea = async () => {
    if (user) {
      const onboardingData = localStorage.getItem(`onboarding_data_${user.id}`)
      if (onboardingData) {
        try {
          const data = JSON.parse(onboardingData)
          if (data.path === 'idea' && data.ideaTitle && data.ideaDescription) {
            const ideaInfo = {
              title: data.ideaTitle,
              description: data.ideaDescription
            }
            setUserIdea(ideaInfo)
            
            // Auto-save to workspace if not already saved
            const savedIdeas = await ideaValidationService.getSavedIdeas(user.id)
            const existingIdea = savedIdeas.find(idea => idea.title === data.ideaTitle)
            
            if (!existingIdea) {
              await ideaValidationService.saveIdeaToWorkspace({
                title: data.ideaTitle,
                description: data.ideaDescription,
                userId: user.id
              })
            }

            // Trigger automatic validation if not already done
            if (!hasAutoValidated) {
              setHasAutoValidated(true)
              setTimeout(() => {
                handleIdeaValidationStart(ideaInfo)
              }, 2000) // Delay to let the UI load
            }
          }
        } catch (error) {
          console.error('Error loading onboarding data:', error)
        }
      }
    }
  }

  const fetchUserProfile = async () => {
    try {
      // Edge functions disabled - using client-side mock data only
      const mockProfile: UserProfile = {
        firstName: user?.firstName || 'Demo',
        lastName: user?.lastName || 'User',
        email: user?.email || 'demo@example.com',
        activeRoleId: 'founder-1',
        roles: [
          {
            roleId: 'founder-1',
            roleName: 'Tech Entrepreneur',
            roleType: 'founder',
            onboardingComplete: true,
            profileData: {
              title: 'Founder & CEO',
              company: 'AI Innovation Co',
              experience: '3+ years',
              skills: ['Product Strategy', 'Team Leadership', 'Fundraising', 'Business Development'],
              industries: ['Technology', 'AI/ML'],
              bio: 'Tech entrepreneur passionate about AI innovation and building scalable solutions.',
              hasStartup: true,
              hasIdea: true,
              startupDetails: { name: 'AI Innovation Co', stage: 'Ideation' }
            },
            entrepreneurialStage: 'ideation',
            isActive: true,
            createdAt: '2024-01-15',
            lastUsed: '2024-01-20T09:00:00Z'
          },
          {
            roleId: 'mentor-1',
            roleName: 'Senior Mentor',
            roleType: 'mentor',
            onboardingComplete: true,
            profileData: {
              title: 'Senior Partner & Mentor',
              company: 'TechStars Accelerator',
              experience: '15+ years',
              skills: ['Startup Mentoring', 'Investment Strategy', 'Product Development', 'Market Validation'],
              industries: ['Technology', 'SaaS', 'AI/ML', 'FinTech'],
              bio: 'Experienced mentor and startup advisor helping entrepreneurs scale their businesses.'
            },
            entrepreneurialStage: 'supporting',
            isActive: false,
            createdAt: '2024-01-10',
            lastUsed: new Date().toISOString()
          },
          {
            roleId: 'investor-1',
            roleName: 'Angel Investor',
            roleType: 'investor',
            onboardingComplete: false,
            profileData: {
              title: 'Angel Investor',
              company: 'Investment Fund',
              experience: '10+ years',
              skills: ['Due Diligence', 'Portfolio Management', 'Market Analysis'],
              industries: ['Technology', 'Fintech']
            },
            entrepreneurialStage: 'investing',
            isActive: false,
            createdAt: '2024-01-05',
            lastUsed: '2024-01-18T15:30:00Z'
          }
        ]
      }
      
      setUserProfile(mockProfile)
      // Set default tab based on active role
      const activeRoleData = mockProfile.roles.find(role => role.roleId === mockProfile.activeRoleId)
      if (activeRoleData?.roleType === 'mentor') {
        setActiveTab('application-center')
      } else {
        setActiveTab('ai-assistant')
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      console.error('Error details:', error.message, error.stack)
    }
  }

  // Get active role
  const getActiveRole = (): RoleProfile | null => {
    if (!userProfile) return null
    return userProfile.roles.find(role => role.roleId === userProfile.activeRoleId) || null
  }

  // Switch active role
  const switchRole = async (roleId: string) => {
    if (!userProfile) return
    
    setUserProfile(prev => (({
      ...prev!,
      activeRoleId: roleId,
      roles: prev!.roles.map(role => ({
        ...role,
        isActive: role.roleId === roleId,
        lastUsed: role.roleId === roleId ? new Date().toISOString() : role.lastUsed
      }))
    })))
  }



  // Create new role profile
  const createNewRole = () => {
    // Create new role profile logic
  }

  // Spotlight handling functions
  const handleIdeaValidationStart = async (ideaToValidate?: { title: string; description: string }) => {
    const ideaForValidation = ideaToValidate || userIdea
    if (!ideaForValidation || !user) return

    setIsValidatingIdea(true)
    setSpotlightMode('validation')
    
    try {
      const result = await ideaValidationService.validateIdea({
        title: ideaForValidation.title,
        description: ideaForValidation.description,
        userId: user.id
      })
      
      setValidationResult(result)
      
      // Generate registration tasks after validation
      setTimeout(async () => {
        const tasks = await ideaValidationService.getRegistrationTasks(ideaForValidation.title)
        setRegistrationTasks(tasks)
        setSpotlightMode('tasks')
      }, 1000)
      
    } catch (error) {
      console.error('Error validating idea:', error)
    } finally {
      setIsValidatingIdea(false)
    }
  }

  const handleSpotlightUpdate = (mode: 'validation' | 'tasks' | 'connections' | 'actions', data?: any) => {
    setSpotlightMode(mode)
  }

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    try {
      await ideaValidationService.updateTaskStatus(taskId, completed)
      
      setRegistrationTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      )
      
      // Show celebration or next steps when all tasks are completed
      if (completed) {
        const completedTasks = registrationTasks.filter(t => t.completed).length + 1
        if (completedTasks === registrationTasks.length) {
          // All registration tasks completed
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleActionClick = (actionId: string) => {
    // Handle specific actions
    if (actionId === 'validate_idea' && userIdea) {
      handleIdeaValidationStart()
    } else if (actionId === 'view_full_validation' && validationResult) {
      // Could open a detailed validation modal
    }
  }

  const activeRole = getActiveRole()

  const getEntrepreneurialStage = () => {
    if (!activeRole) return 'Getting Started'
    return activeRole.entrepreneurialStage || 'new'
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new':
      case 'onboarding': return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
      case 'ideation': return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
      case 'validation': return 'bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]'
      case 'scaling': return 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]'
      case 'investing': return 'bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]'
      case 'established': return 'bg-[#EDF2FF] text-[#3CE5A7] border-[#C8D6FF]'
      case 'supporting': return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
      case 'learning': return 'bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]'
      case 'seeking': return 'bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]'
      default: return 'bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]'
    }
  }

  const getRoleTypeIcon = (roleType: string) => {
    switch (roleType) {
      case 'founder': return <Rocket className="w-3 h-3 md:w-4 md:h-4" />
      case 'investor': return <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
      case 'freelancer': 
      case 'service_provider': return <Target className="w-3 h-3 md:w-4 md:h-4" />
      case 'mentor': return <Building className="w-3 h-3 md:w-4 md:h-4" />
      case 'student': return <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
      case 'job_seeker': return <Search className="w-3 h-3 md:w-4 md:h-4" />
      case 'supplier': return <Truck className="w-3 h-3 md:w-4 md:h-4" />
      case 'exploring': return <Heart className="w-3 h-3 md:w-4 md:h-4" />
      default: return <Users className="w-3 h-3 md:w-4 md:h-4" />
    }
  }

  const getRoleTypeLabel = (roleType: string) => {
    switch (roleType) {
      case 'founder': return 'Founder'
      case 'investor': return 'Investor'
      case 'freelancer': return 'Freelancer'
      case 'service_provider': return 'Service Provider'
      case 'mentor': return 'Mentor'
      case 'student': return 'Student'
      case 'job_seeker': return 'Job Seeker'
      case 'supplier': return 'Supplier'
      case 'exploring': return 'Explorer'
      default: return 'Entrepreneur'
    }
  }

  // Show entrepreneur tabs for founders, mentor dashboard for mentors, otherwise show default tabs based on role
  const showEntrepreneurTabs = activeRole?.roleType === 'founder' && !showPartnerDashboard
  const showMentorDashboard = activeRole?.roleType === 'mentor' && !showPartnerDashboard
  const showPartnerDashboardView = showPartnerDashboard // Use the state we already have

  // State for the main sections
  const [mainSection, setMainSection] = useState<'idea-launch-pad' | 'growth-hub' | 'my-account' | 'mentors' | 'funding'>(initialSection || 'idea-launch-pad')
  const [subSection, setSubSection] = useState<string>('ai-assistant')
  
  // State for collapsible sections
  const [launchPadExpanded, setLaunchPadExpanded] = useState(true)
  const [growthHubExpanded, setGrowthHubExpanded] = useState(true)
  const [mentorsExpanded, setMentorsExpanded] = useState(true)
  const [myAccountExpanded, setMyAccountExpanded] = useState(true)
  
  // State for mentor sections
  const [mentorMainSection, setMentorMainSection] = useState<'application-center' | 'startup-portfolio' | 'my-account'>('application-center')
  const [mentorSubSection, setMentorSubSection] = useState<string>('applications')
  const [applicationCenterExpanded, setApplicationCenterExpanded] = useState(true)
  const [mentorAccountExpanded, setMentorAccountExpanded] = useState(true)

  // State for partner sections
  const [partnerMainSection, setPartnerMainSection] = useState<'partner-hub' | 'leads' | 'my-account'>('partner-hub')
  const [partnerSubSection, setPartnerSubSection] = useState<string>('dashboard')
  const [partnerHubExpanded, setPartnerHubExpanded] = useState(true)
  const [partnerAccountExpanded, setPartnerAccountExpanded] = useState(true)

  const getLaunchPadSections = () => [
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'workspace', label: 'My Workspace', icon: Briefcase },
    { id: 'connections', label: 'Connections', icon: Network },
    { id: 'social', label: 'CFC Social', icon: Heart },
    { id: 'launchpad', label: 'Launchpad', icon: Rocket },
    { id: 'integrations', label: 'Integrations', icon: Zap }
  ]

  const getGrowthHubSections = () => [
    { id: 'ai-assistant', label: 'AI Assistant', icon: Brain },
    { id: 'partners', label: 'Partners', icon: Target },
    { id: 'mentors', label: 'Mentors', icon: GraduationCap },
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'needs-leads', label: 'Needs & Leads', icon: Lightbulb }
  ]

  const getCurrentSections = () => {
    return mainSection === 'idea-launch-pad' ? getLaunchPadSections() : getGrowthHubSections()
  }

  const getTabsForUserType = () => {
    if (showMentorDashboard) {
      return [
        { id: 'application-center', label: 'Application Center', icon: Building },
        { id: 'startup-portfolio', label: 'Startup Portfolio', icon: Rocket }
      ]
    } else {
      // Default tabs for other user types
      return [
        { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'connections', label: 'Connections', icon: Network },
        { id: 'needs-leads', label: 'Needs & Leads', icon: Lightbulb },
        { id: 'job-portal', label: 'Job Portal', icon: Briefcase },
        { id: 'tools', label: 'SAAS tools', icon: Zap },
        { id: 'resources', label: 'Resources', icon: BookOpen }
      ]
    }
  }

  const tabs = showEntrepreneurTabs ? getCurrentSections() : getTabsForUserType()

  return (
    <PartnerProvider>
    <div className="min-h-screen w-full bg-[#F7F9FF]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <img 
                  src={cofounderCircleLogo} 
                  alt="CoFounder Circle" 
                  className="h-8 md:h-10 w-auto"
                />
               
              </div>
              
              {/* Role Type and Stage Badges */}
            

              {/* Launch Pad / Growth Hub Switcher for Entrepreneurs */}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Tour Video Button */}
              

              {/* Chrome-style Profile Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-10 px-3 hover:bg-gray-100">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={`/placeholder-avatar-${activeRole?.roleType}.jpg`} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                        {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium">{activeRole?.roleName || 'Select Role'}</p>
                      <p className="text-xs text-muted-foreground">{getRoleTypeLabel(activeRole?.roleType || 'founder')}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {userProfile?.roles.map((role) => (
                      <DropdownMenuItem
                        key={role.roleId}
                        onClick={() => switchRole(role.roleId)}
                        className="flex items-center space-x-3 p-3 cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={`/placeholder-avatar-${role.roleType}.jpg`} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs">
                            {userProfile?.firstName?.[0]}{userProfile?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{role.roleName}</p>
                            {role.roleId === userProfile.activeRoleId && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{getRoleTypeLabel(role.roleType)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={role.onboardingComplete ? 'default' : 'secondary'} className="text-xs">
                              {role.onboardingComplete ? 'Complete' : 'Setup Required'}
                            </Badge>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    
                    {/* Partner Profile Option */}
                    {hasPartnerProfile && (
                      <DropdownMenuItem
                        onClick={() => setShowPartnerDashboard(true)}
                        className="flex items-center space-x-3 p-3 cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-xs">
                            <Package className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Partner Dashboard</p>
                            {showPartnerDashboard && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">Supplier & Service Provider</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="default" className="text-xs bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]">
                              Active
                            </Badge>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={createNewRole} className="flex items-center space-x-2 p-3 cursor-pointer">
                    <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Add Role Profile</p>
                      <p className="text-xs text-muted-foreground">Create a new professional identity</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async () => {
                      await signOut()
                    }}
                    className="flex items-center space-x-2 p-3 cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sign Out</p>
                      <p className="text-xs text-muted-foreground">End your session</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden"
                >
                  {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              )}

              {/* Desktop User Info */}
            

              {/* Sign Out Button */}
              
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t bg-white p-4 space-y-3"
            >
              <div className="text-sm">
                <p className="font-medium">{userProfile?.firstName} {userProfile?.lastName}</p>
                <p className="text-xs text-gray-500">{userProfile?.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {getEntrepreneurialStage()}
                </Badge>
                {!activeRole?.onboardingComplete && (
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs">
                    Complete Profile
                  </Badge>
                )}
              </div>

              {/* Mobile Section Switcher for Entrepreneurs */}
              {showEntrepreneurTabs && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-600">Switch Section</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={mainSection === 'idea-launch-pad' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setMainSection('idea-launch-pad')
                        setSubSection('ai-assistant')
                        setShowMobileMenu(false)
                      }}
                      className="justify-start h-12 flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <Rocket className="w-4 h-4" />
                        <span className="text-xs font-medium">Launch Pad</span>
                      </div>
                      <span className="text-xs opacity-80">Build & Create</span>
                    </Button>
                    <Button
                      variant={mainSection === 'growth-hub' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setMainSection('growth-hub')
                        setSubSection('ai-assistant')
                        setShowMobileMenu(false)
                      }}
                      className="justify-start h-12 flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">Growth Hub</span>
                      </div>
                      <span className="text-xs opacity-80">Scale & Expand</span>
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTourVideo(true)}
                className="w-full justify-start"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Watch Quick Tour
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      <div className="w-full h-[calc(100vh-5rem)] px-4 md:px-6 lg:px-8 py-4 md:py-8 overflow-hidden">
        {showEntrepreneurTabs ? (
          <div className="h-full flex flex-col">
            {/* Two Section Layout for Entrepreneurs */}
            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
              {/* Main Section Selector */}
              <div className="w-full lg:w-80 flex-shrink-0">
                {/* Navigation Menu */}
                <Card className="h-full">
                  <CardContent className="p-3 space-y-1 h-full overflow-y-auto">
                    {/* Launch Pad Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (mainSection === 'idea-launch-pad') {
                            // If already selected, toggle expansion
                            setLaunchPadExpanded(!launchPadExpanded)
                          } else {
                            setMainSection('idea-launch-pad')
                            setSubSection('ai-assistant')
                            setLaunchPadExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          mainSection === 'idea-launch-pad' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mainSection === 'idea-launch-pad' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <Lightbulb className={`w-5 h-5 ${
                              mainSection === 'idea-launch-pad' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mainSection === 'idea-launch-pad' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Launch Pad</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          launchPadExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {launchPadExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                        <Button
                          variant={subSection === 'ai-assistant' && mainSection === 'idea-launch-pad' ? 'secondary' : 'ghost'}
                          onClick={() => {
                            setMainSection('idea-launch-pad')
                            setSubSection('ai-assistant')
                          }}
                          className="w-full justify-start h-8 text-xs"
                        >
                          <MessageSquare className="w-3 h-3 mr-2" />
                          RACE AI
                          {!activeRole?.onboardingComplete && (
                            <div className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </Button>
                        <Button
                          variant={subSection === 'workspace' && mainSection === 'idea-launch-pad' ? 'secondary' : 'ghost'}
                          onClick={() => {
                            setMainSection('idea-launch-pad')
                            setSubSection('workspace')
                          }}
                          className="w-full justify-start h-8 text-xs"
                        >
                          <Building className="w-3 h-3 mr-2" />
                          My Workspace
                        </Button>
                        <Button
                          variant={subSection === 'launchpad' && mainSection === 'idea-launch-pad' ? 'secondary' : 'ghost'}
                          onClick={() => {
                            setMainSection('idea-launch-pad')
                            setSubSection('launchpad')
                          }}
                          className="w-full justify-start h-8 text-xs"
                        >
                          <Rocket className="w-3 h-3 mr-2" />
                          SaaS OS
                        </Button>
                        <Button
                          variant={subSection === 'integrations' && mainSection === 'idea-launch-pad' ? 'secondary' : 'ghost'}
                          onClick={() => {
                            setMainSection('idea-launch-pad')
                            setSubSection('integrations')
                          }}
                          className="w-full justify-start h-8 text-xs"
                        >
                          <Zap className="w-3 h-3 mr-2" />
                          Integrations
                        </Button>
                        </div>
                      )}
                    </div>

                    {/* Growth Hub Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (mainSection === 'growth-hub') {
                            // If already selected, toggle expansion
                            setGrowthHubExpanded(!growthHubExpanded)
                          } else {
                            setMainSection('growth-hub')
                            setSubSection('partners')
                            setGrowthHubExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          mainSection === 'growth-hub' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mainSection === 'growth-hub' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <Rocket className={`w-5 h-5 ${
                              mainSection === 'growth-hub' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mainSection === 'growth-hub' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Growth Hub</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          growthHubExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {growthHubExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">

                          <Button
                            variant={subSection === 'partners' && mainSection === 'growth-hub' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('growth-hub')
                              setSubSection('partners')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Building className="w-3 h-3 mr-2" />
                            Partners
                          </Button>


                          <Button
                            variant={subSection === 'needs-leads' && mainSection === 'growth-hub' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('growth-hub')
                              setSubSection('needs-leads')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Lightbulb className="w-3 h-3 mr-2" />
                            Needs & Leads
                          </Button>
                          <Button
                            variant={subSection === 'connections' && mainSection === 'growth-hub' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('growth-hub')
                              setSubSection('connections')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Network className="w-3 h-3 mr-2" />
                            People
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Mentors Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (mainSection === 'mentors') {
                            // If already selected, toggle expansion
                            setMentorsExpanded(!mentorsExpanded)
                          } else {
                            setMainSection('mentors')
                            setSubSection('find-mentor')
                            setMentorsExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          mainSection === 'mentors' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mainSection === 'mentors' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <GraduationCap className={`w-5 h-5 ${
                              mainSection === 'mentors' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mainSection === 'mentors' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Mentors</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          mentorsExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {mentorsExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                          <Button
                            variant={subSection === 'find-mentor' && mainSection === 'mentors' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('mentors')
                              setSubSection('find-mentor')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Search className="w-3 h-3 mr-2" />
                            Find a Mentor
                          </Button>
                          <Button
                            variant={subSection === 'my-applications' && mainSection === 'mentors' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('mentors')
                              setSubSection('my-applications')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Briefcase className="w-3 h-3 mr-2" />
                            My Applications
                          </Button>
                          <Button
                            variant={subSection === 'my-mentors' && mainSection === 'mentors' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('mentors')
                              setSubSection('my-mentors')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Users className="w-3 h-3 mr-2" />
                            My Mentors
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Funding Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMainSection('funding')
                          setSubSection('funding-hub')
                        }}
                        className={`w-full justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          mainSection === 'funding' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mainSection === 'funding' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <DollarSign className={`w-5 h-5 ${
                              mainSection === 'funding' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-base font-semibold ${
                              mainSection === 'funding' ? 'text-[#114DFF]' : 'text-gray-700'
                            }`}>Funding</span>
                            <span className="text-xs text-gray-500">Coming Soon</span>
                          </div>
                        </div>
                      </Button>
                    </div>

                    {/* My Account Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (mainSection === 'my-account') {
                            // If already selected, toggle expansion
                            setMyAccountExpanded(!myAccountExpanded)
                          } else {
                            setMainSection('my-account')
                            setSubSection('profile')
                            setMyAccountExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          mainSection === 'my-account' 
                            ? 'bg-gradient-to-r from-[#F5F5F5] to-[#F7F9FF] border-2 border-[#CCCCCC] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#F5F5F5] hover:to-[#F7F9FF] hover:border-[#CCCCCC] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mainSection === 'my-account' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <User className={`w-5 h-5 ${
                              mainSection === 'my-account' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mainSection === 'my-account' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>My Account</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          myAccountExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {myAccountExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                          <Button
                            variant={subSection === 'profile' && mainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('my-account')
                              setSubSection('profile')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <UserCircle className="w-3 h-3 mr-2" />
                            My Profile
                          </Button>
                          <Button
                            variant={subSection === 'settings' && mainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMainSection('my-account')
                              setSubSection('settings')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Settings className="w-3 h-3 mr-2" />
                            Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {subSection === 'ai-assistant' && (
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* AI Chat - Main Area */}
                    <div className="flex-1 min-w-0 order-2 lg:order-1">
                      <Card className="h-full flex-1 min-h-0">
                        <EnhancedAIChat 
                          context={mainSection === 'growth-hub' ? 'growth' : 'ideation'}
                          welcomeMessage={
                            mainSection === 'idea-launch-pad' 
                              ? "Hello! I'm your AI assistant for the Launch Pad. I can help you brainstorm ideas, validate concepts, build prototypes, and take your first steps as an entrepreneur. What would you like to work on today?"
                              : "Hello! I'm your AI assistant for the Growth Hub. I can help you scale your business, find partners and mentors, secure funding, and expand your operations. How can I help you grow today?"
                          }
                          onIdeaValidationStart={handleIdeaValidationStart}
                          onIdeaValidationComplete={(result) => {}}
                          onSpotlightUpdate={handleSpotlightUpdate}
                          onChatContextUpdate={setChatContext}
                          userIdea={userIdea}
                        />
                      </Card>
                    </div>
                    
                    {/* Spotlight Section - Right Sidebar */}
                    <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-1 lg:order-2 h-64 lg:h-full">
                      <SpotlightSection
                        currentMode={spotlightMode}
                        validationResult={validationResult || undefined}
                        registrationTasks={registrationTasks}
                        onTaskToggle={handleTaskToggle}
                        onActionClick={handleActionClick}
                        chatContext={chatContext}
                        userRole={showMentorDashboard ? 'mentor' : 'founder'}
                      />
                    </div>
                  </div>
                )}
                {subSection === 'workspace' && <WorkspaceSection userProfile={activeRole} onOpenOnboarding={onOpenOnboarding} />}
                {subSection === 'launchpad' && (
                  <LaunchpadWrapper 
                    onNavigateToIntegrations={() => {
                      setMainSection('idea-launch-pad')
                      setSubSection('integrations')
                    }}
                  />
                )}
                {subSection === 'integrations' && (
                  <IntegrationsDashboard 
                    onNavigateToLaunchpad={() => {
                      setMainSection('idea-launch-pad')
                      setSubSection('launchpad')
                    }}
                  />
                )}
                {subSection === 'tools' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>SaaS Tools</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-muted-foreground">
                          Powerful SaaS tools to accelerate your entrepreneurial journey
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center py-12 text-center">
                        <div>
                          <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="font-medium text-gray-900 mb-2">SaaS Tools Coming Soon</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            We're building powerful SaaS tools to help you with market research, business planning, automation, and more.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {subSection === 'connections' && (
                  <ConnectionsModule 
                    userProfile={activeRole} 
                    onNavigateToProfile={onNavigateToProfile}
                  />
                )}
                {subSection === 'social' && <CFCSocialSection />}
                {subSection === 'partners' && <PartnersSection />}


                {subSection === 'needs-leads' && (
                  <NeedsLeadsSection userProfile={activeRole} />
                )}
                {subSection === 'profile' && mainSection === 'my-account' && (
                  <MyProfileSection userProfile={activeRole} />
                )}
                {subSection === 'settings' && mainSection === 'my-account' && (
                  <SettingsSection userProfile={activeRole} />
                )}
                {mainSection === 'mentors' && (
                  <MentorsSection 
                    subSection={subSection} 
                    onNavigateToApplicationForm={onNavigateToApplicationForm}
                  />
                )}
                {mainSection === 'funding' && (
                  <div className="flex items-center justify-center p-4 md:p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center max-w-4xl mx-auto space-y-6"
                    >
                      {/* Coming Soon Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] rounded-full px-4 py-2"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-[#06CB1D]" />
                        </motion.div>
                        <span className="font-semibold text-[#06CB1D] text-sm">Coming Soon</span>
                      </motion.div>

                      {/* Main Heading */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="space-y-3"
                      >
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#06CB1D] via-[#3CE5A7] to-[#114DFF] bg-clip-text text-transparent">
                          Funding Hub
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                          Your AI-powered gateway to funding opportunities, investor connections, and capital insights
                        </p>
                      </motion.div>

                      {/* Feature Preview Grid */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                      >
                        {[
                          {
                            icon: Users,
                            title: "Investor Matching",
                            description: "AI-powered investor discovery",
                            color: "from-[#114DFF] to-[#0d3eb8]",
                            delay: 0.8,
                          },
                          {
                            icon: BarChart3,
                            title: "Funding Analytics",
                            description: "Market insights and trends",
                            color: "from-[#06CB1D] to-[#059e17]",
                            delay: 0.9,
                          },
                          {
                            icon: Building,
                            title: "Pitch Optimization",
                            description: "AI-guided pitch creation",
                            color: "from-[#114DFF] to-[#3CE5A7]",
                            delay: 1.0,
                          },
                          {
                            icon: Network,
                            title: "Due Diligence",
                            description: "Streamlined documentation",
                            color: "from-[#3CE5A7] to-[#2bc78f]",
                            delay: 1.1,
                          },
                        ].map((feature, index) => (
                          <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: feature.delay, duration: 0.6 }}
                            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 mx-auto`}>
                              <feature.icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">{feature.title}</h3>
                            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                          </motion.div>
                        ))}
                      </motion.div>

                      {/* Bottom Message */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border border-[#C8D6FF] rounded-xl p-6"
                      >
                        <div className="flex items-center justify-center space-x-3 mb-3">
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Brain className="w-6 h-6 text-[#114DFF]" />
                          </motion.div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Built with RACE AI Intelligence
                          </h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto text-sm md:text-base mb-4">
                          Our AI is learning from thousands of successful funding rounds to bring you 
                          personalized insights, intelligent introductions, and strategic guidance.
                        </p>
                        
                        {/* Progress indicator */}
                        <div className="max-w-md mx-auto">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "75%" }}
                            transition={{ delay: 1.5, duration: 2, ease: "easeOut" }}
                            className="w-3/4 h-2 bg-gradient-to-r from-[#06CB1D] to-[#114DFF] rounded-full mx-auto"
                          />
                          <p className="text-xs text-gray-500 mt-2">Development Progress: 75%</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : showMentorDashboard ? (
          <div className="h-full flex flex-col">
            {/* Two Section Layout for Mentors */}
            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
              {/* Main Section Selector - Left Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                {/* Navigation Menu */}
                <Card className="h-full">
                  <CardContent className="p-3 space-y-1 h-full overflow-y-auto">
                    {/* Application Center Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMentorMainSection('application-center')
                          setMentorSubSection('applications')
                        }}
                        className={`w-full justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          mentorMainSection === 'application-center' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mentorMainSection === 'application-center' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <Building className={`w-5 h-5 ${
                              mentorMainSection === 'application-center' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mentorMainSection === 'application-center' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Application Center</span>
                        </div>
                      </Button>
                    </div>

                    {/* Startup Portfolio Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setMentorMainSection('startup-portfolio')
                          setMentorSubSection('portfolio')
                        }}
                        className={`w-full justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          mentorMainSection === 'startup-portfolio' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mentorMainSection === 'startup-portfolio' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <Rocket className={`w-5 h-5 ${
                              mentorMainSection === 'startup-portfolio' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mentorMainSection === 'startup-portfolio' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Startup Portfolio</span>
                        </div>
                      </Button>
                    </div>

                    {/* My Account Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (mentorMainSection === 'my-account') {
                            setMentorAccountExpanded(!mentorAccountExpanded)
                          } else {
                            setMentorMainSection('my-account')
                            setMentorSubSection('mentor-profile')
                            setMentorAccountExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          mentorMainSection === 'my-account' 
                            ? 'bg-gradient-to-r from-[#F5F5F5] to-[#F7F9FF] border-2 border-[#CCCCCC] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#F5F5F5] hover:to-[#F7F9FF] hover:border-[#CCCCCC] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            mentorMainSection === 'my-account' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <User className={`w-5 h-5 ${
                              mentorMainSection === 'my-account' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`text-base font-semibold ${
                            mentorMainSection === 'my-account' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>My Account</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          mentorAccountExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {mentorAccountExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                          <Button
                            variant={mentorSubSection === 'mentor-profile' && mentorMainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMentorMainSection('my-account')
                              setMentorSubSection('mentor-profile')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <UserCircle className="w-3 h-3 mr-2" />
                            Mentor Profile
                          </Button>
                          <Button
                            variant={mentorSubSection === 'my-calendar' && mentorMainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMentorMainSection('my-account')
                              setMentorSubSection('my-calendar')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Calendar className="w-3 h-3 mr-2" />
                            My Calendar
                          </Button>
                          <Button
                            variant={mentorSubSection === 'settings' && mentorMainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setMentorMainSection('my-account')
                              setMentorSubSection('settings')
                            }}
                            className="w-full justify-start h-8 text-xs"
                          >
                            <Settings className="w-3 h-3 mr-2" />
                            Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Application Center - All subsections use ApplicationManagement with different tabs */}
                {mentorMainSection === 'application-center' && (
                  <ApplicationManagement 
                    onNavigateToProfile={onNavigateToProfile}
                    initialTab={
                      mentorSubSection === 'applications' ? 'inbox' :
                      mentorSubSection === 'interviews' ? 'interviews' :
                      mentorSubSection === 'decisions' ? 'decisions' :
                      mentorSubSection === 'agreements' ? 'agreements' : 'inbox'
                    }
                    hideTabNavigation={true}
                  />
                )}
                
                {/* Startup Portfolio */}
                {mentorSubSection === 'portfolio' && <PortfolioManagement onBack={() => setMentorMainSection('application-center')} />}
                
                {/* My Account sections */}
                {mentorSubSection === 'mentor-profile' && <MentorProfileSection />}
                {mentorSubSection === 'my-calendar' && <MentorCalendar />}
                {mentorSubSection === 'settings' && mentorMainSection === 'my-account' && <MentorSettings />}
              </div>
            </div>
          </div>
        ) : showPartnerDashboardView ? (
          <div className="h-full flex flex-col">
            {/* Two Section Layout for Partners */}
            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
              {/* Main Section Selector - Left Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                {/* Navigation Menu */}
                <Card className="h-full">
                  <CardContent className="p-3 space-y-1 h-full overflow-y-auto">
                    {/* Partner Hub Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setPartnerMainSection('partner-hub')
                          setPartnerSubSection('dashboard')
                        }}
                        className={`w-full justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          partnerMainSection === 'partner-hub' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            partnerMainSection === 'partner-hub' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <LayoutDashboard className={`w-5 h-5 ${
                              partnerMainSection === 'partner-hub' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`${
                            partnerMainSection === 'partner-hub' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Partner Hub</span>
                        </div>
                      </Button>
                    </div>

                    {/* Leads Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setPartnerMainSection('leads')
                          setPartnerSubSection('inbox')
                        }}
                        className={`w-full justify-start h-12 px-4 rounded-lg transition-all duration-200 ${
                          partnerMainSection === 'leads' 
                            ? 'bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] border-2 border-[#C8D6FF] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#EDF2FF] hover:to-[#F7F9FF] hover:border-[#C8D6FF] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            partnerMainSection === 'leads' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <Inbox className={`w-5 h-5 ${
                              partnerMainSection === 'leads' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`${
                            partnerMainSection === 'leads' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>Leads Inbox</span>
                        </div>
                      </Button>
                    </div>

                    {/* My Account Section */}
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (partnerMainSection === 'my-account') {
                            setPartnerAccountExpanded(!partnerAccountExpanded)
                          } else {
                            setPartnerMainSection('my-account')
                            setPartnerSubSection('profile')
                            setPartnerAccountExpanded(true)
                          }
                        }}
                        className={`w-full justify-between h-12 px-4 rounded-lg transition-all duration-200 ${
                          partnerMainSection === 'my-account' 
                            ? 'bg-gradient-to-r from-[#F5F5F5] to-[#F7F9FF] border-2 border-[#CCCCCC] shadow-md' 
                            : 'hover:bg-gradient-to-r hover:from-[#F5F5F5] hover:to-[#F7F9FF] hover:border-[#CCCCCC] border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            partnerMainSection === 'my-account' 
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-lg' 
                              : 'bg-[#EDF2FF]'
                          }`}>
                            <User className={`w-5 h-5 ${
                              partnerMainSection === 'my-account' ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <span className={`${
                            partnerMainSection === 'my-account' ? 'text-[#114DFF]' : 'text-gray-700'
                          }`}>My Account</span>
                        </div>
                        <ChevronDown className={`w-3 h-3 transition-transform ${
                          partnerAccountExpanded ? 'rotate-180' : ''
                        }`} />
                      </Button>
                      
                      {partnerAccountExpanded && (
                        <div className="ml-4 space-y-1 border-l border-gray-200 pl-3">
                          <Button
                            variant={partnerSubSection === 'profile' && partnerMainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setPartnerMainSection('my-account')
                              setPartnerSubSection('profile')
                            }}
                            className="w-full justify-start h-8"
                          >
                            <UserCircle className="w-3 h-3 mr-2" />
                            Partner Profile
                          </Button>
                          <Button
                            variant={partnerSubSection === 'settings' && partnerMainSection === 'my-account' ? 'secondary' : 'ghost'}
                            onClick={() => {
                              setPartnerMainSection('my-account')
                              setPartnerSubSection('settings')
                            }}
                            className="w-full justify-start h-8"
                          >
                            <Settings className="w-3 h-3 mr-2" />
                            Settings
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Back to Dashboard */}
                    <div className="pt-4 border-t border-[#CCCCCC]">
                      <Button
                        variant="outline"
                        onClick={() => setShowPartnerDashboard(false)}
                        className="w-full justify-start h-10 gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <X className="w-4 h-4" />
                        Back to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto">
                {/* Partner Hub */}
                {partnerMainSection === 'partner-hub' && (
                  <PartnerHub 
                    onNavigateToLeadsInbox={() => setPartnerMainSection('leads')}
                  />
                )}
                
                {/* Leads Inbox */}
                {partnerMainSection === 'leads' && <LeadsInbox />}
                
                {/* My Account sections */}
                {partnerSubSection === 'profile' && partnerMainSection === 'my-account' && <PartnerProfileSection />}
                {partnerSubSection === 'settings' && partnerMainSection === 'my-account' && <PartnerSettings />}
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
            {/* Navigation Tabs for non-entrepreneurs */}
            <TabsList className={`grid w-full ${ 
              showMentorDashboard
                ? (isMobile ? 'grid-cols-2' : 'grid-cols-2')
                : (isMobile ? 'grid-cols-3' : 'grid-cols-7')
            } gap-1`}>
              {tabs.slice(0, isMobile ? (showMentorDashboard ? 2 : 2) : tabs.length).map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="space-x-1 md:space-x-2 text-xs md:text-sm relative"
                >
                  <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {tab.id === 'ai-assistant' && !activeRole?.onboardingComplete && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </TabsTrigger>
              ))}
              
              {/* Mobile More Tab */}
              {isMobile && (
                <TabsTrigger value="more" className="space-x-1 text-xs">
                  <Settings className="w-3 h-3" />
                  <span>More</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Tab Content for non-entrepreneurs */}
            {!showMentorDashboard && (
              <TabsContent value="ai-assistant" className="space-y-0">
                <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-4 lg:gap-6">
                  {/* AI Chat - Main Area */}
                  <div className="flex-1 min-w-0 order-2 lg:order-1">
                    <Card className="h-full flex-1 min-h-0">
                      <EnhancedAIChat 
                        context={mainSection === 'growth-hub' ? 'growth' : 'ideation'}
                        welcomeMessage={
                          mainSection === 'idea-launch-pad' 
                            ? "Hello! I'm your AI assistant for the Launch Pad. I can help you brainstorm ideas, validate concepts, build prototypes, and take your first steps as an entrepreneur. What would you like to work on today?"
                            : "Hello! I'm your AI assistant for the Growth Hub. I can help you scale your business, find partners and mentors, secure funding, and expand your operations. How can I help you grow today?"
                        }
                        onIdeaValidationStart={handleIdeaValidationStart}
                        onIdeaValidationComplete={(result) => {}}
                        onSpotlightUpdate={handleSpotlightUpdate}
                        onChatContextUpdate={setChatContext}
                        userIdea={userIdea}
                      />
                    </Card>
                  </div>
                  
                  {/* Spotlight Section - Right Sidebar */}
                  <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 order-1 lg:order-2 h-64 lg:h-full">
                    <SpotlightSection
                      currentMode={spotlightMode}
                      validationResult={validationResult || undefined}
                      registrationTasks={registrationTasks}
                      onTaskToggle={handleTaskToggle}
                      onActionClick={handleActionClick}
                      chatContext={chatContext}
                      userRole={showMentorDashboard ? 'mentor' : 'founder'}
                    />
                  </div>
                </div>
              </TabsContent>
            )}
            {showMentorDashboard ? (
              <>
                {/* Application Center */}
                <TabsContent value="application-center" className="space-y-0">
                  <ApplicationManagement onNavigateToProfile={onNavigateToProfile} />
                </TabsContent>

                {/* Startup Portfolio */}
                <TabsContent value="startup-portfolio" className="space-y-0">
                  <PortfolioManagement onBack={() => setActiveTab('application-center')} />
                </TabsContent>
              </>
            ) : (
              <>
                {/* Connections for non-entrepreneurs */}
                <TabsContent value="connections" className="space-y-0">
                  <ConnectionsModule 
                    userProfile={activeRole} 
                    onNavigateToProfile={onNavigateToProfile}
                  />
                </TabsContent>

                {/* Needs & Leads for non-entrepreneurs */}
                <TabsContent value="needs-leads" className="space-y-0">
                  <NeedsLeadsSection 
                    userProfile={activeRole}
                  />
                </TabsContent>

                {/* Job Portal for non-entrepreneurs */}
                <TabsContent value="job-portal" className="space-y-0">
                  <JobPortalSection 
                    userProfile={activeRole}
                  />
                </TabsContent>

                {/* Default dashboard for non-entrepreneur users */}
                <TabsContent value="dashboard" className="space-y-4 md:space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Connections
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">254</div>
                      <p className="text-xs text-muted-foreground">
                        +12% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Job Applications
                      </CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">
                        +3 this week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Skills Learned
                      </CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        +2 this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        AI Interactions
                      </CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">
                        +89 today
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-[#114DFF] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Applied to Frontend Developer position at TechCorp</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-[#06CB1D] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Connected with Sarah Johnson from AI Startup</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-[#3CE5A7] rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Completed React Advanced course</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SAAS tools Tab */}
              <TabsContent value="tools" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>SaaS Tools</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-muted-foreground">
                        Powerful SaaS tools to accelerate your professional journey
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-medium text-gray-900 mb-2">SaaS Tools Coming Soon</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          We're building powerful SaaS tools to help you with productivity, automation, project management, and more.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5" />
                        <span>Resources</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Learning resources and guides will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        )}
      </div>
    </div>
    </PartnerProvider>
  )
}