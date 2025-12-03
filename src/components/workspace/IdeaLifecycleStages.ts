// Idea and Startup Lifecycle Management

export type IdeaStage = 
  | 'idea' 
  | 'validation' 
  | 'registered' 
  | 'mvp' 
  | 'traction' 
  | 'growth' 
  | 'scale'

export interface Milestone {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: string
  tasks: Task[]
}

export interface TaskDocumentation {
  id: string
  title: string
  filename: string
  fileType: 'pdf' | 'doc' | 'docx' | 'txt' | 'xlsx' | 'pptx' | 'md' | 'other'
  url?: string
  size?: number
  uploadedAt: string
  description?: string
}

export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  completedAt?: string
  startedAt?: string
  status?: 'not_started' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  estimatedHours?: number
  category: 'research' | 'development' | 'legal' | 'marketing' | 'funding' | 'operations' | 'team'
  documentation?: TaskDocumentation[]
}

export interface IdeaProject {
  id: string
  name: string
  description: string
  stage: IdeaStage
  industry: string
  targetMarket: string
  problemStatement: string
  solution: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  progress: number
  milestones: Milestone[]
  nextActions: Task[]
  estimatedTimeToNextStage?: string
  tags: string[]
  resources: {
    funding?: {
      raised: number
      target: number
      currency: string
    }
    team?: {
      size: number
      openPositions: string[]
    }
    metrics?: {
      users?: number
      revenue?: number
      partnerships?: number
    }
  }
}

export const STAGE_INFO: Record<IdeaStage, {
  title: string
  description: string
  color: string
  bgColor: string
  borderColor: string
  progress: number
  estimatedDuration: string
  keyActivities: string[]
  nextStage?: IdeaStage
}> = {
  idea: {
    title: 'Idea Stage',
    description: 'Initial concept development and basic research',
    color: 'text-[#114DFF]',
    bgColor: 'bg-[#F7F9FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 10,
    estimatedDuration: '2-4 weeks',
    keyActivities: ['Market research', 'Problem validation', 'Solution brainstorming'],
    nextStage: 'validation'
  },
  validation: {
    title: 'Validation Stage',
    description: 'Market validation and customer discovery',
    color: 'text-[#114DFF]',
    bgColor: 'bg-[#EDF2FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 25,
    estimatedDuration: '4-8 weeks',
    keyActivities: ['Customer interviews', 'Surveys', 'Prototype testing'],
    nextStage: 'registered'
  },
  registered: {
    title: 'Registered Startup',
    description: 'Legal entity formation and business setup',
    color: 'text-[#114DFF]',
    bgColor: 'bg-[#F7F9FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 40,
    estimatedDuration: '2-3 weeks',
    keyActivities: ['Business registration', 'Legal setup', 'IP protection'],
    nextStage: 'mvp'
  },
  mvp: {
    title: 'MVP Development',
    description: 'Building minimum viable product',
    color: 'text-[#3CE5A7]',
    bgColor: 'bg-[#EDF2FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 60,
    estimatedDuration: '8-16 weeks',
    keyActivities: ['Product development', 'Technical architecture', 'Initial testing'],
    nextStage: 'traction'
  },
  traction: {
    title: 'Initial Traction',
    description: 'First customers and product-market fit',
    color: 'text-[#3CE5A7]',
    bgColor: 'bg-[#F7F9FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 75,
    estimatedDuration: '12-24 weeks',
    keyActivities: ['Customer acquisition', 'Product refinement', 'Market feedback'],
    nextStage: 'growth'
  },
  growth: {
    title: 'Growth Stage',
    description: 'Scaling operations and user base',
    color: 'text-[#06CB1D]',
    bgColor: 'bg-[#EDF2FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 90,
    estimatedDuration: '6-12 months',
    keyActivities: ['Team expansion', 'Marketing scale-up', 'Operations optimization'],
    nextStage: 'scale'
  },
  scale: {
    title: 'Scale Stage',
    description: 'Enterprise growth and expansion',
    color: 'text-[#06CB1D]',
    bgColor: 'bg-[#F7F9FF]',
    borderColor: 'border-[#C8D6FF]',
    progress: 100,
    estimatedDuration: 'Ongoing',
    keyActivities: ['Market expansion', 'Product diversification', 'Strategic partnerships']
  }
}

// Core required tasks for each stage based on the entrepreneurial journey
export const getStageRequiredTasks = (stage: IdeaStage): Task[] => {
  const stageTasks: Record<IdeaStage, Task[]> = {
    idea: [
      {
        id: 'idea-task-1',
        title: 'Define Your Business Idea',
        description: 'Clearly articulate your business concept and value proposition',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 4,
        category: 'research'
      },
      {
        id: 'idea-task-2',
        title: 'Conduct Market Research',
        description: 'Research your target market, competitors, and industry trends',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 12,
        category: 'research'
      },
      {
        id: 'idea-task-3',
        title: 'Identify Target Audience',
        description: 'Define your ideal customer personas and demographics',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 6,
        category: 'research'
      }
    ],
    validation: [
      {
        id: 'validation-task-1',
        title: 'Validate my Idea',
        description: 'Test your business concept with potential customers and stakeholders',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 20,
        category: 'research'
      },
      {
        id: 'validation-task-2',
        title: 'Decide on the Business Model',
        description: 'Choose how your business will generate revenue and create value',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 8,
        category: 'research'
      },
      {
        id: 'validation-task-3',
        title: 'Write a Business Plan',
        description: 'Create a comprehensive business plan document',
        completed: true,
        completedAt: '2024-12-15T10:30:00Z',
        status: 'completed',
        priority: 'high',
        estimatedHours: 24,
        category: 'operations',
        documentation: [
          {
            id: 'doc-1',
            title: 'RACE AI Business Plan',
            filename: 'raceai-business-plan.pdf',
            fileType: 'pdf',
            size: 2450000,
            uploadedAt: '2024-12-15T10:30:00Z',
            description: 'Comprehensive business plan including market analysis, financial projections, and growth strategy'
          },
          {
            id: 'doc-2',
            title: 'Financial Projections Spreadsheet',
            filename: 'financial-projections.xlsx',
            fileType: 'xlsx',
            size: 890000,
            uploadedAt: '2024-12-15T10:45:00Z',
            description: '5-year financial model with revenue forecasts and expense breakdown'
          }
        ]
      },
      {
        id: 'validation-task-4',
        title: 'Create Your Project & Task Plan',
        description: 'Develop detailed project roadmap and task breakdown',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 6,
        category: 'operations'
      }
    ],
    registered: [
      {
        id: 'registered-task-1',
        title: 'Choose a Business Name',
        description: 'Select and verify availability of your business name',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 4,
        category: 'legal'
      },
      {
        id: 'registered-task-2',
        title: 'Register the Business',
        description: 'Complete legal business registration and incorporation',
        completed: true,
        completedAt: '2024-12-10T14:20:00Z',
        status: 'completed',
        priority: 'high',
        estimatedHours: 8,
        category: 'legal',
        documentation: [
          {
            id: 'doc-3',
            title: 'Certificate of Incorporation',
            filename: 'certificate-of-incorporation.pdf',
            fileType: 'pdf',
            size: 1200000,
            uploadedAt: '2024-12-10T14:20:00Z',
            description: 'Official certificate of business incorporation'
          },
          {
            id: 'doc-4',
            title: 'Articles of Organization',
            filename: 'articles-of-organization.pdf',
            fileType: 'pdf',
            size: 850000,
            uploadedAt: '2024-12-10T14:25:00Z',
            description: 'Legal documents defining business structure and ownership'
          },
          {
            id: 'doc-5',
            title: 'EIN Assignment Notice',
            filename: 'ein-assignment.pdf',
            fileType: 'pdf',
            size: 450000,
            uploadedAt: '2024-12-10T15:00:00Z',
            description: 'IRS Employer Identification Number assignment confirmation'
          }
        ]
      },
      {
        id: 'registered-task-3',
        title: 'Apply for Necessary Licenses',
        description: 'Obtain required business licenses and permits',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 12,
        category: 'legal'
      },
      {
        id: 'registered-task-4',
        title: 'Open a Business Bank Account',
        description: 'Set up dedicated business banking accounts',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 3,
        category: 'operations'
      }
    ],
    mvp: [
      {
        id: 'mvp-task-1',
        title: 'Create Your Minimum Viable Product',
        description: 'Build and test your MVP with core features',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 120,
        category: 'development'
      },
      {
        id: 'mvp-task-2',
        title: 'Look For Locations',
        description: 'Find and secure physical business locations if needed',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 16,
        category: 'operations'
      },
      {
        id: 'mvp-task-3',
        title: 'Set Up Accounting and Bookkeeping',
        description: 'Implement financial tracking and accounting systems',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 8,
        category: 'operations'
      }
    ],
    traction: [
      {
        id: 'traction-task-1',
        title: 'Create a Brand Identity',
        description: 'Develop your brand logo, colors, and visual identity',
        completed: true,
        completedAt: '2024-12-18T09:15:00Z',
        status: 'completed',
        priority: 'high',
        estimatedHours: 20,
        category: 'marketing',
        documentation: [
          {
            id: 'doc-6',
            title: 'Brand Guidelines Document',
            filename: 'raceai-brand-guidelines.pdf',
            fileType: 'pdf',
            size: 3200000,
            uploadedAt: '2024-12-18T09:15:00Z',
            description: 'Complete brand guidelines including logo usage, color palette, typography, and visual identity standards'
          },
          {
            id: 'doc-7',
            title: 'Logo Asset Package',
            filename: 'logo-assets.zip',
            fileType: 'other',
            size: 1800000,
            uploadedAt: '2024-12-18T09:20:00Z',
            description: 'High-resolution logo files in various formats (SVG, PNG, JPG) and variations'
          }
        ]
      },
      {
        id: 'traction-task-2',
        title: 'Develop A Website',
        description: 'Build your company website and online presence',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 40,
        category: 'development'
      },
      {
        id: 'traction-task-3',
        title: 'Create Social Profile',
        description: 'Set up social media profiles and online presence',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 8,
        category: 'marketing'
      },
      {
        id: 'traction-task-4',
        title: 'Register trademarks',
        description: 'Protect your brand with trademark registration',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 12,
        category: 'legal'
      },
      {
        id: 'traction-task-5',
        title: 'Source Vendors and Partners',
        description: 'Identify and establish key business partnerships',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 24,
        category: 'operations'
      },
      {
        id: 'traction-task-6',
        title: 'Find Interns',
        description: 'Recruit interns to support business operations',
        completed: false,
        status: 'not_started',
        priority: 'low',
        estimatedHours: 12,
        category: 'team'
      },
      {
        id: 'traction-task-7',
        title: 'Explore Barter Opportunities',
        description: 'Identify potential barter and collaboration opportunities',
        completed: false,
        status: 'not_started',
        priority: 'low',
        estimatedHours: 8,
        category: 'operations'
      }
    ],
    growth: [
      {
        id: 'growth-task-1',
        title: 'Launch Marketing Campaigns',
        description: 'Execute comprehensive marketing and advertising campaigns',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 40,
        category: 'marketing'
      },
      {
        id: 'growth-task-2',
        title: 'Build an Inventory/System',
        description: 'Establish inventory management and operational systems',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 32,
        category: 'operations'
      },
      {
        id: 'growth-task-3',
        title: 'Arrange funding and set your initial budget',
        description: 'Secure funding and establish financial planning',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 60,
        category: 'funding'
      },
      {
        id: 'growth-task-4',
        title: 'Plan & Launch Go-to-Market (GTM) Campaign',
        description: 'Develop and execute comprehensive go-to-market strategy',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 48,
        category: 'marketing'
      },
      {
        id: 'growth-task-5',
        title: 'Apply To Incubator',
        description: 'Research and apply to startup incubators and accelerators',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 20,
        category: 'funding'
      },
      {
        id: 'growth-task-6',
        title: 'Apply For Funding (coming soon)',
        description: 'Prepare and submit funding applications to investors',
        completed: false,
        status: 'not_started',
        priority: 'medium',
        estimatedHours: 80,
        category: 'funding'
      }
    ],
    scale: [
      {
        id: 'scale-task-1',
        title: 'Apply To Pitch Tank',
        description: 'Apply and pitch to investor pitch events and competitions',
        completed: false,
        status: 'not_started',
        priority: 'high',
        estimatedHours: 40,
        category: 'funding'
      }
    ]
  }

  return stageTasks[stage] || []
}

export const generateStageRecommendations = (stage: IdeaStage, project: IdeaProject): Task[] => {
  const baseRecommendations: Record<IdeaStage, Task[]> = {
    idea: [
      {
        id: 'idea-1',
        title: 'Conduct Market Size Analysis',
        description: 'Research the total addressable market (TAM) for your idea',
        completed: false,
        priority: 'high',
        estimatedHours: 8,
        category: 'research'
      },
      {
        id: 'idea-2',
        title: 'Define Target Customer Persona',
        description: 'Create detailed profiles of your ideal customers',
        completed: false,
        priority: 'high',
        estimatedHours: 4,
        category: 'research'
      },
      {
        id: 'idea-3',
        title: 'Analyze Competitors',
        description: 'Identify and analyze direct and indirect competitors',
        completed: false,
        priority: 'medium',
        estimatedHours: 6,
        category: 'research'
      }
    ],
    validation: [
      {
        id: 'validation-1',
        title: 'Conduct Customer Interviews',
        description: 'Interview 20+ potential customers to validate problem-solution fit',
        completed: false,
        priority: 'high',
        estimatedHours: 40,
        category: 'research'
      },
      {
        id: 'validation-2',
        title: 'Create Landing Page',
        description: 'Build a landing page to test demand and collect email signups',
        completed: false,
        priority: 'high',
        estimatedHours: 12,
        category: 'marketing'
      },
      {
        id: 'validation-3',
        title: 'Run Survey Campaign',
        description: 'Deploy surveys to validate assumptions about your target market',
        completed: false,
        priority: 'medium',
        estimatedHours: 8,
        category: 'research'
      }
    ],
    registered: [
      {
        id: 'registered-1',
        title: 'Register Business Entity',
        description: 'Choose and register appropriate business structure (LLC, Corp, etc.)',
        completed: false,
        priority: 'high',
        estimatedHours: 16,
        category: 'legal'
      },
      {
        id: 'registered-2',
        title: 'Setup Business Banking',
        description: 'Open business bank accounts and setup accounting systems',
        completed: false,
        priority: 'high',
        estimatedHours: 4,
        category: 'operations'
      },
      {
        id: 'registered-3',
        title: 'Trademark Registration',
        description: 'Protect your brand name and logo with trademark registration',
        completed: false,
        priority: 'medium',
        estimatedHours: 8,
        category: 'legal'
      }
    ],
    mvp: [
      {
        id: 'mvp-1',
        title: 'Define MVP Feature Set',
        description: 'Identify core features needed for minimum viable product',
        completed: false,
        priority: 'high',
        estimatedHours: 8,
        category: 'development'
      },
      {
        id: 'mvp-2',
        title: 'Build Technical Architecture',
        description: 'Design scalable technical foundation for your product',
        completed: false,
        priority: 'high',
        estimatedHours: 40,
        category: 'development'
      },
      {
        id: 'mvp-3',
        title: 'Setup Analytics Tracking',
        description: 'Implement user analytics and product usage tracking',
        completed: false,
        priority: 'medium',
        estimatedHours: 12,
        category: 'development'
      }
    ],
    traction: [
      {
        id: 'traction-1',
        title: 'Launch Beta Program',
        description: 'Recruit and onboard initial beta users for product testing',
        completed: false,
        priority: 'high',
        estimatedHours: 24,
        category: 'marketing'
      },
      {
        id: 'traction-2',
        title: 'Implement User Feedback Loop',
        description: 'Create systematic process for collecting and acting on user feedback',
        completed: false,
        priority: 'high',
        estimatedHours: 16,
        category: 'operations'
      },
      {
        id: 'traction-3',
        title: 'Develop Content Marketing Strategy',
        description: 'Create content marketing plan to attract and educate customers',
        completed: false,
        priority: 'medium',
        estimatedHours: 20,
        category: 'marketing'
      }
    ],
    growth: [
      {
        id: 'growth-1',
        title: 'Hire Key Team Members',
        description: 'Recruit essential team members to support growth',
        completed: false,
        priority: 'high',
        estimatedHours: 80,
        category: 'team'
      },
      {
        id: 'growth-2',
        title: 'Scale Marketing Channels',
        description: 'Expand successful marketing channels and test new ones',
        completed: false,
        priority: 'high',
        estimatedHours: 40,
        category: 'marketing'
      },
      {
        id: 'growth-3',
        title: 'Prepare Funding Round',
        description: 'Prepare pitch deck and financial projections for funding',
        completed: false,
        priority: 'medium',
        estimatedHours: 60,
        category: 'funding'
      }
    ],
    scale: [
      {
        id: 'scale-1',
        title: 'Explore New Markets',
        description: 'Research and validate expansion into new geographical or vertical markets',
        completed: false,
        priority: 'medium',
        estimatedHours: 40,
        category: 'research'
      },
      {
        id: 'scale-2',
        title: 'Build Strategic Partnerships',
        description: 'Develop partnerships with complementary businesses',
        completed: false,
        priority: 'medium',
        estimatedHours: 32,
        category: 'operations'
      },
      {
        id: 'scale-3',
        title: 'Optimize Operations',
        description: 'Implement automation and process improvements for efficiency',
        completed: false,
        priority: 'low',
        estimatedHours: 24,
        category: 'operations'
      }
    ]
  }

  return baseRecommendations[stage] || []
}

export const getNextStageMilestones = (currentStage: IdeaStage): Milestone[] => {
  const nextStage = STAGE_INFO[currentStage].nextStage
  if (!nextStage) return []

  const stageMilestones: Record<IdeaStage, Milestone[]> = {
    idea: [],
    validation: [
      {
        id: 'val-milestone-1',
        title: 'Problem-Solution Fit Validated',
        description: 'Confirmed that your solution addresses a real customer problem',
        completed: false,
        tasks: [
          {
            id: 'val-task-1',
            title: 'Complete 20 customer interviews',
            description: 'Interview potential customers to validate problem exists',
            completed: false,
            priority: 'high',
            category: 'research'
          }
        ]
      }
    ],
    registered: [
      {
        id: 'reg-milestone-1',
        title: 'Legal Entity Established',
        description: 'Business legally registered and operational',
        completed: false,
        tasks: [
          {
            id: 'reg-task-1',
            title: 'File business registration',
            description: 'Complete legal paperwork and registration process',
            completed: false,
            priority: 'high',
            category: 'legal'
          }
        ]
      }
    ],
    mvp: [
      {
        id: 'mvp-milestone-1',
        title: 'MVP Launched',
        description: 'Minimum viable product released to initial users',
        completed: false,
        tasks: [
          {
            id: 'mvp-task-1',
            title: 'Complete core feature development',
            description: 'Build essential features for MVP release',
            completed: false,
            priority: 'high',
            category: 'development'
          }
        ]
      }
    ],
    traction: [
      {
        id: 'traction-milestone-1',
        title: 'Product-Market Fit Achieved',
        description: 'Strong indication of product-market fit with growing user base',
        completed: false,
        tasks: [
          {
            id: 'traction-task-1',
            title: 'Reach 100 active users',
            description: 'Acquire and retain 100 actively engaged users',
            completed: false,
            priority: 'high',
            category: 'marketing'
          }
        ]
      }
    ],
    growth: [
      {
        id: 'growth-milestone-1',
        title: 'Scalable Growth Engine',
        description: 'Established repeatable and scalable customer acquisition',
        completed: false,
        tasks: [
          {
            id: 'growth-task-1',
            title: 'Identify scalable marketing channels',
            description: 'Find and optimize marketing channels that scale',
            completed: false,
            priority: 'high',
            category: 'marketing'
          }
        ]
      }
    ],
    scale: [
      {
        id: 'scale-milestone-1',
        title: 'Market Leadership Position',
        description: 'Established as a leader in your market segment',
        completed: false,
        tasks: [
          {
            id: 'scale-task-1',
            title: 'Achieve significant market share',
            description: 'Capture meaningful portion of addressable market',
            completed: false,
            priority: 'medium',
            category: 'operations'
          }
        ]
      }
    ]
  }

  return stageMilestones[nextStage] || []
}

export const calculateProjectProgress = (project: IdeaProject): number => {
  if (!project.milestones || project.milestones.length === 0) {
    return STAGE_INFO[project.stage].progress
  }

  const completedMilestones = project.milestones.filter(m => m.completed).length
  const totalMilestones = project.milestones.length
  const baseProgress = STAGE_INFO[project.stage].progress
  
  // Add bonus progress for completed milestones within the stage
  const milestoneProgress = (completedMilestones / totalMilestones) * 10
  
  return Math.min(100, baseProgress + milestoneProgress)
}

export const getStageRecommendedActions = (stage: IdeaStage, completedTasks: string[] = []): Task[] => {
  const allRecommendations = generateStageRecommendations(stage, {} as IdeaProject)
  return allRecommendations.filter(task => !completedTasks.includes(task.id))
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const downloadTaskDocumentation = async (task: Task) => {
  if (!task.documentation || task.documentation.length === 0) {
    return
  }

  try {
    if (task.documentation.length === 1) {
      // Single file download
      const doc = task.documentation[0]
      await downloadFile(doc.filename, doc.url || generateMockFileUrl(doc), doc.fileType)
    } else {
      // Multiple files - create a zip
      await downloadAsZip(task.documentation, `${task.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_documentation`)
    }
  } catch (error) {
    console.error('Error downloading task documentation:', error)
    throw new Error('Failed to download documentation')
  }
}

const downloadFile = async (filename: string, url: string, fileType: string) => {
  // Create a temporary link and trigger download
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadAsZip = async (documents: TaskDocumentation[], zipName: string) => {
  // This would typically use a library like JSZip in a real implementation
  // For now, we'll download files individually with a delay
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i]
    setTimeout(() => {
      downloadFile(doc.filename, doc.url || generateMockFileUrl(doc), doc.fileType)
    }, i * 500) // Stagger downloads to avoid browser blocking
  }
}

const generateMockFileUrl = (doc: TaskDocumentation): string => {
  // In a real implementation, this would return actual file URLs from storage
  // For demo purposes, we'll generate mock blob URLs
  const content = generateMockFileContent(doc)
  const blob = new Blob([content], { type: getMimeType(doc.fileType) })
  return URL.createObjectURL(blob)
}

const generateMockFileContent = (doc: TaskDocumentation): string => {
  switch (doc.fileType) {
    case 'pdf':
      return `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${doc.title}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n309\n%%EOF`
    case 'txt':
    case 'md':
      return `${doc.title}\n${'='.repeat(doc.title.length)}\n\n${doc.description}\n\nThis is a sample document generated for demonstration purposes.\n\nGenerated on: ${new Date(doc.uploadedAt).toLocaleString()}`
    default:
      return `Sample content for ${doc.title}\n\nDescription: ${doc.description}\n\nFile Type: ${doc.fileType}\nGenerated: ${new Date(doc.uploadedAt).toLocaleString()}`
  }
}

const getMimeType = (fileType: string): string => {
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'md': 'text/markdown',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'other': 'application/octet-stream'
  }
  return mimeTypes[fileType] || 'application/octet-stream'
}