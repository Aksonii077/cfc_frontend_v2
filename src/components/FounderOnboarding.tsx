import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { 
  Lightbulb, 
  Building, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Target,
  Rocket,
  CheckCircle,
  Calendar,
  FileText,
  Info,
  Zap,
  TrendingUp,
  Network,
  Users,
  GraduationCap,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import cofounderCircleLogo from "figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png"
import { 
  trackOnboardingStart, 
  trackOnboardingStepView, 
  trackOnboardingStepComplete,
  trackOnboardingFieldEdit,
  trackDashboardSectionSelect,
  trackOnboardingComplete
} from '../utils/analytics'

interface OnboardingData {
  path: 'idea' | 'startup' | null
  selectedSection?: 'idea-launch-pad' | 'growth-hub'
  // Idea path data
  ideaTitle?: string
  ideaDescription?: string
  // Startup path data  
  startupName?: string
  startupDescription?: string
  startupStage?: string
  isIncorporated?: boolean
  incorporationDate?: string
  registrationNumber?: string
}

interface FounderOnboardingProps {
  onComplete: (data: OnboardingData) => void
  onBack?: () => void
}

const startupStages = [
  {
    value: 'ideation',
    label: 'Ideation',
    description: 'Just brainstorming and researching your idea'
  },
  {
    value: 'validation',
    label: 'Validation',
    description: 'Testing your idea with potential customers'
  },
  {
    value: 'registered',
    label: 'Registered',
    description: 'Business is legally registered but not fully operational'
  },
  {
    value: 'mvp',
    label: 'MVP',
    description: 'Built a minimum viable product for testing'
  },
  {
    value: 'initial-traction',
    label: 'Initial Traction',
    description: 'Have first customers and some revenue'
  },
  {
    value: 'growth',
    label: 'Growth',
    description: 'Scaling operations and growing customer base'
  },
  {
    value: 'scale',
    label: 'Scale',
    description: 'Established business looking to expand significantly'
  }
]

export function FounderOnboarding({ onComplete, onBack }: FounderOnboardingProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<'welcome' | 'path-selection' | 'idea-form' | 'startup-form' | 'incorporation' | 'completion'>('welcome')
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    path: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now())
  const [onboardingStartTime] = useState<number>(Date.now())

  // Track onboarding start on mount
  useEffect(() => {
    if (user) {
      trackOnboardingStart(user.id, 'founder')
    }
  }, [user])

  // Track step views
  useEffect(() => {
    const stepNames: Record<string, string> = {
      'welcome': 'Welcome',
      'path-selection': 'Path Selection',
      'idea-form': 'Idea Form',
      'startup-form': 'Startup Form',
      'incorporation': 'Incorporation',
      'completion': 'Completion'
    }
    
    const stepNumber: Record<string, number> = {
      'welcome': 1,
      'path-selection': 2,
      'idea-form': 3,
      'startup-form': 3,
      'incorporation': 4,
      'completion': 5
    }

    if (stepNames[currentStep]) {
      trackOnboardingStepView(stepNumber[currentStep], stepNames[currentStep])
      setStepStartTime(Date.now())
    }
  }, [currentStep])

  const handlePathSelection = (path: 'idea' | 'startup') => {
    // Track step completion
    const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000)
    trackOnboardingStepComplete(2, 'Path Selection', timeSpent)
    
    setOnboardingData(prev => ({ ...prev, path }))
    if (path === 'idea') {
      setCurrentStep('idea-form')
    } else {
      setCurrentStep('startup-form')
    }
  }

  const validateIdeaForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!onboardingData.ideaTitle?.trim()) {
      newErrors.ideaTitle = 'Please enter your idea title'
    }
    
    if (!onboardingData.ideaDescription?.trim()) {
      newErrors.ideaDescription = 'Please explain your idea and problem statement'
    } else if (onboardingData.ideaDescription.trim().length < 50) {
      newErrors.ideaDescription = 'Please provide more details (at least 50 characters)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStartupForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!onboardingData.startupName?.trim()) {
      newErrors.startupName = 'Please enter your startup name'
    }
    
    if (!onboardingData.startupDescription?.trim()) {
      newErrors.startupDescription = 'Please tell us about your startup'
    } else if (onboardingData.startupDescription.trim().length < 50) {
      newErrors.startupDescription = 'Please provide more details (at least 50 characters)'
    }
    
    if (!onboardingData.startupStage) {
      newErrors.startupStage = 'Please select your startup stage'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateIncorporationForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (onboardingData.isIncorporated) {
      if (!onboardingData.incorporationDate) {
        newErrors.incorporationDate = 'Please enter incorporation date'
      }
      
      if (!onboardingData.registrationNumber?.trim()) {
        newErrors.registrationNumber = 'Please enter registration number'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleIdeaSubmit = () => {
    if (validateIdeaForm()) {
      setCurrentStep('completion')
    }
  }

  const handleStartupSubmit = () => {
    if (validateStartupForm()) {
      const stage = onboardingData.startupStage
      if (stage && ['registered', 'mvp', 'initial-traction', 'growth', 'scale'].includes(stage)) {
        setCurrentStep('incorporation')
      } else {
        setCurrentStep('completion')
      }
    }
  }

  const handleIncorporationSubmit = () => {
    if (validateIncorporationForm()) {
      setCurrentStep('completion')
    }
  }

  const handleFinalSubmit = async (selectedSection?: 'idea-launch-pad' | 'growth-hub') => {
    if (selectedSection) {
      // Track dashboard section selection
      trackDashboardSectionSelect(selectedSection)
      
      // User clicked on a specific section box
      const updatedData = { ...onboardingData, selectedSection }
      
      // Track onboarding completion
      const totalTime = Math.floor((Date.now() - onboardingStartTime) / 1000)
      const completedSteps = 5
      trackOnboardingComplete(totalTime, completedSteps, selectedSection)
      
      // Complete onboarding and move to dashboard
      onComplete(updatedData)
    } else {
      // User clicked the general "Launch RACE AI" button
      setIsSubmitting(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Track onboarding completion (default to idea-launch-pad)
      const totalTime = Math.floor((Date.now() - onboardingStartTime) / 1000)
      const completedSteps = 5
      trackOnboardingComplete(totalTime, completedSteps, 'idea-launch-pad')
      
      // Complete onboarding and move to dashboard
      onComplete(onboardingData)
    }
  }

  const getStageDescription = (stage: string) => {
    return startupStages.find(s => s.value === stage)?.description || ''
  }

  // Helper to track field edits
  const handleFieldChange = (fieldName: string, value: any) => {
    trackOnboardingFieldEdit(fieldName, !!value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="space-y-3 mb-6">
                    <h2 className="text-3xl text-gray-900">Welcome</h2>
                    <p className="text-xl text-gray-600">to</p>
                    <div className="flex justify-center my-4">
                      <img 
                        src={cofounderCircleLogo} 
                        alt="CoFounder Circle" 
                        className="h-16 w-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-500">Powered by RACE AI</p>
                  </div>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                    Hi {user?.firstName}! Let's set up your entrepreneurial journey. 
                    This quick setup will help us personalize your AI companion to provide the most relevant guidance.
                  </p>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { icon: Lightbulb, title: 'Research', desc: 'Market insights & analysis', color: 'text-[#114DFF]' },
                      { icon: Target, title: 'Advise', desc: 'Strategic guidance', color: 'text-[#114DFF]' },
                      { icon: Network, title: 'Connect', desc: 'Find partners & resources', color: 'text-[#3CE5A7]' },
                      { icon: Zap, title: 'Execute', desc: 'Turn ideas into action', color: 'text-[#06CB1D]' }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-[#F7F9FF] to-white border border-[#C8D6FF] hover:shadow-md transition-all duration-200"
                      >
                        <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                        <h3 className="mb-1 text-center">{feature.title}</h3>
                        <p className="text-sm text-gray-600 text-center">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Bottom Buttons - Back and Get Started */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Back Button - Left Side */}
                    {onBack ? (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={onBack}
                        className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF] hover:border-[#114DFF] text-gray-700 px-8"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                    ) : (
                      <div />
                    )}
                    
                    {/* Get Started Button - Right Side */}
                    <Button 
                      size="lg" 
                      onClick={() => setCurrentStep('path-selection')}
                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white px-8"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Path Selection Step */}
          {currentStep === 'path-selection' && (
            <motion.div
              key="path-selection"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Tell us about your entrepreneurial journey</CardTitle>
                  <p className="text-gray-600 mt-2">
                    This helps us customize your RACE AI experience
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer border-2 border-[#C8D6FF] hover:border-[#114DFF] transition-all duration-200 bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF]"
                        onClick={() => handlePathSelection('idea')}
                      >
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Lightbulb className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl mb-3">I have an Idea</h3>
                          <p className="text-gray-600">
                            I am just at Ideation stage and trying to move forward from it.
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className="cursor-pointer border-2 border-[#C8D6FF] hover:border-[#114DFF] transition-all duration-200 bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF]"
                        onClick={() => handlePathSelection('startup')}
                      >
                        <CardContent className="p-8 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Building className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-xl mb-3">I have a Startup</h3>
                          <p className="text-gray-600">
                            I already have a Startup Registered and trying to move forward.
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                  
                  <div className="text-center mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('welcome')}
                      className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Idea Form Step */}
          {currentStep === 'idea-form' && (
            <motion.div
              key="idea-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Tell us about your idea</CardTitle>
                  <p className="text-gray-600 mt-2">
                    Help us understand your vision so we can provide targeted guidance
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="idea-title">Short Title *</Label>
                    <Input
                      id="idea-title"
                      placeholder="e.g., AI-powered fitness coach app"
                      value={onboardingData.ideaTitle || ''}
                      onChange={(e) => {
                        handleFieldChange('idea_title', e.target.value)
                        setOnboardingData(prev => ({ 
                          ...prev, 
                          ideaTitle: e.target.value 
                        }))
                      }}
                      className={errors.ideaTitle ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}
                    />
                    {errors.ideaTitle && (
                      <p className="text-[#FF220E] text-sm mt-1">{errors.ideaTitle}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="idea-description">Explain the Idea & Problem Statement *</Label>
                    <Textarea
                      id="idea-description"
                      placeholder="Describe your idea in detail. What problem does it solve? Who is your target audience? What makes it unique?"
                      value={onboardingData.ideaDescription || ''}
                      onChange={(e) => {
                        handleFieldChange('idea_description', e.target.value)
                        setOnboardingData(prev => ({ 
                          ...prev, 
                          ideaDescription: e.target.value 
                        }))
                      }}
                      className={`min-h-32 ${errors.ideaDescription ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                    />
                    {errors.ideaDescription && (
                      <p className="text-[#FF220E] text-sm mt-1">{errors.ideaDescription}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {onboardingData.ideaDescription?.length || 0} characters (minimum 50)
                    </p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('path-selection')}
                      className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleIdeaSubmit}
                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Startup Form Step */}
          {currentStep === 'startup-form' && (
            <motion.div
              key="startup-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Tell us about your startup</CardTitle>
                  <p className="text-gray-600 mt-2">
                    Help us understand your business so we can provide relevant support
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="startup-name">Startup Name *</Label>
                    <Input
                      id="startup-name"
                      placeholder="e.g., TechFlow Solutions"
                      value={onboardingData.startupName || ''}
                      onChange={(e) => setOnboardingData(prev => ({ 
                        ...prev, 
                        startupName: e.target.value 
                      }))}
                      className={errors.startupName ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}
                    />
                    {errors.startupName && (
                      <p className="text-[#FF220E] text-sm mt-1">{errors.startupName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="startup-description">Tell us more about your startup *</Label>
                    <Textarea
                      id="startup-description"
                      placeholder="What is your startup? What problem does it solve? What's your solution? Who are your customers?"
                      value={onboardingData.startupDescription || ''}
                      onChange={(e) => setOnboardingData(prev => ({ 
                        ...prev, 
                        startupDescription: e.target.value 
                      }))}
                      className={`min-h-32 ${errors.startupDescription ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                    />
                    {errors.startupDescription && (
                      <p className="text-[#FF220E] text-sm mt-1">{errors.startupDescription}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {onboardingData.startupDescription?.length || 0} characters (minimum 50)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="startup-stage">Startup Stage *</Label>
                    <Select 
                      value={onboardingData.startupStage || ''} 
                      onValueChange={(value) => setOnboardingData(prev => ({ 
                        ...prev, 
                        startupStage: value 
                      }))}
                    >
                      <SelectTrigger className={errors.startupStage ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}>
                        <SelectValue placeholder="Select your current stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {startupStages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <span>{stage.label}</span>
                                    <Info className="w-3 h-3 ml-2 text-gray-400" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{stage.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.startupStage && (
                      <p className="text-[#FF220E] text-sm mt-1">{errors.startupStage}</p>
                    )}
                    {onboardingData.startupStage && (
                      <p className="text-sm text-gray-600 mt-1">
                        {getStageDescription(onboardingData.startupStage)}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('path-selection')}
                      className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleStartupSubmit}
                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Incorporation Step */}
          {currentStep === 'incorporation' && (
            <motion.div
              key="incorporation"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Incorporation Details</CardTitle>
                  <p className="text-gray-600 mt-2">
                    Let us know about your legal business status
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <Label className="text-base">Is your startup incorporated?</Label>
                    <div className="flex gap-4 justify-center mt-4">
                      <Button
                        variant={onboardingData.isIncorporated === true ? "default" : "outline"}
                        onClick={() => setOnboardingData(prev => ({ ...prev, isIncorporated: true }))}
                        className={onboardingData.isIncorporated === true ? "min-w-24 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "min-w-24 border-[#C8D6FF] hover:bg-[#EDF2FF]"}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={onboardingData.isIncorporated === false ? "default" : "outline"}
                        onClick={() => setOnboardingData(prev => ({ ...prev, isIncorporated: false }))}
                        className={onboardingData.isIncorporated === false ? "min-w-24 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : "min-w-24 border-[#C8D6FF] hover:bg-[#EDF2FF]"}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  {onboardingData.isIncorporated === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="incorporation-date">Incorporation Date</Label>
                        <Input
                          id="incorporation-date"
                          type="month"
                          value={onboardingData.incorporationDate || ''}
                          onChange={(e) => setOnboardingData(prev => ({ 
                            ...prev, 
                            incorporationDate: e.target.value 
                          }))}
                          className={errors.incorporationDate ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}
                        />
                        {errors.incorporationDate && (
                          <p className="text-[#FF220E] text-sm mt-1">{errors.incorporationDate}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="registration-number">Registration Number</Label>
                        <Input
                          id="registration-number"
                          placeholder="e.g., 12345678"
                          value={onboardingData.registrationNumber || ''}
                          onChange={(e) => setOnboardingData(prev => ({ 
                            ...prev, 
                            registrationNumber: e.target.value 
                          }))}
                          className={errors.registrationNumber ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}
                        />
                        {errors.registrationNumber && (
                          <p className="text-[#FF220E] text-sm mt-1">{errors.registrationNumber}</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {onboardingData.isIncorporated === false && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#EDF2FF] rounded-lg p-4 border border-[#C8D6FF]"
                    >
                      <div className="flex items-center">
                        <Info className="w-5 h-5 text-[#114DFF] mr-2" />
                        <p className="text-gray-800">
                          No problem! RACE AI can help you understand incorporation options when you're ready.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('startup-form')}
                      className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleIncorporationSubmit}
                      className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Completion Step */}
          {currentStep === 'completion' && (
            <motion.div
              key="completion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm">
                <CardContent className="text-center py-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                    className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-3"
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="mb-2">Perfect! You're all set</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-4">
                      Welcome to RACE AI! Your personalized AI companion is ready to Research, Advise, Connect, and Execute with you.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto mb-4">
                      {/* Mentor Box */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFinalSubmit('mentor')}
                        className="cursor-pointer"
                      >
                        <Card className="h-full bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF] hover:border-[#114DFF] transition-all duration-200">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                                <GraduationCap className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col items-start">
                                <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-[10px] px-1.5 py-0">
                                  Perfect for Guidance
                                </Badge>
                                <h3 className="truncate">Mentor</h3>
                              </div>
                            </div>
                            
                            <p className="text-left text-gray-700 text-xs mb-2 line-clamp-2">
                              Connect with experienced mentors and advisors to guide your entrepreneurial journey.
                            </p>

                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Users className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Find Expert Mentors</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Target className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">One-on-One Guidance</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Network className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Industry Connections</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center text-[#114DFF] text-xs">
                              <span>Click to explore</span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Launch Pad Box */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFinalSubmit('idea-launch-pad')}
                        className="cursor-pointer"
                      >
                        <Card className="h-full bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF] hover:border-[#114DFF] transition-all duration-200">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Rocket className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col items-start">
                                <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-[10px] px-1.5 py-0">
                                  Perfect for Ideas
                                </Badge>
                                <h3 className="truncate">Launch Pad</h3>
                              </div>
                            </div>
                            
                            <p className="text-left text-gray-700 text-xs mb-2 line-clamp-2">
                              Transform your concepts into viable business plans with AI-powered tools and guidance.
                            </p>

                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Lightbulb className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Ideation & Brainstorming Tools</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Target className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Market Research & Analysis</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <FileText className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Business Plan Builder</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center text-[#114DFF] text-xs">
                              <span>Click to explore</span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Growth Hub Box */}
                      <motion.div
                        className="cursor-not-allowed opacity-60"
                      >
                        <Card className="h-full bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF] relative">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col items-start">
                                <Badge variant="outline" className="bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8] text-[10px] px-1.5 py-0">
                                  Coming Soon
                                </Badge>
                                <h3 className="truncate">Growth Hub</h3>
                              </div>
                            </div>
                            
                            <p className="text-left text-gray-700 text-xs mb-2 line-clamp-2">
                              Scale your registered startup with strategic connections and growth-focused resources.
                            </p>

                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <Users className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Connect with Mentors</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Building className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Find Service Providers</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Target className="w-3 h-3 mr-1.5 text-[#3CE5A7] flex-shrink-0" />
                                <span className="truncate">Access Investors Network</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center text-gray-500 text-xs">
                              <span>Available soon</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Funding Box */}
                      <motion.div
                        className="cursor-not-allowed opacity-60"
                      >
                        <Card className="h-full bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF] relative">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col items-start">
                                <Badge variant="outline" className="bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8] text-[10px] px-1.5 py-0">
                                  Coming Soon
                                </Badge>
                                <h3 className="truncate">Funding</h3>
                              </div>
                            </div>
                            
                            <p className="text-left text-gray-700 text-xs mb-2 line-clamp-2">
                              Access investors, funding opportunities, and financial resources to fuel your growth.
                            </p>

                            <div className="space-y-1">
                              <div className="flex items-center text-xs text-gray-600">
                                <DollarSign className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Investor Network Access</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <Target className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Funding Opportunities</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-600">
                                <FileText className="w-3 h-3 mr-1.5 text-[#114DFF] flex-shrink-0" />
                                <span className="truncate">Pitch Deck Preparation</span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center text-gray-500 text-xs">
                              <span>Available soon</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}