import { useState } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { Building, Mail, Phone, Linkedin, AlertCircle, Send, Star, X, Briefcase, Award, ArrowLeft } from 'lucide-react'
import cofounderCircleLogo from 'figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png'
import { trackEvent } from '../utils/analytics'

interface MentorInterestData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  linkedinUrl: string
  bio: string
  expertise: string[]
  yearsOfExperience: string
}

interface MentorInterestFormProps {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    countryCode: string
    linkedinUrl: string
  }
  onSubmit: (data: MentorInterestData) => void
  onBack?: () => void
}

// Predefined expertise areas
const expertiseOptions = [
  'Strategy', 'Marketing', 'Sales', 'Product Development', 'Technology',
  'Finance', 'Operations', 'HR', 'Legal', 'Fundraising',
  'Growth Hacking', 'Design', 'Customer Success', 'Data Analytics'
]

export function MentorInterestForm({ personalInfo, onSubmit, onBack }: MentorInterestFormProps) {
  const [formData, setFormData] = useState<MentorInterestData>({
    ...personalInfo,
    bio: '',
    expertise: [],
    yearsOfExperience: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expertiseInput, setExpertiseInput] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.bio.trim()) {
      newErrors.bio = 'Please provide a brief bio'
    } else if (formData.bio.length > 150) {
      newErrors.bio = 'Bio must be 150 characters or less'
    }

    if (formData.expertise.length === 0) {
      newErrors.expertise = 'Please select at least one area of expertise'
    }

    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Please select your years of experience'
    }

    if (formData.linkedinUrl && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/.test(formData.linkedinUrl)) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      trackEvent('mentor_interest_validation_error', {
        error_fields: Object.keys(errors)
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Track mentor interest submission
      trackEvent('mentor_interest_submit', {
        has_linkedin: !!formData.linkedinUrl,
        phone: `${formData.countryCode}${formData.phone}`,
        expertise_count: formData.expertise.length,
        years_of_experience: formData.yearsOfExperience,
        bio_length: formData.bio.length
      })

      // Simulate brief processing
      await new Promise(resolve => setTimeout(resolve, 800))

      onSubmit(formData)
    } catch (error) {
      console.error('Error submitting mentor interest:', error)
      setErrors({ submit: 'Failed to submit your interest. Please try again.' })
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: keyof MentorInterestData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const addExpertise = (area: string) => {
    if (area && !formData.expertise.includes(area) && formData.expertise.length < 5) {
      handleFieldChange('expertise', [...formData.expertise, area])
      setExpertiseInput('')
    }
  }

  const removeExpertise = (area: string) => {
    handleFieldChange('expertise', formData.expertise.filter(e => e !== area))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm max-w-4xl w-full">
          <CardHeader className="text-center pb-3 pt-4">
            <div className="flex justify-center mb-2">
              <img 
                src={cofounderCircleLogo} 
                alt="CoFounder Circle" 
                className="h-9 w-auto"
              />
            </div>
            
            {/* Invite Only Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#114DFF]/10 to-[#3CE5A7]/10 border border-[#114DFF]/20 rounded-full mx-auto mb-2">
              <Star className="w-3 h-3 text-[#114DFF]" />
              <span className="text-xs text-[#114DFF]">Invite Only Program</span>
            </div>

            <CardTitle className="text-lg">Mentor Program Interest</CardTitle>
            <p className="text-gray-600 text-xs mt-1">
              Carefully curated to ensure quality guidance for founders
            </p>
          </CardHeader>

          <CardContent className="space-y-3 px-6 pb-4">
            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-3.5 w-3.5" />
                <AlertDescription className="text-xs">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Vertical Flow Layout */}
            <div className="space-y-3 max-w-2xl mx-auto">
              {/* Info Card */}
              <Card className="bg-gradient-to-br from-[#EDF2FF] to-[#F7F9FF] border-[#C8D6FF]">
                <CardContent className="p-2">
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-[#114DFF] flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-gray-900 text-sm mb-1">Why Join as a Mentor?</h4>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-gray-600">
                        <div>• Guide startups</div>
                        <div>• Expand network</div>
                        <div>• Shape future</div>
                        <div>• Exclusive community</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>



              {/* Divider */}
              <div className="border-t border-[#C8D6FF] my-2" />

              {/* Form Fields Section */}
              <div className="space-y-2.5">
                <h3 className="text-gray-900 text-sm">Your Information</h3>
                
                {/* Name Fields (2-column grid) */}
                <div className="grid grid-cols-2 gap-1.5">
                  <Input
                    value={formData.firstName}
                    disabled
                    placeholder="First Name"
                    className="bg-gray-50 border-[#C8D6FF] h-8 text-xs"
                  />
                  <Input
                    value={formData.lastName}
                    disabled
                    placeholder="Last Name"
                    className="bg-gray-50 border-[#C8D6FF] h-8 text-xs"
                  />
                </div>

                {/* Email */}
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-xs text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    placeholder="Email"
                    className="bg-gray-50 border-[#C8D6FF] h-8 text-xs"
                  />
                </div>
                
                {/* Phone */}
                <div className="space-y-0.5">
                  <Label htmlFor="phone" className="text-xs text-gray-700">Phone Number</Label>
                  <Input
                    id="phone"
                    value={`${formData.countryCode} ${formData.phone}`}
                    disabled
                    placeholder="Phone"
                    className="bg-gray-50 border-[#C8D6FF] h-8 text-xs"
                  />
                </div>

                {/* Brief Bio */}
                <div className="space-y-0.5">
                  <Label htmlFor="bio" className="text-xs text-gray-700 flex items-center justify-between">
                    <span>Brief Bio *</span>
                    <span className="text-gray-500 text-[10px]">{formData.bio.length}/150</span>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your background and experience..."
                    value={formData.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value.slice(0, 150))}
                    className={`h-20 text-xs resize-none ${errors.bio ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}
                    maxLength={150}
                  />
                  {errors.bio && (
                    <p className="text-[#FF220E] text-[10px]">{errors.bio}</p>
                  )}
                </div>

                {/* Years of Experience */}
                <div className="space-y-0.5">
                  <Label htmlFor="experience" className="text-xs text-gray-700">Years of Experience *</Label>
                  <Select
                    value={formData.yearsOfExperience}
                    onValueChange={(value) => handleFieldChange('yearsOfExperience', value)}
                  >
                    <SelectTrigger className={`h-8 text-xs ${errors.yearsOfExperience ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}>
                      <SelectValue placeholder="Select years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10-15">10-15 years</SelectItem>
                      <SelectItem value="15+">15+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.yearsOfExperience && (
                    <p className="text-[#FF220E] text-[10px]">{errors.yearsOfExperience}</p>
                  )}
                </div>

                {/* Areas of Expertise */}
                <div className="space-y-0.5">
                  <Label htmlFor="expertise" className="text-xs text-gray-700 flex items-center justify-between">
                    <span>Areas of Expertise *</span>
                    <span className="text-gray-500 text-[10px]">Max 5</span>
                  </Label>
                  <Select
                    value={expertiseInput}
                    onValueChange={(value) => {
                      addExpertise(value)
                    }}
                    disabled={formData.expertise.length >= 5}
                  >
                    <SelectTrigger className={`h-8 text-xs ${errors.expertise ? 'border-[#FF220E]' : 'border-[#C8D6FF]'}`}>
                      <SelectValue placeholder="Select expertise areas" />
                    </SelectTrigger>
                    <SelectContent>
                      {expertiseOptions.map(option => (
                        <SelectItem 
                          key={option} 
                          value={option}
                          disabled={formData.expertise.includes(option)}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Selected Expertise Tags */}
                  {formData.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {formData.expertise.map(area => (
                        <Badge
                          key={area}
                          variant="secondary"
                          className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-[10px] px-2 py-0.5 h-6 gap-1"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => removeExpertise(area)}
                            className="ml-0.5 hover:text-[#FF220E]"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.expertise && (
                    <p className="text-[#FF220E] text-[10px]">{errors.expertise}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              {onBack && (
                <Button
                  onClick={onBack}
                  variant="outline"
                  disabled={isSubmitting}
                  className="flex-1 h-9 text-xs border-[#C8D6FF] hover:bg-[#EDF2FF] text-gray-700"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </span>
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-9 text-xs"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Submit Your Interest
                    <Send className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <p className="text-[9px] text-center text-gray-500 leading-snug">
              By submitting, you agree to be contacted regarding the mentor program
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
