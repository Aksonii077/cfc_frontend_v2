import { useState } from 'react'
import { ArrowLeft, Plus, X, MapPin, DollarSign, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { 
  NEED_CATEGORIES, 
  URGENCY_LEVELS, 
  NEED_TYPES, 
  BUDGET_TYPES, 
  COMMON_SKILLS,
  Need,
  validateNeedForm
} from '../../config/needsLeads.config'
import { projectId } from '../../utils/supabase/info'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true

interface PostNeedFormProps {
  onSuccess: () => void
  onCancel: () => void
  userProfile: any
}

export function PostNeedForm({ onSuccess, onCancel, userProfile }: PostNeedFormProps) {
  const [formData, setFormData] = useState<Partial<Need>>({
    title: '',
    description: '',
    category: '',
    skillsRequired: [],
    type: 'barter',
    skillsOffered: [],
    budget: '',
    budgetType: 'fixed',
    duration: '',
    urgency: 'medium',
    location: '',
    isRemote: true
  })
  
  const [skillInput, setSkillInput] = useState('')
  const [skillOfferedInput, setSkillOfferedInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const supabase = createClient()

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...(prev.skillsRequired || []), skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired?.filter(s => s !== skill) || []
    }))
  }

  const addSkillOffered = () => {
    if (skillOfferedInput.trim() && !formData.skillsOffered?.includes(skillOfferedInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...(prev.skillsOffered || []), skillOfferedInput.trim()]
      }))
      setSkillOfferedInput('')
    }
  }

  const removeSkillOffered = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered?.filter(s => s !== skill) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateNeedForm(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setIsSubmitting(true)
    setErrors([])

    try {
      if (MOCK_MODE) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        onSuccess()
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please sign in to post a need')
        return
      }

      const needData = {
        ...formData,
        postedBy: userProfile?.id || userProfile?.roleId,
        posterName: userProfile?.name || 'Anonymous',
        posterRole: userProfile?.role || 'User',
        posterCompany: userProfile?.company,
        status: 'active',
        leadCount: 0,
        viewCount: 0
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/needs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(needData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to post need')
      }
    } catch (error) {
      console.error('Error posting need:', error)
      toast.error('Error posting need')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">Post a Need</h2>
          <p className="text-muted-foreground">Describe what you need help with</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the essential details about your need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Website UI/UX Design for HealthTech Startup"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide a detailed description of what you need help with..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEED_CATEGORIES.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as any }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    {URGENCY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 4-6 weeks, 3 months, Ongoing"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills Required */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Required</CardTitle>
            <CardDescription>What skills are you looking for?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add Skills *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Enter a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} disabled={!skillInput.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Common Skills */}
            <div>
              <Label className="text-sm text-muted-foreground">Common Skills (click to add)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COMMON_SKILLS.slice(0, 12).map(skill => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      if (!formData.skillsRequired?.includes(skill)) {
                        setFormData(prev => ({
                          ...prev,
                          skillsRequired: [...(prev.skillsRequired || []), skill]
                        }))
                      }
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Selected Skills */}
            {formData.skillsRequired && formData.skillsRequired.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Selected Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsRequired.map(skill => (
                    <Badge key={skill} className="bg-primary text-primary-foreground">
                      {skill}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Type and Exchange */}
        <Card>
          <CardHeader>
            <CardTitle>Project Type</CardTitle>
            <CardDescription>How would you like to structure this collaboration?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
            >
              {NEED_TYPES.map(type => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex items-center gap-2 cursor-pointer">
                    <span className="text-lg">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Barter Section */}
            {formData.type === 'barter' && (
              <div className="space-y-4 p-4 bg-green-50 rounded-lg border">
                <div className="flex items-center gap-2 text-green-700">
                  <RefreshCw className="w-4 h-4" />
                  <h4 className="font-medium">Skills Exchange</h4>
                </div>
                
                <div>
                  <Label>Skills You Can Offer *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={skillOfferedInput}
                      onChange={(e) => setSkillOfferedInput(e.target.value)}
                      placeholder="What skills can you offer in exchange?"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillOffered())}
                    />
                    <Button type="button" onClick={addSkillOffered} disabled={!skillOfferedInput.trim()}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {formData.skillsOffered && formData.skillsOffered.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Skills You're Offering</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.skillsOffered.map(skill => (
                        <Badge key={skill} className="bg-green-600 text-white">
                          {skill}
                          <X 
                            className="w-3 h-3 ml-1 cursor-pointer" 
                            onClick={() => removeSkillOffered(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Paid Section */}
            {formData.type === 'paid' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg border">
                <div className="flex items-center gap-2 text-blue-700">
                  <DollarSign className="w-4 h-4" />
                  <h4 className="font-medium">Paid Project</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget *</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      placeholder="e.g., $2,000 - $5,000 or $50"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budgetType">Budget Type</Label>
                    <Select 
                      value={formData.budgetType} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, budgetType: value as any }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Work Arrangement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="remote"
                checked={formData.isRemote}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRemote: checked }))}
              />
              <Label htmlFor="remote">This is a remote opportunity</Label>
            </div>

            {!formData.isRemote && (
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="text-red-600">
                <h4 className="font-medium mb-2">Please fix the following errors:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? 'Posting...' : 'Post Need'}
          </Button>
        </div>
      </form>
    </div>
  )
}