import { Need, Lead, NEED_CATEGORIES, URGENCY_LEVELS, NEED_TYPES, BUDGET_TYPES, LEAD_STATUSES } from './needsLeadsConstants'

// Utility functions for Needs & Leads

export function canUserPostNeeds(userProfile: any): boolean {
  // Allow all users to post needs regardless of role
  return true
}

export function canUserRespondToNeeds(userProfile: any): boolean {
  if (!userProfile) return false
  
  // All roles can respond to needs - check both role and roleType for compatibility
  const userRole = userProfile.role || userProfile.roleType
  return ['founder', 'service_provider', 'freelancer', 'mentor', 'mentor_incubator', 'investor', 'student', 'job_seeker'].includes(userRole)
}

export function filterNeeds(
  needs: Need[], 
  searchTerm: string, 
  categoryFilter: string, 
  typeFilter: string, 
  urgencyFilter: string,
  locationFilter: string
): Need[] {
  return needs.filter(need => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.skillsRequired.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      need.posterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (need.posterCompany && need.posterCompany.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || need.category === categoryFilter
    
    // Type filter
    const matchesType = typeFilter === 'all' || need.type === typeFilter
    
    // Urgency filter
    const matchesUrgency = urgencyFilter === 'all' || need.urgency === urgencyFilter
    
    // Location filter
    const matchesLocation = locationFilter === 'all' || 
      (locationFilter === 'remote' && need.isRemote) ||
      (locationFilter === 'local' && !need.isRemote)
    
    return matchesSearch && matchesCategory && matchesType && matchesUrgency && matchesLocation
  })
}

export function getCategoryInfo(category: string) {
  return NEED_CATEGORIES.find(cat => cat.value === category) || NEED_CATEGORIES[NEED_CATEGORIES.length - 1]
}

export function getUrgencyInfo(urgency: string) {
  return URGENCY_LEVELS.find(level => level.value === urgency) || URGENCY_LEVELS[0]
}

export function getTypeInfo(type: string) {
  return NEED_TYPES.find(t => t.value === type) || NEED_TYPES[0]
}

export function getBudgetTypeInfo(budgetType: string) {
  return BUDGET_TYPES.find(type => type.value === budgetType) || BUDGET_TYPES[0]
}

export function getLeadStatusInfo(status: string) {
  return LEAD_STATUSES.find(s => s.value === status) || LEAD_STATUSES[0]
}

export function formatBudget(budget: string, budgetType: string): string {
  if (!budget) return 'Budget not specified'
  
  const typeInfo = getBudgetTypeInfo(budgetType)
  
  switch (budgetType) {
    case 'fixed':
      return `${budget} (Fixed Price)`
    case 'hourly':
      return `${budget}/hour`
    case 'negotiable':
      return `${budget} (Negotiable)`
    default:
      return budget
  }
}

export function formatSkillsOffered(skills: string[]): string {
  if (!skills || skills.length === 0) return 'No skills specified'
  
  if (skills.length === 1) return skills[0]
  if (skills.length === 2) return skills.join(' and ')
  
  return `${skills.slice(0, -1).join(', ')}, and ${skills[skills.length - 1]}`
}

export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  return `${diffInMonths}mo ago`
}

export function isNeedExpired(need: Need): boolean {
  if (!need.expiresAt) return false
  return new Date(need.expiresAt) < new Date()
}

export function canUserManageNeed(need: Need, userProfile: any): boolean {
  if (!userProfile || !need) return false
  return need.postedBy === userProfile.id || need.postedBy === userProfile.roleId
}

export function canUserRespondToNeed(need: Need, userProfile: any): boolean {
  if (!userProfile || !need) return false
  
  // Can't respond to your own need
  if (need.postedBy === userProfile.id || need.postedBy === userProfile.roleId) return false
  
  // Can't respond to closed/fulfilled needs
  if (need.status === 'closed' || need.status === 'fulfilled') return false
  
  // Can't respond to expired needs
  if (isNeedExpired(need)) return false
  
  return canUserRespondToNeeds(userProfile)
}

export function getNeedStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'paused': return 'bg-yellow-100 text-yellow-800'
    case 'closed': return 'bg-gray-100 text-gray-800'
    case 'fulfilled': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function validateNeedForm(formData: Partial<Need>): string[] {
  const errors: string[] = []
  
  if (!formData.title?.trim()) {
    errors.push('Title is required')
  }
  
  if (!formData.description?.trim()) {
    errors.push('Description is required')
  }
  
  if (!formData.category) {
    errors.push('Category is required')
  }
  
  if (!formData.type) {
    errors.push('Type is required')
  }
  
  if (!formData.skillsRequired || formData.skillsRequired.length === 0) {
    errors.push('At least one required skill must be specified')
  }
  
  if (formData.type === 'barter' && (!formData.skillsOffered || formData.skillsOffered.length === 0)) {
    errors.push('Skills offered are required for barter projects')
  }
  
  if (formData.type === 'paid' && !formData.budget?.trim()) {
    errors.push('Budget is required for paid projects')
  }
  
  if (!formData.duration?.trim()) {
    errors.push('Duration is required')
  }
  
  if (!formData.urgency) {
    errors.push('Urgency level is required')
  }
  
  return errors
}

export function validateLeadForm(formData: Partial<Lead>, needType: string): string[] {
  const errors: string[] = []
  
  if (!formData.coverMessage?.trim()) {
    errors.push('Cover message is required')
  }
  
  if (!formData.proposedSolution?.trim()) {
    errors.push('Proposed solution is required')
  }
  
  if (!formData.relevantExperience?.trim()) {
    errors.push('Relevant experience is required')
  }
  
  if (!formData.availability?.trim()) {
    errors.push('Availability is required')
  }
  
  if (needType === 'barter' && (!formData.skillsOffering || formData.skillsOffering.length === 0)) {
    errors.push('Skills you can offer are required for barter projects')
  }
  
  if (needType === 'paid' && !formData.proposedRate?.trim()) {
    errors.push('Proposed rate is required for paid projects')
  }
  
  return errors
}