// Job Portal Types and Constants

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salary: string
  salaryType: 'range' | 'fixed' | 'negotiable'
  company: string
  location: string
  locationType: 'remote' | 'onsite' | 'hybrid'
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: 'entry' | 'mid' | 'senior' | 'lead'
  department: string
  skills: string[]
  benefits: string[]
  applicationDeadline: string
  status: 'active' | 'paused' | 'closed'
  postedBy: string
  posterName: string
  posterRole: string
  createdAt: string
  updatedAt: string
  applicationCount: number
}

export interface Application {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  coverLetter: string
  resumeUrl: string
  portfolioUrl: string
  experience: string
  status: 'pending' | 'shortlisted' | 'on_hold' | 'rejected'
  appliedAt: string
  statusUpdatedAt: string
  notes: string
}

export interface ApplicationWithJob extends Application {
  job: Job | null
}

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
] as const

export const LOCATION_TYPES = [
  { value: 'remote', label: 'Remote', icon: '🌐' },
  { value: 'onsite', label: 'On-site', icon: '🏢' },
  { value: 'hybrid', label: 'Hybrid', icon: '🔄' }
] as const

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'lead', label: 'Lead Level' }
] as const

export const SALARY_TYPES = [
  { value: 'range', label: 'Salary Range' },
  { value: 'fixed', label: 'Fixed Salary' },
  { value: 'negotiable', label: 'Negotiable' }
] as const

export const APPLICATION_STATUSES = [
  { 
    value: 'pending', 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800',
    message: 'Your application is under review'
  },
  { 
    value: 'shortlisted', 
    label: 'Shortlisted', 
    color: 'bg-green-100 text-green-800',
    message: 'Congratulations! You\'ve been shortlisted'
  },
  { 
    value: 'on_hold', 
    label: 'On Hold', 
    color: 'bg-blue-100 text-blue-800',
    message: 'Your application is on hold for future consideration'
  },
  { 
    value: 'rejected', 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800',
    message: 'Thank you for your interest. We\'ve decided to move forward with other candidates'
  }
] as const

export const FILTER_OPTIONS = {
  location: [
    { value: 'all', label: 'All Locations' },
    ...LOCATION_TYPES.map(type => ({ value: type.value, label: type.label }))
  ],
  jobType: [
    { value: 'all', label: 'All Types' },
    ...JOB_TYPES
  ],
  experience: [
    { value: 'all', label: 'All Levels' },
    ...EXPERIENCE_LEVELS
  ]
} as const