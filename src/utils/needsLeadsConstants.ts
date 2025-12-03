// Needs & Leads Types and Constants

export interface Need {
  id: string
  title: string
  description: string
  category: string
  skillsRequired: string[]
  type: 'barter' | 'paid'
  
  // For barter needs
  skillsOffered?: string[]
  
  // For paid needs
  budget?: string
  budgetType?: 'fixed' | 'hourly' | 'negotiable'
  
  // Common fields
  duration: string
  urgency: 'low' | 'medium' | 'high'
  location?: string
  isRemote: boolean
  
  // Metadata
  postedBy: string
  posterName: string
  posterRole: string
  posterCompany?: string
  status: 'active' | 'paused' | 'closed' | 'fulfilled'
  createdAt: string
  updatedAt: string
  expiresAt?: string
  
  // Lead tracking
  leadCount: number
  viewCount: number
}

export interface Lead {
  id: string
  needId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  applicantRole: string
  applicantCompany?: string
  
  // Application details
  coverMessage: string
  proposedSolution: string
  portfolio?: string
  relevantExperience: string
  availability: string
  
  // For barter responses
  skillsOffering?: string[]
  
  // For paid responses
  proposedRate?: string
  
  // Status tracking
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn'
  appliedAt: string
  statusUpdatedAt: string
  
  // Communication
  notes: string
  lastMessageAt?: string
  messageCount: number
}

export interface LeadWithNeed extends Lead {
  need: Need | null
}

export const NEED_CATEGORIES = [
  { value: 'design', label: 'Design & Creative', icon: '🎨' },
  { value: 'development', label: 'Development & Tech', icon: '💻' },
  { value: 'marketing', label: 'Marketing & Growth', icon: '📈' },
  { value: 'business', label: 'Business Strategy', icon: '💼' },
  { value: 'legal', label: 'Legal & Compliance', icon: '⚖️' },
  { value: 'finance', label: 'Finance & Accounting', icon: '💰' },
  { value: 'content', label: 'Content & Writing', icon: '✍️' },
  { value: 'consulting', label: 'Consulting & Advice', icon: '🤝' },
  { value: 'operations', label: 'Operations & Admin', icon: '⚙️' },
  { value: 'other', label: 'Other', icon: '🔧' }
] as const

export const URGENCY_LEVELS = [
  { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800', description: 'Flexible timeline' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800', description: 'Within a few weeks' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800', description: 'Urgent - ASAP' }
] as const

export const NEED_TYPES = [
  { 
    value: 'barter', 
    label: 'Skill Exchange', 
    icon: '🔄',
    description: 'Exchange skills and expertise with other professionals' 
  },
  { 
    value: 'paid', 
    label: 'Paid Project', 
    icon: '💵',
    description: 'Hire professionals for paid assignments' 
  }
] as const

export const BUDGET_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'negotiable', label: 'Negotiable' }
] as const

export const LEAD_STATUSES = [
  { 
    value: 'pending', 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Awaiting review'
  },
  { 
    value: 'shortlisted', 
    label: 'Shortlisted', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Under consideration'
  },
  { 
    value: 'accepted', 
    label: 'Accepted', 
    color: 'bg-green-100 text-green-800',
    description: 'Selected for the project'
  },
  { 
    value: 'rejected', 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800',
    description: 'Not selected'
  },
  { 
    value: 'withdrawn', 
    label: 'Withdrawn', 
    color: 'bg-gray-100 text-gray-800',
    description: 'Applicant withdrew'
  }
] as const

export const COMMON_SKILLS = [
  // Design
  'UI/UX Design', 'Graphic Design', 'Brand Design', 'Web Design', 'Product Design',
  'Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping',
  
  // Development
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
  'Mobile Development', 'iOS Development', 'Android Development', 'Full-Stack Development',
  'Backend Development', 'Frontend Development', 'DevOps', 'AWS', 'Database Design',
  
  // Marketing
  'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO', 'SEM',
  'Email Marketing', 'Growth Hacking', 'Marketing Strategy', 'Brand Marketing',
  'Performance Marketing', 'Analytics', 'Conversion Optimization',
  
  // Business
  'Business Strategy', 'Product Management', 'Project Management', 'Business Development',
  'Sales', 'Customer Success', 'Market Research', 'Competitive Analysis',
  'Business Planning', 'Pitch Deck Creation', 'Investor Relations',
  
  // Content
  'Content Writing', 'Copywriting', 'Technical Writing', 'Blog Writing', 'Video Production',
  'Photography', 'Content Strategy', 'Social Media Content', 'Newsletter Writing',
  
  // Finance & Legal
  'Financial Modeling', 'Accounting', 'Legal Consulting', 'Contract Review',
  'IP Law', 'Corporate Law', 'Tax Planning', 'Fundraising', 'Investment Analysis',
  
  // Operations
  'Operations Management', 'Process Optimization', 'Supply Chain', 'Quality Assurance',
  'Data Analysis', 'Automation', 'Workflow Design', 'Team Management'
]

export const FILTER_OPTIONS = {
  category: [
    { value: 'all', label: 'All Categories' },
    ...NEED_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }))
  ],
  type: [
    { value: 'all', label: 'All Types' },
    ...NEED_TYPES.map(type => ({ value: type.value, label: type.label }))
  ],
  urgency: [
    { value: 'all', label: 'All Urgency Levels' },
    ...URGENCY_LEVELS.map(level => ({ value: level.value, label: level.label }))
  ],
  location: [
    { value: 'all', label: 'All Locations' },
    { value: 'remote', label: 'Remote Only' },
    { value: 'local', label: 'Local/On-site' }
  ]
} as const