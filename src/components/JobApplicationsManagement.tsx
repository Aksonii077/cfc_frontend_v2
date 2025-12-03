import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Users, 
  Mail, 
  Calendar, 
  FileText, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  Filter,
  Search,
  MoreHorizontal
} from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Label } from './ui/label'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true // Set to false when server is deployed

// Mock Application Data for Different Jobs
const MOCK_APPLICATIONS_DATA: Record<string, Application[]> = {
  'job-1': [ // Senior Full Stack Developer
    {
      id: 'app-mgmt-1',
      jobId: 'job-1',
      applicantId: 'candidate-1',
      applicantName: 'Sarah Chen',
      applicantEmail: 'sarah.chen@email.com',
      coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Full Stack Developer position at AI Wellness Solutions. With 6 years of experience in full-stack development and a passion for healthcare technology, I believe I would be a perfect fit for your team.\n\nIn my current role at HealthTech Inc., I have led the development of a patient management system that serves over 10,000 users. I have extensive experience with React, Node.js, TypeScript, and AWS, which aligns perfectly with your tech stack.\n\nI am particularly drawn to your mission of using AI to personalize wellness, as I believe technology has the power to transform healthcare outcomes.\n\nThank you for considering my application.',
      resumeUrl: 'https://example.com/sarah-chen-resume.pdf',
      portfolioUrl: 'https://sarahchen.dev',
      experience: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Led development of healthcare management systems, e-commerce platforms, and fintech applications. Expert in React, Node.js, TypeScript, AWS, and microservices architecture.',
      status: 'shortlisted',
      appliedAt: '2024-08-01T09:30:00Z',
      statusUpdatedAt: '2024-08-05T14:20:00Z',
      notes: 'Excellent portfolio with relevant healthcare experience. Strong technical background and great cultural fit. Scheduled for technical interview on Friday.'
    },
    {
      id: 'app-mgmt-2',
      jobId: 'job-1',
      applicantId: 'candidate-2',
      applicantName: 'Marcus Rodriguez',
      applicantEmail: 'marcus.rodriguez@email.com',
      coverLetter: 'Hello AI Wellness Solutions Team,\n\nI am writing to express my strong interest in the Senior Full Stack Developer position. As a software engineer with 5 years of experience in building modern web applications, I am excited about the opportunity to contribute to your innovative wellness platform.\n\nAt my current company, TechFlow Solutions, I have been responsible for architecting and implementing full-stack applications using React, Node.js, and cloud technologies. I have a track record of delivering high-quality software that scales with business needs.\n\nI am particularly impressed by your AI-driven approach to personalized wellness and would love to be part of a team that is making a real impact on people\'s health and well-being.',
      resumeUrl: 'https://example.com/marcus-rodriguez-resume.pdf',
      portfolioUrl: 'https://github.com/marcusrod',
      experience: 'Full-stack developer with 5 years of experience in modern JavaScript frameworks and cloud technologies. Built and maintained high-traffic applications serving 100K+ users. Strong background in API design, database optimization, and DevOps practices.',
      status: 'pending',
      appliedAt: '2024-08-03T11:15:00Z',
      statusUpdatedAt: '2024-08-03T11:15:00Z',
      notes: ''
    },
    {
      id: 'app-mgmt-3',
      jobId: 'job-1',
      applicantId: 'candidate-3',
      applicantName: 'Emily Wang',
      applicantEmail: 'emily.wang@email.com',
      coverLetter: 'Dear Hiring Team,\n\nI am thrilled to apply for the Senior Full Stack Developer role at AI Wellness Solutions. With my background in both software engineering and data science, I bring a unique perspective to building AI-powered applications.\n\nDuring my time at DataVibe Corp, I developed machine learning pipelines and built the frontend interfaces to visualize complex data insights. This experience has given me a deep understanding of how to create intuitive user experiences for AI-driven products.\n\nI am passionate about leveraging technology to solve real-world problems and would be excited to contribute to your mission of personalized wellness through AI.',
      resumeUrl: 'https://example.com/emily-wang-resume.pdf',
      portfolioUrl: 'https://emilydev.io',
      experience: 'Full-stack engineer with 4 years of experience and additional background in data science. Specialized in building AI-powered applications with React, Python, and TensorFlow. Experience with data visualization, machine learning model integration, and scalable web architectures.',
      status: 'on_hold',
      appliedAt: '2024-08-02T16:45:00Z',
      statusUpdatedAt: '2024-08-06T10:30:00Z',
      notes: 'Strong candidate with unique AI/ML background. Currently evaluating if we need more data science skills for this specific role. Will revisit after defining data science requirements.'
    },
    {
      id: 'app-mgmt-4',
      jobId: 'job-1',
      applicantId: 'candidate-4',
      applicantName: 'David Thompson',
      applicantEmail: 'david.thompson@email.com',
      coverLetter: 'Hi there,\n\nI saw your job posting for a Senior Full Stack Developer and wanted to throw my hat in the ring. I\'ve been coding for about 3 years now and have worked on some pretty cool projects.\n\nI know React and Node.js pretty well, and I\'ve been learning AWS on the side. I think I could be a good fit for your team and would love to learn more about what you\'re building.\n\nLet me know if you\'d like to chat!',
      resumeUrl: 'https://example.com/david-thompson-resume.pdf',
      portfolioUrl: 'https://github.com/dthompson',
      experience: 'Junior developer with 3 years of experience primarily in frontend development. Built several personal projects with React and basic Node.js applications. Still learning cloud technologies and backend architecture patterns.',
      status: 'rejected',
      appliedAt: '2024-08-04T13:20:00Z',
      statusUpdatedAt: '2024-08-07T09:15:00Z',
      notes: 'While the candidate shows enthusiasm, the experience level doesn\'t match our senior role requirements. The application lacks depth in backend and cloud technologies. Would be better suited for a junior or mid-level position.'
    },
    {
      id: 'app-mgmt-5',
      jobId: 'job-1',
      applicantId: 'candidate-5',
      applicantName: 'Priya Patel',
      applicantEmail: 'priya.patel@email.com',
      coverLetter: 'Dear AI Wellness Solutions Team,\n\nI am excited to submit my application for the Senior Full Stack Developer position. As a seasoned developer with 7 years of experience building enterprise-scale applications, I am drawn to your innovative approach to AI-powered wellness solutions.\n\nIn my current role as Lead Developer at FinanceForward, I have architected and implemented microservices that handle millions of transactions daily. My expertise spans React, Node.js, TypeScript, AWS, and Kubernetes, making me well-equipped to contribute to your technical infrastructure.\n\nI am particularly excited about the opportunity to work on healthcare technology that can make a meaningful difference in people\'s lives. The intersection of AI and wellness represents the future of healthcare, and I would be honored to be part of your mission.',
      resumeUrl: 'https://example.com/priya-patel-resume.pdf',
      portfolioUrl: 'https://priyatech.dev',
      experience: 'Senior full-stack engineer with 7+ years of experience in enterprise software development. Led teams of 5+ developers, architected microservices handling high-scale traffic, and implemented CI/CD pipelines. Expert in modern web technologies and cloud infrastructure.',
      status: 'pending',
      appliedAt: '2024-08-05T08:45:00Z',
      statusUpdatedAt: '2024-08-05T08:45:00Z',
      notes: ''
    }
  ],
  'job-3': [ // Frontend Developer Intern
    {
      id: 'app-mgmt-6',
      jobId: 'job-3',
      applicantId: 'candidate-6',
      applicantName: 'Alex Kim',
      applicantEmail: 'alex.kim@university.edu',
      coverLetter: 'Dear TechStart Inc. Team,\n\nI am writing to apply for the Frontend Developer Intern position. As a Computer Science student in my junior year, I am eager to gain hands-on experience in web development while contributing to your innovative projects.\n\nI have been passionate about frontend development since taking my first web development course last year. Since then, I have built several personal projects using React, including a task management app and a weather dashboard that I deployed to Netlify.\n\nI am particularly drawn to TechStart\'s culture of innovation and learning. The opportunity to work alongside experienced developers while contributing to real projects would be invaluable for my professional growth.',
      resumeUrl: 'https://example.com/alex-kim-resume.pdf',
      portfolioUrl: 'https://alexkim.netlify.app',
      experience: 'Junior Computer Science student with 1+ year of self-taught frontend development experience. Built 3 personal projects with React, proficient in HTML, CSS, JavaScript, and Git. Strong academic performance and eager to learn.',
      status: 'shortlisted',
      appliedAt: '2024-08-10T14:30:00Z',
      statusUpdatedAt: '2024-08-12T11:20:00Z',
      notes: 'Impressive self-taught skills for a student. Clean portfolio with well-documented projects. Shows strong potential and enthusiasm for learning. Great fit for our internship program.'
    },
    {
      id: 'app-mgmt-7',
      jobId: 'job-3',
      applicantId: 'candidate-7',
      applicantName: 'Jamie Chen',
      applicantEmail: 'jamie.chen@college.edu',
      coverLetter: 'Hello,\n\nI\'m interested in the Frontend Developer Intern position at TechStart Inc. I\'m currently studying Computer Science and have been learning web development through online courses.\n\nI\'ve built a few small projects with HTML, CSS, and JavaScript, and I\'m starting to learn React. I think this internship would be a great opportunity to learn from experienced developers and gain real-world experience.\n\nI\'m a quick learner and very motivated to improve my skills. Thank you for considering my application.',
      resumeUrl: 'https://example.com/jamie-chen-resume.pdf',
      portfolioUrl: 'https://github.com/jamiechen',
      experience: 'Computer Science sophomore with basic web development knowledge. Completed online courses in HTML, CSS, and JavaScript. Currently learning React through personal projects and online tutorials.',
      status: 'pending',
      appliedAt: '2024-08-11T10:15:00Z',
      statusUpdatedAt: '2024-08-11T10:15:00Z',
      notes: ''
    },
    {
      id: 'app-mgmt-8',
      jobId: 'job-3',
      applicantId: 'candidate-8',
      applicantName: 'Taylor Brown',
      applicantEmail: 'taylor.brown@bootcamp.com',
      coverLetter: 'Dear TechStart Team,\n\nI am excited to apply for the Frontend Developer Intern position. As a recent graduate of CodeAcademy\'s Full-Stack Bootcamp, I have developed strong skills in modern web development technologies and am eager to apply them in a professional setting.\n\nDuring the bootcamp, I built several projects including an e-commerce site with React and a social media dashboard. I also collaborated with other students on a team project, which taught me valuable lessons about version control and project management.\n\nI am passionate about creating user-friendly interfaces and would love the opportunity to learn from your team while contributing to your projects.',
      resumeUrl: 'https://example.com/taylor-brown-resume.pdf',
      portfolioUrl: 'https://taylorbrown-dev.vercel.app',
      experience: 'Recent coding bootcamp graduate with intensive training in full-stack development. Built 5+ projects with React, Node.js, and various APIs. Strong foundation in modern development practices and team collaboration.',
      status: 'on_hold',
      appliedAt: '2024-08-09T15:45:00Z',
      statusUpdatedAt: '2024-08-13T09:30:00Z',
      notes: 'Strong technical skills from bootcamp but limited real-world experience. Portfolio shows good potential. Currently considering if bootcamp background fits with our university student intern preference.'
    }
  ],
  'job-2': [ // UX/UI Designer
    {
      id: 'app-mgmt-9',
      jobId: 'job-2',
      applicantId: 'candidate-9',
      applicantName: 'Maya Patel',
      applicantEmail: 'maya.patel@design.com',
      coverLetter: 'Dear DesignCo Studio Team,\n\nI am writing to express my enthusiasm for the UX/UI Designer position. With 4 years of experience creating user-centered designs for various industries, I am excited about the opportunity to contribute to your design team.\n\nMy experience spans from conducting user research and creating wireframes to designing high-fidelity prototypes and working closely with development teams to ensure seamless implementation. I have a strong portfolio showcasing my work on mobile apps, web platforms, and design systems.\n\nI am particularly drawn to DesignCo\'s commitment to accessibility and inclusive design, as I believe technology should be accessible to everyone.',
      resumeUrl: 'https://example.com/maya-patel-resume.pdf',
      portfolioUrl: 'https://mayauxdesign.com',
      experience: 'UX/UI Designer with 4+ years of experience in creating user-centered designs. Specialized in mobile app design, web interfaces, and design systems. Strong background in user research, prototyping, and usability testing.',
      status: 'shortlisted',
      appliedAt: '2024-08-06T10:20:00Z',
      statusUpdatedAt: '2024-08-08T15:45:00Z',
      notes: 'Outstanding portfolio with strong attention to accessibility. Great experience with design systems. Scheduled for design challenge presentation next Tuesday.'
    }
  ]
}

interface Application {
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
}

interface Job {
  id: string
  title: string
  company: string
  department: string
  applicationCount: number
}

interface JobApplicationsManagementProps {
  job: Job
  onBack: () => void
  onRefresh: () => void
}

export function JobApplicationsManagement({ job, onBack, onRefresh }: JobApplicationsManagementProps) {
  const [applications, setApplications] = useState<Application[]>(MOCK_MODE ? (MOCK_APPLICATIONS_DATA[job.id] || []) : [])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [notes, setNotes] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    if (MOCK_MODE) {
      // In mock mode, set applications immediately
      setApplications(MOCK_APPLICATIONS_DATA[job.id] || [])
      setLoading(false)
    } else {
      fetchApplications()
    }
  }, [job.id])

  const fetchApplications = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/jobs/${job.id}/applications`, {
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
        toast.error('Failed to load applications')
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Error loading applications')
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string, notesText?: string) => {
    setUpdatingStatus(applicationId)
    try {
      if (MOCK_MODE) {
        // In mock mode, update local state immediately
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as any, notes: notesText || app.notes, statusUpdatedAt: new Date().toISOString() }
            : app
        ))
        toast.success(`Application ${newStatus === 'rejected' ? 'rejected' : newStatus === 'shortlisted' ? 'shortlisted' : newStatus === 'on_hold' ? 'put on hold' : 'updated'}`)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notesText || ''
        })
      })

      if (response.ok) {
        // Update local state
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus as any, notes: notesText || app.notes, statusUpdatedAt: new Date().toISOString() }
            : app
        ))
        
        toast.success(`Application ${newStatus === 'rejected' ? 'rejected' : newStatus === 'shortlisted' ? 'shortlisted' : newStatus === 'on_hold' ? 'put on hold' : 'updated'}`)
        onRefresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update application status')
      }
    } catch (error) {
      console.error('Error updating application status:', error)
      toast.error('Error updating application status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleAddNotes = (application: Application) => {
    setSelectedApplication(application)
    setNotes(application.notes || '')
    setShowNotesDialog(true)
  }

  const saveNotes = async () => {
    if (!selectedApplication) return
    
    await updateApplicationStatus(selectedApplication.id, selectedApplication.status, notes)
    setShowNotesDialog(false)
    setSelectedApplication(null)
    setNotes('')
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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h2 className="text-2xl font-semibold">Loading Applications...</h2>
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
          <h2 className="text-2xl font-semibold">Applications for {job.title}</h2>
          <p className="text-muted-foreground">{job.company} • {job.department}</p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {MOCK_MODE && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Demo Mode:</strong> You're viewing rich test data with {applications.length} applications. 
            Try the List/Pipeline views, manage candidate statuses, add notes, and view candidate profiles!
          </p>
        </div>
      )}

      {applications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              When candidates apply to your job posting, you'll see their applications here.
            </p>
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
                    placeholder="Search by candidate name or email..."
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
              <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
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
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {application.applicantName.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{application.applicantName}</h3>
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusIcon(application.status)}
                                  <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {application.applicantEmail}
                              </p>
                              
                              {application.experience && (
                                <div className="mb-3">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">EXPERIENCE SUMMARY</h4>
                                  <p className="text-sm line-clamp-2">{application.experience}</p>
                                </div>
                              )}

                              <div className="mb-3">
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">COVER LETTER</h4>
                                <p className="text-sm line-clamp-3">{application.coverLetter}</p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Applied {new Date(application.appliedAt).toLocaleDateString()}
                                </span>
                                {application.resumeUrl && (
                                  <a 
                                    href={application.resumeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                  >
                                    <FileText className="w-3 h-3" />
                                    Resume
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                                {application.portfolioUrl && (
                                  <a 
                                    href={application.portfolioUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    Portfolio
                                  </a>
                                )}
                              </div>

                              {application.notes && (
                                <div className="p-3 bg-gray-50 rounded-md">
                                  <h4 className="text-xs font-medium text-muted-foreground mb-1">NOTES</h4>
                                  <p className="text-sm">{application.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            {application.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => updateApplicationStatus(application.id, 'shortlisted')}
                                  disabled={updatingStatus === application.id}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Shortlist
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateApplicationStatus(application.id, 'on_hold')}
                                  disabled={updatingStatus === application.id}
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Hold
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                  disabled={updatingStatus === application.id}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {application.status !== 'pending' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {application.status !== 'shortlisted' && (
                                    <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'shortlisted')}>
                                      <CheckCircle className="w-3 h-3 mr-2" />
                                      Shortlist
                                    </DropdownMenuItem>
                                  )}
                                  {application.status !== 'on_hold' && (
                                    <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'on_hold')}>
                                      <Star className="w-3 h-3 mr-2" />
                                      Put on Hold
                                    </DropdownMenuItem>
                                  )}
                                  {application.status !== 'pending' && (
                                    <DropdownMenuItem onClick={() => updateApplicationStatus(application.id, 'pending')}>
                                      <Clock className="w-3 h-3 mr-2" />
                                      Mark as Pending
                                    </DropdownMenuItem>
                                  )}
                                  {application.status !== 'rejected' && (
                                    <DropdownMenuItem 
                                      onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                      className="text-red-600"
                                    >
                                      <XCircle className="w-3 h-3 mr-2" />
                                      Reject
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddNotes(application)}
                            >
                              Notes
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pipeline" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {['pending', 'shortlisted', 'on_hold', 'rejected'].map((status) => (
                  <Card key={status}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="capitalize">{status.replace('_', ' ')}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {applications.filter(app => app.status === status).length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {applications
                        .filter(app => app.status === status)
                        .map((application) => (
                          <Card key={application.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {application.applicantName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{application.applicantName}</p>
                                  <p className="text-xs text-muted-foreground truncate">{application.applicantEmail}</p>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </Card>
                        ))}
                      {applications.filter(app => app.status === status).length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No applications
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notes</DialogTitle>
            <DialogDescription>
              Add internal notes about {selectedApplication?.applicantName}'s application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your thoughts about this candidate, interview feedback, or any other relevant information..."
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNotesDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveNotes}>
                Save Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}