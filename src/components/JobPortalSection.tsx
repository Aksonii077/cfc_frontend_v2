import { useState, useEffect } from 'react'
import { Briefcase, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { JobPostingForm } from './JobPostingForm'
import { JobApplicationsManagement } from './JobApplicationsManagement'
import { JobDetails } from './JobDetails'
import { ApplicationForm } from './ApplicationForm'
import { MyApplications } from './MyApplications'
import { JobCard } from './job-portal/JobCard'
import { JobSearchFilters } from './job-portal/JobSearchFilters'
import { 
  Job,
  canUserPostJobs, 
  canUserApplyToJobs, 
  filterJobs 
} from '../config/jobPortal.config'
import { projectId } from '../utils/supabase/info'
import { createClient } from '../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true // Set to false when server is deployed

// Mock Job Data for Testing
const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our growing team at AI Wellness Solutions. You will be responsible for developing scalable web applications using modern technologies like React, Node.js, and cloud infrastructure. This role offers the opportunity to work on cutting-edge AI-powered wellness solutions that impact millions of users worldwide.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Strong understanding of database design and optimization',
      'Experience with agile development methodologies',
      'Knowledge of AI/ML concepts is a plus'
    ],
    responsibilities: [
      'Design and develop scalable web applications',
      'Collaborate with cross-functional teams to deliver high-quality products',
      'Optimize application performance and user experience',
      'Mentor junior developers and conduct code reviews',
      'Participate in architectural decisions and technical planning',
      'Implement CI/CD pipelines and deployment strategies'
    ],
    salary: '$120,000 - $160,000',
    salaryType: 'range',
    company: 'AI Wellness Solutions',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    jobType: 'full-time',
    experience: 'senior',
    department: 'Engineering',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker', 'GraphQL'],
    benefits: ['Health Insurance', 'Dental Coverage', '401k Matching', 'Flexible PTO', 'Remote Work Options', 'Professional Development Budget', 'Stock Options'],
    applicationDeadline: '2024-09-15',
    status: 'active',
    postedBy: 'founder-1',
    posterName: 'Alex Rodriguez',
    posterRole: 'CTO & Co-Founder',
    createdAt: '2024-08-01',
    updatedAt: '2024-08-01',
    applicationCount: 23
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    description: 'Join our design team to create beautiful and intuitive user experiences for our wellness platform. We\'re looking for a creative designer who can turn complex ideas into simple, elegant solutions. You\'ll work closely with product managers and engineers to design user interfaces that delight our users.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong portfolio demonstrating user-centered design',
      'Experience with design systems and component libraries',
      'Understanding of frontend development constraints',
      'Knowledge of accessibility standards (WCAG)'
    ],
    responsibilities: [
      'Design user interfaces for web and mobile applications',
      'Conduct user research and usability testing',
      'Create wireframes, prototypes, and high-fidelity designs',
      'Collaborate with developers to ensure design implementation',
      'Maintain and evolve our design system',
      'Present design concepts to stakeholders'
    ],
    salary: '$90,000 - $120,000',
    salaryType: 'range',
    company: 'DesignCo Studio',
    location: 'Austin, TX',
    locationType: 'remote',
    jobType: 'full-time',
    experience: 'mid',
    department: 'Design',
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems', 'Accessibility'],
    benefits: ['Health Insurance', 'Flexible PTO', 'Design Conference Budget', 'Home Office Stipend', 'Mental Health Support', 'Creative Software Licenses'],
    applicationDeadline: '2024-09-20',
    status: 'active',
    postedBy: 'service-provider-1',
    posterName: 'Sarah Kim',
    posterRole: 'Design Director',
    createdAt: '2024-08-05',
    updatedAt: '2024-08-05',
    applicationCount: 18
  },
  {
    id: 'job-3',
    title: 'Frontend Developer Intern',
    description: 'Perfect opportunity for students or recent graduates to gain hands-on experience in frontend development. Work on real projects while learning from experienced developers. This internship offers mentorship, learning opportunities, and the potential for full-time conversion.',
    requirements: [
      'Currently pursuing or recently completed Computer Science degree',
      'Basic knowledge of HTML, CSS, and JavaScript',
      'Familiarity with React or Vue.js',
      'Strong willingness to learn and grow',
      'Good communication skills',
      'Portfolio of personal or academic projects'
    ],
    responsibilities: [
      'Assist in developing user interfaces for web applications',
      'Work closely with senior developers on feature implementation',
      'Participate in code reviews and team meetings',
      'Learn and apply best practices in frontend development',
      'Contribute to documentation and testing efforts',
      'Attend training sessions and workshops'
    ],
    salary: '$25 - $30/hour',
    salaryType: 'range',
    company: 'TechStart Inc.',
    location: 'Remote',
    locationType: 'remote',
    jobType: 'internship',
    experience: 'entry',
    department: 'Engineering',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'REST APIs'],
    benefits: ['Mentorship Program', 'Learning Budget', 'Flexible Schedule', 'Potential Full-time Offer', 'Company Swag', 'Virtual Team Events'],
    applicationDeadline: '2024-09-30',
    status: 'active',
    postedBy: 'founder-2',
    posterName: 'Michael Chen',
    posterRole: 'CEO & Founder',
    createdAt: '2024-08-10',
    updatedAt: '2024-08-10',
    applicationCount: 45
  },
  {
    id: 'job-4',
    title: 'Data Scientist',
    description: 'Help us unlock insights from our wellness data to improve user outcomes. We\'re looking for a data scientist passionate about health technology and machine learning. You\'ll work with large datasets to build predictive models and generate actionable insights.',
    requirements: [
      'PhD or Masters in Data Science, Statistics, or related field',
      'Experience with Python, R, and machine learning frameworks',
      'Strong background in statistical analysis and modeling',
      'Experience with cloud-based data platforms',
      'Healthcare or wellness domain knowledge preferred',
      'Experience with big data technologies (Spark, Hadoop)'
    ],
    responsibilities: [
      'Develop machine learning models for health predictions',
      'Analyze user behavior and health outcome data',
      'Design and implement A/B tests',
      'Collaborate with product team on data-driven features',
      'Present insights to stakeholders and leadership',
      'Maintain and optimize data pipelines'
    ],
    salary: 'Competitive package based on experience',
    salaryType: 'negotiable',
    company: 'AI Wellness Solutions',
    location: 'Boston, MA',
    locationType: 'hybrid',
    jobType: 'full-time',
    experience: 'senior',
    department: 'Data Science',
    skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'AWS', 'Statistics', 'Spark'],
    benefits: ['Health Insurance', 'Stock Options', 'Research Budget', 'Conference Travel', 'Sabbatical Program', 'PhD Tuition Assistance'],
    applicationDeadline: '2024-10-15',
    status: 'active',
    postedBy: 'founder-1',
    posterName: 'Alex Rodriguez',
    posterRole: 'CTO & Co-Founder',
    createdAt: '2024-08-12',
    updatedAt: '2024-08-12',
    applicationCount: 12
  },
  {
    id: 'job-5',
    title: 'Marketing Coordinator',
    description: 'Join our marketing team to help spread the word about our innovative wellness solutions. Perfect for someone looking to grow their career in health tech marketing. You\'ll work on various marketing campaigns and help build our brand presence.',
    requirements: [
      '1-2 years of marketing experience',
      'Experience with social media marketing',
      'Basic knowledge of marketing analytics',
      'Excellent written and verbal communication skills',
      'Interest in health and wellness industry',
      'Experience with content creation and copywriting'
    ],
    responsibilities: [
      'Create content for social media and marketing campaigns',
      'Assist with event planning and coordination',
      'Analyze marketing campaign performance',
      'Support SEO and content marketing efforts',
      'Collaborate with design team on marketing materials',
      'Manage email marketing campaigns'
    ],
    salary: '$50,000 - $65,000',
    salaryType: 'range',
    company: 'WellnessTech Corp',
    location: 'Seattle, WA',
    locationType: 'onsite',
    jobType: 'full-time',
    experience: 'entry',
    department: 'Marketing',
    skills: ['Social Media', 'Content Creation', 'Google Analytics', 'SEO', 'Email Marketing', 'Copywriting'],
    benefits: ['Health Insurance', 'PTO', 'Professional Development', 'Gym Membership', 'Wellness Stipend', 'Free Lunch'],
    applicationDeadline: '2024-09-25',
    status: 'active',
    postedBy: 'founder-3',
    posterName: 'Jessica Wong',
    posterRole: 'VP Marketing',
    createdAt: '2024-08-08',
    updatedAt: '2024-08-08',
    applicationCount: 31
  },
  {
    id: 'job-6',
    title: 'DevOps Engineer',
    description: 'Help us build and maintain scalable infrastructure for our growing platform. We\'re looking for a DevOps engineer passionate about automation and reliability. You\'ll work with cutting-edge cloud technologies and help shape our infrastructure strategy.',
    requirements: [
      '3+ years of DevOps or Infrastructure experience',
      'Experience with AWS/GCP cloud platforms',
      'Proficiency in Infrastructure as Code (Terraform, CloudFormation)',
      'Strong background in CI/CD pipelines',
      'Experience with containerization (Docker, Kubernetes)',
      'Knowledge of monitoring and observability tools'
    ],
    responsibilities: [
      'Design and implement scalable infrastructure',
      'Automate deployment and monitoring processes',
      'Ensure system reliability and performance',
      'Implement security best practices',
      'Collaborate with development teams on infrastructure needs',
      'Respond to and resolve production incidents'
    ],
    salary: '$110,000 - $140,000',
    salaryType: 'range',
    company: 'CloudFirst Solutions',
    location: 'Denver, CO',
    locationType: 'remote',
    jobType: 'contract',
    experience: 'mid',
    department: 'Infrastructure',
    skills: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Monitoring', 'Linux', 'Python'],
    benefits: ['Contractor Rate', 'Flexible Schedule', 'Equipment Provided', 'Potential Extension', 'Training Budget'],
    applicationDeadline: '2024-10-01',
    status: 'active',
    postedBy: 'service-provider-2',
    posterName: 'David Park',
    posterRole: 'Senior DevOps Consultant',
    createdAt: '2024-08-15',
    updatedAt: '2024-08-15',
    applicationCount: 8
  },
  {
    id: 'job-7',
    title: 'Product Manager',
    description: 'Lead product development for our flagship wellness platform. We\'re seeking an experienced product manager who can drive product strategy, work cross-functionally, and deliver exceptional user experiences. You\'ll be responsible for the entire product lifecycle.',
    requirements: [
      '4+ years of product management experience',
      'Experience in health tech or consumer applications',
      'Strong analytical and data-driven decision making skills',
      'Excellent communication and leadership abilities',
      'Experience with agile development methodologies',
      'Background in user research and product analytics'
    ],
    responsibilities: [
      'Define and execute product strategy and roadmap',
      'Collaborate with engineering, design, and marketing teams',
      'Conduct user research and gather product feedback',
      'Analyze product metrics and KPIs',
      'Manage product launches and go-to-market strategies',
      'Prioritize features based on business impact'
    ],
    salary: '$140,000 - $180,000',
    salaryType: 'range',
    company: 'AI Wellness Solutions',
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    jobType: 'full-time',
    experience: 'senior',
    department: 'Product',
    skills: ['Product Strategy', 'User Research', 'Analytics', 'Agile', 'Roadmapping', 'A/B Testing'],
    benefits: ['Health Insurance', 'Stock Options', '401k Matching', 'Flexible PTO', 'Product Development Budget', 'Conference Attendance'],
    applicationDeadline: '2024-10-20',
    status: 'active',
    postedBy: 'founder-1',
    posterName: 'Alex Rodriguez',
    posterRole: 'CTO & Co-Founder',
    createdAt: '2024-08-18',
    updatedAt: '2024-08-18',
    applicationCount: 15
  },
  {
    id: 'job-8',
    title: 'iOS Developer',
    description: 'Build amazing mobile experiences for our wellness app. We\'re looking for an iOS developer who is passionate about creating delightful user experiences and writing clean, maintainable code. You\'ll work on features that help millions improve their health.',
    requirements: [
      '3+ years of iOS development experience',
      'Proficiency in Swift and iOS frameworks',
      'Experience with RESTful APIs and third-party libraries',
      'Knowledge of iOS design patterns (MVC, MVVM)',
      'Understanding of Apple\'s Human Interface Guidelines',
      'Experience with App Store submission process'
    ],
    responsibilities: [
      'Develop and maintain iOS applications',
      'Collaborate with designers to implement UI/UX designs',
      'Write clean, testable, and maintainable code',
      'Optimize app performance and memory usage',
      'Participate in code reviews and technical discussions',
      'Stay up-to-date with iOS development trends'
    ],
    salary: '$100,000 - $130,000',
    salaryType: 'range',
    company: 'MobileFirst Health',
    location: 'Los Angeles, CA',
    locationType: 'hybrid',
    jobType: 'full-time',
    experience: 'mid',
    department: 'Mobile Engineering',
    skills: ['Swift', 'iOS', 'Xcode', 'REST APIs', 'Core Data', 'UIKit', 'SwiftUI'],
    benefits: ['Health Insurance', '401k', 'Flexible Hours', 'Device Allowance', 'Learning Budget', 'Team Lunches'],
    applicationDeadline: '2024-09-28',
    status: 'active',
    postedBy: 'founder-4',
    posterName: 'Lisa Thompson',
    posterRole: 'Head of Mobile',
    createdAt: '2024-08-20',
    updatedAt: '2024-08-20',
    applicationCount: 22
  }
]

interface JobPortalSectionProps {
  userProfile: any
}

export function JobPortalSection({ userProfile }: JobPortalSectionProps) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_MODE ? MOCK_JOBS : [])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [currentView, setCurrentView] = useState<'browse' | 'post' | 'manage' | 'details' | 'apply' | 'my-applications'>('browse')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const supabase = createClient()
  
  const canPostJobs = canUserPostJobs(userProfile)
  const isJobSeeker = canUserApplyToJobs(userProfile)

  useEffect(() => {
    if (MOCK_MODE) {
      // In mock mode, set jobs immediately and filter myJobs based on current user
      setJobs(MOCK_JOBS)
      if (canPostJobs && userProfile?.roleId) {
        // Filter jobs posted by current user - simulate user having posted some jobs
        const userJobs = MOCK_JOBS.filter(job => 
          job.postedBy === userProfile.roleId || 
          (userProfile.role === 'founder' && ['founder-1', 'founder-2', 'founder-3', 'founder-4'].includes(job.postedBy)) ||
          (userProfile.role === 'service_provider' && ['service-provider-1', 'service-provider-2'].includes(job.postedBy))
        )
        setMyJobs(userJobs)
      }
      setLoading(false)
    } else {
      fetchJobs()
      if (canPostJobs) {
        fetchMyJobs()
      }
    }
  }, [refreshTrigger, userProfile?.roleId, userProfile?.role, canPostJobs])

  const fetchJobs = async () => {
    if (MOCK_MODE) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/jobs`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs || [])
      } else {
        console.error('Failed to fetch jobs:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyJobs = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/my-jobs`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMyJobs(data.jobs || [])
      }
    } catch (error) {
      console.error('Error fetching my jobs:', error)
    }
  }

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1)
  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setCurrentView('details')
  }
  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setCurrentView('apply')
  }
  const handleManageApplications = (job: Job) => {
    setSelectedJob(job)
    setCurrentView('manage')
  }

  const filteredJobs = filterJobs(jobs, searchTerm, locationFilter, jobTypeFilter, experienceFilter)

  // Handle different views
  if (currentView === 'post') {
    return (
      <JobPostingForm
        onSuccess={() => {
          setCurrentView('browse')
          handleRefresh()
          toast.success('Job posted successfully!')
        }}
        onCancel={() => setCurrentView('browse')}
      />
    )
  }

  if (currentView === 'manage' && selectedJob) {
    return (
      <JobApplicationsManagement
        job={selectedJob}
        onBack={() => setCurrentView('browse')}
        onRefresh={handleRefresh}
      />
    )
  }

  if (currentView === 'details' && selectedJob) {
    return (
      <JobDetails
        job={selectedJob}
        onBack={() => setCurrentView('browse')}
        onApply={() => handleApplyClick(selectedJob)}
        canApply={isJobSeeker}
        userProfile={userProfile}
      />
    )
  }

  if (currentView === 'apply' && selectedJob) {
    return (
      <ApplicationForm
        job={selectedJob}
        onSuccess={() => {
          setCurrentView('browse')
          toast.success('Application submitted successfully!')
        }}
        onCancel={() => setCurrentView('browse')}
      />
    )
  }

  if (currentView === 'my-applications') {
    return (
      <MyApplications
        onBack={() => setCurrentView('browse')}
        userProfile={userProfile}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Job Portal
          </h2>
          <p className="text-muted-foreground mt-1">
            {canPostJobs ? 'Discover talent and manage your job postings' : 'Find your next opportunity'}
          </p>
        </div>
        <div className="flex gap-2">
          {isJobSeeker && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentView('my-applications')}
              className="flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              My Applications
            </Button>
          )}
          {canPostJobs && (
            <Button 
              onClick={() => setCurrentView('post')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Plus className="w-4 h-4" />
              Post Job
            </Button>
          )}
        </div>
      </div>

      {canPostJobs ? (
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Job Postings</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <JobSearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
              jobTypeFilter={jobTypeFilter}
              setJobTypeFilter={setJobTypeFilter}
              experienceFilter={experienceFilter}
              setExperienceFilter={setExperienceFilter}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || locationFilter !== 'all' || jobTypeFilter !== 'all' || experienceFilter !== 'all'
                        ? 'Try adjusting your search criteria.'
                        : 'No jobs have been posted yet.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onJobClick={handleJobClick}
                      onApplyClick={isJobSeeker ? handleApplyClick : undefined}
                      showApplyButton={isJobSeeker}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-jobs" className="space-y-6">
            {/* My Jobs content - existing code continues as before but simplified */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {myJobs.length} job{myJobs.length !== 1 ? 's' : ''} posted
                </p>
                <Button size="sm" variant="outline" onClick={handleRefresh}>
                  Refresh
                </Button>
              </div>

              {myJobs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No job postings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your team by posting your first job.
                    </p>
                    <Button onClick={() => setCurrentView('post')}>Post Your First Job</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {myJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onJobClick={handleJobClick}
                      onManageClick={handleManageApplications}
                      showApplyButton={false}
                      showManageButton={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        // Job seeker view
        <div className="space-y-6">
          <JobSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            jobTypeFilter={jobTypeFilter}
            setJobTypeFilter={setJobTypeFilter}
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || locationFilter !== 'all' || jobTypeFilter !== 'all' || experienceFilter !== 'all'
                      ? 'Try adjusting your search criteria.'
                      : 'No jobs have been posted yet. Check back soon!'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onJobClick={handleJobClick}
                    onApplyClick={handleApplyClick}
                    showApplyButton={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}