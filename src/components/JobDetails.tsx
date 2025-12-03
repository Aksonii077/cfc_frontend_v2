import { useState } from 'react'
import { 
  ArrowLeft, 
  MapPin, 
  Building2, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { 
  Job,
  formatSalary, 
  getLocationIcon, 
  getExperienceLevel, 
  getJobType, 
  isApplicationDeadlinePassed, 
  daysUntilDeadline 
} from '../config/jobPortal.config'

interface JobDetailsProps {
  job: Job
  onBack: () => void
  onApply: () => void
  canApply: boolean
  userProfile: any
}

export function JobDetails({ job, onBack, onApply, canApply, userProfile }: JobDetailsProps) {
  const [bookmarked, setBookmarked] = useState(false)

  const deadlinePassed = isApplicationDeadlinePassed(job.applicationDeadline)
  const daysLeft = daysUntilDeadline(job.applicationDeadline)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <p className="text-muted-foreground">Job Details & Application</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setBookmarked(!bookmarked)}>
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-medium">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {getLocationIcon(job.locationType)} {job.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary, job.salaryType)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{getJobType(job.jobType)}</Badge>
                    <Badge variant="outline">{getExperienceLevel(job.experience)}</Badge>
                    <Badge variant="outline">{job.department}</Badge>
                    {job.applicationCount > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Deadline Warning */}
          {job.applicationDeadline && (
            <Card className={deadlinePassed ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  {deadlinePassed ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Calendar className="w-5 h-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">
                      {deadlinePassed ? 'Application Deadline Passed' : 'Application Deadline'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {deadlinePassed 
                        ? `Applications closed on ${new Date(job.applicationDeadline).toLocaleDateString()}`
                        : `Applications close on ${new Date(job.applicationDeadline).toLocaleDateString()} (${daysLeft} days left)`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>About the Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {job.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Card */}
          {canApply && (
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>
                  Ready to take the next step in your career?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deadlinePassed ? (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-600 font-medium">Application deadline has passed</p>
                  </div>
                ) : job.status !== 'active' ? (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">This position is no longer accepting applications</p>
                  </div>
                ) : (
                  <>
                    <Button 
                      onClick={onApply} 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      Apply Now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By applying, you agree to our terms and privacy policy
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Job Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Job Type</span>
                  <span className="text-sm font-medium">{getJobType(job.jobType)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium">{getExperienceLevel(job.experience)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location Type</span>
                  <span className="text-sm font-medium">{getLocationIcon(job.locationType)} {job.locationType}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Salary</span>
                  <span className="text-sm font-medium">{formatSalary(job.salary, job.salaryType)}</span>
                </div>
                {job.applicationDeadline && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Application Deadline</span>
                      <span className="text-sm font-medium">
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Posted Date</span>
                  <span className="text-sm font-medium">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="text-sm font-medium">
                    {job.applicationCount} received
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posted By Card */}
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
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

          {/* Company Card */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Company Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}