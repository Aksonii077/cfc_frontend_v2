import { useState } from 'react'
import { ArrowLeft, FileText, Upload, User } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Job, formatSalary, getLocationIcon } from '../config/jobPortal.config'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

interface ApplicationFormProps {
  job: Job
  onSuccess: () => void
  onCancel: () => void
}

export function ApplicationForm({ job, onSuccess, onCancel }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: '',
    portfolioUrl: '',
    experience: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.coverLetter.trim()) {
      toast.error('Please write a cover letter')
      return
    }

    setIsSubmitting(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error('Please log in to apply')
        return
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
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
          <h2 className="text-2xl font-semibold">Apply for Position</h2>
          <p className="text-muted-foreground">Submit your application and make a great first impression</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Application Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Application Details
                </CardTitle>
                <CardDescription>
                  Tell us why you're the perfect fit for this role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Cover Letter *</Label>
                  <Textarea
                    id="coverLetter"
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    placeholder="Dear Hiring Manager,&#10;&#10;I am excited to apply for the [job title] position at [company]. With my experience in...&#10;&#10;[Explain why you're interested in this role and company]&#10;[Highlight your relevant experience and skills]&#10;[Mention specific achievements or projects]&#10;[Express enthusiasm for the opportunity]&#10;&#10;Thank you for considering my application. I look forward to hearing from you.&#10;&#10;Best regards,&#10;[Your name]"
                    rows={10}
                    className="resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Write a compelling cover letter that highlights your relevant experience and explains why you're interested in this role.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Relevant Experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Briefly describe your relevant work experience, key projects, and achievements that make you a great fit for this role..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Documents & Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents & Links
                </CardTitle>
                <CardDescription>
                  Provide links to your resume and portfolio to showcase your work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resumeUrl">Resume/CV URL</Label>
                  <Input
                    id="resumeUrl"
                    type="url"
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/your-resume-link"
                  />
                  <p className="text-xs text-muted-foreground">
                    Share a link to your resume hosted on Google Drive, Dropbox, or your personal website
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio/Website URL (Optional)</Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.com or https://github.com/yourusername"
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to your portfolio, GitHub profile, LinkedIn, or personal website
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Upload className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">Tips for sharing documents:</p>
                      <ul className="text-blue-700 space-y-1">
                        <li>• Make sure your files are publicly accessible or shareable with a link</li>
                        <li>• Use professional file names (e.g., "John_Doe_Resume_2024.pdf")</li>
                        <li>• Keep your resume updated with your latest experience</li>
                        <li>• If you have a portfolio, showcase projects relevant to this role</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
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
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Job Summary Sidebar */}
        <div className="space-y-6">
          {/* Job Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Position Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-medium">{getLocationIcon(job.locationType)} {job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Type</span>
                  <span className="font-medium">{job.jobType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{job.experience} level</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department</span>
                  <span className="font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salary</span>
                  <span className="font-medium">{formatSalary(job.salary, job.salaryType)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Manager */}
          <Card>
            <CardHeader>
              <CardTitle>Hiring Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {job.posterName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{job.posterName}</p>
                  <p className="text-sm text-muted-foreground capitalize">{job.posterRole}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Application Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tailor your cover letter to this specific role and company</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Highlight relevant experience and achievements with specific examples</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Show enthusiasm for the company and role</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep your resume current and professionally formatted</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Double-check all links work properly before submitting</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-purple-600">1</span>
                  </div>
                  <p>Your application will be reviewed by the hiring team</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-purple-600">2</span>
                  </div>
                  <p>You'll receive an email confirmation of your application</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-purple-600">3</span>
                  </div>
                  <p>If selected, you'll be contacted for the next steps</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}