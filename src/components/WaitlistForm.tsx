import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Mail, 
  Phone, 
  Linkedin, 
  AlertCircle, 
  Send, 
  Clock,
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  ArrowLeft
} from 'lucide-react'
import cofounderCircleLogo from 'figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png'
import { trackEvent } from '../utils/analytics'

interface WaitlistData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  linkedinUrl: string
  roleLabel: string
  whyInterested: string
  expectedContribution: string
}

interface WaitlistFormProps {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    countryCode: string
    linkedinUrl: string
    roleLabel: string
  }
  onSubmit: (data: WaitlistData) => void
  onBack?: () => void
}

export function WaitlistForm({ personalInfo, onSubmit, onBack }: WaitlistFormProps) {
  const [formData, setFormData] = useState<WaitlistData>({
    ...personalInfo,
    whyInterested: '',
    expectedContribution: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.whyInterested.trim()) {
      newErrors.whyInterested = 'Please tell us why you\'re interested'
    } else if (formData.whyInterested.length > 200) {
      newErrors.whyInterested = 'Must be 200 characters or less'
    }

    if (!formData.expectedContribution.trim()) {
      newErrors.expectedContribution = 'Please tell us what you can offer'
    } else if (formData.expectedContribution.length > 200) {
      newErrors.expectedContribution = 'Must be 200 characters or less'
    }

    if (formData.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      trackEvent('waitlist_validation_error', {
        error_fields: Object.keys(errors),
        role: formData.roleLabel
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Track waitlist submission
      trackEvent('waitlist_submit', {
        role: formData.roleLabel,
        has_linkedin: !!formData.linkedinUrl,
        phone: `${formData.countryCode}${formData.phone}`,
        why_interested_length: formData.whyInterested.length,
        contribution_length: formData.expectedContribution.length
      })

      // Simulate brief processing
      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit(formData)
    } catch (error) {
      console.error('Error submitting waitlist:', error)
      setErrors({ submit: 'Failed to join waitlist. Please try again.' })
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: keyof WaitlistData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm max-w-2xl w-full">
          <CardHeader className="text-center pb-2 pt-3 px-4">
            <div className="flex justify-center mb-1">
              <img 
                src={cofounderCircleLogo} 
                alt="CoFounder Circle" 
                className="h-6 w-auto"
              />
            </div>
            
            {/* Waitlist Badge */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#114DFF]/10 to-[#3CE5A7]/10 border border-[#114DFF]/20 rounded-full mx-auto mb-1">
              <Clock className="w-2.5 h-2.5 text-[#114DFF]" />
              <span style={{ fontSize: '10px' }} className="text-[#114DFF]">Join the Waitlist</span>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: 500 }} className="text-gray-900">Be Among the First</h2>
            <p className="text-gray-600 mt-0.5" style={{ fontSize: '10px' }}>
              Quality connections for {formData.roleLabel}s
            </p>
          </CardHeader>

          <CardContent className="space-y-2 px-4 pb-3">
            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive" className="py-1.5">
                <AlertCircle className="h-3 w-3" />
                <AlertDescription style={{ fontSize: '10px' }}>{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Single Column Layout - All sections stacked */}
            
            {/* Benefits Card - Horizontal */}
            <Card className="bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF]">
              <CardContent className="p-2">
                <h4 className="text-gray-900 mb-1" style={{ fontSize: '11px', fontWeight: 500 }}>What You'll Get</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5" style={{ fontSize: '9px' }}>
                  <div className="flex items-center gap-1 text-gray-600">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#06CB1D] flex-shrink-0" />
                    <span>Early access</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#06CB1D] flex-shrink-0" />
                    <span>Priority onboarding</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#06CB1D] flex-shrink-0" />
                    <span>Founding benefits</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <CheckCircle2 className="w-2.5 h-2.5 text-[#06CB1D] flex-shrink-0" />
                    <span>Feature input</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card - Horizontal */}
            <Card className="bg-[#F7F9FF] border-[#C8D6FF]">
              <CardContent className="p-2">
                <h4 className="text-gray-900 mb-1" style={{ fontSize: '11px', fontWeight: 500 }}>What Happens Next?</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-gray-600" style={{ fontSize: '9px' }}>
                  <div className="flex gap-1">
                    <span className="text-[#114DFF]" style={{ fontWeight: 500 }}>1.</span>
                    <span>Email sent</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[#114DFF]" style={{ fontWeight: 500 }}>2.</span>
                    <span>Notified when ready</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[#114DFF]" style={{ fontWeight: 500 }}>3.</span>
                    <span>Priority access</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[#114DFF]" style={{ fontWeight: 500 }}>4.</span>
                    <span>Timeline: 2-4 weeks</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Fields */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-gray-900" style={{ fontSize: '11px', fontWeight: 500 }}>Your Information</h3>
              
              {/* Name & Contact (Ultra Compact) */}
              <div className="grid grid-cols-2 gap-1">
                <Input
                  value={formData.firstName}
                  disabled
                  placeholder="First Name"
                  className="bg-gray-50 border-[#C8D6FF] h-6"
                  style={{ fontSize: '10px' }}
                />
                <Input
                  value={formData.lastName}
                  disabled
                  placeholder="Last Name"
                  className="bg-gray-50 border-[#C8D6FF] h-6"
                  style={{ fontSize: '10px' }}
                />
              </div>

              <Input
                value={formData.email}
                disabled
                placeholder="Email"
                className="bg-gray-50 border-[#C8D6FF] h-6"
                style={{ fontSize: '10px' }}
              />
              
              <Input
                value={`${formData.countryCode} ${formData.phone}`}
                disabled
                placeholder="Phone"
                className="bg-gray-50 border-[#C8D6FF] h-6"
                style={{ fontSize: '10px' }}
              />

              {/* LinkedIn URL */}
              <div className="space-y-0.5">
                <Label htmlFor="linkedinUrl" style={{ fontSize: '10px' }}>
                  LinkedIn <span className="text-gray-500">(Optional)</span>
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
                  <Input
                    id="linkedinUrl"
                    placeholder="linkedin.com/in/yourname"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                    className={`pl-6 h-6 ${errors.linkedinUrl ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                    style={{ fontSize: '10px' }}
                  />
                </div>
                {errors.linkedinUrl && (
                  <p className="text-[#FF220E]" style={{ fontSize: '8px' }}>{errors.linkedinUrl}</p>
                )}
              </div>

              {/* Why Interested */}
              <div className="space-y-0.5">
                <Label htmlFor="whyInterested" className="flex items-center justify-between" style={{ fontSize: '10px' }}>
                  <span className="flex items-center gap-0.5">
                    <MessageSquare className="w-2.5 h-2.5 text-[#114DFF]" />
                    Why interested? *
                  </span>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>{formData.whyInterested.length}/200</span>
                </Label>
                <Textarea
                  id="whyInterested"
                  placeholder="Tell us what excites you..."
                  value={formData.whyInterested}
                  onChange={(e) => handleFieldChange('whyInterested', e.target.value.slice(0, 200))}
                  className={`h-10 resize-none ${errors.whyInterested ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                  style={{ fontSize: '10px' }}
                  maxLength={200}
                />
                {errors.whyInterested && (
                  <p className="text-[#FF220E]" style={{ fontSize: '8px' }}>{errors.whyInterested}</p>
                )}
              </div>

              {/* Expected Contribution */}
              <div className="space-y-0.5">
                <Label htmlFor="expectedContribution" className="flex items-center justify-between" style={{ fontSize: '10px' }}>
                  <span className="flex items-center gap-0.5">
                    <Lightbulb className="w-2.5 h-2.5 text-[#3CE5A7]" />
                    What can you offer? *
                  </span>
                  <span className="text-gray-500" style={{ fontSize: '8px' }}>{formData.expectedContribution.length}/200</span>
                </Label>
                <Textarea
                  id="expectedContribution"
                  placeholder="What value can you bring..."
                  value={formData.expectedContribution}
                  onChange={(e) => handleFieldChange('expectedContribution', e.target.value.slice(0, 200))}
                  className={`h-10 resize-none ${errors.expectedContribution ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                  style={{ fontSize: '10px' }}
                  maxLength={200}
                />
                {errors.expectedContribution && (
                  <p className="text-[#FF220E]" style={{ fontSize: '8px' }}>{errors.expectedContribution}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex gap-1.5">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 h-7 border-[#C8D6FF] hover:bg-[#EDF2FF] text-gray-700"
                  style={{ fontSize: '10px' }}
                >
                  <span className="flex items-center justify-center gap-1">
                    <ArrowLeft className="w-3 h-3" />
                    Back
                  </span>
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-7"
                style={{ fontSize: '10px' }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1">
                    <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    Join Waitlist
                    <Send className="w-3 h-3" />
                  </span>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <p className="text-center text-gray-500 leading-tight" style={{ fontSize: '8px' }}>
              By joining, you agree to receive updates about the platform launch
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
