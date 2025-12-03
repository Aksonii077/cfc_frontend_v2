import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Star,
  MessageSquare,
  UserPlus,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Target,
  Lightbulb,
  Building,
  DollarSign,
  Rocket,
  Code,
  Palette,
  BookOpen,
  Search,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Github,
  Eye,
  ThumbsUp,
  Share2
} from 'lucide-react'

interface ProfileUser {
  id: string
  name: string
  title: string
  company: string
  location: string
  userType: 'founder' | 'mentor' | 'investor' | 'professional' | 'student' | 'partner' | 'developer' | 'job_seeker'
  experience: string
  expertise: string[]
  industries: string[]
  description: string
  bio: string
  avatar: string
  verified: boolean
  connections: number
  profileViews: number
  joinedDate: string
  lastActive: string
  
  // Role-specific data
  roleData: {
    // For founders
    startups?: {
      name: string
      stage: string
      description: string
      founded: string
      employees: string
      funding: string
    }[]
    
    // For service providers/freelancers
    portfolio?: {
      title: string
      description: string
      image: string
      link: string
      tags: string[]
    }[]
    
    hourlyRate?: string
    availability?: string
    
    // For investors
    investmentFocus?: string[]
    portfolioSize?: string
    typicalCheck?: string
    
    // For mentors
    mentees?: number
    mentoringAreas?: string[]
    
    // For students/job seekers
    education?: {
      school: string
      degree: string
      year: string
    }[]
    
    lookingFor?: string
    
    // Common
    achievements?: string[]
    testimonials?: {
      name: string
      role: string
      company: string
      text: string
      rating: number
    }[]
  }
  
  // Contact info
  contact: {
    email?: string
    phone?: string
    website?: string
    linkedin?: string
    twitter?: string
    github?: string
  }
}

interface ProfilePageProps {
  userId: string
  onBack: () => void
  isPopup?: boolean
}

export function ProfilePage({ userId, onBack, isPopup = false }: ProfilePageProps) {
  // Refs for each section
  const overviewRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const experienceRef = useRef<HTMLDivElement>(null)
  const portfolioRef = useRef<HTMLDivElement>(null)
  const startupsRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Mock profile data - in real app this would be fetched based on userId
  const profileUser: ProfileUser = {
    id: userId,
    name: userId === '1' ? 'Dr. Priya Sharma' : userId === '2' ? 'Sarah Chen' : userId === '3' ? 'Michael Rodriguez' : 'Lisa Thompson',
    title: userId === '1' ? 'Certified Ayurvedic Practitioner' : userId === '2' ? 'Wellness Investor' : userId === '3' ? 'Spa Business Consultant' : 'UX Designer',
    company: userId === '1' ? 'Ayurveda Institute of Wellness' : userId === '2' ? 'Holistic Ventures' : userId === '3' ? 'Wellness Business Solutions' : 'Mindful Designs',
    location: userId === '1' ? 'Mumbai, India' : userId === '2' ? 'San Francisco, CA' : userId === '3' ? 'Austin, TX' : 'Seattle, WA',
    userType: userId === '1' ? 'partner' : userId === '2' ? 'investor' : userId === '3' ? 'mentor' : 'partner',
    experience: userId === '1' ? '15+ years' : userId === '2' ? '8 years' : userId === '3' ? '12 years' : '6 years',
    expertise: userId === '1' 
      ? ['Ayurvedic Medicine', 'Panchakarma', 'Herbal Formulations', 'Wellness Consulting', 'Traditional Healing', 'Holistic Health']
      : userId === '2' 
        ? ['Health Tech', 'Wellness Startups', 'Seed Funding', 'Series A', 'Due Diligence', 'Portfolio Management']
        : userId === '3'
          ? ['Spa Operations', 'Business Development', 'Franchise Growth', 'Team Management', 'Customer Experience', 'Revenue Optimization']
          : ['UX Design', 'Wellness Apps', 'Brand Identity', 'User Research', 'Prototyping', 'Design Systems'],
    industries: userId === '1' 
      ? ['Healthcare', 'Wellness', 'Alternative Medicine', 'Spa & Beauty', 'Holistic Health']
      : userId === '2'
        ? ['Health Tech', 'Wellness', 'Digital Health', 'Medical Devices', 'Telemedicine']
        : userId === '3'
          ? ['Spa & Wellness', 'Hospitality', 'Beauty', 'Health Services', 'Franchise Business']
          : ['Technology', 'Wellness', 'Healthcare', 'Digital Design'],
    description: userId === '1'
      ? 'Leading Ayurvedic practitioner with expertise in authentic traditional treatments and modern wellness integration.'
      : userId === '2'
        ? 'Angel investor specializing in wellness and health-tech startups with a focus on scalable solutions.'
        : userId === '3'
          ? 'Business consultant helping spa and wellness businesses scale from startup to multi-location success.'
          : 'UX designer specializing in creating calming, intuitive digital experiences for wellness brands.',
    bio: userId === '1'
      ? 'With over 15 years of experience in Ayurvedic medicine, I specialize in authentic traditional treatments combined with modern wellness approaches. I have helped establish treatment protocols for numerous wellness centers and spas globally.\n\nMy expertise includes Panchakarma therapies, herbal formulations, and personalized wellness consultations. I am passionate about making authentic Ayurvedic practices accessible in contemporary wellness settings.'
      : userId === '2'
        ? 'As an angel investor focused on the wellness and health-tech sector, I have invested in 12 successful wellness startups over the past 8 years. My portfolio includes companies in digital health, wellness apps, and alternative medicine platforms.\n\nI am particularly interested in startups that combine traditional wellness practices with modern technology to create scalable solutions for better health outcomes.'
        : userId === '3'
          ? 'I have spent over 12 years helping wellness businesses grow from single locations to successful multi-unit operations. My expertise covers all aspects of spa business development, from operational excellence to franchise expansion.\n\nI have personally worked with 50+ spa and wellness businesses, helping them optimize operations, improve customer experience, and achieve sustainable growth.'
          : 'I specialize in creating digital experiences for wellness and health brands that prioritize user well-being and accessibility. My design philosophy centers on creating calming, intuitive interfaces that support users\' wellness journeys.\n\nI have worked with various wellness startups and established brands to design booking systems, wellness apps, and comprehensive brand experiences.',
    avatar: userId === '1' ? 'PS' : userId === '2' ? 'SC' : userId === '3' ? 'MR' : 'LT',
    verified: true,
    connections: userId === '1' ? 856 : userId === '2' ? 1247 : userId === '3' ? 743 : 623,
    profileViews: userId === '1' ? 2134 : userId === '2' ? 3421 : userId === '3' ? 1876 : 1543,
    joinedDate: userId === '1' ? '2021-05-10' : userId === '2' ? '2020-08-15' : userId === '3' ? '2022-02-20' : '2023-01-08',
    lastActive: '1 hour ago',
    
    roleData: userId === '1' ? {
      // Ayurvedic Practitioner data
      hourlyRate: '$200-300/consultation',
      availability: 'Accepting new clients',
      achievements: [
        'Certified Ayurvedic Practitioner (CAP) from National Ayurvedic Medical Association',
        'Established treatment protocols for 25+ wellness centers',
        'Trained over 100 spa therapists in authentic Ayurvedic practices',
        'Featured speaker at International Wellness Conferences'
      ],
      testimonials: [
        {
          name: 'Radhika Patel',
          role: 'Spa Director',
          company: 'Serenity Wellness Resort',
          text: 'Dr. Priya helped us establish authentic Ayurvedic treatments that increased our client satisfaction by 40%. Her knowledge is unparalleled.',
          rating: 5
        },
        {
          name: 'James Wilson',
          role: 'Wellness Center Owner',
          company: 'Holistic Health Center',
          text: 'Working with Dr. Priya transformed our approach to wellness. Her protocols are both traditional and practical for modern spa settings.',
          rating: 5
        }
      ]
    } : userId === '2' ? {
      // Investor data
      investmentFocus: ['Health Tech', 'Wellness Apps', 'Digital Health', 'Medical Devices', 'Telemedicine'],
      portfolioSize: '12 active investments',
      typicalCheck: '$50K - $500K',
      achievements: [
        'Invested in 12 successful wellness startups with average 3x returns',
        'Portfolio companies serve 5M+ users globally',
        'Named "Top Health Tech Investor" by Wellness Business Magazine',
        'Mentor at TechStars Health Accelerator program'
      ],
      testimonials: [
        {
          name: 'David Miller',
          role: 'CEO',
          company: 'MindfulApp',
          text: 'Sarah\'s investment and guidance helped us scale from 10K to 1M users. Her insights into the wellness market are invaluable.',
          rating: 5
        }
      ]
    } : userId === '3' ? {
      // Business Consultant data
      achievements: [
        'Helped 50+ spa businesses achieve 25% average revenue growth',
        'Designed franchise systems for 3 major wellness brands',
        'Reduced operational costs by 20% average across client base',
        'Authored "Scaling Wellness: A Modern Spa Business Guide"'
      ],
      testimonials: [
        {
          name: 'Maria Santos',
          role: 'Founder',
          company: 'Tranquil Day Spas',
          text: 'Michael\'s consulting helped us grow from 1 to 8 locations in 3 years. His operational expertise is outstanding.',
          rating: 5
        }
      ]
    } : {
      // UX Designer data  
      hourlyRate: '$120-180/hour',
      availability: 'Available for new projects',
      portfolio: [
        {
          title: 'Wellness Booking Platform',
          description: 'Designed a comprehensive booking system for wellness centers with 95% user satisfaction',
          image: '/portfolio-wellness-1.jpg',
          link: '#',
          tags: ['UX Design', 'Wellness', 'Booking Systems']
        },
        {
          title: 'Meditation App Interface',
          description: 'Created calming, intuitive interface for meditation app with 100K+ downloads',
          image: '/portfolio-wellness-2.jpg',
          link: '#',
          tags: ['Mobile App', 'Meditation', 'Mindfulness']
        }
      ],
      achievements: [
        'Designed wellness experiences for 500K+ users',
        'Improved user engagement by 60% average across projects',
        'Speaker at UX & Wellness conference',
        'Certified in Accessibility Design Standards'
      ],
      testimonials: [
        {
          name: 'Dr. Rachel Kim',
          role: 'Founder',
          company: 'Mindful Wellness',
          text: 'Lisa\'s designs perfectly capture the essence of wellness. Her work increased our app engagement by 70%.',
          rating: 5
        }
      ]
    },
    
    contact: {
      email: userId === '1' ? 'priya@ayurvedainstitute.com' : userId === '2' ? 'sarah@holisticventures.com' : userId === '3' ? 'michael@wellnesssolutions.com' : 'lisa@mindfuldesigns.com',
      website: userId === '1' ? 'ayurvedainstitute.com' : userId === '2' ? 'holisticventures.com' : userId === '3' ? 'wellnesssolutions.com' : 'mindfuldesigns.com',
      linkedin: userId === '1' ? 'priya-sharma-ayurveda' : userId === '2' ? 'sarah-chen-wellness' : userId === '3' ? 'michael-rodriguez-wellness' : 'lisa-thompson-ux',
      twitter: userId === '1' ? '@ayurvedapriya' : userId === '2' ? '@sarahwellness' : userId === '3' ? '@wellnessguru' : '@lisadesigns'
    }
  }

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    })
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'founder': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'mentor': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'investor': return 'bg-green-100 text-green-800 border-green-200'
      case 'professional': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'student': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'partner': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'developer': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'job_seeker': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'founder': return 'Founder'
      case 'mentor': return 'Mentor & Incubator'
      case 'investor': return 'Investor'
      case 'professional': return 'Professional'
      case 'student': return 'Student'
      case 'partner': return 'Partner'
      case 'developer': return 'Developer'
      case 'job_seeker': return 'Job Seeker'
      default: return 'Entrepreneur'
    }
  }

  const getRoleIcon = (userType: string) => {
    switch (userType) {
      case 'founder': return <Rocket className="w-5 h-5" />
      case 'mentor': return <GraduationCap className="w-5 h-5" />
      case 'investor': return <DollarSign className="w-5 h-5" />
      case 'professional': return <Briefcase className="w-5 h-5" />
      case 'student': return <BookOpen className="w-5 h-5" />
      case 'partner': return <Palette className="w-5 h-5" />
      case 'developer': return <Code className="w-5 h-5" />
      case 'job_seeker': return <Search className="w-5 h-5" />
      default: return <Users className="w-5 h-5" />
    }
  }

  // Build navigation items based on available content
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Eye, ref: overviewRef },
    { id: 'about', label: 'About', icon: Users, ref: aboutRef },
    { id: 'experience', label: 'Experience', icon: Briefcase, ref: experienceRef },
    ...(profileUser.roleData.portfolio ? [{ id: 'portfolio', label: 'Portfolio', icon: Award, ref: portfolioRef }] : []),
    ...(profileUser.roleData.startups ? [{ id: 'startups', label: 'Startups', icon: Rocket, ref: startupsRef }] : []),
    { id: 'reviews', label: 'Reviews', icon: ThumbsUp, ref: reviewsRef },
    { id: 'contact', label: 'Contact', icon: Mail, ref: contactRef }
  ]

  const containerClass = isPopup 
    ? "h-full bg-white overflow-y-auto" 
    : "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
  
  const contentClass = isPopup 
    ? "h-full px-4 lg:px-8 py-8" 
    : "w-full px-4 lg:px-8 py-8 pb-16"

  return (
    <div className={containerClass}>
      {/* Header - Only show if not in popup */}
      {!isPopup && (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="w-full px-4 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Connections</span>
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </header>
      )}

      <div className={`${contentClass} ${!isPopup ? 'max-h-[calc(100vh-4rem)] overflow-y-auto' : ''}`}>
        {/* Profile Header */}
        <Card className={isPopup ? "mb-6" : "mb-8"}>
          <CardContent className={isPopup ? "p-6" : "p-8"}>
            <div className={`flex ${isPopup ? 'flex-col md:flex-row' : 'flex-col lg:flex-row'} gap-6`}>
              {/* Avatar and Basic Info */}
              <div className={`flex ${isPopup ? 'flex-row md:flex-col' : 'flex-col'} items-center ${isPopup ? 'md:items-start' : 'lg:items-start'} space-x-4 md:space-x-0`}>
                <div className="relative">
                  <Avatar className={isPopup ? "w-20 h-20" : "w-32 h-32"}>
                    <AvatarImage src={`/placeholder-avatar-${profileUser.id}.jpg`} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl">
                      {profileUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {profileUser.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                
                {/* Stats for popup mode */}
                {isPopup && (
                  <div className="flex md:hidden space-x-4 text-center">
                    <div>
                      <div className="font-semibold">{profileUser.connections}</div>
                      <div className="text-xs text-muted-foreground">Connections</div>
                    </div>
                    <div>
                      <div className="font-semibold">{profileUser.profileViews}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Info */}
              <div className="flex-1">
                <div className={`flex ${isPopup ? 'flex-col md:flex-row' : 'flex-col lg:flex-row'} justify-between items-start gap-4 mb-4`}>
                  <div>
                    <h1 className={isPopup ? "text-2xl font-semibold mb-2" : "text-3xl font-semibold mb-2"}>{profileUser.name}</h1>
                    <div className="flex items-center space-x-2 mb-2">
                      {getRoleIcon(profileUser.userType)}
                      <p className={isPopup ? "text-lg text-muted-foreground" : "text-xl text-muted-foreground"}>{profileUser.title}</p>
                    </div>
                    <p className={isPopup ? "text-base text-muted-foreground mb-3" : "text-lg text-muted-foreground mb-4"}>{profileUser.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{profileUser.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{profileUser.experience} experience</span>
                      </div>
                      <Badge variant="outline" className={`${getUserTypeColor(profileUser.userType)} text-xs`}>
                        {getUserTypeLabel(profileUser.userType)}
                      </Badge>
                    </div>

                    {/* Hourly Rate for Partners */}
                    {(profileUser.userType === 'partner') && profileUser.roleData.hourlyRate && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs mr-2">
                          {profileUser.roleData.hourlyRate}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {profileUser.roleData.availability}
                        </Badge>
                      </div>
                    )}

                    {/* Investment Focus for Investors */}
                    {profileUser.userType === 'investor' && profileUser.roleData.typicalCheck && (
                      <div className="mb-3">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-xs mr-2">
                          {profileUser.roleData.typicalCheck}
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                          {profileUser.roleData.portfolioSize}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <Button size={isPopup ? "default" : "lg"} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size={isPopup ? "default" : "lg"}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm">{profileUser.description}</p>

                {/* Top Skills Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {profileUser.expertise.slice(0, isPopup ? 4 : 6).map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {profileUser.expertise.length > (isPopup ? 4 : 6) && (
                      <Badge variant="outline" className="text-xs">
                        +{profileUser.expertise.length - (isPopup ? 4 : 6)} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-2">
                  {profileUser.contact.email && (
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                  )}
                  {profileUser.contact.website && (
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Globe className="w-3 h-3 mr-1" />
                      Website
                    </Button>
                  )}
                  {profileUser.contact.linkedin && (
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Linkedin className="w-3 h-3 mr-1" />
                      LinkedIn
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Navigation - Only show if not in popup or if popup is large enough */}
        {!isPopup && (
          <div className="flex space-x-1 mb-8 overflow-x-auto sticky top-20 bg-white/80 backdrop-blur-sm p-4 rounded-lg border z-30">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.ref)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-secondary"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* All Sections Content */}
        <div className={`space-y-${isPopup ? '6' : '12'}`}>
          {/* Overview Section */}
          <section ref={overviewRef} className="scroll-mt-32">
            <h2 className={`${isPopup ? 'text-xl' : 'text-2xl'} font-semibold mb-4`}>Overview</h2>
            <div className="space-y-4">
              {/* Skills & Expertise */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              {profileUser.roleData.achievements && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Key Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profileUser.roleData.achievements.slice(0, isPopup ? 3 : 4).map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Testimonials Preview */}
              {profileUser.roleData.testimonials && profileUser.roleData.testimonials.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">What People Say</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileUser.roleData.testimonials.slice(0, isPopup ? 1 : 2).map((testimonial, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <p className="text-sm italic mb-2">"{testimonial.text}"</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">{testimonial.name}</span>, {testimonial.role} at {testimonial.company}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>

          {/* About Section */}
          <section ref={aboutRef} className="scroll-mt-32">
            <h2 className={`${isPopup ? 'text-xl' : 'text-2xl'} font-semibold mb-4`}>About {profileUser.name}</h2>
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  {profileUser.bio.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-muted-foreground leading-relaxed text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Contact Section */}
          <section ref={contactRef} className="scroll-mt-32">
            <h2 className={`${isPopup ? 'text-xl' : 'text-2xl'} font-semibold mb-4`}>Get in Touch</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {profileUser.contact.email && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <p className="text-sm text-muted-foreground">{profileUser.contact.email}</p>
                      </div>
                    </div>
                  )}
                  {profileUser.contact.website && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Website</p>
                        <p className="text-sm text-muted-foreground">{profileUser.contact.website}</p>
                      </div>
                    </div>
                  )}
                  {profileUser.contact.linkedin && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <div>
                        <p className="font-medium text-sm">LinkedIn</p>
                        <p className="text-sm text-muted-foreground">{profileUser.contact.linkedin}</p>
                      </div>
                    </div>
                  )}
                  {profileUser.contact.twitter && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Twitter className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="font-medium text-sm">Twitter</p>
                        <p className="text-sm text-muted-foreground">{profileUser.contact.twitter}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}