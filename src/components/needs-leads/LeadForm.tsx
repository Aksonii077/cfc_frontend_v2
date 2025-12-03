import { useState } from 'react'
import { ArrowLeft, Plus, X, DollarSign, RefreshCw, User, Link } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Need, Lead, COMMON_SKILLS, validateLeadForm, getCategoryInfo, getTypeInfo } from '../../config/needsLeads.config'
import { projectId } from '../../utils/supabase/info'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true

interface LeadFormProps {
  need: Need
  onSuccess: () => void
  onCancel: () => void
  userProfile: any
}

export function LeadForm({ need, onSuccess, onCancel, userProfile }: LeadFormProps) {
  const [formData, setFormData] = useState<Partial<Lead>>({
    coverMessage: '',
    proposedSolution: '',
    relevantExperience: '',
    availability: '',
    portfolio: '',
    skillsOffering: [],
    proposedRate: ''
  })
  
  const [skillInput, setSkillInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const supabase = createClient()
  const categoryInfo = getCategoryInfo(need.category)
  const typeInfo = getTypeInfo(need.type)

  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsOffering?.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsOffering: [...(prev.skillsOffering || []), skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffering: prev.skillsOffering?.filter(s => s !== skill) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateLeadForm(formData, need.type)
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
        toast.error('Please sign in to submit your interest')
        return
      }

      const leadData = {
        ...formData,
        needId: need.id,
        applicantId: userProfile?.id || userProfile?.roleId,
        applicantName: userProfile?.name || 'Anonymous',
        applicantEmail: userProfile?.email || '',
        applicantRole: userProfile?.role || 'User',
        applicantCompany: userProfile?.company,
        status: 'pending',
        notes: '',
        messageCount: 0
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/needs/${need.id}/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit interest')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      toast.error('Error submitting interest')
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
          <h2 className="text-2xl font-semibold">Show Interest</h2>
          <p className="text-muted-foreground">Express your interest in this opportunity</p>
        </div>
      </div>

      {/* Need Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="text-lg">{categoryInfo.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{need.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {need.posterName} • {need.posterCompany || need.posterRole}
              </p>
              <div className="flex gap-2">
                <Badge className={typeInfo.value === 'barter' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  {typeInfo.icon} {typeInfo.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Your Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Your Profile
            </CardTitle>
            <CardDescription>This information will be shared with the poster</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input 
                  value={userProfile?.name || 'Anonymous'} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input 
                  value={userProfile?.role || 'User'} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            {userProfile?.company && (
              <div>
                <Label>Company</Label>
                <Input 
                  value={userProfile.company} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cover Message */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Message</CardTitle>
            <CardDescription>Introduce yourself and explain why you're interested</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.coverMessage}
              onChange={(e) => setFormData(prev => ({ ...prev, coverMessage: e.target.value }))}
              placeholder="Hi! I'm interested in this opportunity because..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Proposed Solution */}
        <Card>
          <CardHeader>
            <CardTitle>Your Proposed Solution</CardTitle>
            <CardDescription>Describe how you would approach this project</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.proposedSolution}
              onChange={(e) => setFormData(prev => ({ ...prev, proposedSolution: e.target.value }))}
              placeholder="Here's how I would tackle this project..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Relevant Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Relevant Experience</CardTitle>
            <CardDescription>Highlight your relevant skills and past projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.relevantExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, relevantExperience: e.target.value }))}
              placeholder="I have experience in..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Portfolio Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Portfolio/Work Samples
            </CardTitle>
            <CardDescription>Share a link to your portfolio or relevant work (optional)</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={formData.portfolio}
              onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
              placeholder="https://yourportfolio.com or https://github.com/username"
            />
          </CardContent>
        </Card>

        {/* Skills Offering (for barter) */}
        {need.type === 'barter' && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <RefreshCw className="w-5 h-5" />
                Skills You Can Offer
              </CardTitle>
              <CardDescription>What skills can you offer in exchange?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Add Your Skills</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Enter a skill you can offer..."
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
                        if (!formData.skillsOffering?.includes(skill)) {
                          setFormData(prev => ({
                            ...prev,
                            skillsOffering: [...(prev.skillsOffering || []), skill]
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
              {formData.skillsOffering && formData.skillsOffering.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Skills You're Offering</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skillsOffering.map(skill => (
                      <Badge key={skill} className="bg-green-600 text-white">
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
        )}

        {/* Proposed Rate (for paid) */}
        {need.type === 'paid' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <DollarSign className="w-5 h-5" />
                Your Proposed Rate
              </CardTitle>
              <CardDescription>
                {need.budget && `Budget: ${need.budget}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.proposedRate}
                onChange={(e) => setFormData(prev => ({ ...prev, proposedRate: e.target.value }))}
                placeholder="e.g., $50/hour, $3,000 total, or 'Flexible - let's discuss'"
              />
            </CardContent>
          </Card>
        )}

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
            <CardDescription>When can you start and how much time can you commit?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
              placeholder="I'm available to start immediately and can commit 10-15 hours per week..."
              rows={3}
            />
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
            {isSubmitting ? 'Submitting...' : 'Submit Interest'}
          </Button>
        </div>
      </form>
    </div>
  )
}