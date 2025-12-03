import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Alert, AlertDescription } from './ui/alert'
import { 
  User, 
  Mail, 
  Phone, 
  Linkedin,
  Briefcase,
  Rocket,
  Target,
  Code,
  Building,
  Truck,
  Search,
  BookOpen,
  Heart,
  DollarSign,
  Database,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import cofounderCircleLogo from 'figma:asset/410004b62b93127b8e248ebc3bc69d517631ee0f.png'
import { 
  trackOnboardingFieldEdit,
  trackEvent 
} from '../utils/analytics'

interface PersonalInfoData {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  linkedinUrl: string
  selectedRole: string
}

interface PersonalInfoCollectionProps {
  onComplete: (data: PersonalInfoData) => void
}

// Country codes for phone input
const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
]

// Role options
const roleOptions = [
  {
    id: 'founder',
    label: 'Founders',
    icon: Rocket,
    description: 'Building the next big thing',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'mentor',
    label: 'Mentors & Incubators',
    icon: Building,
    description: 'Guiding entrepreneurs',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'investor',
    label: 'Investors',
    icon: DollarSign,
    description: 'Funding the future',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'professional',
    label: 'Professionals',
    icon: Briefcase,
    description: 'Experienced industry experts',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'student',
    label: 'Students',
    icon: BookOpen,
    description: 'Learning & exploring',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'partner',
    label: 'Partners (Suppliers & Service Providers)',
    icon: Truck,
    description: 'Providing products & services',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'developer',
    label: 'Developers',
    icon: Code,
    description: 'Building technology solutions',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
  {
    id: 'job_seeker',
    label: 'Job Seekers',
    icon: Search,
    description: 'Finding opportunities',
    color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]'
  },
]

export function PersonalInfoCollection({ onComplete }: PersonalInfoCollectionProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<PersonalInfoData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    linkedinUrl: '',
    selectedRole: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-populate from Google user data
  useEffect(() => {
    if (user) {
      const nameParts = user.user_metadata?.full_name?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || user.user_metadata?.first_name || '',
        lastName: nameParts.slice(1).join(' ') || user.user_metadata?.last_name || '',
        email: user.email || ''
      }))

      // Track step view
      trackEvent('personal_info_step_view', {
        user_id: user.id,
        prepopulated_fields: ['firstName', 'lastName', 'email']
      })
    }
  }, [user])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/[\s-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)'
    }

    // LinkedIn URL validation (optional field)
    if (formData.linkedinUrl.trim()) {
      const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i
      if (!linkedinPattern.test(formData.linkedinUrl.trim())) {
        newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL (e.g., linkedin.com/in/yourname)'
      }
    }

    if (!formData.selectedRole) {
      newErrors.selectedRole = 'Please select your primary role'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      trackEvent('personal_info_validation_error', {
        error_fields: Object.keys(errors)
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Track completion
      trackEvent('personal_info_complete', {
        user_id: user?.id,
        selected_role: formData.selectedRole,
        has_phone: !!formData.phone,
        has_linkedin: !!formData.linkedinUrl
      })

      // Simulate brief processing
      await new Promise(resolve => setTimeout(resolve, 500))

      onComplete(formData)
    } catch (error) {
      console.error('Error submitting personal info:', error)
      setErrors({ submit: 'Failed to save information. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFieldChange = (field: keyof PersonalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    trackOnboardingFieldEdit(field, !!value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-[#EDF2FF] to-[#F5F5F5] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl border-[#C8D6FF] bg-white/80 backdrop-blur-sm w-full max-w-5xl">
          <CardHeader className="text-center pb-2 pt-3">
            <div className="flex justify-center mb-1.5">
              <img 
                src={cofounderCircleLogo} 
                alt="CoFounder Circle" 
                className="h-9 w-auto"
              />
            </div>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <p className="text-gray-600 text-xs mt-0.5">
              Quick setup to personalize your experience
            </p>
          </CardHeader>

          <CardContent className="space-y-3.5 px-6 pb-4">
            {/* Error Alert */}
            {errors.submit && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <AlertDescription className="text-xs">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-2.5">
              <h3 className="text-gray-900 text-sm flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#114DFF]" />
                Basic Information
              </h3>

              {/* Full Name - First and Last */}
              <div>
                <Label className="text-xs text-gray-700 mb-1 block">Full Name *</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <Input
                      id="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      className={`h-8 text-xs border-[#C8D6FF] ${errors.firstName ? 'border-[#FF220E]' : ''}`}
                    />
                    {errors.firstName && (
                      <p className="text-[#FF220E] text-[10px]">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <Input
                      id="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      className={`h-8 text-xs border-[#C8D6FF] ${errors.lastName ? 'border-[#FF220E]' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="text-[#FF220E] text-[10px]">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-0.5">
                <Label htmlFor="email" className="text-xs text-gray-700">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    disabled={!!user?.email}
                    className={`pl-7 h-8 text-xs border-[#C8D6FF] ${errors.email ? 'border-[#FF220E]' : ''} ${user?.email ? 'bg-gray-50' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-[#FF220E] text-[10px]">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-0.5">
                <Label htmlFor="phone" className="text-xs text-gray-700">Phone Number *</Label>
                <div className="flex gap-1.5">
                  <Select
                    value={formData.countryCode}
                    onValueChange={(value) => handleFieldChange('countryCode', value)}
                  >
                    <SelectTrigger className="w-[95px] h-8 border-[#C8D6FF] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-1 text-xs">
                            <span className="text-xs">{country.flag}</span>
                            <span>{country.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="relative flex-1">
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="555 123 4567"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value.replace(/[^\d\s-()]/g, ''))}
                      className={`pl-7 h-8 text-xs border-[#C8D6FF] ${errors.phone ? 'border-[#FF220E]' : ''}`}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <p className="text-[#FF220E] text-[10px]">{errors.phone}</p>
                )}
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-0.5">
                <Label htmlFor="linkedinUrl" className="text-xs text-gray-700">LinkedIn Profile (Optional)</Label>
                <div className="relative">
                  <Linkedin className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="linkedin.com/in/yourname"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                    className={`pl-7 h-8 text-xs border-[#C8D6FF] ${errors.linkedinUrl ? 'border-[#FF220E]' : ''}`}
                  />
                </div>
                {errors.linkedinUrl && (
                  <p className="text-[#FF220E] text-[10px]">{errors.linkedinUrl}</p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#C8D6FF] my-2" />

            {/* Role Selection */}
            <div className="space-y-2">
              <h3 className="text-gray-900 text-sm flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#114DFF]" />
                Select Your Primary Role
              </h3>

              {/* Selected Role Indicator */}
              {formData.selectedRole && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-1.5 bg-[#EDF2FF] border border-[#114DFF] rounded-md flex items-center gap-1.5"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-[#06CB1D] flex items-center justify-center flex-shrink-0">
                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-[#114DFF] truncate">
                    Selected: {roleOptions.find(r => r.id === formData.selectedRole)?.label}
                  </span>
                </motion.div>
              )}

              {/* Role Cards Grid - 4 columns x 2 rows */}
              <div className="grid grid-cols-4 gap-2">
                {roleOptions.map((role, index) => {
                  const isSelected = formData.selectedRole === role.id;
                  return (
                    <motion.button
                      key={role.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.015 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleFieldChange('selectedRole', role.id)}
                      className="w-full text-left"
                    >
                      <Card
                        className={`border transition-all duration-150 relative ${
                          isSelected
                            ? 'border-[#114DFF] bg-[#EDF2FF] shadow-sm'
                            : 'border-[#C8D6FF] hover:border-[#114DFF] bg-white'
                        }`}
                      >
                        {/* Selection Checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-[#06CB1D] flex items-center justify-center z-10"
                          >
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}

                        <CardContent className="p-1.5 flex flex-col items-center gap-1 text-center">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#114DFF] to-[#3CE5A7]'
                              : 'bg-[#F7F9FF]'
                          }`}>
                            <role.icon className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-white' : 'text-[#114DFF]'
                            }`} />
                          </div>
                          <h4 className={`text-[9px] leading-tight line-clamp-2 ${isSelected ? 'text-[#114DFF]' : 'text-gray-900'}`}>
                            {role.label}
                          </h4>
                        </CardContent>
                      </Card>
                    </motion.button>
                  );
                })}
              </div>
              
              {errors.selectedRole && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1 text-[#FF220E]"
                >
                  <AlertCircle className="w-3 h-3" />
                  <p className="text-[10px]">{errors.selectedRole}</p>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1.5">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-9 shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    Continue
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                )}
              </Button>
            </div>

            {/* Privacy Notice */}
            <p className="text-[9px] text-center text-gray-500 leading-snug">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
