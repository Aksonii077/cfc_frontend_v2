'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Checkbox } from './ui/checkbox'
import { 
  Sparkles, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  ExternalLink,
  Calendar,
  FileText,
  Play,
  Link,
  Zap,
  Network,
  Building,
  DollarSign,
  BookOpen,
  ChevronRight,
  Star,
  Award,
  Rocket
} from 'lucide-react'
import { ValidationResult, TaskForRegistration } from '../utils/ideaValidationService'

interface SpotlightSectionProps {
  currentMode: 'validation' | 'tasks' | 'connections' | 'actions'
  validationResult?: ValidationResult
  registrationTasks?: TaskForRegistration[]
  onTaskToggle?: (taskId: string, completed: boolean) => void
  onActionClick?: (actionId: string) => void
  chatContext?: string
  userRole?: 'mentor' | 'founder'
}

interface RecommendedAction {
  id: string
  title: string
  description: string
  type: 'validation' | 'development' | 'marketing' | 'funding' | 'networking'
  priority: 'high' | 'medium' | 'low'
  icon: any
  actionText: string
}

interface RecommendedConnection {
  id: string
  name: string
  title: string
  company: string
  type: 'mentor' | 'advisor' | 'investor' | 'partner' | 'service_provider'
  relevanceScore: number
  reason: string
  avatar: string
}

export function SpotlightSection({ 
  currentMode, 
  validationResult, 
  registrationTasks = [], 
  onTaskToggle, 
  onActionClick,
  chatContext = '',
  userRole = 'founder'
}: SpotlightSectionProps) {
  const [activeTab, setActiveTab] = useState<'actions' | 'connections'>('actions')
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  // Mock recommended actions based on chat context
  const getRecommendedActions = (): RecommendedAction[] => {
    const baseActions: RecommendedAction[] = [
      {
        id: 'validate_idea',
        title: 'Validate Your Idea',
        description: 'Get AI-powered validation for your business concept',
        type: 'validation',
        priority: 'high',
        icon: Target,
        actionText: 'Start Validation'
      },
      {
        id: 'create_mvp_plan',
        title: 'Create MVP Plan',
        description: 'Develop a plan for your minimum viable product',
        type: 'development',
        priority: 'high',
        icon: Rocket,
        actionText: 'Plan MVP'
      },
      {
        id: 'market_research',
        title: 'Conduct Market Research',
        description: 'Analyze your target market and competitors',
        type: 'marketing',
        priority: 'medium',
        icon: TrendingUp,
        actionText: 'Research Market'
      },
      {
        id: 'find_cofounders',
        title: 'Find Co-founders',
        description: 'Connect with potential co-founders and team members',
        type: 'networking',
        priority: 'medium',
        icon: Users,
        actionText: 'Find Team'
      },
      {
        id: 'funding_strategy',
        title: 'Plan Funding Strategy',
        description: 'Explore funding options and prepare pitch materials',
        type: 'funding',
        priority: 'medium',
        icon: DollarSign,
        actionText: 'Plan Funding'
      }
    ]

    // Filter based on chat context (simple keyword matching)
    if (chatContext.toLowerCase().includes('funding') || chatContext.toLowerCase().includes('investor')) {
      return baseActions.filter(action => action.type === 'funding' || action.type === 'networking')
    }
    
    if (chatContext.toLowerCase().includes('team') || chatContext.toLowerCase().includes('cofounder')) {
      return baseActions.filter(action => action.type === 'networking' || action.type === 'development')
    }

    if (chatContext.toLowerCase().includes('market') || chatContext.toLowerCase().includes('customer')) {
      return baseActions.filter(action => action.type === 'marketing' || action.type === 'validation')
    }

    return baseActions.slice(0, 3) // Show top 3 by default
  }

  // Mock recommended connections
  const getRecommendedConnections = (): RecommendedConnection[] => {
    return [
      {
        id: 'mentor_1',
        name: 'Sarah Chen',
        title: 'Former VP of Product',
        company: 'Google',
        type: 'mentor',
        relevanceScore: 95,
        reason: 'Expert in product strategy and user experience',
        avatar: 'SC'
      },
      {
        id: 'investor_1',
        name: 'Michael Rodriguez',
        title: 'Partner',
        company: 'Sequoia Capital',
        type: 'investor',
        relevanceScore: 88,
        reason: 'Focuses on early-stage tech startups',
        avatar: 'MR'
      },
      {
        id: 'advisor_1',
        name: 'David Kim',
        title: 'Co-founder & CTO',
        company: 'TechStart Inc',
        type: 'advisor',
        relevanceScore: 82,
        reason: 'Technical expertise in your industry',
        avatar: 'DK'
      }
    ]
  }

  const handleTaskToggle = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    const isCompleted = !completedTasks.has(taskId)
    
    if (isCompleted) {
      newCompleted.add(taskId)
    } else {
      newCompleted.delete(taskId)
    }
    
    setCompletedTasks(newCompleted)
    onTaskToggle?.(taskId, isCompleted)
  }

  const getTaskIcon = (category: string) => {
    switch (category) {
      case 'legal': return FileText
      case 'business': return Building
      case 'technical': return Zap
      case 'marketing': return TrendingUp
      case 'financial': return DollarSign
      default: return CheckCircle
    }
  }

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50'
      case 'medium': return 'border-yellow-200 bg-yellow-50'
      case 'low': return 'border-green-200 bg-green-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateProgress = () => {
    if (registrationTasks.length === 0) return 0
    const completed = registrationTasks.filter(task => completedTasks.has(task.id) || task.completed).length
    return Math.round((completed / registrationTasks.length) * 100)
  }

  return (
    <Card className="h-full flex flex-col border-[#C8D6FF]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#114DFF]" />
            <span>Spotlight</span>
          </CardTitle>
          {currentMode === 'tasks' && userRole === 'founder' && (
            <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
              {calculateProgress()}% Complete
            </Badge>
          )}
        </div>

        {/* Timeline showing current and next stage */}
        {userRole === 'founder' && (
          <div className="flex items-center justify-center space-x-3 py-2">
            {/* Current Stage - Ideation */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] flex items-center justify-center shadow-sm border border-[#C8D6FF]">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm text-[#114DFF]">Ideation</div>
                <div className="text-xs text-[#06CB1D]">Current</div>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="h-px w-8 bg-gradient-to-r from-[#C8D6FF] to-[#CCCCCC]"></div>

            {/* Next Stage - Validation */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center shadow-sm border border-[#CCCCCC]">
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Validation</div>
                <div className="text-xs text-gray-500">Next</div>
              </div>
            </div>
          </div>
        )}

        
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {/* Dynamic Actions/Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Tab Switcher */}
          <div className="flex bg-[#F5F5F5] rounded-lg p-1">
            <Button
              variant={activeTab === 'actions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('actions')}
              className={activeTab === 'actions' ? 'flex-1 h-8 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white' : 'flex-1 h-8 hover:bg-[#EDF2FF]'}
            >
              <Zap className="w-4 h-4 mr-1" />
              Actions
            </Button>
            <Button
              variant={activeTab === 'connections' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('connections')}
              className={activeTab === 'connections' ? 'flex-1 h-8 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white' : 'flex-1 h-8 hover:bg-[#EDF2FF]'}
            >
              <Network className="w-4 h-4 mr-1" />
              Connections
            </Button>
          </div>

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <h4 className="text-sm text-gray-900">Recommended Actions</h4>
              <div className="space-y-3 max-h-100 overflow-y-auto">
                {(userRole === 'mentor' ? [
                  {
                    id: 'review_pending_applications',
                    title: 'Review Pending Applications',
                    description: 'Review and shortlist new startup applications',
                    icon: FileText,
                    priority: 'high',
                    actionText: 'Review Now'
                  },
                  {
                    id: 'schedule_interviews',
                    title: 'Schedule Interviews',
                    description: 'Set up interviews with shortlisted startups',
                    icon: Calendar,
                    priority: 'high',
                    actionText: 'Schedule'
                  },
                  {
                    id: 'send_decisions',
                    title: 'Send Decision Communications',
                    description: 'Draft and send acceptance/rejection emails',
                    icon: CheckCircle,
                    priority: 'high',
                    actionText: 'Send Emails'
                  },
                  {
                    id: 'onboard_startups',
                    title: 'Onboard Approved Startups',
                    description: 'Complete onboarding for newly accepted startups',
                    icon: Rocket,
                    priority: 'medium',
                    actionText: 'Start Onboarding'
                  },
                  {
                    id: 'review_portfolio_kpis',
                    title: 'Review Portfolio KPIs',
                    description: 'Check metrics and health scores of your startups',
                    icon: TrendingUp,
                    priority: 'medium',
                    actionText: 'View KPIs'
                  },
                  {
                    id: 'track_milestones',
                    title: 'Track Milestone Progress',
                    description: 'Monitor startup progress on key milestones',
                    icon: Target,
                    priority: 'medium',
                    actionText: 'Track Progress'
                  },
                  {
                    id: 'schedule_mentor_sessions',
                    title: 'Schedule Mentor Sessions',
                    description: 'Book mentoring sessions with your startups',
                    icon: Users,
                    priority: 'low',
                    actionText: 'Schedule'
                  },
                  {
                    id: 'provide_feedback',
                    title: 'Provide Startup Feedback',
                    description: 'Review documents and provide guidance',
                    icon: Award,
                    priority: 'low',
                    actionText: 'Give Feedback'
                  }
                ] : [
                  {
                    id: 'define_business_idea',
                    title: 'Define Your Business Idea',
                    description: 'Clarify and refine your core business concept',
                    icon: Lightbulb,
                    priority: 'high',
                    actionText: 'Start Defining'
                  },
                  {
                    id: 'conduct_market_research',
                    title: 'Conduct Market Research',
                    description: 'Analyze your target market and competitors',
                    icon: TrendingUp,
                    priority: 'high',
                    actionText: 'Research Market'
                  },
                  {
                    id: 'identify_target_audience',
                    title: 'Identify Target Audience',
                    description: 'Define who your ideal customers are',
                    icon: Users,
                    priority: 'high',
                    actionText: 'Find Audience'
                  },
                  {
                    id: 'validate_my_idea',
                    title: 'Validate my Idea',
                    description: 'Test your concept with potential customers',
                    icon: Target,
                    priority: 'high',
                    actionText: 'Validate Now'
                  },
                  {
                    id: 'decide_business_model',
                    title: 'Decide on the Business Model',
                    description: 'Choose how your business will make money',
                    icon: DollarSign,
                    priority: 'medium',
                    actionText: 'Plan Model'
                  },
                  {
                    id: 'write_business_plan',
                    title: 'Write a Business Plan',
                    description: 'Create a comprehensive roadmap for your business',
                    icon: FileText,
                    priority: 'medium',
                    actionText: 'Write Plan'
                  }
                ]).map((action) => (
                  <div
                    key={action.id}
                    className="border border-[#C8D6FF] rounded-lg p-2 hover:bg-[#EDF2FF] transition-colors cursor-pointer"
                    onClick={() => onActionClick?.(action.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded bg-[#EDF2FF] flex items-center justify-center flex-shrink-0">
                        <action.icon className="w-3 h-3 text-[#114DFF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs leading-tight truncate">{action.title}</h5>
                        <p className="text-xs text-gray-500 leading-tight">{action.description}</p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="space-y-3">
              <h4 className="text-sm text-gray-900">Recommended Connections</h4>
              <div className="space-y-3 max-h-120 overflow-y-auto">
                {getRecommendedConnections().map((connection) => (
                  <div
                    key={connection.id}
                    className="border border-[#C8D6FF] rounded-lg p-3 hover:bg-[#EDF2FF] transition-colors cursor-pointer"
                    onClick={() => onActionClick?.(connection.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] flex items-center justify-center text-white text-sm ring-1 ring-[#C8D6FF]/30">
                        {connection.avatar}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-sm">{connection.name}</h5>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-[#3CE5A7] fill-current" />
                            <span className="text-xs text-gray-500">{connection.relevanceScore}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{connection.title} at {connection.company}</p>
                        <p className="text-xs text-[#114DFF]">{connection.reason}</p>
                        <Button size="sm" variant="outline" className="h-7 text-xs mt-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                          Connect
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  )
}