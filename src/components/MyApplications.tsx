import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  FileText,
  ExternalLink,
  Eye,
  Search,
  Filter
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true // Set to false when server is deployed

// Mock Applications Data for Job Seekers
const MOCK_USER_APPLICATIONS: ApplicationWithJob[] = [
  {
    id: 'user-app-1',
    jobId: 'job-1',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Full Stack Developer position at AI Wellness Solutions. With my experience in React, Node.js, and cloud technologies, I believe I can contribute effectively to your team.\n\nI am particularly interested in the intersection of technology and healthcare, and would love the opportunity to work on products that can make a real difference in people\'s lives.\n\nThank you for considering my application.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Full-stack developer with 4+ years of experience building web applications with React, Node.js, and cloud technologies. Experience with healthcare and fintech applications.',
    status: 'shortlisted',
    appliedAt: '2024-08-02T10:30:00Z',
    statusUpdatedAt: '2024-08-06T14:15:00Z',
    notes: 'Great portfolio and relevant experience. Scheduled for technical interview on Thursday.',
    job: {
      id: 'job-1',
      title: 'Senior Full Stack Developer',
      company: 'AI Wellness Solutions',
      location: 'San Francisco, CA',
      locationType: 'hybrid',
      jobType: 'full-time',
      experience: 'senior',
      department: 'Engineering',
      salary: '$120,000 - $160,000',
      salaryType: 'range',
      posterName: 'Alex Rodriguez',
      posterRole: 'CTO & Co-Founder',
      status: 'active'
    }
  },
  {
    id: 'user-app-2',
    jobId: 'job-3',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear TechStart Inc. Team,\n\nI am interested in the Frontend Developer Intern position. While I have some experience with web development, I am eager to learn from experienced developers and contribute to real projects.\n\nI have built several personal projects with HTML, CSS, JavaScript, and React. This internship would be a great opportunity to gain professional experience and grow my skills.\n\nThank you for considering my application.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Self-taught frontend developer with 1+ year of experience building personal projects. Proficient in HTML, CSS, JavaScript, and React.',
    status: 'pending',
    appliedAt: '2024-08-12T09:15:00Z',
    statusUpdatedAt: '2024-08-12T09:15:00Z',
    notes: '',
    job: {
      id: 'job-3',
      title: 'Frontend Developer Intern',
      company: 'TechStart Inc.',
      location: 'Remote',
      locationType: 'remote',
      jobType: 'internship',
      experience: 'entry',
      department: 'Engineering',
      salary: '$25 - $30/hour',
      salaryType: 'range',
      posterName: 'Michael Chen',
      posterRole: 'CEO & Founder',
      status: 'active'
    }
  },
  {
    id: 'user-app-3',
    jobId: 'job-2',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear DesignCo Studio Team,\n\nI am writing to apply for the UX/UI Designer position. Although my primary background is in development, I have a strong interest in design and user experience.\n\nI have been studying design principles and have created some UI mockups for my development projects. I believe my technical background combined with my growing design skills could bring a unique perspective to your team.\n\nI would love the opportunity to discuss how I can contribute to your design team.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Developer with growing interest in UX/UI design. Self-taught in design principles and tools like Figma. Created UI designs for personal projects.',
    status: 'on_hold',
    appliedAt: '2024-08-08T14:45:00Z',
    statusUpdatedAt: '2024-08-10T11:30:00Z',
    notes: 'Interesting background combining development and design. Currently evaluating if technical background fits our design team needs.',
    job: {
      id: 'job-2',
      title: 'UX/UI Designer',
      company: 'DesignCo Studio',
      location: 'Austin, TX',
      locationType: 'remote',
      jobType: 'full-time',
      experience: 'mid',
      department: 'Design',
      salary: '$90,000 - $120,000',
      salaryType: 'range',
      posterName: 'Sarah Kim',
      posterRole: 'Design Director',
      status: 'active'
    }
  },
  {
    id: 'user-app-4',
    jobId: 'job-5',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear WellnessTech Corp Team,\n\nI am interested in the Marketing Coordinator position. While my background is primarily technical, I have been involved in marketing activities for some of my side projects and have developed an interest in marketing.\n\nI have experience with social media, content creation, and basic analytics. I believe my technical background could bring a unique perspective to your marketing team, especially for technical product marketing.\n\nThank you for considering my application.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Technical professional with side interest in marketing. Experience with social media marketing for personal projects and basic understanding of marketing analytics.',
    status: 'rejected',
    appliedAt: '2024-08-09T16:20:00Z',
    statusUpdatedAt: '2024-08-11T13:45:00Z',
    notes: 'Thank you for your interest in our Marketing Coordinator position. While your technical background is impressive, we are looking for someone with more dedicated marketing experience for this role.',
    job: {
      id: 'job-5',
      title: 'Marketing Coordinator',
      company: 'WellnessTech Corp',
      location: 'Seattle, WA',
      locationType: 'onsite',
      jobType: 'full-time',
      experience: 'entry',
      department: 'Marketing',
      salary: '$50,000 - $65,000',
      salaryType: 'range',
      posterName: 'Jessica Wong',
      posterRole: 'VP Marketing',
      status: 'active'
    }
  },
  {
    id: 'user-app-5',
    jobId: 'job-6',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear CloudFirst Solutions Team,\n\nI am excited to apply for the DevOps Engineer position. I have been working on expanding my skills into infrastructure and DevOps practices, and this role aligns perfectly with my career goals.\n\nI have experience with AWS, Docker, and CI/CD pipelines from my development work. I am eager to focus more on infrastructure and automation, and would love the opportunity to contribute to your team.\n\nThank you for considering my application.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Full-stack developer transitioning to DevOps. Experience with AWS, Docker, and CI/CD from development work. Eager to focus more on infrastructure and automation.',
    status: 'pending',
    appliedAt: '2024-08-16T11:30:00Z',
    statusUpdatedAt: '2024-08-16T11:30:00Z',
    notes: '',
    job: {
      id: 'job-6',
      title: 'DevOps Engineer',
      company: 'CloudFirst Solutions',
      location: 'Denver, CO',
      locationType: 'remote',
      jobType: 'contract',
      experience: 'mid',
      department: 'Infrastructure',
      salary: '$110,000 - $140,000',
      salaryType: 'range',
      posterName: 'David Park',
      posterRole: 'Senior DevOps Consultant',
      status: 'active'
    }
  },
  {
    id: 'user-app-6',
    jobId: 'job-8',
    applicantId: 'current-user',
    applicantName: 'Current User',
    applicantEmail: 'user@example.com',
    coverLetter: 'Dear MobileFirst Health Team,\n\nI am writing to express my interest in the iOS Developer position. While my primary experience has been in web development, I have been learning iOS development and Swift in my spare time.\n\nI have built a couple of small iOS apps as learning projects and am excited about the opportunity to transition into mobile development, especially in the health tech space.\n\nI would welcome the chance to discuss how my web development experience and growing mobile skills could contribute to your team.',
    resumeUrl: 'https://example.com/my-resume.pdf',
    portfolioUrl: 'https://myportfolio.dev',
    experience: 'Web developer learning iOS development. Built several learning projects in Swift and iOS. Strong foundation in software development principles.',
    status: 'pending',
    appliedAt: '2024-08-21T15:45:00Z',
    statusUpdatedAt: '2024-08-21T15:45:00Z',
    notes: '',
    job: {
      id: 'job-8',
      title: 'iOS Developer',
      company: 'MobileFirst Health',
      location: 'Los Angeles, CA',
      locationType: 'hybrid',
      jobType: 'full-time',
      experience: 'mid',
      department: 'Mobile Engineering',
      salary: '$100,000 - $130,000',
      salaryType: 'range',
      posterName: 'Lisa Thompson',
      posterRole: 'Head of Mobile',
      status: 'active'
    }
  }
]

interface ApplicationWithJob {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  coverLetter: string
  resumeUrl: string
  portfolioUrl: string
  experience: string
  status: 'pending' | 'shortlisted' | 'on_hold' | 'rejected'
  appliedAt: string
  statusUpdatedAt: string
  notes: string
  job: {
    id: string
    title: string
    company: string
    location: string
    locationType: string
    jobType: string
    experience: string
    department: string
    salary: string
    salaryType: string
    posterName: string
    posterRole: string
    status: string
  } | null
}

interface MyApplicationsProps {
  onBack: () => void
  userProfile: any
}

export function MyApplications({ onBack, userProfile }: MyApplicationsProps) {
  const [applications, setApplications] = useState<ApplicationWithJob[]>(MOCK_MODE ? MOCK_USER_APPLICATIONS : [])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (MOCK_MODE) {
      setApplications(MOCK_USER_APPLICATIONS)
      setLoading(false)
    } else {
      fetchApplications()
    }
  }, [])

  const fetchApplications = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/my-applications`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      } else {
        console.error('Failed to fetch applications:', response.statusText)
        toast.error('Failed to load your applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Error loading your applications')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'shortlisted': return 'bg-green-100 text-green-800'
      case 'on_hold': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />
      case 'on_hold': return <Star className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending': return 'Your application is under review'
      case 'shortlisted': return 'Congratulations! You\'ve been shortlisted'
      case 'on_hold': return 'Your application is on hold for future consideration'
      case 'rejected': return 'Thank you for your interest. We\'ve decided to move forward with other candidates'
      default: return 'Application status unknown'
    }
  }

  const getLocationIcon = (locationType: string) => {
    switch (locationType) {
      case 'remote': return '🌐'
      case 'onsite': return '🏢'
      case 'hybrid': return '🔄'
      default: return '📍'
    }
  }

  const formatSalary = (salary: string, salaryType: string) => {
    if (salaryType === 'negotiable') return 'Salary negotiable'
    if (salaryType === 'fixed') return salary
    return salary // For range type
  }

  const handleViewDetails = (application: ApplicationWithJob) => {
    setSelectedApplication(application)
    setShowDetailsDialog(true)
  }

  const filteredApplications = applications.filter(app => {
    if (!app.job) return false
    
    const matchesSearch = app.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    on_hold: applications.filter(app => app.status === 'on_hold').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Loading Your Applications...</h2>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">My Applications</h2>
          <p className="text-muted-foreground">Track the status of your job applications</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="w-3 h-3" />
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              When you apply to job postings, you'll see your applications and their status here.
            </p>
            <Button onClick={onBack}>Browse Jobs</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted ({statusCounts.shortlisted})</SelectItem>
                    <SelectItem value="on_hold">On Hold ({statusCounts.on_hold})</SelectItem>
                    <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No applications match your search criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <Card key={application.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium">
                              {application.job?.company?.charAt(0).toUpperCase() || 'J'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-medium">{application.job?.title || 'Unknown Position'}</h3>
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                              
                              <div className="space-y-2 mb-4">
                                <p className="text-sm text-muted-foreground flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {application.job?.company || 'Unknown Company'}
                                  </span>
                                  {application.job?.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {getLocationIcon(application.job.locationType)} {application.job.location}
                                    </span>
                                  )}
                                </p>
                                
                                <p className="text-sm text-muted-foreground">
                                  {getStatusMessage(application.status)}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Applied {new Date(application.appliedAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Updated {new Date(application.statusUpdatedAt).toLocaleDateString()}
                                </span>
                                {application.resumeUrl && (
                                  <span className="flex items-center gap-1 text-blue-600">
                                    <FileText className="w-3 h-3" />
                                    Resume attached
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(application)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                            {application.job?.status === 'active' && application.status === 'rejected' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={onBack}
                                className="text-xs"
                              >
                                Apply Again?
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="space-y-6">
                {['shortlisted', 'pending', 'on_hold', 'rejected'].map((status) => {
                  const statusApplications = applications.filter(app => app.status === status)
                  if (statusApplications.length === 0) return null

                  return (
                    <Card key={status}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize">{status.replace('_', ' ')}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {statusApplications.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {getStatusMessage(status)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {statusApplications.map((application, index) => (
                          <div key={application.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                              {application.job?.company?.charAt(0).toUpperCase() || 'J'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{application.job?.title || 'Unknown Position'}</h4>
                              <p className="text-sm text-muted-foreground">{application.job?.company || 'Unknown Company'}</p>
                              <p className="text-xs text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewDetails(application)}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Your application for {selectedApplication?.job?.title} at {selectedApplication?.job?.company}
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Job Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Position Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Job Title:</span>
                      <p className="font-medium">{selectedApplication.job?.title}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Company:</span>
                      <p className="font-medium">{selectedApplication.job?.company}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <p className="font-medium">{selectedApplication.job?.department}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">
                        {selectedApplication.job?.location && getLocationIcon(selectedApplication.job.locationType)} {selectedApplication.job?.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Job Type:</span>
                      <p className="font-medium">{selectedApplication.job?.jobType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience Level:</span>
                      <p className="font-medium">{selectedApplication.job?.experience} level</p>
                    </div>
                  </div>
                  {selectedApplication.job?.salary && (
                    <div>
                      <span className="text-muted-foreground">Salary:</span>
                      <p className="font-medium">{formatSalary(selectedApplication.job.salary, selectedApplication.job.salaryType)}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Application Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Application Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(selectedApplication.status)} size="lg">
                      {getStatusIcon(selectedApplication.status)}
                      <span className="ml-1 capitalize">{selectedApplication.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{getStatusMessage(selectedApplication.status)}</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Applied: {new Date(selectedApplication.appliedAt).toLocaleDateString()}</p>
                    <p>Last Updated: {new Date(selectedApplication.statusUpdatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Your Application */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Application</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedApplication.experience && (
                    <div>
                      <h4 className="font-medium mb-2">Experience Summary</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.experience}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium mb-2">Cover Letter</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                  </div>

                  <div className="flex gap-4">
                    {selectedApplication.resumeUrl && (
                      <a 
                        href={selectedApplication.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        View Resume
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {selectedApplication.portfolioUrl && (
                      <a 
                        href={selectedApplication.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Portfolio
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Hiring Manager Notes (if any) */}
              {selectedApplication.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Feedback from Hiring Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedApplication.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}