import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
  Search,
  Filter,
  MapPin,
  Link2,
  Users,
  Rocket,
  Palette,
  Code,
  DollarSign,
  TrendingUp,
  Building,
  Lightbulb,
  Target,
  MessageSquare,
  UserPlus,
  Globe,
  Star,
  Calendar,
  BookOpen,
  Eye,
  Clock,
  Briefcase,
  Award,
  Linkedin
} from 'lucide-react'

interface RoleProfile {
  roleId: string
  roleName: string
  roleType: 'founder' | 'freelancer' | 'service_provider' | 'mentor' | 'investor' | 'student' | 'job_seeker'
  onboardingComplete: boolean
  profileData: {
    title?: string
    company?: string
    experience?: string
    skills?: string[]
    industries?: string[]
    bio?: string
    hasStartup?: boolean
    hasIdea?: boolean
    startupDetails?: any
    ideaDetails?: any
  }
  entrepreneurialStage: string
  isActive: boolean
  createdAt: string
  lastUsed: string
}

interface ConnectionsModuleProps {
  userProfile: RoleProfile | null
  onNavigateToProfile?: (userId: string) => void
}

interface UserConnection {
  id: string
  name: string
  title: string
  company: string
  location: string
  userType: string
  experience: string
  expertise: string[]
  industries: string[]
  description: string
  avatar: string
  verified: boolean
  connections: number
  lastActive: string
  availability: {
    type: 'Part-time' | 'Full-time' | 'Project-based' | 'Advisory'
    hoursPerWeek?: number
  }
  currentOrLastCompany: string
  currentOrLastRole: string
  totalYearsExperience: number
  hasStartupExperience: boolean
}

export function ConnectionsModule({ userProfile, onNavigateToProfile }: ConnectionsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Mock data for demonstration
  const mockConnections: UserConnection[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Product Designer',
      company: 'Meta',
      location: 'San Francisco, CA',
      userType: 'service_provider',
      experience: '8 years',
      expertise: ['UI/UX Design', 'Product Strategy', 'Design Systems'],
      industries: ['Technology', 'Social Media', 'E-commerce'],
      description: 'Passionate product designer with expertise in creating user-centered digital experiences for global audiences.',
      avatar: 'SC',
      verified: true,
      connections: 1247,
      lastActive: '2 hours ago',
      availability: { type: 'Part-time', hoursPerWeek: 20 },
      currentOrLastCompany: 'Meta',
      currentOrLastRole: 'Senior Product Designer',
      totalYearsExperience: 8,
      hasStartupExperience: true
    },
    {
      id: '2',
      name: 'Marcus Thompson',
      title: 'AI Engineer',
      company: 'OpenAI',
      location: 'Austin, TX',
      userType: 'freelancer',
      experience: '6 years',
      expertise: ['Machine Learning', 'Deep Learning', 'Natural Language Processing'],
      industries: ['Artificial Intelligence', 'Healthcare', 'Fintech'],
      description: 'Building the future of AI with focus on ethical and responsible artificial intelligence applications.',
      avatar: 'MT',
      verified: true,
      connections: 892,
      lastActive: '1 day ago',
      availability: { type: 'Project-based', hoursPerWeek: 15 },
      currentOrLastCompany: 'OpenAI',
      currentOrLastRole: 'AI Engineer',
      totalYearsExperience: 6,
      hasStartupExperience: false
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      title: 'Co-Founder & CEO',
      company: 'GreenTech Solutions',
      location: 'Barcelona, Spain',
      userType: 'founder',
      experience: '12 years',
      expertise: ['Sustainable Technology', 'Business Development', 'Team Leadership'],
      industries: ['Clean Energy', 'Environmental Technology', 'B2B SaaS'],
      description: 'Leading the green revolution through innovative technology solutions that help businesses reduce their carbon footprint.',
      avatar: 'ER',
      verified: true,
      connections: 2156,
      lastActive: '30 minutes ago',
      availability: { type: 'Advisory', hoursPerWeek: 5 },
      currentOrLastCompany: 'GreenTech Solutions',
      currentOrLastRole: 'Co-Founder & CEO',
      totalYearsExperience: 12,
      hasStartupExperience: true
    },
    {
      id: '4',
      name: 'David Park',
      title: 'Full Stack Developer',
      company: 'Stripe',
      location: 'Seattle, WA',
      userType: 'freelancer',
      experience: '5 years',
      expertise: ['React', 'Node.js', 'Python', 'Cloud Architecture'],
      industries: ['Fintech', 'E-commerce', 'Developer Tools'],
      description: 'Full-stack developer specializing in scalable web applications and payment infrastructure solutions.',
      avatar: 'DP',
      verified: false,
      connections: 456,
      lastActive: '3 hours ago',
      availability: { type: 'Project-based', hoursPerWeek: 10 },
      currentOrLastCompany: 'Stripe',
      currentOrLastRole: 'Full Stack Developer',
      totalYearsExperience: 5,
      hasStartupExperience: true
    },
    {
      id: '5',
      name: 'Priya Sharma',
      title: 'Venture Partner',
      company: 'Sequoia Capital',
      location: 'Mumbai, India',
      userType: 'investor',
      experience: '15 years',
      expertise: ['Early Stage Investing', 'SaaS', 'Market Analysis'],
      industries: ['Venture Capital', 'SaaS', 'Mobile Technology'],
      description: 'Passionate about investing in early-stage startups that are solving real-world problems with innovative solutions.',
      avatar: 'PS',
      verified: true,
      connections: 3421,
      lastActive: '4 hours ago',
      availability: { type: 'Advisory', hoursPerWeek: 10 },
      currentOrLastCompany: 'Sequoia Capital',
      currentOrLastRole: 'Venture Partner',
      totalYearsExperience: 15,
      hasStartupExperience: false
    },
    {
      id: '6',
      name: 'James Wilson',
      title: 'Growth Marketing Lead',
      company: 'Shopify',
      location: 'Toronto, Canada',
      userType: 'service_provider',
      experience: '7 years',
      expertise: ['Growth Marketing', 'Digital Strategy', 'Analytics'],
      industries: ['E-commerce', 'SaaS', 'Digital Marketing'],
      description: 'Growth marketing expert helping businesses scale through data-driven strategies and performance optimization.',
      avatar: 'JW',
      verified: true,
      connections: 1834,
      lastActive: '6 hours ago',
      availability: { type: 'Full-time' },
      currentOrLastCompany: 'Shopify',
      currentOrLastRole: 'Growth Marketing Lead',
      totalYearsExperience: 7,
      hasStartupExperience: true
    },
    {
      id: '7',
      name: 'Alex Kumar',
      title: 'Computer Science Student',
      company: 'Stanford University',
      location: 'Palo Alto, CA',
      userType: 'student',
      experience: '2 years',
      expertise: ['Machine Learning', 'Python', 'Data Science'],
      industries: ['Education', 'Technology', 'Research'],
      description: 'CS student passionate about AI and machine learning, actively seeking internship opportunities in tech.',
      avatar: 'AK',
      verified: false,
      connections: 234,
      lastActive: '1 hour ago',
      availability: { type: 'Part-time', hoursPerWeek: 15 },
      currentOrLastCompany: 'Stanford University',
      currentOrLastRole: 'Computer Science Student',
      totalYearsExperience: 2,
      hasStartupExperience: false
    },
    {
      id: '8',
      name: 'Lisa Wang',
      title: 'Seeking Product Manager Role',
      company: 'Job Seeker',
      location: 'New York, NY',
      userType: 'job_seeker',
      experience: '4 years',
      expertise: ['Product Management', 'User Research', 'Agile', 'Strategy'],
      industries: ['Technology', 'E-commerce', 'Healthcare'],
      description: 'Experienced product manager seeking new opportunities to drive product innovation and user experience.',
      avatar: 'LW',
      verified: false,
      connections: 567,
      lastActive: '4 hours ago',
      availability: { type: 'Full-time' },
      currentOrLastCompany: 'TechCorp',
      currentOrLastRole: 'Senior Product Manager',
      totalYearsExperience: 4,
      hasStartupExperience: false
    }
  ]

  // Smart filter tags
  const smartTags = [
    { id: 'founders', label: 'Founders', icon: Rocket, count: 45 },
    { id: 'designers', label: 'Designers', icon: Palette, count: 123 },
    { id: 'engineers', label: 'AI Engineers', icon: Code, count: 89 },
    { id: 'marketers', label: 'Marketers', icon: TrendingUp, count: 67 },
    { id: 'investors', label: 'Investors', icon: DollarSign, count: 34 },
    { id: 'product', label: 'Product', icon: Target, count: 156 },
    { id: 'consultants', label: 'Consultants', icon: Lightbulb, count: 78 },
    { id: 'sales', label: 'Sales', icon: Building, count: 91 },
    { id: 'students', label: 'Students', icon: BookOpen, count: 52 },
    { id: 'job_seekers', label: 'Job Seekers', icon: Search, count: 43 }
  ]

  // Categories
  const categories = [
    { value: 'all', label: 'All Users' },
    { value: 'founder', label: 'Founders' },
    { value: 'freelancer', label: 'Freelancers' },
    { value: 'service_provider', label: 'Service Providers' },
    { value: 'investor', label: 'Investors' },
    { value: 'mentor', label: 'Mentors' },
    { value: 'student', label: 'Students' },
    { value: 'job_seeker', label: 'Job Seekers' }
  ]

  // Locations
  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'us', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'germany', label: 'Germany' },
    { value: 'india', label: 'India' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'australia', label: 'Australia' }
  ]

  // Filter connections based on search and filters
  const filteredConnections = mockConnections.filter((connection) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        connection.name.toLowerCase().includes(query) ||
        connection.title.toLowerCase().includes(query) ||
        connection.company.toLowerCase().includes(query) ||
        connection.expertise.some(skill => skill.toLowerCase().includes(query)) ||
        connection.industries.some(industry => industry.toLowerCase().includes(query)) ||
        connection.description.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Category filter
    if (selectedCategory !== 'all' && connection.userType !== selectedCategory) {
      return false
    }

    // Tag filters (simplified for demo)
    if (selectedTags.length > 0) {
      const hasMatchingTag = selectedTags.some(tag => {
        switch (tag) {
          case 'founders': return connection.userType === 'founder'
          case 'designers': return connection.expertise.some(skill => skill.toLowerCase().includes('design'))
          case 'engineers': return connection.expertise.some(skill => skill.toLowerCase().includes('engineer') || skill.toLowerCase().includes('development') || skill.toLowerCase().includes('machine learning'))
          case 'marketers': return connection.expertise.some(skill => skill.toLowerCase().includes('marketing'))
          case 'investors': return connection.userType === 'investor'
          case 'students': return connection.userType === 'student'
          case 'job_seekers': return connection.userType === 'job_seeker'
          default: return true
        }
      })
      if (!hasMatchingTag) return false
    }

    return true
  })

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'founder': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'freelancer': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'service_provider': return 'bg-teal-100 text-teal-800 border-teal-200'
      case 'investor': return 'bg-green-100 text-green-800 border-green-200'
      case 'mentor': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'student': return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'job_seeker': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'founder': return 'Founder'
      case 'freelancer': return 'Freelancer'
      case 'service_provider': return 'Service Provider'
      case 'investor': return 'Investor'
      case 'mentor': return 'Mentor'
      case 'student': return 'Student'
      case 'job_seeker': return 'Job Seeker'
      default: return 'Entrepreneur'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Link Contacts */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Connect with Entrepreneurs</h2>
          <p className="text-muted-foreground">Discover and connect with founders, freelancers, investors, and innovators in your network</p>
          {userProfile && (
            <p className="text-sm text-muted-foreground mt-1">
              Currently viewing as: <Badge variant="outline" className="ml-1">{userProfile.roleName}</Badge>
            </p>
          )}
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link2 className="w-4 h-4 mr-2" />
          Link Your Contacts
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* Smart Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, skills, company, or describe what you're looking for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category and Location Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2 flex-1">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 flex-1">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Smart Tags */}
          <div>
            <p className="text-sm font-medium mb-3">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              {smartTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <tag.icon className="w-3 h-3" />
                  <span>{tag.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {tag.count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'all' || selectedLocation !== 'all' || selectedTags.length > 0) && (
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Showing {filteredConnections.length} results</span>
                {(selectedTags.length > 0 || selectedCategory !== 'all' || selectedLocation !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTags([])
                      setSelectedCategory('all')
                      setSelectedLocation('all')
                      setSearchQuery('')
                    }}
                    className="text-xs"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connections Grid */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredConnections.map((connection) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 h-full">
              <CardContent className="p-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="relative cursor-pointer" onClick={() => onNavigateToProfile?.(connection.id)}>
                    <Avatar className="w-12 h-12 hover:ring-2 hover:ring-primary transition-all">
                      <AvatarImage src={`/placeholder-avatar-${connection.id}.jpg`} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {connection.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {connection.verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-semibold truncate cursor-pointer hover:text-primary transition-colors"
                      onClick={() => onNavigateToProfile?.(connection.id)}
                    >
                      {connection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{connection.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{connection.company}</p>
                  </div>
                </div>

                {/* Location and User Type */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{connection.location}</span>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getUserTypeColor(connection.userType)}`}>
                    {getUserTypeLabel(connection.userType)}
                  </Badge>
                </div>

                {/* Experience and Stats */}
                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{connection.experience} exp</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{connection.connections.toLocaleString()}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {connection.description}
                </p>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {connection.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {connection.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{connection.expertise.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Industries */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Industries</p>
                  <div className="flex flex-wrap gap-1">
                    {connection.industries.slice(0, 2).map((industry, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                        {industry}
                      </Badge>
                    ))}
                    {connection.industries.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{connection.industries.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Availability</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                      <Clock className="w-3 h-3 mr-1" />
                      {connection.availability.type}
                    </Badge>
                    {connection.availability.hoursPerWeek && (
                      <span className="text-xs text-muted-foreground">
                        {connection.availability.hoursPerWeek} hrs/week
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience Section */}
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Experience</p>
                  
                  {/* Current/Last Role */}
                  <div className="flex items-start space-x-2">
                    <Briefcase className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{connection.currentOrLastRole}</p>
                      <p className="text-xs text-muted-foreground truncate">{connection.currentOrLastCompany}</p>
                    </div>
                  </div>

                  {/* Total Experience and Startup Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{connection.totalYearsExperience} years total</span>
                    </div>
                    {connection.hasStartupExperience && (
                      <Badge variant="outline" className="text-xs bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]">
                        <Award className="w-3 h-3 mr-1" />
                        Startup Exp
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                  onClick={() => onNavigateToProfile?.(connection.id)}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  View LinkedIn
                </Button>

                {/* Last Active */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Last active {connection.lastActive}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No connections found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or explore different filters to find more connections.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSelectedLocation('all')
                setSelectedTags([])
              }}
            >
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Load More */}
      {filteredConnections.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full md:w-auto">
            Load More Connections
          </Button>
        </div>
      )}
    </div>
  )
}