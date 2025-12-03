import { useState } from 'react'
import React from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowRight, 
  TrendingUp,
  Users,
  DollarSign,
  Lightbulb,
  Target,
  Rocket,
  Star,
  PlayCircle,
  Calendar,
  Download,
  FileText,
  Package,
  Building,
  Linkedin,
  Globe,
  Mail,
  Instagram,
  BarChart3,
  UserCircle,
  Video,
  Upload,
  ChevronDown,
  ChevronRight,
  Lock,
  Eye,
  Edit2,
  ExternalLink,
  CreditCard,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { IdeaProject, IdeaStage, STAGE_INFO, Milestone, Task, getStageRequiredTasks, formatFileSize, downloadTaskDocumentation } from './IdeaLifecycleStages'
import { toast } from 'sonner@2.0.3'

interface IdeaTimelineViewProps {
  project: IdeaProject
  onUpdateStage?: (projectId: string, newStage: IdeaStage) => void
  onCompleteTask?: (projectId: string, taskId: string) => void
  onCompleteMilestone?: (projectId: string, milestoneId: string) => void
  onStartTask?: (projectId: string, taskId: string) => void
}

export function IdeaTimelineView({ 
  project, 
  onUpdateStage, 
  onCompleteTask, 
  onCompleteMilestone,
  onStartTask 
}: IdeaTimelineViewProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null)
  const [selectedTimelineStage, setSelectedTimelineStage] = useState<IdeaStage | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'company-details': true,
    'team': false,
    'product': false,
    'market-competition': false,
    'traction-financials': false,
    'business-model-gtm': false,
    'funding-cap-table': false,
    'attachments': false,
    'help-looking-for': false
  })
  
  const [isReviewMode, setIsReviewMode] = useState(true)
  
  // State for funding entries
  const [fundingEntries, setFundingEntries] = useState<Array<{
    id: string;
    round: string;
    amount: string;
    investors: string;
    date: string;
    description: string;
  }>>([])
  
  const [newFundingEntry, setNewFundingEntry] = useState({
    round: '',
    amount: '',
    investors: '',
    date: '',
    description: ''
  })
  
  const currentStageInfo = STAGE_INFO[project.stage]
  const nextStageInfo = currentStageInfo.nextStage ? STAGE_INFO[currentStageInfo.nextStage] : null
  
  const completedMilestones = project.milestones.filter(m => m.completed).length
  const totalMilestones = project.milestones.length
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // For demo purposes, we'll track mock completion
    // In production, this would check actual form field values
    const sections = [
      { id: 'company-details', weight: 15, completed: 60 }, // Partially filled
      { id: 'team', weight: 15, completed: 0 },
      { id: 'product', weight: 15, completed: 0 },
      { id: 'market-competition', weight: 10, completed: 0 },
      { id: 'traction-financials', weight: 10, completed: 0 },
      { id: 'business-model-gtm', weight: 10, completed: 0 },
      { id: 'funding-cap-table', weight: 10, completed: 0 },
      { id: 'attachments', weight: 10, completed: 0 },
      { id: 'help-looking-for', weight: 5, completed: 0 }
    ]
    
    const totalCompletion = sections.reduce((acc, section) => {
      return acc + (section.weight * section.completed / 100)
    }, 0)
    
    return Math.round(totalCompletion)
  }

  const profileCompletion = calculateProfileCompletion()

  const getStageIcon = (stage: IdeaStage) => {
    switch (stage) {
      case 'idea': return Lightbulb
      case 'validation': return Target
      case 'registered': return CheckCircle
      case 'mvp': return Rocket
      case 'traction': return TrendingUp
      case 'growth': return Users
      case 'scale': return Star
      default: return Circle
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTaskPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'research': return Target
      case 'development': return Rocket
      case 'legal': return CheckCircle
      case 'marketing': return TrendingUp
      case 'funding': return DollarSign
      case 'operations': return Users
      case 'team': return Users
      default: return Circle
    }
  }

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Funding management functions
  const addFundingEntry = () => {
    if (!newFundingEntry.round || !newFundingEntry.amount) {
      toast.error('Please fill in funding round and amount')
      return
    }

    const entry = {
      id: Date.now().toString(),
      ...newFundingEntry
    }

    setFundingEntries(prev => [...prev, entry])
    setNewFundingEntry({
      round: '',
      amount: '',
      investors: '',
      date: '',
      description: ''
    })
    toast.success('Funding entry added successfully')
  }

  const removeFundingEntry = (id: string) => {
    setFundingEntries(prev => prev.filter(entry => entry.id !== id))
    toast.success('Funding entry removed')
  }

  const updateNewFundingEntry = (field: string, value: string) => {
    setNewFundingEntry(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isFinancialMetricsUnlocked = project.stage === 'registered' || 
    STAGE_INFO[project.stage].progress >= STAGE_INFO['registered'].progress

  const handleDownloadDocumentation = async (task: Task) => {
    try {
      await downloadTaskDocumentation(task)
      toast.success(`Downloaded documentation for \"${task.title}\"`)
    } catch (error) {
      toast.error('Failed to download documentation')
      console.error('Download error:', error)
    }
  }

  // Review mode summary renderers
  const renderReviewSummary = (sectionId: string) => {
    // Mock data - in production this would come from actual form state
    const summaries: Record<string, React.ReactNode> = {
      'company-details': (
        <div className="space-y-2">
          <p className="text-gray-700"><strong>Incorporation:</strong> DE123456789</p>
          <p className="text-gray-700"><strong>Email:</strong> contact@yourstartup.com</p>
          <p className="text-gray-700"><strong>Website:</strong> https://yourstartup.com</p>
          <p className="text-gray-500 text-sm italic">Social profiles not added</p>
        </div>
      ),
      'team': (
        <div className="text-gray-500 italic">
          No team members added yet
        </div>
      ),
      'product': (
        <div className="text-gray-500 italic">
          Product details not provided
        </div>
      ),
      'market-competition': (
        <div className="text-gray-500 italic">
          Market analysis not completed
        </div>
      ),
      'traction-financials': (
        <div className="text-gray-500 italic">
          Traction and financial metrics not provided
        </div>
      ),
      'business-model-gtm': (
        <div className="text-gray-500 italic">
          Business model and GTM strategy not defined
        </div>
      ),
      'funding-cap-table': (
        <div className="text-gray-500 italic">
          Funding details not provided
        </div>
      ),
      'attachments': (
        <div className="text-gray-500 italic">
          No attachments uploaded
        </div>
      ),
      'help-looking-for': (
        <div className="text-gray-500 italic">
          Help preferences not specified
        </div>
      )
    }
    
    return summaries[sectionId] || <div className="text-gray-500 italic">No data available</div>
  }

  // Profile section data and renderers
  const profileSections = [
    {
      id: 'company-details',
      title: 'Company Details',
      icon: Building,
      description: 'Basic company information and social profiles',
      locked: false
    },
    {
      id: 'team',
      title: 'Team',
      icon: Users,
      description: 'Founding team and key members',
      locked: false
    },
    {
      id: 'product',
      title: 'Product',
      icon: Rocket,
      description: 'Problem, solution, and product details',
      locked: false
    },
    {
      id: 'market-competition',
      title: 'Market & Competition',
      icon: Target,
      description: 'Market size, timing, and competitive landscape',
      locked: false
    },
    {
      id: 'traction-financials',
      title: 'Traction & Financials',
      icon: TrendingUp,
      description: 'Revenue, growth metrics, and key performance indicators',
      locked: false
    },
    {
      id: 'business-model-gtm',
      title: 'Business Model & GTM',
      icon: BarChart3,
      description: 'How you make money and acquire customers',
      locked: false
    },
    {
      id: 'funding-cap-table',
      title: 'Funding & Cap Table',
      icon: DollarSign,
      description: 'Past funding, ownership, and fundraising plans',
      locked: false
    },
    {
      id: 'attachments',
      title: 'Attachments',
      icon: FileText,
      description: 'Product images and pitch deck',
      locked: false
    },
    {
      id: 'help-looking-for',
      title: 'Help Looking For',
      icon: Lightbulb,
      description: 'Areas where you need mentorship support',
      locked: false
    }
  ]

  const renderCompanyDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Startup Incorporation Number</label>
          <Input placeholder="e.g., DE123456789" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Contact Email</label>
          <Input placeholder="contact@yourstartup.com" />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Company Website</label>
        <div className="flex items-center space-x-2">
          <Input placeholder="https://yourstartup.com" />
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Separator />
      
      <div className="space-y-3">
        <h4 className="font-medium">Social Media Profiles</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Linkedin className="w-5 h-5 text-blue-600" />
            <Input placeholder="https://linkedin.com/company/yourstartup" className="flex-1" />
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Instagram className="w-5 h-5 text-pink-600" />
            <Input placeholder="https://instagram.com/yourstartup" className="flex-1" />
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTeam = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm">Founders</label>
          <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <Plus className="w-4 h-4 mr-1" />
            Add Founder
          </Button>
        </div>
        <div className="space-y-3">
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm">Full Name</label>
                  <Input placeholder="e.g., Jane Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Role / Title</label>
                  <Input placeholder="e.g., CEO & Co-founder" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm">Time Commitment</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commitment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Ownership %</label>
                  <Input type="number" placeholder="e.g., 40" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">LinkedIn Profile</label>
                <Input placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="technical" />
                <label htmlFor="technical" className="text-sm cursor-pointer">Technical founder (can code)</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-sm">Why this team?</label>
        <p className="text-gray-600">Explain founder-market fit, prior collaboration, and complementary skills</p>
        <Textarea
          placeholder="E.g., Our CEO has 10 years in fintech, CTO built payment systems at Stripe, we've worked together for 3 years..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>
    </div>
  )

  const renderProduct = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Problem</label>
        <p className="text-gray-600">What specific problem are you solving?</p>
        <Textarea
          placeholder="E.g., Small businesses waste 20+ hours/month on manual bookkeeping..."
          rows={3}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Target User</label>
        <p className="text-gray-600">Who specifically experiences this problem?</p>
        <Input placeholder="E.g., Small business owners with 1-10 employees" className="bg-[#F7F9FF] border-[#C8D6FF]" />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Solution</label>
        <p className="text-gray-600">How does your product solve the problem?</p>
        <Textarea
          placeholder="E.g., AI-powered bookkeeping that automatically categorizes transactions and generates financial reports..."
          rows={3}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Demo / Product URL</label>
        <Input placeholder="https://app.yourstartup.com or https://demo.yourstartup.com" className="bg-[#F7F9FF] border-[#C8D6FF]" />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Differentiation & Unique Insight</label>
        <p className="text-gray-600">What makes you different?</p>
        <Textarea
          placeholder="E.g., Unlike existing solutions, we use LLMs trained on accounting standards..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>
    </div>
  )

  const renderMarketCompetition = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm">TAM (Total Addressable Market)</label>
          <p className="text-gray-600">Total market size in USD</p>
          <Input type="number" placeholder="5000000000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">SAM (Serviceable Available Market)</label>
          <p className="text-gray-600">Market you can serve</p>
          <Input type="number" placeholder="1000000000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">SOM (Serviceable Obtainable Market)</label>
          <p className="text-gray-600">Market you can capture</p>
          <Input type="number" placeholder="100000000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Why Now?</label>
        <p className="text-gray-600">What makes this the right time for your solution?</p>
        <Textarea
          placeholder="E.g., Recent regulatory changes require small businesses to maintain digital records..."
          rows={3}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm">Competitors</label>
          <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <Plus className="w-4 h-4 mr-1" />
            Add Competitor
          </Button>
        </div>
        <div className="space-y-3">
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm">Competitor Name</label>
                  <Input placeholder="e.g., QuickBooks" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Website</label>
                  <Input placeholder="https://competitor.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">How are you different?</label>
                <Textarea
                  placeholder="E.g., They target enterprises, we focus on solo businesses with AI automation..."
                  rows={2}
                  className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderTractionFinancials = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm mb-3 block">Monthly Revenue History</label>
        <div className="space-y-3">
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm">Month</label>
                  <Input type="month" className="bg-[#F7F9FF] border-[#C8D6FF]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Revenue (USD)</label>
                  <Input type="number" placeholder="25000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button variant="outline" size="sm" className="mt-3 border-[#C8D6FF] hover:bg-[#EDF2FF]">
          <Plus className="w-4 h-4 mr-1" />
          Add Month
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">MRR (Monthly Recurring Revenue)</label>
          <Input type="number" placeholder="50000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">ARR (Annual Recurring Revenue)</label>
          <Input type="number" placeholder="600000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">MoM Growth Rate %</label>
          <Input type="number" placeholder="15" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Monthly Active Users</label>
          <Input type="number" placeholder="5000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Customer Acquisition Cost (CAC)</label>
          <Input type="number" placeholder="150" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Lifetime Value (LTV)</label>
          <Input type="number" placeholder="1200" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Proof of Demand</label>
        <p className="text-gray-600">LOIs, pilots, waitlist size, retention data, etc.</p>
        <Textarea
          placeholder="E.g., 500 businesses on waitlist, 3 LOIs totaling $150K ARR, 90-day retention at 88%..."
          rows={3}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>
    </div>
  )

  const renderBusinessModelGTM = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Pricing / ACV (Annual Contract Value)</label>
        <p className="text-gray-600">Describe your pricing model, deal sizes, and any tiering</p>
        <Textarea
          placeholder="E.g., Tiered SaaS: $49/mo (Starter), $149/mo (Pro), $499/mo (Enterprise). ACV ranges from $588-$5,988..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Sales Cycle & CAC Payback</label>
        <p className="text-gray-600">How long to close a deal? Time to recover customer acquisition cost?</p>
        <Textarea
          placeholder="E.g., Self-serve signups convert in 7 days. Enterprise sales cycle is 45 days. CAC payback in 6 months..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Partnerships / Distribution</label>
        <p className="text-gray-600">Key partners, integrations, or distribution channels</p>
        <Textarea
          placeholder="E.g., Integrations with Stripe, Plaid, QuickBooks. Partner network of 50 accounting firms..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>
    </div>
  )

  const renderFundingCapTable = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm">Funding Rounds</label>
          <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <Plus className="w-4 h-4 mr-1" />
            Add Round
          </Button>
        </div>
        <div className="space-y-3">
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm">Round Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friends-family">Friends & Family</SelectItem>
                      <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm">Date Closed</label>
                  <Input type="month" className="bg-[#F7F9FF] border-[#C8D6FF]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm">Amount Raised (USD)</label>
                <Input type="number" placeholder="500000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm">Lead Investor(s)</label>
                <Input placeholder="e.g., Acme Ventures, Angel Investor Name" className="bg-[#F7F9FF] border-[#C8D6FF]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <label className="text-sm">Cap Table Summary</label>
        <p className="text-gray-600">Founder ownership %, investor breakdown, employee pool</p>
        <Textarea
          placeholder="E.g., Founders: 70% (CEO 40%, CTO 30%), Investors: 20%, Employee Pool: 10%..."
          rows={3}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm">Are you raising now?</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="raising-yes" />
              <label htmlFor="raising-yes" className="text-sm cursor-pointer">Yes</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="raising-no" />
              <label htmlFor="raising-no" className="text-sm cursor-pointer">No</label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Target Raise Amount</label>
          <Input type="number" placeholder="2000000" className="bg-[#F7F9FF] border-[#C8D6FF]" />
        </div>

        <div className="space-y-2">
          <label className="text-sm">Use of Funds</label>
          <Textarea
            placeholder="E.g., 40% engineering, 30% sales & marketing, 20% operations, 10% runway buffer..."
            rows={3}
            className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
          />
        </div>
      </div>
    </div>
  )

  const renderAttachments = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm">Product Images</label>
        <p className="text-gray-600">Upload screenshots or product photos (PNG/JPG)</p>
        <div className="border-2 border-dashed border-[#C8D6FF] rounded-lg p-8 text-center hover:border-[#114DFF] transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto text-[#114DFF] mb-3" />
          <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
          <p className="text-gray-500">PNG or JPG (max 5 images)</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm">Pitch Deck (Optional)</label>
        <p className="text-gray-600">Upload your pitch deck if available (PDF only, max 25 MB)</p>
        <div className="border-2 border-dashed border-[#C8D6FF] rounded-lg p-8 text-center hover:border-[#114DFF] transition-colors cursor-pointer">
          <FileText className="w-8 h-8 mx-auto text-[#114DFF] mb-3" />
          <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
          <p className="text-gray-500">PDF only (max 25 MB)</p>
        </div>
      </div>
    </div>
  )

  const renderHelpLookingFor = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="text-sm">Primary Focus Areas</label>
        <p className="text-gray-600 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Product Development', 'Go-to-Market Strategy', 'Fundraising', 'Team Building', 'Business Model', 'Sales & Marketing', 'Operations', 'Technology & Engineering', 'Financial Planning'].map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox id={area} />
              <label htmlFor={area} className="text-sm cursor-pointer">{area}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Specific Help Needed (Keywords)</label>
        <Input
          placeholder="E.g., fundraising strategy, product-market fit, hiring engineers..."
          className="bg-[#F7F9FF] border-[#C8D6FF]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm">Description</label>
        <p className="text-gray-600">Explain what you're looking for and how mentors can help</p>
        <Textarea
          placeholder="E.g., We're preparing for our seed round and need guidance on valuation, term sheets..."
          rows={4}
          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
        />
      </div>
    </div>
  )

  const renderMarketResearch = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Market Size & Opportunity</label>
        <Textarea placeholder="Describe the total addressable market (TAM), serviceable addressable market (SAM), and your target market size..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Competitive Analysis</label>
        <Textarea placeholder="List key competitors, their strengths/weaknesses, and your competitive advantages..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Market Trends & Insights</label>
        <Textarea placeholder="Key market trends, growth drivers, and industry insights that support your business..." rows={3} />
      </div>
    </div>
  )

  const renderTargetAudience = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Primary Customer Personas</label>
        <Textarea placeholder="Describe your main customer segments, their demographics, pain points, and behaviors..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Customer Acquisition Strategy</label>
        <Textarea placeholder="How do you plan to reach and acquire customers? Include marketing channels, partnerships, etc..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Customer Validation</label>
        <Textarea placeholder="What validation have you done with customers? Include surveys, interviews, pilot programs..." rows={3} />
      </div>
    </div>
  )

  const renderBusinessModel = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Revenue Streams</label>
        <Textarea placeholder="Describe your main revenue streams, pricing model, and monetization strategy..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Value Proposition</label>
        <Textarea placeholder="What unique value do you provide to customers? How do you solve their problems differently..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Go-to-Market Strategy</label>
        <Textarea placeholder="Your strategy for launching and scaling, including distribution channels, partnerships..." rows={3} />
      </div>
    </div>
  )

  const renderFinancialMetrics = () => {
    if (!isFinancialMetricsUnlocked) {
      return (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="font-medium text-gray-600 mb-2">Financial Metrics Locked</h4>
          <p className="text-sm text-gray-500 mb-4">
            Complete the "Registered" stage to unlock financial and adoption metrics
          </p>
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            Available after Registration
          </Badge>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Monthly Recurring Revenue (MRR)</label>
            <Input placeholder="$0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Customer Acquisition Cost (CAC)</label>
            <Input placeholder="$0" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm">Total Users/Customers</label>
            <Input placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-sm">Monthly Active Users (MAU)</label>
            <Input placeholder="0" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm">Key Performance Indicators</label>
          <Textarea placeholder="List your main KPIs, growth metrics, and how you measure success..." rows={3} />
        </div>
      </div>
    )
  }

  const renderAssetsAttachments = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Short Pitch Video</label>
        <div className="flex items-center space-x-2">
          <Input placeholder="YouTube or Vimeo link" />
          <Button variant="outline" size="sm">
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Pitch Deck</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-2">Upload your pitch deck (PDF)</p>
          <Button variant="outline" size="sm">
            Choose File
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Additional Materials</label>
        <div className="space-y-2">
          <div className="border rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm">No files uploaded yet</span>
            </div>
            <Button variant="outline" size="sm">
              Add Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderFundingDetails = () => (
    <div className="space-y-6">
      {/* Add New Funding Entry */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium mb-4 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add New Funding Round
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Funding Round</label>
              <Select value={newFundingEntry.round} onValueChange={(value) => updateNewFundingEntry('round', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select funding round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                  <SelectItem value="Angel">Angel</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Series A">Series A</SelectItem>
                  <SelectItem value="Series B">Series B</SelectItem>
                  <SelectItem value="Series C">Series C</SelectItem>
                  <SelectItem value="Series D">Series D</SelectItem>
                  <SelectItem value="Bridge">Bridge</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Funding Amount (USD)</label>
              <Input 
                placeholder="e.g., $500,000" 
                value={newFundingEntry.amount}
                onChange={(e) => updateNewFundingEntry('amount', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Lead Investor(s)</label>
              <Input 
                placeholder="e.g., Sequoia Capital, Individual Angel" 
                value={newFundingEntry.investors}
                onChange={(e) => updateNewFundingEntry('investors', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm">Funding Date</label>
              <Input 
                type="date" 
                value={newFundingEntry.date}
                onChange={(e) => updateNewFundingEntry('date', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm">Description / Notes</label>
            <Textarea 
              placeholder="Additional details about this funding round, terms, use of funds, etc..." 
              rows={2}
              value={newFundingEntry.description}
              onChange={(e) => updateNewFundingEntry('description', e.target.value)}
            />
          </div>
          
          <Button onClick={addFundingEntry} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Funding Entry
          </Button>
        </div>
      </div>

      {/* Existing Funding Entries */}
      {fundingEntries.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Funding History</h4>
          {fundingEntries.map((entry) => (
            <div key={entry.id} className="p-4 border rounded-lg bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {entry.round}
                    </Badge>
                    <span className="font-medium text-lg">{entry.amount}</span>
                    {entry.date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  
                  {entry.investors && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Investors:</span>
                      <span className="text-sm text-muted-foreground">{entry.investors}</span>
                    </div>
                  )}
                  
                  {entry.description && (
                    <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFundingEntry(entry.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Funding Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Funding Summary</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-700 font-medium">Total Funding Rounds</p>
                <p className="text-blue-900 text-lg font-semibold">{fundingEntries.length}</p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Latest Round</p>
                <p className="text-blue-900 font-semibold">
                  {fundingEntries.length > 0 
                    ? fundingEntries[fundingEntries.length - 1].round 
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-blue-700 font-medium">Total Raised</p>
                <p className="text-blue-900 text-lg font-semibold">
                  {fundingEntries.length > 0 
                    ? `${fundingEntries.length} round${fundingEntries.length > 1 ? 's' : ''}`
                    : 'No funding yet'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {fundingEntries.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="font-medium text-gray-600 mb-2">No Funding Entries Yet</h4>
          <p className="text-sm text-gray-500">
            Add your first funding round using the form above
          </p>
        </div>
      )}
    </div>
  )

  const renderCoFoundersLeadership = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm">Founder Information</label>
        <Textarea placeholder="Brief background of founders, their expertise, and previous experience..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Team Composition</label>
        <Textarea placeholder="Current team members, their roles, and key skills. Include any advisors..." rows={3} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm">Leadership Structure</label>
        <Textarea placeholder="How is your company organized? Who makes key decisions? Any board members..." rows={3} />
      </div>
    </div>
  )

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'company-details':
        return renderCompanyDetails()
      case 'team':
        return renderTeam()
      case 'product':
        return renderProduct()
      case 'market-competition':
        return renderMarketCompetition()
      case 'traction-financials':
        return renderTractionFinancials()
      case 'business-model-gtm':
        return renderBusinessModelGTM()
      case 'funding-cap-table':
        return renderFundingCapTable()
      case 'attachments':
        return renderAttachments()
      case 'help-looking-for':
        return renderHelpLookingFor()
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{project.name}</CardTitle>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className={`${currentStageInfo.bgColor} ${currentStageInfo.color} ${currentStageInfo.borderColor}`}>
                  {currentStageInfo.title}
                </Badge>
                <Badge variant="secondary">{project.industry}</Badge>
                <span className="text-sm text-muted-foreground">
                  Created {formatDate(project.createdAt)}
                </span>
              </div>
            </div>
            
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Overall Progress</p>
                <span className="text-sm text-muted-foreground font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Stage</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {React.createElement(getStageIcon(project.stage), { 
                    className: `w-4 h-4 ${currentStageInfo.color}` 
                  })}
                  <span className="text-sm font-medium">{currentStageInfo.title}</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {currentStageInfo.estimatedDuration}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Timeline */}
      <Card>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Stage Timeline</span>
            </div>
            <p className="text-xs text-muted-foreground font-normal">Click to view actions</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              {Object.entries(STAGE_INFO).map(([stageKey, stageInfo], index) => {
                const stage = stageKey as IdeaStage
                const StageIcon = getStageIcon(stage)
                const isCurrentStage = stage === project.stage
                const isCompletedStage = stageInfo.progress <= currentStageInfo.progress
                const isNextStage = stage === currentStageInfo.nextStage
                
                return (
                  <div key={stage} className="flex flex-col items-center relative">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                        selectedTimelineStage === stage
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : isCurrentStage 
                          ? `${stageInfo.bgColor} ${stageInfo.borderColor} border-2`
                          : isCompletedStage
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                      }`}
                      onClick={() => setSelectedTimelineStage(selectedTimelineStage === stage ? null : stage)}
                    >
                      <StageIcon className={`w-3.5 h-3.5 ${
                        selectedTimelineStage === stage
                          ? 'text-purple-600'
                          : isCurrentStage 
                          ? stageInfo.color
                          : isCompletedStage
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="mt-0.5 text-center min-h-[22px] flex flex-col justify-start">
                      <p className={`text-xs leading-tight ${
                        selectedTimelineStage === stage
                          ? 'text-purple-600 font-medium'
                          : isCurrentStage 
                          ? 'text-foreground font-medium' 
                          : 'text-muted-foreground'
                      }`}>
                        {stageInfo.title.split(' ')[0]}
                      </p>
                      {selectedTimelineStage === stage && (
                        <Badge variant="secondary" className="text-xs mt-0.5 px-1 py-0 bg-purple-100 text-purple-800 h-3.5 leading-none">
                          Active
                        </Badge>
                      )}
                      {!selectedTimelineStage && isCurrentStage && (
                        <Badge variant="secondary" className="text-xs mt-0.5 px-1 py-0 h-3.5 leading-none">
                          Current
                        </Badge>
                      )}
                    </div>
                    
                    {/* Connection line */}
                    {index < Object.keys(STAGE_INFO).length - 1 && (
                      <div className={`absolute top-3.5 left-7 w-full h-0.5 ${
                        isCompletedStage ? 'bg-green-300' : 'bg-gray-300'
                      }`} style={{ width: '70px' }} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Timeline Stage Actions */}
      {selectedTimelineStage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {React.createElement(getStageIcon(selectedTimelineStage), { 
                  className: `w-5 h-5 text-purple-600` 
                })}
                <span>{STAGE_INFO[selectedTimelineStage].title} Actions</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedTimelineStage(null)}
              >
                ×
              </Button>
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {STAGE_INFO[selectedTimelineStage].description}
            </p>
          </CardHeader>
          <CardContent>
            {(() => {
              const stageActions = getStageRequiredTasks(selectedTimelineStage)
              
              if (stageActions.length === 0) {
                return (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                    <p className="text-muted-foreground">No specific actions defined for this stage yet.</p>
                  </div>
                )
              }

              return (
                <div className="space-y-4">
                  

                  <div className="space-y-3">
                    {stageActions.map((action, index) => {
                      const CategoryIcon = getCategoryIcon(action.category)
                      const isCompleted = action.completed
                      const isCurrentStageAction = selectedTimelineStage === project.stage
                      
                      return (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`border rounded-lg p-4 transition-colors ${
                            isCompleted ? 'border-green-200 bg-green-50/50' : 'border-border hover:border-purple-200'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-purple-100 text-purple-600'
                              }`}>
                                {index + 1}
                              </div>
                              {isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <CategoryIcon className="w-4 h-4 text-muted-foreground" />
                                    <h4 className={`font-medium ${
                                      isCompleted ? 'line-through text-muted-foreground' : ''
                                    }`}>
                                      {action.title}
                                    </h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {action.description}
                                  </p>
                                  
                                  <div className="flex items-center space-x-3">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getTaskPriorityColor(action.priority)}`}
                                    >
                                      {action.priority}
                                    </Badge>
                                    {action.estimatedHours && (
                                      <span className="text-xs text-muted-foreground flex items-center space-x-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{action.estimatedHours}h</span>
                                      </span>
                                    )}
                                    <Badge variant="secondary" className="text-xs">
                                      {action.category}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 ml-4">
                                  {isCurrentStageAction && !isCompleted ? (
                                    <>
                                      {action.status === 'not_started' && (
                                        <Button 
                                          size="sm" 
                                          variant="outline"
                                          onClick={() => onStartTask?.(project.id, action.id)}
                                        >
                                          <PlayCircle className="w-4 h-4 mr-1" />
                                          Start
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        onClick={() => onCompleteTask?.(project.id, action.id)}
                                      >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Complete
                                      </Button>
                                    </>
                                  ) : isCompleted ? (
                                    <Badge variant="default" className="bg-green-600 text-white">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Completed
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                                      Available Later
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Current Stage Required Tasks */}
      {!selectedTimelineStage && (
        <Card className="border-[#C8D6FF]">
          <CardHeader>
            <CardTitle>Current Stage Required Tasks</CardTitle>
            <p className="text-gray-500 text-sm">
              Complete these essential tasks to advance to {nextStageInfo?.title || 'the next stage'}
            </p>
          </CardHeader>
          <CardContent>
            {(() => {
              const requiredTasks = getStageRequiredTasks(project.stage)
              
              if (requiredTasks.length === 0) {
                return (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#06CB1D] to-[#059e17] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="mb-2 text-gray-800">All required tasks completed for this stage!</h3>
                    <p className="text-sm text-gray-500">
                      You're ready to advance to the next stage.
                    </p>
                  </div>
                )
              }

              return (
                <div className="space-y-3">
                  {requiredTasks.map((task) => {
                    const CategoryIcon = getCategoryIcon(task.category)
                    const isCompleted = task.completed
                    
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border rounded-xl p-5 transition-all duration-200 ${
                          isCompleted 
                            ? 'border-[#C8D6FF] bg-[#EDF2FF]/50' 
                            : 'border-[#C8D6FF] bg-white hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    isCompleted 
                                      ? 'bg-[#EDF2FF]' 
                                      : 'bg-[#F7F9FF]'
                                  }`}>
                                    <CategoryIcon className={`w-4 h-4 ${
                                      isCompleted ? 'text-[#06CB1D]' : 'text-[#114DFF]'
                                    }`} />
                                  </div>
                                  <h4 className={`${
                                    isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                                  }`}>
                                    {task.title}
                                  </h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 leading-relaxed ml-10">
                                  {task.description}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                {!isCompleted ? (
                                  <>
                                    {task.status === 'not_started' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => onStartTask?.(project.id, task.id)}
                                        className="border-[#C8D6FF] hover:bg-[#EDF2FF] h-9"
                                      >
                                        <PlayCircle className="w-4 h-4 mr-1.5" />
                                        Start
                                      </Button>
                                    )}
                                    <Button 
                                      size="sm" 
                                      onClick={() => onCompleteTask?.(project.id, task.id)}
                                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-9"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1.5" />
                                      Complete
                                    </Button>
                                  </>
                                ) : (
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] px-3 py-1">
                                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                      Completed
                                    </Badge>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleDownloadDocumentation(task)}
                                      className="h-8 px-3 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                                    >
                                      <Download className="w-3.5 h-3.5 mr-1.5" />
                                      PDF
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Idea/Startup Profile - NEW REDESIGNED SECTION */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle>Startup Profile</CardTitle>
                <p className="text-sm text-gray-500">
                  {isReviewMode ? 'Review your application before submitting' : 'Company details and basic information'}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
              onClick={() => setIsReviewMode(!isReviewMode)}
            >
              {isReviewMode ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Mode
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Completion Progress */}
          <div className="mb-6 p-4 border border-[#C8D6FF] rounded-xl bg-[#F7F9FF]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  profileCompletion >= 90 ? 'bg-[#06CB1D]/10' : profileCompletion >= 50 ? 'bg-[#FF8C00]/10' : 'bg-[#FF220E]/10'
                }`}>
                  <span className={`${
                    profileCompletion >= 90 ? 'text-[#06CB1D]' : profileCompletion >= 50 ? 'text-[#FF8C00]' : 'text-[#FF220E]'
                  }`}>
                    {profileCompletion}%
                  </span>
                </div>
                <div>
                  <h4 className="text-gray-900">Application Completion</h4>
                  <p className="text-sm text-gray-600">
                    {profileCompletion >= 90 ? 'Looking good!' : profileCompletion >= 50 ? 'Almost there!' : 'Keep going!'}
                  </p>
                </div>
              </div>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            
            {profileCompletion < 90 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-[#FFE5E5] border border-[#FF220E]/30 rounded-lg flex items-start space-x-2"
              >
                <AlertCircle className="w-5 h-5 text-[#FF220E] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-gray-700">
                    <strong className="text-[#FF220E]">Incomplete applications are less likely to get selected</strong>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Complete all sections to increase your chances of acceptance
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="space-y-3">
            {isReviewMode ? (
              // Review Mode - Show all sections with summaries
              profileSections.map((section, index) => {
                const Icon = section.icon
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="p-4 border border-[#C8D6FF] rounded-xl bg-white hover:border-[#114DFF] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#EDF2FF] rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#114DFF]" />
                          </div>
                          <div>
                            <h4 className="text-gray-800">{section.title}</h4>
                            <p className="text-sm text-gray-500">{section.description}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsReviewMode(false)
                            toggleSection(section.id)
                          }}
                          className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="pl-[52px]">
                        {renderReviewSummary(section.id)}
                      </div>
                    </div>
                  </motion.div>
                )
              })
            ) : (
              // Edit Mode - Show collapsible sections
              profileSections.map((section, index) => {
              const Icon = section.icon
              const isOpen = openSections[section.id]
              const isLocked = section.locked

              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Collapsible
                    open={isOpen && !isLocked}
                    onOpenChange={() => !isLocked && toggleSection(section.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className={`w-full p-4 border rounded-xl transition-all duration-200 ${
                        isOpen && !isLocked 
                          ? 'border-[#C8D6FF] bg-[#EDF2FF]/50 cursor-pointer' 
                          : 'border-[#C8D6FF] hover:border-[#114DFF] hover:bg-[#F7F9FF] cursor-pointer'
                      } ${isLocked ? 'opacity-60 cursor-not-allowed hover:border-[#C8D6FF] hover:bg-transparent' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isLocked 
                                ? 'bg-[#F5F5F5]' 
                                : isOpen 
                                  ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] shadow-md' 
                                  : 'bg-[#EDF2FF]'
                            }`}>
                              {isLocked ? (
                                <Lock className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Icon className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-[#114DFF]'}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className={isLocked ? 'text-gray-500' : 'text-gray-800'}>{section.title}</h4>
                              <p className="text-sm text-gray-500">{section.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isLocked && (
                              <Badge variant="outline" className="bg-[#F5F5F5] text-gray-600 border-[#CCCCCC]">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                            {!isLocked && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Handle edit functionality
                                  }}
                                  className="hover:bg-[#EDF2FF] hover:text-[#114DFF] h-8"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                {isOpen ? (
                                  <ChevronDown className="w-5 h-5 text-[#114DFF]" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    {!isLocked && (
                      <CollapsibleContent>
                        <div className="mt-3 p-5 border border-t-0 border-[#C8D6FF] rounded-b-xl bg-white">
                          {renderSectionContent(section.id)}
                          
                          <div className="flex items-center justify-end space-x-2 mt-5 pt-4 border-t border-[#C8D6FF]">
                            <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#F7F9FF]">
                              Cancel
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                </motion.div>
              )
            })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}