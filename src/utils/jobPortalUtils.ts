import { Clock, CheckCircle, Star, XCircle } from 'lucide-react'
import { LOCATION_TYPES, APPLICATION_STATUSES, JOB_TYPES, EXPERIENCE_LEVELS } from './jobPortalConstants'

export const formatSalary = (salary: string, salaryType: string) => {
  if (salaryType === 'negotiable') return 'Salary negotiable'
  if (salaryType === 'fixed') return salary
  return salary // For range type
}

export const getLocationIcon = (locationType: string) => {
  const location = LOCATION_TYPES.find(type => type.value === locationType)
  return location?.icon || '📍'
}

export const getStatusColor = (status: string) => {
  const statusConfig = APPLICATION_STATUSES.find(s => s.value === status)
  return statusConfig?.color || 'bg-gray-100 text-gray-800'
}

export const getStatusMessage = (status: string) => {
  const statusConfig = APPLICATION_STATUSES.find(s => s.value === status)
  return statusConfig?.message || 'Application status unknown'
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return Clock
    case 'shortlisted': return CheckCircle
    case 'on_hold': return Star
    case 'rejected': return XCircle
    default: return Clock
  }
}

export const getExperienceLevel = (level: string) => {
  const experience = EXPERIENCE_LEVELS.find(exp => exp.value === level)
  return experience?.label || level
}

export const getJobType = (type: string) => {
  const jobType = JOB_TYPES.find(jt => jt.value === type)
  return jobType?.label || type
}

export const isApplicationDeadlinePassed = (deadline?: string) => {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export const daysUntilDeadline = (deadline?: string) => {
  if (!deadline) return null
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffTime = deadlineDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const canUserPostJobs = (userProfile?: any) => {
  // Handle single role object (activeRole) passed from StratoScaleDashboard
  if (userProfile?.roleType) {
    return ['founder', 'service_provider'].includes(userProfile.roleType)
  }
  
  // Handle full userProfile with activeRoles array (for future compatibility)
  if (userProfile?.activeRoles) {
    return userProfile.activeRoles.some((role: string) => 
      ['founder', 'serviceProvider'].includes(role)
    )
  }
  
  return false
}

export const canUserApplyToJobs = (userProfile?: any) => {
  // Handle single role object (activeRole) passed from StratoScaleDashboard
  if (userProfile?.roleType) {
    return ['student', 'job_seeker'].includes(userProfile.roleType) || !canUserPostJobs(userProfile)
  }
  
  // Handle full userProfile with activeRoles array (for future compatibility)  
  if (userProfile?.activeRoles) {
    return userProfile.activeRoles.some((role: string) => 
      ['student', 'jobSeeker'].includes(role)
    ) || !canUserPostJobs(userProfile)
  }
  
  return false
}

export const canUserAccessJobPortal = (userProfile?: any) => {
  // Handle single role object (activeRole) passed from StratoScaleDashboard
  if (userProfile?.roleType) {
    return ['founder', 'service_provider', 'student', 'job_seeker'].includes(userProfile.roleType)
  }
  
  // Handle full userProfile with activeRoles array (for future compatibility)
  if (userProfile?.activeRoles) {
    return userProfile.activeRoles.some((role: string) => 
      ['founder', 'service_provider', 'student', 'job_seeker'].includes(role)
    )
  }
  
  return false
}

export const filterJobs = (
  jobs: any[], 
  searchTerm: string, 
  locationFilter: string, 
  jobTypeFilter: string, 
  experienceFilter: string
) => {
  return jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLocation = locationFilter === 'all' || job.locationType === locationFilter
    const matchesJobType = jobTypeFilter === 'all' || job.jobType === jobTypeFilter
    const matchesExperience = experienceFilter === 'all' || job.experience === experienceFilter

    return matchesSearch && matchesLocation && matchesJobType && matchesExperience
  })
}

export const filterApplications = (
  applications: any[], 
  searchTerm: string, 
  statusFilter: string
) => {
  return applications.filter(app => {
    if (!app.job) return false
    
    const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })
}

export const getStatusCounts = (applications: any[]) => {
  return {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    on_hold: applications.filter(app => app.status === 'on_hold').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }
}

export const formatDate = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {}
  
  if (formatStr === 'PPP') {
    options.weekday = 'long'
    options.year = 'numeric'
    options.month = 'long'
    options.day = 'numeric'
  }
  
  return date.toLocaleDateString('en-US', options)
}