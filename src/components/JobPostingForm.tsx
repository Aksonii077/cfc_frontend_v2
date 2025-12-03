import { useState } from 'react'
import { ArrowLeft, Plus, X, Building2, MapPin, DollarSign, Clock, Users, Briefcase } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'
import { CalendarIcon } from 'lucide-react'

const format = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {}
  
  if (formatStr === 'PPP') {
    options.weekday = 'long'
    options.year = 'numeric'
    options.month = 'long'
    options.day = 'numeric'
  }
  
  return date.toLocaleDateString('en-US', options)
}

interface JobPostingFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function JobPostingForm({ onSuccess, onCancel }: JobPostingFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    locationType: 'remote',
    jobType: 'full-time',
    experience: 'mid',
    department: '',
    salary: '',
    salaryType: 'range',
    description: '',
    applicationDeadline: undefined as Date | undefined
  })

  const [requirements, setRequirements] = useState<string[]>([''])
  const [responsibilities, setResponsibilities] = useState<string[]>([''])
  const [skills, setSkills] = useState<string[]>([''])
  const [benefits, setBenefits] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  const addListItem = (list: string[], setList: (list: string[]) => void) => {
    setList([...list, ''])
  }

  const removeListItem = (index: number, list: string[], setList: (list: string[]) => void) => {
    setList(list.filter((_, i) => i !== index))
  }

  const updateListItem = (index: number, value: string, list: string[], setList: (list: string[]) => void) => {
    const newList = [...list]
    newList[index] = value
    setList(newList)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.company || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please log in to post a job')
        return
      }

      const jobData = {
        ...formData,
        requirements: requirements.filter(req => req.trim() !== ''),
        responsibilities: responsibilities.filter(resp => resp.trim() !== ''),
        skills: skills.filter(skill => skill.trim() !== ''),
        benefits: benefits.filter(benefit => benefit.trim() !== ''),
        applicationDeadline: formData.applicationDeadline?.toISOString()
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to post job')
      }
    } catch (error) {
      console.error('Error posting job:', error)
      toast.error('Failed to post job')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ListInput = ({ 
    list, 
    setList, 
    label, 
    placeholder 
  }: { 
    list: string[]
    setList: (list: string[]) => void
    label: string
    placeholder: string
  }) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      {list.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => updateListItem(index, e.target.value, list, setList)}
            placeholder={placeholder}
            className="flex-1"
          />
          {list.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeListItem(index, list, setList)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addListItem(list, setList)}
        className="flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add {label.slice(0, -1)}
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">Post New Job</h2>
          <p className="text-muted-foreground">Create a new job posting to find the perfect candidate</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Details
            </CardTitle>
            <CardDescription>
              Provide the basic information about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. TechCorp Inc."
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Engineering, Marketing, Sales"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA or Global"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location Type</Label>
                <Select value={formData.locationType} onValueChange={(value) => setFormData({ ...formData, locationType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">🌐 Remote</SelectItem>
                    <SelectItem value="onsite">🏢 On-site</SelectItem>
                    <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role, company culture, and what you're looking for in a candidate..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Compensation
            </CardTitle>
            <CardDescription>
              Set the salary range and benefits for this position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Salary Type</Label>
                <Select value={formData.salaryType} onValueChange={(value) => setFormData({ ...formData, salaryType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="range">Salary Range</SelectItem>
                    <SelectItem value="fixed">Fixed Salary</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">
                  {formData.salaryType === 'range' ? 'Salary Range' : 
                   formData.salaryType === 'fixed' ? 'Salary Amount' : 'Salary (Optional)'}
                </Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder={
                    formData.salaryType === 'range' ? '$80,000 - $120,000' :
                    formData.salaryType === 'fixed' ? '$100,000' : 'To be discussed'
                  }
                  disabled={formData.salaryType === 'negotiable'}
                />
              </div>
            </div>

            <ListInput
              list={benefits}
              setList={setBenefits}
              label="Benefits"
              placeholder="e.g. Health insurance, 401k, flexible hours"
            />
          </CardContent>
        </Card>

        {/* Requirements & Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Role Details
            </CardTitle>
            <CardDescription>
              Define what the role involves and what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ListInput
              list={requirements}
              setList={setRequirements}
              label="Requirements"
              placeholder="e.g. 3+ years of React experience"
            />

            <Separator />

            <ListInput
              list={responsibilities}
              setList={setResponsibilities}
              label="Responsibilities"
              placeholder="e.g. Develop and maintain user interfaces"
            />

            <Separator />

            <ListInput
              list={skills}
              setList={setSkills}
              label="Skills"
              placeholder="e.g. JavaScript, React, TypeScript"
            />
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Application Settings
            </CardTitle>
            <CardDescription>
              Configure how and when applications are accepted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Application Deadline (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.applicationDeadline ? (
                      format(formData.applicationDeadline, "PPP")
                    ) : (
                      <span>Pick a deadline date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.applicationDeadline}
                    onSelect={(date) => setFormData({ ...formData, applicationDeadline: date })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Leave empty if there's no specific deadline
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}