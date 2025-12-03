import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Checkbox } from '../ui/checkbox'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Card, CardContent } from '../ui/card'
import { toast } from 'sonner@2.0.3'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import {
  trackMentorApplicationStart,
  trackMentorApplicationStepView,
  trackMentorApplicationStepComplete,
  trackMentorApplicationFlowSelected,
  trackMentorApplicationDeckUpload,
  trackMentorApplicationSectionEdit,
  trackMentorApplicationReviewView,
  trackMentorApplicationSubmit,
  trackMentorApplicationAbandon,
} from '../../utils/analytics'
import {
  klaviyoTrackMentorApplicationStart,
  klaviyoTrackMentorApplicationStepView,
  klaviyoTrackMentorApplicationStepComplete,
  klaviyoTrackMentorApplicationFlowSelected,
  klaviyoTrackMentorApplicationDeckUpload,
  klaviyoTrackMentorApplicationSectionEdit,
  klaviyoTrackMentorApplicationReviewView,
  klaviyoTrackMentorApplicationSubmit,
  klaviyoTrackMentorApplicationAbandon,
} from '../../utils/klaviyo'

interface MentorApplicationFormProps {
  mentorName: string
  programName: string
  onBack: () => void
}

interface Founder {
  name: string
  role: string
  timeCommitment: 'full-time' | 'part-time' | ''
  linkedin: string
  ownership: string
  isTechnical: boolean
}

interface Competitor {
  name: string
  url: string
  differentiation: string
}

interface MonthlyRevenue {
  month: string
  revenue: string
}

interface FundingRound {
  type: string
  date: string
  amount: string
  investors: string
}

type CurrentStage = 'Idea' | 'MVP' | 'Pre-seed' | 'Seed' | 'Series A+' | ''

export function MentorApplicationForm({ mentorName, programName, onBack }: MentorApplicationFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadDeckNow, setUploadDeckNow] = useState<'yes' | 'no' | ''>('')
  const [deckFile, setDeckFile] = useState<File | null>(null)
  const [deckUploading, setDeckUploading] = useState(false)
  const [deckUploadProgress, setDeckUploadProgress] = useState(0)
  const [productImages, setProductImages] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const deckInputRef = useRef<HTMLInputElement>(null)
  const imagesInputRef = useRef<HTMLInputElement>(null)

  // Tracking state
  const [formStartTime] = useState(Date.now())
  const [stepStartTime, setStepStartTime] = useState(Date.now())
  const [hasTrackedMount, setHasTrackedMount] = useState(false)

  // Step 1 - Basics
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [startupName, setStartupName] = useState('')
  const [website, setWebsite] = useState('')
  const [hqLocation, setHqLocation] = useState('')
  const [yearFounded, setYearFounded] = useState('')
  const [currentStage, setCurrentStage] = useState<CurrentStage>('')
  const [oneLiner, setOneLiner] = useState('')
  const [summary, setSummary] = useState('')

  // Step 2 - Team
  const [founders, setFounders] = useState<Founder[]>([{
    name: '',
    role: '',
    timeCommitment: '',
    linkedin: '',
    ownership: '',
    isTechnical: false
  }])
  const [teamRationale, setTeamRationale] = useState('')

  // Step 3 - Product
  const [problem, setProblem] = useState('')
  const [targetUser, setTargetUser] = useState('')
  const [solution, setSolution] = useState('')
  const [demoUrl, setDemoUrl] = useState('')
  const [differentiation, setDifferentiation] = useState('')

  // Step 4 - Market & Competition
  const [tam, setTam] = useState('')
  const [sam, setSam] = useState('')
  const [som, setSom] = useState('')
  const [whyNow, setWhyNow] = useState('')
  const [competitors, setCompetitors] = useState<Competitor[]>([{ name: '', url: '', differentiation: '' }])

  // Step 5 - Traction & Financials
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([{ month: '', revenue: '' }])
  const [mrr, setMrr] = useState('')
  const [arr, setArr] = useState('')
  const [growthRate, setGrowthRate] = useState('')
  const [mau, setMau] = useState('')
  const [retention, setRetention] = useState('')
  const [cac, setCac] = useState('')
  const [ltv, setLtv] = useState('')
  const [grossMargin, setGrossMargin] = useState('')
  const [burn, setBurn] = useState('')
  const [runway, setRunway] = useState('')
  const [proofOfDemand, setProofOfDemand] = useState('')

  // Step 6 - Funding & Cap Table
  const [hasFunding, setHasFunding] = useState<boolean | null>(null)
  const [fundingRounds, setFundingRounds] = useState<FundingRound[]>([{ type: '', date: '', amount: '', investors: '' }])
  const [capTableSummary, setCapTableSummary] = useState('')
  const [raisingNow, setRaisingNow] = useState<boolean | null>(null)
  const [targetAmount, setTargetAmount] = useState('')
  const [useOfFunds, setUseOfFunds] = useState('')

  // Step 8 - Help Looking For
  const [primaryFocusArea, setPrimaryFocusArea] = useState<string[]>([])
  const [specificSupport, setSpecificSupport] = useState('')
  const [helpDescription, setHelpDescription] = useState('')

  // Flow A (with deck): Steps 1 → 8 → 9 (3 steps total)
  // Flow B (no deck): Steps 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 (9 steps total)
  const isFlowA = uploadDeckNow === 'yes' && deckFile !== null
  
  // Calculate display step number and total for progress
  const getDisplayStep = () => {
    if (isFlowA) {
      if (currentStep === 1) return 1
      if (currentStep === 8) return 2
      if (currentStep === 9) return 3
    }
    return currentStep
  }
  
  const totalSteps = isFlowA ? 3 : 9
  const displayStep = getDisplayStep()
  const progress = (displayStep / totalSteps) * 100

  const stepTitles: Record<number, string> = {
    1: 'Basics',
    2: 'Team',
    3: 'Product',
    4: 'Market & Competition',
    5: 'Traction & Financials',
    6: 'Funding & Cap Table',
    7: 'Attachments',
    8: 'Help Looking For',
    9: 'Review & Submit'
  }

  const focusAreas = [
    'Product Development',
    'Go-to-Market Strategy',
    'Fundraising',
    'Team Building',
    'Business Model',
    'Sales & Marketing',
    'Operations',
    'Technology & Engineering',
    'Legal & Compliance',
    'Financial Planning'
  ]

  // Track application start on mount
  useEffect(() => {
    if (!hasTrackedMount && user) {
      trackMentorApplicationStart(mentorName, programName)
      klaviyoTrackMentorApplicationStart(user.id, mentorName, programName)
      setHasTrackedMount(true)
    }
  }, [hasTrackedMount, user, mentorName, programName])

  // Track step views and step changes
  useEffect(() => {
    if (user) {
      const stepName = stepTitles[currentStep] || `Step ${currentStep}`
      trackMentorApplicationStepView(currentStep, stepName)
      klaviyoTrackMentorApplicationStepView(user.id, currentStep, stepName)
      setStepStartTime(Date.now())
    }
  }, [currentStep, user])

  // Track review view when reaching step 11
  useEffect(() => {
    if (currentStep === 11 && user) {
      // Calculate completion inline to avoid dependency issues
      let totalFields = 6 // Step 1 required fields
      let filledFields = 0

      if (contactName.trim()) filledFields++
      if (email.trim()) filledFields++
      if (startupName.trim()) filledFields++
      if (hqLocation.trim()) filledFields++
      if (currentStage) filledFields++
      if (oneLiner.trim()) filledFields++

      const isFlowA = uploadDeckNow === 'yes' && deckFile
      
      if (!isFlowA) {
        totalFields += 15 // Additional flow B fields
        if (founders.some(f => f.name.trim())) filledFields++
        if (problem.trim()) filledFields++
        if (targetUser.trim()) filledFields++
        if (solution.trim()) filledFields++
      }

      totalFields += 2 // Step 9 required
      if (primaryFocusArea.length > 0) filledFields++
      if (helpDescription.trim()) filledFields++

      const completion = Math.round((filledFields / totalFields) * 100)
      
      trackMentorApplicationReviewView(completion)
      klaviyoTrackMentorApplicationReviewView(user.id, completion)
    }
  }, [currentStep, user, contactName, email, startupName, hqLocation, currentStage, oneLiner, uploadDeckNow, deckFile, founders, problem, targetUser, solution, primaryFocusArea, helpDescription])

  // Validation functions
  const validateStep1 = () => {
    if (!contactName.trim() || contactName.length > 120) {
      toast.error('Primary Contact Name is required (max 120 characters)')
      return false
    }
    if (!email.trim() || !email.includes('@')) {
      toast.error('Valid email is required')
      return false
    }
    if (!startupName.trim()) {
      toast.error('Startup Name is required')
      return false
    }
    if (!hqLocation.trim()) {
      toast.error('HQ City/Country is required')
      return false
    }
    if (!currentStage) {
      toast.error('Current Stage is required')
      return false
    }
    if (!oneLiner.trim() || oneLiner.length > 180) {
      toast.error('One-line Pitch is required (max 180 characters)')
      return false
    }
    if (summary.length > 280) {
      toast.error('Summary must be max 280 characters')
      return false
    }
    if (!uploadDeckNow) {
      toast.error('Please select whether you want to upload pitch deck now')
      return false
    }
    if (uploadDeckNow === 'yes' && !deckFile) {
      toast.error('Please upload your pitch deck')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (founders.length === 0 || !founders[0].name.trim()) {
      toast.error('At least one founder is required')
      return false
    }
    for (const founder of founders) {
      if (founder.name.trim() && !founder.role.trim()) {
        toast.error('All founders must have a role specified')
        return false
      }
    }
    return true
  }

  const validateStep3 = () => {
    if (!problem.trim() || problem.length > 1200) {
      toast.error('Problem description is required (max 1,200 characters)')
      return false
    }
    if (!targetUser.trim() || targetUser.length > 800) {
      toast.error('Target User/Customer is required (max 800 characters)')
      return false
    }
    if (!solution.trim() || solution.length > 1500) {
      toast.error('Solution & Product State is required (max 1,500 characters)')
      return false
    }
    return true
  }

  const validateStep5 = () => {
    // Stage-gated validation for Seed and Series A+
    if (currentStage === 'Seed' || currentStage === 'Series A+') {
      if (!mrr.trim() && !arr.trim()) {
        toast.error('MRR or ARR is required for Seed and Series A+ stages')
        return false
      }
      if (!grossMargin.trim()) {
        toast.error('Gross Margin is required for Seed and Series A+ stages')
        return false
      }
    }
    return true
  }

  const validateStep8 = () => {
    if (primaryFocusArea.length === 0) {
      toast.error('Please select at least one primary focus area')
      return false
    }
    return true
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    let totalFields = 0
    let filledFields = 0

    // Step 1: Basics (7 required + 3 optional)
    totalFields += 7
    if (contactName.trim()) filledFields++
    if (email.trim()) filledFields++
    if (startupName.trim()) filledFields++
    if (hqLocation.trim()) filledFields++
    if (currentStage) filledFields++
    if (oneLiner.trim()) filledFields++
    if (uploadDeckNow) filledFields++
    
    // Optional fields (weighted less)
    totalFields += 3
    if (phone.trim()) filledFields++
    if (website.trim()) filledFields++
    if (yearFounded.trim()) filledFields++

    // If Flow A (deck uploaded), skip steps 2-9
    if (uploadDeckNow === 'yes' && deckFile) {
      totalFields += 1
      filledFields++ // Deck is uploaded
    } else {
      // Step 2: Team (3 required)
      totalFields += 3
      if (founders.some(f => f.name.trim())) filledFields++
      if (founders.some(f => f.role.trim())) filledFields++
      if (teamRationale.trim()) filledFields++

      // Step 3: Product (3 required + 2 optional)
      totalFields += 3
      if (problem.trim()) filledFields++
      if (targetUser.trim()) filledFields++
      if (solution.trim()) filledFields++
      totalFields += 2
      if (demoUrl.trim()) filledFields++
      if (differentiation.trim()) filledFields++

      // Step 4: Market & Competition (2 required)
      totalFields += 2
      if (whyNow.trim()) filledFields++
      if (competitors.some(c => c.name.trim())) filledFields++
      totalFields += 3 // TAM, SAM, SOM
      if (tam.trim()) filledFields++
      if (sam.trim()) filledFields++
      if (som.trim()) filledFields++

      // Step 5: Traction & Financials (varies by stage)
      if (currentStage === 'Seed' || currentStage === 'Series A+') {
        totalFields += 3 // Required for these stages
        if (mrr.trim() || arr.trim()) filledFields++
        if (grossMargin.trim()) filledFields++
        if (monthlyRevenue.some(m => m.month.trim() && m.revenue.trim())) filledFields++
      }
      totalFields += 5 // Optional metrics
      if (growthRate.trim()) filledFields++
      if (mau.trim()) filledFields++
      if (retention.trim()) filledFields++
      if (cac.trim()) filledFields++
      if (ltv.trim()) filledFields++

      // Step 6: Funding & Cap Table (optional)
      totalFields += 2
      if (fundingRounds.some(f => f.type.trim() || f.amount.trim())) filledFields++
      if (capTableSummary.trim()) filledFields++

      // Step 7: Attachments (optional)
      totalFields += 1
      if (productImages.length > 0) filledFields++
    }

    // Step 8: Help Looking For (2 required)
    totalFields += 2
    if (primaryFocusArea.length > 0) filledFields++
    if (helpDescription.trim()) filledFields++

    const percentage = Math.round((filledFields / totalFields) * 100)
    return Math.min(percentage, 100)
  }

  // Handle deck upload
  const handleDeckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size must be less than 25 MB')
      return
    }

    setDeckUploading(true)
    setDeckUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setDeckUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setDeckUploading(false)
          setDeckFile(file)
          toast.success('Pitch deck uploaded successfully')
          
          // Track deck upload
          if (user) {
            const flowType = uploadDeckNow === 'yes' ? 'flow_a' : 'flow_b'
            trackMentorApplicationDeckUpload(file.size, flowType)
            klaviyoTrackMentorApplicationDeckUpload(user.id, file.size, flowType)
          }
          
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const removeDeck = () => {
    setDeckFile(null)
    setDeckUploadProgress(0)
    if (deckInputRef.current) {
      deckInputRef.current.value = ''
    }
  }

  // Handle images upload
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image format`)
        return false
      }
      return true
    })
    setProductImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index))
  }

  // Founder management
  const addFounder = () => {
    setFounders([...founders, { name: '', role: '', timeCommitment: '', linkedin: '', ownership: '', isTechnical: false }])
  }

  const removeFounder = (index: number) => {
    if (founders.length > 1) {
      setFounders(founders.filter((_, i) => i !== index))
    }
  }

  const updateFounder = (index: number, field: keyof Founder, value: any) => {
    const updated = [...founders]
    updated[index] = { ...updated[index], [field]: value }
    setFounders(updated)
  }

  // Competitor management
  const addCompetitor = () => {
    setCompetitors([...competitors, { name: '', url: '', differentiation: '' }])
  }

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index))
    }
  }

  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...competitors]
    updated[index] = { ...updated[index], [field]: value }
    setCompetitors(updated)
  }

  // Monthly revenue management
  const addMonthlyRevenue = () => {
    setMonthlyRevenue([...monthlyRevenue, { month: '', revenue: '' }])
  }

  const removeMonthlyRevenue = (index: number) => {
    if (monthlyRevenue.length > 1) {
      setMonthlyRevenue(monthlyRevenue.filter((_, i) => i !== index))
    }
  }

  const updateMonthlyRevenue = (index: number, field: keyof MonthlyRevenue, value: string) => {
    const updated = [...monthlyRevenue]
    updated[index] = { ...updated[index], [field]: value }
    setMonthlyRevenue(updated)
  }

  // Funding round management
  const addFundingRound = () => {
    setFundingRounds([...fundingRounds, { type: '', date: '', amount: '', investors: '' }])
  }

  const removeFundingRound = (index: number) => {
    if (fundingRounds.length > 1) {
      setFundingRounds(fundingRounds.filter((_, i) => i !== index))
    }
  }

  const updateFundingRound = (index: number, field: keyof FundingRound, value: string) => {
    const updated = [...fundingRounds]
    updated[index] = { ...updated[index], [field]: value }
    setFundingRounds(updated)
  }

  // Navigation
  const handleNext = () => {
    // Validate current step
    let isValid = true
    if (currentStep === 1) isValid = validateStep1()
    else if (currentStep === 2) isValid = validateStep2()
    else if (currentStep === 3) isValid = validateStep3()
    else if (currentStep === 5) isValid = validateStep5()
    else if (currentStep === 8) isValid = validateStep8()

    if (!isValid) return

    // Track step completion
    if (user) {
      const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000)
      const stepName = stepTitles[currentStep] || `Step ${currentStep}`
      trackMentorApplicationStepComplete(currentStep, stepName, timeSpent)
      klaviyoTrackMentorApplicationStepComplete(user.id, currentStep, stepName, timeSpent)
    }

    // Flow A: 1 → 8 → 9
    if (isFlowA) {
      if (currentStep === 1) {
        setCurrentStep(8) // Skip to Help Looking For
      } else if (currentStep === 8) {
        setCurrentStep(9) // Go to Review & Submit
      }
    } 
    // Flow B: 1 → 2 → 3 → ... → 9
    else {
      if (currentStep < 9) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    // Flow A: 9 → 8 → 1
    if (isFlowA) {
      if (currentStep === 9) {
        setCurrentStep(8)
      } else if (currentStep === 8) {
        setCurrentStep(1)
      }
    }
    // Flow B: Normal decrement
    else {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1)
      }
    }
  }

  const handleSkipToHelp = () => {
    if (uploadDeckNow === 'yes' && deckFile) {
      setCurrentStep(8)
      toast.success('Skipped to Help Looking For section')
    }
  }

  const handleSubmit = () => {
    // Final validation
    if (!validateStep8()) return

    // Prepare application data
    const applicationData = {
      basics: { contactName, email, phone, startupName, website, hqLocation, yearFounded, currentStage, oneLiner, summary },
      team: { founders, teamRationale },
      product: { problem, targetUser, solution, demoUrl, differentiation },
      market: { tam, sam, som, whyNow, competitors },
      traction: { monthlyRevenue, mrr, arr, growthRate, mau, retention, cac, ltv, grossMargin, burn, runway, proofOfDemand },
      funding: { fundingRounds, capTableSummary, raisingNow, targetAmount, useOfFunds },
      helpNeeded: { primaryFocusArea, specificSupport, helpDescription },
      attachments: { deckFile, productImages }
    }

    // Track submission
    if (user) {
      const totalTimeSpent = Math.floor((Date.now() - formStartTime) / 1000)
      const flowType = uploadDeckNow === 'yes' && deckFile ? 'flow_a' : 'flow_b'
      const completion = calculateCompletion()
      
      trackMentorApplicationSubmit(flowType, completion, totalTimeSpent, currentStage)
      klaviyoTrackMentorApplicationSubmit(
        user.id,
        email,
        startupName,
        flowType,
        completion,
        totalTimeSpent,
        currentStage,
        mentorName,
        programName
      )
    }

    toast.success('Application submitted successfully!')
    
    setTimeout(() => {
      setSubmitted(true)
    }, 1500)
  }

  // Edit section from review
  const editSection = (step: number) => {
    if (user) {
      const sectionName = stepTitles[step] || `Step ${step}`
      trackMentorApplicationSectionEdit(step, sectionName)
      klaviyoTrackMentorApplicationSectionEdit(user.id, step, sectionName)
    }
    setCurrentStep(step)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl border border-[#C8D6FF] shadow-xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-gray-900">Application Submitted!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Thank you for applying to {programName}. {mentorName} will review your application and get back to you soon.
            </p>

            <div className="pt-6 space-y-3">
              <p className="text-gray-600">Recommended next steps:</p>
              <div className="space-y-2 text-left max-w-md mx-auto">
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06CB1D] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Check your email for confirmation</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06CB1D] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Prepare for potential interview</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#06CB1D] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gather any additional materials</span>
                </div>
              </div>
            </div>

            <Button
              onClick={onBack}
              className="mt-6 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
            >
              Back to Mentors
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F9FF] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#C8D6FF] flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={onBack}
                size="sm"
                className="border-[#C8D6FF] hover:bg-[#EDF2FF] h-8 text-xs"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Back
              </Button>
              <div>
                <h4 className="text-gray-900 mb-0">Apply for Mentorship</h4>
                <p className="text-xs text-gray-600">{mentorName} • {programName}</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-xs">
              Step {displayStep} of {totalSteps}
            </Badge>
          </div>

          {/* Progress bar */}
          <div>
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-gray-600 mt-1">{stepTitles[currentStep]}</p>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-[#C8D6FF]">
              <CardContent className="p-4">
                {/* Step 1: Basics */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 mb-0">Basic Information</h4>
                      <p className="text-xs text-gray-600">Tell us about your startup and contact details</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div>
                        <Label className="text-xs">Contact Name <span className="text-[#FF220E]">*</span></Label>
                        <Input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="John Doe"
                          maxLength={120}
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Email <span className="text-[#FF220E]">*</span></Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@startup.com"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Phone</Label>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555-123-4567"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Startup Name <span className="text-[#FF220E]">*</span></Label>
                        <Input
                          value={startupName}
                          onChange={(e) => setStartupName(e.target.value)}
                          placeholder="Acme Inc"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Website</Label>
                        <Input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://acme.com"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">HQ Location <span className="text-[#FF220E]">*</span></Label>
                        <Input
                          value={hqLocation}
                          onChange={(e) => setHqLocation(e.target.value)}
                          placeholder="San Francisco, USA"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Year Founded</Label>
                        <Input
                          type="number"
                          value={yearFounded}
                          onChange={(e) => setYearFounded(e.target.value)}
                          placeholder="2024"
                          min="1900"
                          max="2100"
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-xs">Current Stage <span className="text-[#FF220E]">*</span></Label>
                        <Select value={currentStage} onValueChange={(value: CurrentStage) => setCurrentStage(value)}>
                          <SelectTrigger className="bg-[#F7F9FF] border-[#C8D6FF] h-10 text-sm mt-1">
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Idea">Idea</SelectItem>
                            <SelectItem value="MVP">MVP</SelectItem>
                            <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A+">Series A+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs">One-line Pitch <span className="text-[#FF220E]">*</span> <span className="text-gray-500">({oneLiner.length}/180)</span></Label>
                      <Textarea
                        value={oneLiner}
                        onChange={(e) => setOneLiner(e.target.value)}
                        placeholder="E.g., We're building the Airbnb for data centers"
                        maxLength={180}
                        rows={3}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none text-sm mt-1"
                      />
                    </div>

                    <Separator />

                    {/* Upload Pitch Deck Now? */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Do you Have Pitch Deck? <span className="text-[#FF220E]">*</span></Label>
                        <p className="text-xs text-gray-500">Choose Yes to upload your deck or No to fill the form manually</p>
                      </div>

                      <RadioGroup value={uploadDeckNow} onValueChange={(value: 'yes' | 'no') => {
                        setUploadDeckNow(value)
                        // Track flow selection
                        if (user) {
                          const flowType = value === 'yes' ? 'flow_a' : 'flow_b'
                          const hasDeck = value === 'yes'
                          trackMentorApplicationFlowSelected(flowType, hasDeck)
                          klaviyoTrackMentorApplicationFlowSelected(user.id, flowType, hasDeck)
                        }
                      }} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="deck-yes" />
                          <Label htmlFor="deck-yes" className="cursor-pointer text-xs">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="deck-no" />
                          <Label htmlFor="deck-no" className="cursor-pointer text-xs">No</Label>
                        </div>
                      </RadioGroup>

                      {uploadDeckNow === 'yes' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <div>
                            <Label className="text-xs">Pitch Deck (PDF, max 25 MB) <span className="text-[#FF220E]">*</span></Label>
                            
                            <input
                              ref={deckInputRef}
                              type="file"
                              accept="application/pdf"
                              onChange={handleDeckUpload}
                              className="hidden"
                            />

                            {!deckFile && !deckUploading && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => deckInputRef.current?.click()}
                                className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed h-14 text-xs mt-1"
                              >
                                <Upload className="w-3 h-3 mr-2" />
                                Click to upload deck (PDF)
                              </Button>
                            )}

                            {deckUploading && (
                              <div className="space-y-1.5 mt-1">
                                <div className="flex items-center justify-between text-gray-700 text-xs">
                                  <span>Uploading...</span>
                                  <span>{deckUploadProgress}%</span>
                                </div>
                                <Progress value={deckUploadProgress} className="h-2" />
                              </div>
                            )}

                            {deckFile && !deckUploading && (
                              <div className="flex items-center justify-between p-3 bg-[#EDF2FF] rounded border border-[#C8D6FF] mt-1">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-[#114DFF]" />
                                  <div>
                                    <p className="text-xs text-gray-900">{deckFile.name}</p>
                                    <p className="text-xs text-gray-500">{(deckFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deckInputRef.current?.click()}
                                    className="border-[#C8D6FF] h-7 text-xs px-2.5"
                                  >
                                    Replace
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={removeDeck}
                                    className="border-[#C8D6FF] text-[#FF220E] hover:bg-[#FFE5E5] h-7 px-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {deckFile && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between p-3 bg-[#EDF2FF] border border-[#C8D6FF] rounded"
                            >
                              <div className="flex items-center space-x-2">
                                <Info className="w-4 h-4 text-[#114DFF] flex-shrink-0" />
                                <p className="text-xs text-gray-700">Deck uploaded! You can skip to Help section</p>
                              </div>
                              <Button
                                onClick={handleSkipToHelp}
                                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] h-7 text-xs px-3"
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Skip
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {uploadDeckNow === 'no' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-[#F7F9FF] border border-[#C8D6FF] rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <Info className="w-4 h-4 text-[#114DFF] flex-shrink-0" />
                            <p className="text-xs text-gray-700">Please fill the form below with your startup details</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Team */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 mb-0">Team</h3>
                      <p className="text-gray-600 text-sm">Tell us about your founding team and key members</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      {founders.map((founder, index) => (
                        <Card key={index} className="border-[#C8D6FF] bg-[#F7F9FF]">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-gray-900 text-sm">Founder {index + 1}</h4>
                              {founders.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFounder(index)}
                                  className="border-[#C8D6FF] text-[#FF220E] hover:bg-[#FFE5E5] h-7 text-xs"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-sm">Name <span className="text-[#FF220E]">*</span></Label>
                                <Input
                                  value={founder.name}
                                  onChange={(e) => updateFounder(index, 'name', e.target.value)}
                                  placeholder="Jane Smith"
                                  className="bg-white border-[#C8D6FF] h-9"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-sm">Role <span className="text-[#FF220E]">*</span></Label>
                                <Input
                                  value={founder.role}
                                  onChange={(e) => updateFounder(index, 'role', e.target.value)}
                                  placeholder="CEO & Co-founder"
                                  className="bg-white border-[#C8D6FF] h-9"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-sm">Time Commitment</Label>
                                <Select
                                  value={founder.timeCommitment}
                                  onValueChange={(value) => updateFounder(index, 'timeCommitment', value)}
                                >
                                  <SelectTrigger className="bg-white border-[#C8D6FF] h-9">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="full-time">Full-time</SelectItem>
                                    <SelectItem value="part-time">Part-time</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1 md:col-span-2">
                                <Label className="text-sm">LinkedIn</Label>
                                <Input
                                  type="url"
                                  value={founder.linkedin}
                                  onChange={(e) => updateFounder(index, 'linkedin', e.target.value)}
                                  placeholder="https://linkedin.com/in/..."
                                  className="bg-white border-[#C8D6FF] h-9"
                                />
                              </div>

                              <div className="space-y-1">
                                <Label className="text-sm">Ownership %</Label>
                                <Input
                                  type="number"
                                  value={founder.ownership}
                                  onChange={(e) => updateFounder(index, 'ownership', e.target.value)}
                                  placeholder="25"
                                  min="0"
                                  max="100"
                                  className="bg-white border-[#C8D6FF] h-9"
                                />
                              </div>

                              <div className="space-y-2 flex items-center">
                                <Checkbox
                                  id={`tech-${index}`}
                                  checked={founder.isTechnical}
                                  onCheckedChange={(checked) => updateFounder(index, 'isTechnical', checked)}
                                />
                                <Label htmlFor={`tech-${index}`} className="ml-2 cursor-pointer">
                                  Technical Founder
                                </Label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addFounder}
                        className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Founder
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Why this team?</Label>
                      <p className="text-gray-600">Explain founder-market fit, prior collaboration, and complementary skills</p>
                      <Textarea
                        value={teamRationale}
                        onChange={(e) => setTeamRationale(e.target.value)}
                        placeholder="E.g., Our CEO has 10 years in fintech, CTO built payment systems at Stripe, we've worked together for 3 years..."
                        maxLength={1000}
                        rows={6}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                      />
                      <p className="text-gray-500">{teamRationale.length}/1,000 characters</p>
                    </div>
                  </div>
                )}

                {/* Step 3: Product */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-gray-900 mb-0">Product</h3>
                      <p className="text-gray-600 text-sm">Describe the problem, solution, and your product</p>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <Label className="text-sm">Problem <span className="text-[#FF220E]">*</span></Label>
                      <p className="text-xs text-gray-600">What specific problem are you solving?</p>
                      <Textarea
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="E.g., Small businesses waste 20+ hours/month on manual bookkeeping..."
                        maxLength={1200}
                        rows={3}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none text-sm"
                      />
                      <p className="text-xs text-gray-500">{problem.length}/1,200</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Target User/Customer <span className="text-[#FF220E]">*</span></Label>
                      <p className="text-xs text-gray-600">Who is your ideal customer?</p>
                      <Textarea
                        value={targetUser}
                        onChange={(e) => setTargetUser(e.target.value)}
                        placeholder="E.g., Small business owners (1-50 employees) in professional services..."
                        maxLength={800}
                        rows={3}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none text-sm"
                      />
                      <p className="text-xs text-gray-500">{targetUser.length}/800</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Solution & Product State <span className="text-[#FF220E]">*</span></Label>
                      <p className="text-xs text-gray-600">Describe your solution and development stage</p>
                      <Textarea
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="E.g., AI-powered bookkeeping assistant. Currently in beta with 50 paying customers..."
                        maxLength={1500}
                        rows={3}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none text-sm"
                      />
                      <p className="text-xs text-gray-500">{solution.length}/1,500</p>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Demo URL or Video</Label>
                      <Input
                        type="url"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        placeholder="https://demo.acme.com"
                        className="bg-[#F7F9FF] border-[#C8D6FF] h-9"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm">Differentiation & Unique Insight</Label>
                      <p className="text-xs text-gray-600">What makes you different?</p>
                      <Textarea
                        value={differentiation}
                        onChange={(e) => setDifferentiation(e.target.value)}
                        placeholder="E.g., Unlike existing solutions, we use LLMs trained on accounting standards..."
                        maxLength={1000}
                        rows={6}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                      />
                      <p className="text-gray-500">{differentiation.length}/1,000 characters</p>
                    </div>
                  </div>
                )}

                {/* Step 4: Market & Competition */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-900 mb-1">Market & Competition</h3>
                      <p className="text-gray-600">Market size, timing, and competitive landscape</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>TAM (Total Addressable Market)</Label>
                        <p className="text-gray-600">Total market size in USD</p>
                        <Input
                          type="number"
                          value={tam}
                          onChange={(e) => setTam(e.target.value)}
                          placeholder="5000000000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>SAM (Serviceable Addressable Market)</Label>
                        <p className="text-gray-600">Market you can realistically serve</p>
                        <Input
                          type="number"
                          value={sam}
                          onChange={(e) => setSam(e.target.value)}
                          placeholder="500000000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>SOM (Serviceable Obtainable Market)</Label>
                        <p className="text-gray-600">Market you can capture short-term</p>
                        <Input
                          type="number"
                          value={som}
                          onChange={(e) => setSom(e.target.value)}
                          placeholder="50000000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Why Now / Tailwinds</Label>
                      <p className="text-gray-600">What recent changes make this the right time? Technology, regulation, behavior shifts, etc.</p>
                      <Textarea
                        value={whyNow}
                        onChange={(e) => setWhyNow(e.target.value)}
                        placeholder="E.g., GPT-4 enables unprecedented accuracy in document understanding; new tax regulations increase bookkeeping complexity; remote work boom creates need for cloud-based tools..."
                        maxLength={800}
                        rows={5}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                      />
                      <p className="text-gray-500">{whyNow.length}/800 characters</p>
                    </div>

                    <Separator />

                    <div>
                      <Label>Competitors</Label>
                      <p className="text-gray-600 mb-4">List key competitors and how you differ</p>

                      <div className="space-y-4">
                        {competitors.map((competitor, index) => (
                          <Card key={index} className="border-[#C8D6FF] bg-[#F7F9FF]">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="text-gray-900">Competitor {index + 1}</h4>
                                {competitors.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeCompetitor(index)}
                                    className="border-[#C8D6FF] text-[#FF220E] hover:bg-[#FFE5E5]"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                      value={competitor.name}
                                      onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                                      placeholder="QuickBooks"
                                      className="bg-white border-[#C8D6FF]"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>URL</Label>
                                    <Input
                                      type="url"
                                      value={competitor.url}
                                      onChange={(e) => updateCompetitor(index, 'url', e.target.value)}
                                      placeholder="https://quickbooks.com"
                                      className="bg-white border-[#C8D6FF]"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label>How do you differ?</Label>
                                  <Textarea
                                    value={competitor.differentiation}
                                    onChange={(e) => updateCompetitor(index, 'differentiation', e.target.value)}
                                    placeholder="E.g., QuickBooks requires manual categorization; we automate it with AI..."
                                    maxLength={500}
                                    rows={3}
                                    className="bg-white border-[#C8D6FF] resize-none"
                                  />
                                  <p className="text-gray-500">{competitor.differentiation.length}/500</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCompetitor}
                          className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Competitor
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Traction & Financials */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-900 mb-1">Traction & Financials</h3>
                      <p className="text-gray-600">Revenue, growth metrics, and key performance indicators</p>
                      {(currentStage === 'Seed' || currentStage === 'Series A+') && (
                        <div className="flex items-start space-x-2 mt-2 p-3 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                          <AlertCircle className="w-5 h-5 text-[#114DFF] flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700">
                            For {currentStage} stage, revenue data, MRR/ARR, and gross margin are required
                          </p>
                        </div>
                      )}
                    </div>

                    <Separator />



                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>MRR (Monthly Recurring Revenue)</Label>
                        <Input
                          type="number"
                          value={mrr}
                          onChange={(e) => setMrr(e.target.value)}
                          placeholder="50000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>ARR (Annual Recurring Revenue)</Label>
                        <Input
                          type="number"
                          value={arr}
                          onChange={(e) => setArr(e.target.value)}
                          placeholder="600000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Growth Rate %</Label>
                        <Input
                          type="number"
                          value={growthRate}
                          onChange={(e) => setGrowthRate(e.target.value)}
                          placeholder="15"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>MAU (Monthly Active Users)</Label>
                        <Input
                          type="number"
                          value={mau}
                          onChange={(e) => setMau(e.target.value)}
                          placeholder="5000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Retention Rate %</Label>
                        <Input
                          type="number"
                          value={retention}
                          onChange={(e) => setRetention(e.target.value)}
                          placeholder="85"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>CAC (Customer Acquisition Cost)</Label>
                        <Input
                          type="number"
                          value={cac}
                          onChange={(e) => setCac(e.target.value)}
                          placeholder="500"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>LTV (Customer Lifetime Value)</Label>
                        <Input
                          type="number"
                          value={ltv}
                          onChange={(e) => setLtv(e.target.value)}
                          placeholder="5000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Gross Margin %</Label>
                        <Input
                          type="number"
                          value={grossMargin}
                          onChange={(e) => setGrossMargin(e.target.value)}
                          placeholder="75"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly Burn (USD)</Label>
                        <Input
                          type="number"
                          value={burn}
                          onChange={(e) => setBurn(e.target.value)}
                          placeholder="30000"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Runway (Months)</Label>
                        <Input
                          type="number"
                          value={runway}
                          onChange={(e) => setRunway(e.target.value)}
                          placeholder="18"
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Proof of Demand</Label>
                      <p className="text-gray-600">LOIs, pilots, waitlist size, retention data, etc.</p>
                      <Textarea
                        value={proofOfDemand}
                        onChange={(e) => setProofOfDemand(e.target.value)}
                        placeholder="E.g., 500 businesses on waitlist, 3 LOIs totaling $150K ARR, 90-day retention at 88%..."
                        rows={4}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Funding & Cap Table */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-900 mb-1">Funding & Cap Table</h3>
                      <p className="text-gray-600">Past funding, current ownership, and future fundraising plans</p>
                    </div>

                    <Separator />

                    {/* Has your startup raised any funding? */}
                    <div className="space-y-4">
                      <div>
                        <Label>Has your startup raised any funding?</Label>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="funding-yes"
                              checked={hasFunding === true}
                              onCheckedChange={(checked) => setHasFunding(checked ? true : null)}
                            />
                            <Label htmlFor="funding-yes" className="cursor-pointer">Yes, we have raised funding</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="funding-no"
                              checked={hasFunding === false}
                              onCheckedChange={(checked) => setHasFunding(checked ? false : null)}
                            />
                            <Label htmlFor="funding-no" className="cursor-pointer">No, we have not raised funding</Label>
                          </div>
                        </div>
                      </div>

                      {/* Show Funding Rounds only if hasFunding === true */}
                      {hasFunding === true && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <Separator />
                          
                          <div>
                            <Label>Funding Rounds</Label>
                            <p className="text-gray-600 mb-4">List all funding rounds to date</p>

                            <div className="space-y-4">
                              {fundingRounds.map((round, index) => (
                                <Card key={index} className="border-[#C8D6FF] bg-[#F7F9FF]">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="text-gray-900">Round {index + 1}</h4>
                                      {fundingRounds.length > 1 && (
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() => removeFundingRound(index)}
                                          className="border-[#C8D6FF] text-[#FF220E] hover:bg-[#FFE5E5]"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label>Round Type</Label>
                                        <Input
                                          value={round.type}
                                          onChange={(e) => updateFundingRound(index, 'type', e.target.value)}
                                          placeholder="Pre-seed, Seed, SAFE, etc."
                                          className="bg-white border-[#C8D6FF]"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Date (YYYY-MM)</Label>
                                        <Input
                                          type="month"
                                          value={round.date}
                                          onChange={(e) => updateFundingRound(index, 'date', e.target.value)}
                                          className="bg-white border-[#C8D6FF]"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Amount (USD)</Label>
                                        <Input
                                          type="number"
                                          value={round.amount}
                                          onChange={(e) => updateFundingRound(index, 'amount', e.target.value)}
                                          placeholder="500000"
                                          className="bg-white border-[#C8D6FF]"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label>Investors</Label>
                                        <Input
                                          value={round.investors}
                                          onChange={(e) => updateFundingRound(index, 'investors', e.target.value)}
                                          placeholder="Y Combinator, a16z, angels..."
                                          className="bg-white border-[#C8D6FF]"
                                        />
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}

                              <Button
                                type="button"
                                variant="outline"
                                onClick={addFundingRound}
                                className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Funding Round
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Cap Table Summary (Fully Diluted %)</Label>
                      <p className="text-gray-600">Break down ownership: founders, investors, ESOP, etc.</p>
                      <Textarea
                        value={capTableSummary}
                        onChange={(e) => setCapTableSummary(e.target.value)}
                        placeholder="E.g., Founders: 70%, Seed investors: 20%, ESOP pool: 10%"
                        rows={4}
                        className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Are you currently raising?</Label>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="raising-yes"
                              checked={raisingNow === true}
                              onCheckedChange={(checked) => setRaisingNow(checked ? true : null)}
                            />
                            <Label htmlFor="raising-yes" className="cursor-pointer">Yes, actively raising</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="raising-no"
                              checked={raisingNow === false}
                              onCheckedChange={(checked) => setRaisingNow(checked ? false : null)}
                            />
                            <Label htmlFor="raising-no" className="cursor-pointer">No, not raising</Label>
                          </div>
                        </div>
                      </div>

                      {raisingNow && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Label>Target Amount (USD)</Label>
                            <Input
                              type="number"
                              value={targetAmount}
                              onChange={(e) => setTargetAmount(e.target.value)}
                              placeholder="1000000"
                              className="bg-[#F7F9FF] border-[#C8D6FF]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Use of Funds</Label>
                            <Textarea
                              value={useOfFunds}
                              onChange={(e) => setUseOfFunds(e.target.value)}
                              placeholder="E.g., 50% engineering, 30% sales & marketing, 20% operations. Goals: hire 5 engineers, expand to EU market..."
                              maxLength={800}
                              rows={5}
                              className="bg-[#F7F9FF] border-[#C8D6FF] resize-none"
                            />
                            <p className="text-gray-500">{useOfFunds.length}/800 characters</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7: Attachments (Flow B only) */}
                {currentStep === 7 && uploadDeckNow === 'no' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-gray-900 mb-1">Attachments</h3>
                      <p className="text-gray-600">Upload product images and optionally your pitch deck</p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div>
                        <Label>Product Images (PNG/JPG)</Label>
                        <p className="text-gray-600 mb-3">Upload screenshots or product photos</p>

                        <input
                          ref={imagesInputRef}
                          type="file"
                          accept="image/png,image/jpeg"
                          multiple
                          onChange={handleImagesUpload}
                          className="hidden"
                        />

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => imagesInputRef.current?.click()}
                          className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed h-24"
                        >
                          <ImageIcon className="w-5 h-5 mr-2" />
                          Click to upload images
                        </Button>

                        {productImages.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {productImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-video bg-[#F7F9FF] rounded-lg border border-[#C8D6FF] overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white border-[#C8D6FF]"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Pitch Deck (Optional)</Label>
                        <p className="text-gray-600 mb-3">PDF only, max 25 MB</p>

                        <input
                          ref={deckInputRef}
                          type="file"
                          accept="application/pdf"
                          onChange={handleDeckUpload}
                          className="hidden"
                        />

                        {!deckFile && !deckUploading && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => deckInputRef.current?.click()}
                            className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF] border-dashed h-24"
                          >
                            <Upload className="w-5 h-5 mr-2" />
                            Click to upload pitch deck (PDF)
                          </Button>
                        )}

                        {deckUploading && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-gray-700">
                              <span>Uploading...</span>
                              <span>{deckUploadProgress}%</span>
                            </div>
                            <Progress value={deckUploadProgress} className="h-2" />
                          </div>
                        )}

                        {deckFile && !deckUploading && (
                          <div className="flex items-center justify-between p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-[#114DFF]" />
                              <div>
                                <p className="text-gray-900">{deckFile.name}</p>
                                <p className="text-gray-600">{(deckFile.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => deckInputRef.current?.click()}
                                className="border-[#C8D6FF]"
                              >
                                Replace
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeDeck}
                                className="border-[#C8D6FF] text-[#FF220E] hover:bg-[#FFE5E5]"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 8: Help Looking For */}
                {currentStep === 8 && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-gray-900 mb-0">Help Looking For</h4>
                      <p className="text-xs text-gray-600">What specific areas do you need mentorship support?</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Primary Focus Areas <span className="text-[#FF220E]">*</span></Label>
                        <p className="text-xs text-gray-600 mb-2">Select all that apply</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {focusAreas.map((area) => (
                            <div key={area} className="flex items-center space-x-2">
                              <Checkbox
                                id={area}
                                checked={primaryFocusArea.includes(area)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPrimaryFocusArea([...primaryFocusArea, area])
                                  } else {
                                    setPrimaryFocusArea(primaryFocusArea.filter(a => a !== area))
                                  }
                                }}
                              />
                              <Label htmlFor={area} className="cursor-pointer text-xs">{area}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Specific Help Needed (Keywords)</Label>
                        <Input
                          value={specificSupport}
                          onChange={(e) => setSpecificSupport(e.target.value)}
                          placeholder="E.g., fundraising strategy, product-market fit..."
                          className="bg-[#F7F9FF] border-[#C8D6FF] h-8 text-sm mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Description</Label>
                        <p className="text-xs text-gray-600">Explain what you're looking for</p>
                        <Textarea
                          value={helpDescription}
                          onChange={(e) => setHelpDescription(e.target.value)}
                          placeholder="E.g., We're preparing for our seed round and need guidance on valuation, term sheets..."
                          rows={3}
                          className="bg-[#F7F9FF] border-[#C8D6FF] resize-none text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 9: Review & Submit */}
                {currentStep === 9 && (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-gray-900 mb-0">Review & Submit</h4>
                      <p className="text-xs text-gray-600">Review your application before submitting</p>
                    </div>

                    <Separator />

                    {/* Completion Progress */}
                    <div className="p-3 border border-[#C8D6FF] rounded-xl bg-[#F7F9FF]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${
                            calculateCompletion() >= 90 ? 'bg-[#06CB1D]/10 text-[#06CB1D]' : 
                            calculateCompletion() >= 50 ? 'bg-[#FF8C00]/10 text-[#FF8C00]' : 
                            'bg-[#FF220E]/10 text-[#FF220E]'
                          }`}>
                            {calculateCompletion()}%
                          </div>
                          <div>
                            <h4 className="text-gray-900 text-sm">Application Completion</h4>
                            <p className="text-xs text-gray-600">
                              {calculateCompletion() >= 90 ? 'Looking good!' : calculateCompletion() >= 50 ? 'Almost there!' : 'Keep going!'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Progress value={calculateCompletion()} className="h-1.5" />
                      
                      {calculateCompletion() < 90 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-2 bg-[#FFE5E5] border border-[#FF220E]/30 rounded-lg flex items-start space-x-2"
                        >
                          <AlertCircle className="w-4 h-4 text-[#FF220E] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-700">
                              <strong className="text-[#FF220E]">Incomplete applications are less likely to get selected</strong>
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">
                              Complete all sections to increase your chances of acceptance
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* Basics */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Basics</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(1)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {contactName ? <p><strong>Contact:</strong> {contactName} ({email})</p> : <p className="text-gray-500 italic text-xs">Contact information not provided</p>}
                            {startupName ? <p><strong>Startup:</strong> {startupName}</p> : <p className="text-gray-500 italic text-xs">Startup name not provided</p>}
                            {hqLocation && <p><strong>Location:</strong> {hqLocation}</p>}
                            {currentStage ? <p><strong>Stage:</strong> {currentStage}</p> : <p className="text-gray-500 italic text-xs">Stage not specified</p>}
                            {oneLiner ? <p><strong>Pitch:</strong> {oneLiner}</p> : <p className="text-gray-500 italic text-xs">One-liner not provided</p>}
                            {website && <p><strong>Website:</strong> {website}</p>}
                            {deckFile && (
                              <div className="flex items-center space-x-2 mt-2 p-2 bg-[#EDF2FF] rounded border border-[#C8D6FF]">
                                <FileText className="w-3 h-3 text-[#114DFF]" />
                                <span className="text-xs">Pitch Deck: {deckFile.name}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Team - Always show */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Team</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(2)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {founders.some(f => f.name.trim()) ? (
                              <>
                                {founders.filter(f => f.name.trim()).map((f, i) => (
                                  <p key={i}>{f.name} - {f.role || 'Role not specified'}</p>
                                ))}
                                {teamRationale && <p className="mt-2"><strong>Why this team:</strong> {teamRationale.substring(0, 100)}{teamRationale.length > 100 ? '...' : ''}</p>}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Team information not provided</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Product - Always show */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Product</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(3)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {problem ? (
                              <>
                                <p><strong>Problem:</strong> {problem.substring(0, 150)}{problem.length > 150 ? '...' : ''}</p>
                                {targetUser && <p><strong>Target User:</strong> {targetUser.substring(0, 100)}{targetUser.length > 100 ? '...' : ''}</p>}
                                {solution && <p><strong>Solution:</strong> {solution.substring(0, 150)}{solution.length > 150 ? '...' : ''}</p>}
                                {demoUrl && <p><strong>Demo:</strong> {demoUrl}</p>}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Product details not provided</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Market & Competition - Always show */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Market & Competition</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(4)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {(tam || sam || som) ? (
                              <>
                                {tam && <p><strong>TAM:</strong> ${parseInt(tam).toLocaleString()}</p>}
                                {sam && <p><strong>SAM:</strong> ${parseInt(sam).toLocaleString()}</p>}
                                {som && <p><strong>SOM:</strong> ${parseInt(som).toLocaleString()}</p>}
                                {whyNow && <p className="mt-2"><strong>Why Now:</strong> {whyNow.substring(0, 100)}{whyNow.length > 100 ? '...' : ''}</p>}
                                {competitors.some(c => c.name.trim()) && (
                                  <p className="mt-2"><strong>Competitors:</strong> {competitors.filter(c => c.name.trim()).map(c => c.name).join(', ')}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Market analysis not completed</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Traction & Financials - Always show */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Traction & Financials</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(5)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {(mrr || arr || growthRate) ? (
                              <>
                                {mrr && <p><strong>MRR:</strong> ${parseInt(mrr).toLocaleString()}</p>}
                                {arr && <p><strong>ARR:</strong> ${parseInt(arr).toLocaleString()}</p>}
                                {growthRate && <p><strong>Growth Rate:</strong> {growthRate}%</p>}
                                {mau && <p><strong>MAU:</strong> {parseInt(mau).toLocaleString()}</p>}
                                {retention && <p><strong>Retention:</strong> {retention}%</p>}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Traction metrics not provided</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Funding & Cap Table - Always show */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Funding & Cap Table</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(6)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {fundingRounds.some(f => f.type.trim() || f.amount.trim()) ? (
                              <>
                                {fundingRounds.filter(f => f.type.trim() || f.amount.trim()).map((f, i) => (
                                  <p key={i}>{f.type || 'Round'}: ${f.amount ? parseInt(f.amount).toLocaleString() : 'N/A'} {f.investors && `from ${f.investors}`}</p>
                                ))}
                                {capTableSummary && <p className="mt-2"><strong>Cap Table:</strong> {capTableSummary.substring(0, 100)}{capTableSummary.length > 100 ? '...' : ''}</p>}
                                {raisingNow && targetAmount && <p><strong>Raising:</strong> ${parseInt(targetAmount).toLocaleString()}</p>}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Funding details not provided</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Attachments - Always show (only in Flow B) */}
                      {uploadDeckNow === 'no' && (
                        <Card className="border-[#C8D6FF]">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-gray-900 text-sm">Attachments</h4>
                              <Button variant="outline" size="sm" onClick={() => editSection(7)} className="border-[#C8D6FF] h-7 text-xs">
                                Edit
                              </Button>
                            </div>
                            <div className="space-y-1 text-gray-700 text-sm">
                              {(productImages.length > 0 || deckFile) ? (
                                <>
                                  {productImages.length > 0 && <p><strong>Product Images:</strong> {productImages.length} file(s)</p>}
                                  {deckFile && <p><strong>Pitch Deck:</strong> {deckFile.name}</p>}
                                </>
                              ) : (
                                <p className="text-gray-500 italic text-xs">No attachments uploaded</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Help Looking For */}
                      <Card className="border-[#C8D6FF]">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-gray-900 text-sm">Help Looking For</h4>
                            <Button variant="outline" size="sm" onClick={() => editSection(8)} className="border-[#C8D6FF] h-7 text-xs">
                              Edit
                            </Button>
                          </div>
                          <div className="space-y-1 text-gray-700 text-sm">
                            {primaryFocusArea.length > 0 ? (
                              <>
                                <p><strong>Focus Areas:</strong> {primaryFocusArea.join(', ')}</p>
                                {specificSupport && <p><strong>Specific:</strong> {specificSupport}</p>}
                                {helpDescription && <p><strong>Description:</strong> {helpDescription.substring(0, 150)}{helpDescription.length > 150 ? '...' : ''}</p>}
                              </>
                            ) : (
                              <p className="text-gray-500 italic text-xs">Help preferences not specified</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Attestation */}
                      <div className="space-y-3 p-4 bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="accuracy" required />
                          <Label htmlFor="accuracy" className="cursor-pointer text-xs">
                            I attest that all information provided is accurate and complete to the best of my knowledge
                          </Label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" required />
                          <Label htmlFor="terms" className="cursor-pointer text-xs">
                            I agree to the Terms of Service and Privacy Policy
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer - Fixed at bottom */}
      <div className="bg-white border-t border-[#C8D6FF] flex-shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              size="sm"
              className="border-[#C8D6FF] hover:bg-[#EDF2FF] h-8 text-xs"
            >
              <ChevronLeft className="w-3 h-3 mr-1" />
              Previous
            </Button>

            {currentStep !== 9 ? (
              <Button
                onClick={handleNext}
                size="sm"
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] h-8 text-xs"
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                size="sm"
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] h-8 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
