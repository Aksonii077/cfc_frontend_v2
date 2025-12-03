import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Separator } from './ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  User, 
  Users, 
  Target,
  Rocket,
  Building,
  TrendingUp,
  CheckCircle,
  Star,
  Plus,
  Edit,
  Settings,
  UserCircle,
  Briefcase,
  BarChart3,
} from 'lucide-react'

interface MyProfileSectionProps {
  userProfile?: any
  userIdeas?: any[]
  activeIdea?: any
  profileCompletion?: number
}

export function MyProfileSection({ 
  userProfile, 
  userIdeas = [], 
  activeIdea, 
  profileCompletion = 75
}: MyProfileSectionProps) {
  // Edit mode state management
  const [editMode, setEditMode] = useState({
    about: false,
    experience: false,
    education: false,
    skills: false,
    profile: false
  })

  // Form data state
  const [formData, setFormData] = useState({
    about: {
      summary: 'Serial entrepreneur with 10+ years of experience building and scaling technology companies. Passionate about solving complex problems through innovative solutions and building high-performing teams. Currently focused on AI-driven platforms that democratize entrepreneurship and enable the next generation of founders.',
      description: 'Founded multiple successful ventures including TechFlow Solutions (acquired by Microsoft for $45M) and currently building RACE AI, the world\'s first comprehensive AI entrepreneurial companion. Expert in product strategy, team scaling, fundraising, and go-to-market execution.',
      hashtags: ['#Entrepreneurship', '#ArtificialIntelligence', '#StartupStrategy', '#TechLeadership', '#ProductManagement', '#Fundraising']
    },
    profile: {
      name: userProfile?.roleName || 'John Smith',
      title: userProfile?.profileData?.title || 'Founder & CEO',
      company: userProfile?.profileData?.company || 'RACE AI (CoFounder Circle)',
      location: 'San Francisco, CA',
      profileImage: '/placeholder-avatar.jpg'
    },
    experience: [
      {
        id: '1',
        title: 'Founder & CEO',
        company: 'RACE AI (CoFounder Circle)',
        location: 'San Francisco, CA',
        startMonth: '01',
        startYear: '2024',
        endMonth: '',
        endYear: '',
        isCurrent: true,
        description: 'Building the future of entrepreneurship with AI-powered tools that help founders go from idea to IPO. Leading a team of 25+ across product, engineering, and business development. Successfully raised $2.5M seed round from top-tier VCs and scaled to 10K+ active users in first year.',
        achievements: [
          'Designed and launched comprehensive AI entrepreneurial platform',
          'Built strategic partnerships with 50+ incubators and accelerators',
          'Achieved 150% month-over-month user growth',
          'Led product development for R-A-C-E AI framework'
        ],
        skills: ['AI/ML', 'SaaS', 'B2B', 'Fundraising']
      },
      {
        id: '2',
        title: 'Co-Founder & CTO',
        company: 'TechFlow Solutions',
        location: 'San Francisco, CA',
        startMonth: '03',
        startYear: '2020',
        endMonth: '12',
        endYear: '2023',
        isCurrent: false,
        description: 'Led technical team of 15+ engineers building enterprise SaaS platform. Grew from prototype to 500+ enterprise clients with $10M ARR. Successfully exited to Microsoft for $45M in strategic acquisition.',
        achievements: [
          'Architected scalable platform serving 100K+ daily active users',
          'Built and managed engineering team from 3 to 15 developers',
          'Led technical due diligence for $45M acquisition by Microsoft',
          'Implemented DevOps practices reducing deployment time by 80%'
        ],
        skills: ['Enterprise', 'SaaS', 'Exit', 'Leadership']
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Business Administration (MBA)',
        institution: 'Stanford Graduate School of Business',
        location: 'Stanford, CA',
        startYear: '2016',
        endYear: '2018',
        description: 'Concentrated in Entrepreneurship and Technology Management. Led student venture fund investing in early-stage startups. Graduated with High Distinction.',
        achievements: [
          'Co-President of Entrepreneurship Club',
          'Led $1M student venture fund with 8 portfolio companies',
          'Winner of Stanford Business School Case Competition'
        ],
        skills: ['Strategy', 'Entrepreneurship', 'Venture Capital']
      },
      {
        id: '2',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Massachusetts Institute of Technology (MIT)',
        location: 'Cambridge, MA',
        startYear: '2012',
        endYear: '2016',
        description: 'Specialized in Artificial Intelligence and Machine Learning. Conducted research in natural language processing under Prof. Regina Barzilay. Graduated Summa Cum Laude with a 3.9 GPA.',
        achievements: [
          'Published 3 papers in top-tier AI conferences',
          'Teaching Assistant for AI and Machine Learning courses',
          'President of MIT Entrepreneurship Society'
        ],
        skills: ['Computer Science', 'AI/ML', 'Research']
      }
    ],
    skills: {
      businessSkills: [
        { name: 'Product Strategy', level: 95, experience: '10+ years', description: 'Led product strategy for 3 successful exits' },
        { name: 'Team Leadership', level: 92, experience: '8+ years', description: 'Led teams of 50+ across multiple companies' },
        { name: 'Fundraising', level: 88, experience: '6+ years', description: 'Raised $50M+ across multiple funding rounds' },
        { name: 'Go-to-Market', level: 85, experience: '8+ years', description: 'Launched 10+ products with successful market entry' }
      ],
      technicalSkills: [
        { name: 'AI/Machine Learning', level: 90, experience: '8+ years', description: 'MIT CS degree • 8+ years building AI products' },
        { name: 'Software Architecture', level: 85, experience: '10+ years', description: 'Designed scalable systems serving millions of users' },
        { name: 'Data Analytics', level: 82, experience: '6+ years', description: 'Expert in business intelligence and user analytics' },
        { name: 'Cloud Infrastructure', level: 75, experience: '5+ years', description: 'AWS, GCP experience • DevOps best practices' }
      ],
      industries: ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'Enterprise', 'Consumer', 'Mobile', 'Web3']
    }
  })

  // Helper functions
  const openEditMode = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: true }))
  }

  const closeEditMode = (section: string) => {
    setEditMode(prev => ({ ...prev, [section]: false }))
  }

  const handleSave = (section: string, data: any) => {
    setFormData(prev => ({ ...prev, [section]: data }))
    closeEditMode(section)
    // Here you would typically save to your backend/database
  }

  const handleCancel = (section: string) => {
    closeEditMode(section)
    // Reset form data to original values if needed
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Profile Overview Header */}
      <Card className="shadow-lg border-[#C8D6FF] bg-gradient-to-r from-white to-[#F7F9FF]/50">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image & Basic Info */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] ring-2 ring-[#C8D6FF]/30">
                  <AvatarImage src="/placeholder-avatar.jpg" className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-3xl">
                    {userProfile?.roleName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Online Status */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#06CB1D] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute -bottom-3 -right-12 rounded-full w-8 h-8 p-0 shadow-md bg-[#EDF2FF] hover:bg-[#C8D6FF] border-[#C8D6FF]"
                  onClick={() => openEditMode('profile')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {/* Name, Designation, Company */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-4">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-gray-900">{userProfile?.roleName || 'John Smith'}</h1>
                    <CheckCircle className="w-6 h-6 text-[#114DFF]" />
                  </div>
                  <p className="text-xl text-gray-600">{userProfile?.profileData?.title || 'Founder & CEO'}</p>
                  <p className="text-lg text-gray-500 mb-3">{userProfile?.profileData?.company || 'RACE AI (CoFounder Circle)'}</p>
                  
                  {/* Location */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-600 mb-4">
                    <Building className="w-5 h-5 text-[#114DFF]" />
                    <span>San Francisco, CA</span>
                  </div>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] px-3 py-1">
                      <Target className="w-3 h-3 mr-1" />
                      AI/ML Expert
                    </Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] px-3 py-1">
                      <Rocket className="w-3 h-3 mr-1" />
                      Serial Entrepreneur
                    </Badge>
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] px-3 py-1">
                      <Users className="w-3 h-3 mr-1" />
                      Team Leader
                    </Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] px-3 py-1">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Growth Hacker
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="flex flex-col gap-3 lg:w-48">
              <Button variant="outline" className="w-full border-[#C8D6FF] hover:bg-[#EDF2FF]" onClick={() => openEditMode('profile')}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Full Width */}
      <div className="w-full">
        {/* Main Content Sections */}
        <div className="space-y-8">
          
          {/* 2. About Section */}
          <Card className="shadow-md border-[#C8D6FF]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <User className="w-6 h-6 text-[#114DFF]" />
                  <span>About</span>
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-gray-500 hover:text-gray-700 hover:bg-[#EDF2FF]"
                  onClick={() => openEditMode('about')}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">
                Serial entrepreneur with 10+ years of experience building and scaling technology companies. 
                Passionate about solving complex problems through innovative solutions and building 
                high-performing teams. Currently focused on AI-driven platforms that democratize 
                entrepreneurship and enable the next generation of founders.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Founded multiple successful ventures including TechFlow Solutions (acquired by Microsoft for $45M) 
                and currently building RACE AI, the world's first comprehensive AI entrepreneurial companion. 
                Expert in product strategy, team scaling, fundraising, and go-to-market execution.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[#114DFF] border-[#C8D6FF] bg-[#EDF2FF] px-3 py-1">#Entrepreneurship</Badge>
                <Badge variant="outline" className="text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF] px-3 py-1">#ArtificialIntelligence</Badge>
                <Badge variant="outline" className="text-[#06CB1D] border-[#C8D6FF] bg-[#EDF2FF] px-3 py-1">#StartupStrategy</Badge>
                <Badge variant="outline" className="text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF] px-3 py-1">#TechLeadership</Badge>
                <Badge variant="outline" className="text-[#114DFF] border-[#C8D6FF] bg-[#EDF2FF] px-3 py-1">#ProductManagement</Badge>
                <Badge variant="outline" className="text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF] px-3 py-1">#Fundraising</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 3. Professional Experience */}
          <Card className="shadow-md border-[#C8D6FF]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-[#114DFF]" />
                  <span>Professional Experience</span>
                </span>
                <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-[#EDF2FF]" onClick={() => openEditMode('experience')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Current Role */}
              <div className="flex space-x-4 p-6 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900">Founder & CEO</h3>
                      <p className="text-[#114DFF]">RACE AI (CoFounder Circle)</p>
                    </div>
                    <Badge className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] px-3 py-1">Current</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Jan 2024 - Present • 11 months • San Francisco, CA</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Building the future of entrepreneurship with AI-powered tools that help founders go from idea to IPO. 
                    Leading a team of 25+ across product, engineering, and business development. Successfully raised 
                    $2.5M seed round from top-tier VCs and scaled to 10K+ active users in first year.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">• Designed and launched comprehensive AI entrepreneurial platform</p>
                    <p className="text-sm text-gray-700">• Built strategic partnerships with 50+ incubators and accelerators</p>
                    <p className="text-sm text-gray-700">• Achieved 150% month-over-month user growth</p>
                    <p className="text-sm text-gray-700">• Led product development for R-A-C-E AI framework</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">AI/ML</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">SaaS</Badge>
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">B2B</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#06CB1D] border-[#C8D6FF]">Fundraising</Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[#C8D6FF]" />

              {/* Previous Role */}
              <div className="flex space-x-4 p-6 bg-gradient-to-r from-[#F7F9FF] to-[#F5F5F5] rounded-xl border border-[#CCCCCC]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900">Co-Founder & CTO</h3>
                      <p className="text-[#114DFF]">TechFlow Solutions</p>
                    </div>
                    <Badge variant="outline" className="text-gray-700 bg-[#F7F9FF] border-[#CCCCCC] px-3 py-1">Exited</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Mar 2020 - Dec 2023 • 3 years 10 months • San Francisco, CA</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Led technical team of 15+ engineers building enterprise SaaS platform. Grew from prototype to 
                    500+ enterprise clients with $10M ARR. Successfully exited to Microsoft for $45M in strategic acquisition.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">• Architected scalable platform serving 100K+ daily active users</p>
                    <p className="text-sm text-gray-700">• Built and managed engineering team from 3 to 15 developers</p>
                    <p className="text-sm text-gray-700">• Led technical due diligence for $45M acquisition by Microsoft</p>
                    <p className="text-sm text-gray-700">• Implemented DevOps practices reducing deployment time by 80%</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">Enterprise</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#06CB1D] border-[#C8D6FF]">SaaS</Badge>
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">Exit</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">Leadership</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Education */}
          <Card className="shadow-md border-[#C8D6FF]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-[#06CB1D]" />
                  <span>Education</span>
                </span>
                <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-[#EDF2FF]" onClick={() => openEditMode('education')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* MBA */}
              <div className="flex space-x-4 p-6 bg-gradient-to-r from-[#EDF2FF] to-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900">Master of Business Administration (MBA)</h3>
                      <p className="text-[#114DFF]">Stanford Graduate School of Business</p>
                    </div>
                    <Badge variant="outline" className="text-[#114DFF] bg-[#EDF2FF] border-[#C8D6FF] px-3 py-1">2016-2018</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">2016 - 2018 • Stanford, CA</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Concentrated in Entrepreneurship and Technology Management. Led student venture fund investing in 
                    early-stage startups. Graduated with High Distinction.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">• Co-President of Entrepreneurship Club</p>
                    <p className="text-sm text-gray-700">• Led $1M student venture fund with 8 portfolio companies</p>
                    <p className="text-sm text-gray-700">• Winner of Stanford Business School Case Competition</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">Strategy</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">Entrepreneurship</Badge>
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">Venture Capital</Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-[#C8D6FF]" />

              {/* Bachelor's */}
              <div className="flex space-x-4 p-6 bg-gradient-to-r from-[#F7F9FF] to-[#F5F5F5] rounded-xl border border-[#CCCCCC]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900">Bachelor of Science in Computer Science</h3>
                      <p className="text-[#114DFF]">Massachusetts Institute of Technology (MIT)</p>
                    </div>
                    <Badge variant="outline" className="text-[#114DFF] bg-[#EDF2FF] border-[#C8D6FF] px-3 py-1">2012-2016</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">2012 - 2016 • Cambridge, MA</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Specialized in Artificial Intelligence and Machine Learning. Conducted research in natural language 
                    processing under Prof. Regina Barzilay. Graduated Summa Cum Laude with a 3.9 GPA.
                  </p>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700">• Published 3 papers in top-tier AI conferences</p>
                    <p className="text-sm text-gray-700">• Teaching Assistant for AI and Machine Learning courses</p>
                    <p className="text-sm text-gray-700">• President of MIT Entrepreneurship Society</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">Computer Science</Badge>
                    <Badge variant="secondary" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">AI/ML</Badge>
                    <Badge variant="secondary" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">Research</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Skills & Expertise */}
          <Card className="shadow-md border-[#C8D6FF]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#06CB1D]" />
                  <span>Skills & Expertise</span>
                </span>
                <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-[#EDF2FF]" onClick={() => openEditMode('skills')}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Core Business Skills */}
                <div className="space-y-5">
                  <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#114DFF]" />
                    Core Business Skills
                  </h4>
                  
                  <div className="p-4 bg-[#EDF2FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Product Strategy</span>
                      <Badge className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] text-xs px-2 py-1">Expert</Badge>
                    </div>
                    <Progress value={95} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">10+ years • Led product strategy for 3 successful exits</p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Team Leadership</span>
                      <Badge className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] text-xs px-2 py-1">Expert</Badge>
                    </div>
                    <Progress value={92} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">Led teams of 50+ across multiple companies</p>
                  </div>
                  
                  <div className="p-4 bg-[#EDF2FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Fundraising</span>
                      <Badge className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] text-xs px-2 py-1">Expert</Badge>
                    </div>
                    <Progress value={88} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">Raised $50M+ across multiple funding rounds</p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Go-to-Market</span>
                      <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-xs px-2 py-1">Advanced</Badge>
                    </div>
                    <Progress value={85} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">Launched 10+ products with successful market entry</p>
                  </div>
                </div>
                
                {/* Technical Skills */}
                <div className="space-y-5">
                  <h4 className="text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#114DFF]" />
                    Technical Skills
                  </h4>
                  
                  <div className="p-4 bg-[#EDF2FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">AI/Machine Learning</span>
                      <Badge className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] text-xs px-2 py-1">Expert</Badge>
                    </div>
                    <Progress value={90} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">MIT CS degree • 8+ years building AI products</p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Software Architecture</span>
                      <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] text-xs px-2 py-1">Advanced</Badge>
                    </div>
                    <Progress value={85} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">Designed scalable systems serving millions of users</p>
                  </div>
                  
                  <div className="p-4 bg-[#EDF2FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Data Analytics</span>
                      <Badge className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] text-xs px-2 py-1">Advanced</Badge>
                    </div>
                    <Progress value={82} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">Expert in business intelligence and user analytics</p>
                  </div>
                  
                  <div className="p-4 bg-[#F7F9FF] rounded-xl border border-[#C8D6FF]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-900">Cloud Infrastructure</span>
                      <Badge className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC] text-xs px-2 py-1">Intermediate</Badge>
                    </div>
                    <Progress value={75} className="h-3 mb-2" />
                    <p className="text-xs text-gray-600">AWS, GCP experience • DevOps best practices</p>
                  </div>
                </div>
              </div>

              {/* Skill Categories */}
              <div className="mt-8 pt-6 border-t border-[#C8D6FF]">
                <h4 className="text-gray-900 mb-4">Industry Expertise</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#EDF2FF]">SaaS</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF]">FinTech</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#06CB1D] border-[#C8D6FF] bg-[#EDF2FF]">HealthTech</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF]">EdTech</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#EDF2FF]">Enterprise</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF]">Consumer</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#EDF2FF]">Mobile</Badge>
                  <Badge variant="outline" className="justify-center py-2 text-[#114DFF] border-[#C8D6FF] bg-[#F7F9FF]">Web3</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Modals - Simplified for now */}
      <Dialog open={editMode.profile} onOpenChange={() => handleCancel('profile')}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                defaultValue={formData.profile.name}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                defaultValue={formData.profile.title}
                placeholder="e.g., Founder & CEO"
              />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                defaultValue={formData.profile.company}
                placeholder="Your current company"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                defaultValue={formData.profile.location}
                placeholder="Your location"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleCancel('profile')}>Cancel</Button>
              <Button onClick={() => handleSave('profile', formData.profile)}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}