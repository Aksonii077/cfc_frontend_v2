export interface ValidationResult {
  id: string
  ideaTitle: string
  ideaDescription: string
  overallScore: number
  marketPotentialScore: number
  feasibilityScore: number
  competitiveLandscapeScore: number
  validationSummary: string
  keyStrengths: string[]
  potentialChallenges: string[]
  recommendations: string[]
  nextSteps: string[]
  createdAt: string
}

export interface TaskForRegistration {
  id: string
  title: string
  description: string
  category: 'legal' | 'business' | 'technical' | 'marketing' | 'financial'
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  completed: boolean
  dueDate?: string
  resources?: {
    title: string
    url: string
    type: 'article' | 'template' | 'tool' | 'video'
  }[]
}

export interface SavedIdea {
  id: string
  title: string
  description: string
  userId: string
  createdAt: string
  lastModified: string
  status: 'draft' | 'validating' | 'validated' | 'registered'
  validationResult?: ValidationResult
}

class IdeaValidationService {
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async validateIdea(ideaData: { title: string; description: string; userId: string }): Promise<ValidationResult> {
    // Simulate API call delay
    await this.delay(2000)

    // Mock validation result - in production this would call your AI validation API
    const validationResult: ValidationResult = {
      id: `validation_${Date.now()}`,
      ideaTitle: ideaData.title,
      ideaDescription: ideaData.description,
      overallScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
      marketPotentialScore: Math.floor(Math.random() * 40) + 60,
      feasibilityScore: Math.floor(Math.random() * 40) + 60,
      competitiveLandscapeScore: Math.floor(Math.random() * 40) + 60,
      validationSummary: "Your idea shows strong market potential with innovative features that address real user pain points. The concept demonstrates good feasibility with current technology stacks and has a clear path to monetization.",
      keyStrengths: [
        "Strong market demand and clear target audience",
        "Innovative approach to solving existing problems",
        "Scalable business model with multiple revenue streams",
        "Leverages current technology trends effectively"
      ],
      potentialChallenges: [
        "Competitive market with established players",
        "User acquisition and retention costs",
        "Technical complexity in initial development",
        "Regulatory compliance requirements"
      ],
      recommendations: [
        "Conduct detailed market research and user interviews",
        "Develop a minimum viable product (MVP) to test core assumptions",
        "Build strategic partnerships with industry leaders",
        "Focus on a specific niche market initially"
      ],
      nextSteps: [
        "Register your business entity",
        "Develop a detailed business plan",
        "Create wireframes and prototypes",
        "Build your founding team",
        "Secure initial funding"
      ],
      createdAt: new Date().toISOString()
    }

    // Save validation result to localStorage
    const savedValidations = JSON.parse(localStorage.getItem('idea_validations') || '[]')
    savedValidations.push(validationResult)
    localStorage.setItem('idea_validations', JSON.stringify(savedValidations))

    return validationResult
  }

  async saveIdeaToWorkspace(ideaData: { title: string; description: string; userId: string }): Promise<SavedIdea> {
    const savedIdea: SavedIdea = {
      id: `idea_${Date.now()}`,
      title: ideaData.title,
      description: ideaData.description,
      userId: ideaData.userId,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      status: 'draft'
    }

    // Save to localStorage (in production this would save to your database)
    const savedIdeas = JSON.parse(localStorage.getItem('workspace_ideas') || '[]')
    savedIdeas.push(savedIdea)
    localStorage.setItem('workspace_ideas', JSON.stringify(savedIdeas))

    return savedIdea
  }

  async getRegistrationTasks(ideaTitle: string): Promise<TaskForRegistration[]> {
    // Simulate API call
    await this.delay(1000)

    // Mock registration tasks - in production this would be dynamic based on the idea type
    const tasks: TaskForRegistration[] = [
      {
        id: 'task_1',
        title: 'Business Registration',
        description: 'Register business entity (LLC, Corp, etc.)',
        category: 'legal',
        priority: 'high',
        estimatedTime: '1-2 weeks',
        completed: false,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        resources: [
          {
            title: 'Business Registration Guide',
            url: '#',
            type: 'article'
          },
          {
            title: 'Entity Selection Tool',
            url: '#',
            type: 'tool'
          }
        ]
      },
      {
        id: 'task_2',
        title: 'Business Plan Development',
        description: 'Create business plan with market analysis',
        category: 'business',
        priority: 'high',
        estimatedTime: '2-3 weeks',
        completed: false,
        resources: [
          {
            title: 'Business Plan Template',
            url: '#',
            type: 'template'
          }
        ]
      },
      {
        id: 'task_3',
        title: 'Trademark & IP Protection',
        description: 'Register trademarks and protect IP',
        category: 'legal',
        priority: 'medium',
        estimatedTime: '3-6 months',
        completed: false,
        resources: [
          {
            title: 'IP Protection Guide',
            url: '#',
            type: 'article'
          }
        ]
      },
      {
        id: 'task_4',
        title: 'Domain & Website Setup',
        description: 'Secure domain and setup website',
        category: 'technical',
        priority: 'medium',
        estimatedTime: '1 week',
        completed: false,
        resources: [
          {
            title: 'Website Setup Guide',
            url: '#',
            type: 'article'
          }
        ]
      },
      {
        id: 'task_5',
        title: 'Financial Setup',
        description: 'Open business bank account and setup accounting',
        category: 'financial',
        priority: 'high',
        estimatedTime: '1-2 weeks',
        completed: false,
        resources: [
          {
            title: 'Business Banking Guide',
            url: '#',
            type: 'article'
          },
          {
            title: 'Accounting Software Comparison',
            url: '#',
            type: 'tool'
          }
        ]
      },
      {
        id: 'task_6',
        title: 'MVP Development Plan',
        description: 'Plan minimum viable product development',
        category: 'technical',
        priority: 'high',
        estimatedTime: '1 week',
        completed: false,
        resources: [
          {
            title: 'MVP Planning Template',
            url: '#',
            type: 'template'
          }
        ]
      }
    ]

    return tasks
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<void> {
    // In production, this would update the database
    // For now, we'll just simulate the update
    await this.delay(500)
    console.log(`Task ${taskId} updated to ${completed ? 'completed' : 'pending'}`)
  }

  async getValidationHistory(userId: string): Promise<ValidationResult[]> {
    const savedValidations = JSON.parse(localStorage.getItem('idea_validations') || '[]')
    return savedValidations
  }

  async getSavedIdeas(userId: string): Promise<SavedIdea[]> {
    const savedIdeas = JSON.parse(localStorage.getItem('workspace_ideas') || '[]')
    return savedIdeas.filter((idea: SavedIdea) => idea.userId === userId)
  }
}

export const ideaValidationService = new IdeaValidationService()