import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { IdeaTimelineView } from './workspace/IdeaTimelineView'
import { 
  IdeaProject, 
  IdeaStage, 
  STAGE_INFO, 
  generateStageRecommendations,
  calculateProjectProgress
} from './workspace/IdeaLifecycleStages'
import { 
  User, 
  Lightbulb, 
  Users, 
  Wrench, 
  Target,
  Rocket,
  Building,
  DollarSign,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Plus,
  Edit,
  Share,
  Eye,
  Settings,
  UserCircle,
  Briefcase,
  BarChart3,
  Calendar,
  ArrowRight,
  AlertCircle,
  PlayCircle,
  Award
} from 'lucide-react'

// Mock Ideas Data for Testing
const MOCK_IDEAS: IdeaProject[] = [
  {
    id: 'idea-1',
    name: 'AI Wellness Solutions',
    description: 'AI-powered platform for personalized wellness recommendations combining traditional Ayurvedic practices with modern health technology.',
    stage: 'mvp',
    industry: 'HealthTech',
    targetMarket: 'Health-conscious individuals aged 25-45',
    problemStatement: 'People struggle to find personalized wellness solutions that combine traditional wisdom with modern science.',
    solution: 'AI platform that analyzes individual health data and provides personalized Ayurvedic recommendations.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-08-15T14:20:00Z',
    isActive: true,
    progress: 65,
    tags: ['AI', 'Wellness', 'Ayurveda', 'Healthcare'],
    milestones: [
      {
        id: 'milestone-1',
        title: 'MVP Core Features Complete',
        description: 'Essential features for minimum viable product are developed and tested',
        completed: true,
        completedAt: '2024-07-20T12:00:00Z',
        tasks: [
          {
            id: 'task-1',
            title: 'User registration and profile setup',
            description: 'Build user onboarding flow with health questionnaire',
            completed: true,
            completedAt: '2024-07-15T10:00:00Z',
            priority: 'high',
            category: 'development'
          }
        ]
      },
      {
        id: 'milestone-2',
        title: 'Initial User Testing',
        description: 'Conduct user testing with 50+ beta users and gather feedback',
        completed: false,
        tasks: [
          {
            id: 'task-2',
            title: 'Recruit beta testers',
            description: 'Find and onboard 50 beta users for product testing',
            completed: true,
            priority: 'high',
            category: 'marketing'
          }
        ]
      }
    ]
  },
  {
    id: 'idea-2',
    name: 'SaaS HR Analytics',
    description: 'Comprehensive HR analytics platform for mid-size companies to optimize team performance and employee satisfaction.',
    stage: 'validation',
    industry: 'HR Tech',
    targetMarket: 'Mid-size companies (50-500 employees)',
    problemStatement: 'HR departments lack data-driven insights to make informed decisions about team performance and employee satisfaction.',
    solution: 'Analytics platform that integrates with existing HR tools to provide actionable insights and recommendations.',
    createdAt: '2024-03-20T14:15:00Z',
    updatedAt: '2024-08-10T09:30:00Z',
    isActive: false,
    progress: 35,
    tags: ['SaaS', 'HR', 'Analytics', 'B2B'],
    milestones: [
      {
        id: 'milestone-3',
        title: 'Market Research Complete',
        description: 'Conduct comprehensive market research and competitor analysis',
        completed: true,
        completedAt: '2024-05-15T16:20:00Z',
        tasks: []
      }
    ]
  }
]

interface StartupTool {
  id: string
  name: string
  description: string
  category: 'development' | 'marketing' | 'operations' | 'finance'
  url: string
  isPremium: boolean
  rating: number
  used: boolean
  lastUsed: string
}

interface WorkspaceSectionProps {
  userProfile?: any
  onOpenOnboarding?: () => void
}

export function WorkspaceSection({ userProfile, onOpenOnboarding }: WorkspaceSectionProps) {
  const [selectedIdea, setSelectedIdea] = useState<IdeaProject | null>(null)

  // Get user's ideas (mock data for now)
  const userIdeas = MOCK_IDEAS

  return (
    <div className="w-full">
      <IdeasStartupsSection 
        userIdeas={userIdeas}
        selectedIdea={selectedIdea}
        setSelectedIdea={setSelectedIdea}
        onOpenOnboarding={onOpenOnboarding}
      />
    </div>
  )
}

// Ideas & Startups Section Component
function IdeasStartupsSection({ userIdeas, selectedIdea, setSelectedIdea, onOpenOnboarding }: any) {
  // If we have a selected idea, show the detailed timeline view
  if (selectedIdea) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedIdea(null)}
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Ideas
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Idea Timeline</h2>
            <p className="text-muted-foreground text-sm">Manage your idea's progress and milestones</p>
          </div>
        </div>
        
        <IdeaTimelineView 
          project={selectedIdea}
          onUpdateStage={(projectId, newStage) => {
            // Update stage logic
          }}
          onCompleteTask={(projectId, taskId) => {
            // Complete task logic
          }}
          onCompleteMilestone={(projectId, milestoneId) => {
            // Complete milestone logic
          }}
          onStartTask={(projectId, taskId) => {
            // Start task logic
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="mb-1">My Ideas & Startups</h2>
            <p className="text-gray-500 text-sm">Track and manage your business ideas and startup projects</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Idea
        </Button>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userIdeas.map((idea: any) => {
          const stageInfo = STAGE_INFO[idea.stage]
          const completedMilestones = idea.milestones.filter((m: any) => m.completed).length
          const totalMilestones = idea.milestones.length
          
          return (
            <Card key={idea.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-[#C8D6FF] bg-white" 
                  onClick={() => setSelectedIdea(idea)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <CardTitle className="mb-1.5">{idea.name}</CardTitle>
                    <p className="text-sm text-gray-500">{idea.industry}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-xs whitespace-nowrap">
                      {stageInfo.title}
                    </Badge>
                    {idea.isActive && (
                      <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] text-xs">Active</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {idea.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="text-[#114DFF]">{idea.progress}%</span>
                  </div>
                  <Progress value={idea.progress} className="h-2.5" />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIdea(idea)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" 
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add New Idea Card */}
        <Card className="hover:shadow-lg transition-all duration-200 border-2 border-dashed border-[#C8D6FF] bg-[#F7F9FF] hover:bg-[#EDF2FF] cursor-pointer">
          <CardContent className="flex items-center justify-center h-full min-h-[320px] text-center p-6">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2 text-gray-800">Add New Idea / Startup</h3>
              <p className="text-sm text-gray-500 mb-5">Start your next entrepreneurial journey</p>
              <Button 
                variant="outline" 
                className="border-[#C8D6FF] hover:bg-[#EDF2FF] hover:text-[#114DFF]"
                onClick={onOpenOnboarding}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}