'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  MessageSquare,
  Heart,
  Share,
  Building,
  Wrench,
  Palette,
  Code,
  TrendingUp,
  Camera,
  Megaphone,
  FileText,
  Truck,
  Package,
  ShoppingCart,
  Factory,
  Globe,
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  Calendar,
  Award,
  Shield,
  CheckCircle,
  ArrowRight,
  Target,
  BarChart3,
  Network,
  Eye
} from 'lucide-react'

interface Partner {
  id: number
  name: string
  type: string
  category: string
  location: string
  country: string
  rating: number
  reviewCount: number
  description: string
  shortDescription: string
  services: string[]
  industries: string[]
  teamSize: string
  foundedYear: number
  website: string
  email: string
  phone: string
  logo: string
  verified: boolean
  featured: boolean
  clientsServed: number
  projectsCompleted: number
  certificates: string[]
  languages: string[]
  socialMedia: {
    linkedin?: string
    website?: string
  }
  portfolio: {
    title: string
    description: string
    image: string
    tags: string[]
  }[]
  testimonials: {
    client: string
    content: string
    rating: number
    project: string
  }[]
  pricingModel: string
  minBudget: number
  responseTime: string
}

export function PartnersSection() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedPartnerType, setSelectedPartnerType] = useState('all')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const partnerTypes = [
    { id: 'all', label: 'All Partners', icon: Building },
    { id: 'agency', label: 'Agency', icon: TrendingUp },
    { id: 'consultancy', label: 'Consultancy', icon: Target },
    { id: 'manufacturer', label: 'Manufacturer', icon: Factory },
    { id: 'supplier', label: 'Supplier', icon: Package },
    { id: 'logistics', label: 'Logistics Partner', icon: Truck },
    { id: 'distributor', label: 'Distributor', icon: Network },
    { id: 'retail', label: 'Retail Partner', icon: ShoppingCart }
  ]

  const categories = [
    { id: 'all', label: 'All Categories', icon: Building },
    { id: 'design', label: 'Design & Creative', icon: Palette },
    { id: 'development', label: 'Development & Tech', icon: Code },
    { id: 'marketing', label: 'Marketing & Sales', icon: Megaphone },
    { id: 'business', label: 'Business & Strategy', icon: TrendingUp },
    { id: 'content', label: 'Content & Writing', icon: FileText },
    { id: 'media', label: 'Media & Production', icon: Camera },
    { id: 'manufacturing', label: 'Manufacturing', icon: Wrench },
    { id: 'logistics', label: 'Logistics & Supply Chain', icon: Truck },
    { id: 'retail', label: 'Retail & E-commerce', icon: ShoppingCart }
  ]

  const partners: Partner[] = [
    {
      id: 1,
      name: "TechCraft Solutions",
      type: "agency",
      category: "development",
      location: "San Francisco, CA",
      country: "United States",
      rating: 4.9,
      reviewCount: 127,
      description: "TechCraft Solutions is a full-service digital agency specializing in cutting-edge web and mobile application development. We've been helping startups and enterprises build scalable, innovative digital solutions for over 8 years. Our team combines technical expertise with creative problem-solving to deliver products that drive business growth.",
      shortDescription: "Full-service digital agency specializing in web and mobile app development with 8+ years of experience.",
      services: ["Web Development", "Mobile Apps", "Cloud Infrastructure", "DevOps", "API Development", "UI/UX Design"],
      industries: ["FinTech", "HealthTech", "E-commerce", "SaaS", "EdTech"],
      teamSize: "25-50",
      foundedYear: 2016,
      website: "https://techcraft-solutions.com",
      email: "contact@techcraft-solutions.com",
      phone: "+1 (555) 123-4567",
      logo: "TC",
      verified: true,
      featured: true,
      clientsServed: 150,
      projectsCompleted: 300,
      certificates: ["AWS Certified", "Google Cloud Partner", "ISO 27001"],
      languages: ["English", "Spanish"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/techcraft-solutions",
        website: "https://techcraft-solutions.com"
      },
      portfolio: [
        {
          title: "FinTech Mobile Banking App",
          description: "Complete mobile banking solution with advanced security features",
          image: "/placeholder-project.jpg",
          tags: ["React Native", "Node.js", "AWS"]
        },
        {
          title: "E-commerce Platform",
          description: "Scalable e-commerce platform handling 10M+ transactions",
          image: "/placeholder-project.jpg",
          tags: ["React", "Microservices", "Kubernetes"]
        }
      ],
      testimonials: [
        {
          client: "John Smith, CEO of FinanceFlow",
          content: "TechCraft delivered an exceptional mobile banking app that exceeded our expectations. Their technical expertise and project management were outstanding.",
          rating: 5,
          project: "Mobile Banking App"
        }
      ],
      pricingModel: "Fixed Price & Hourly",
      minBudget: 10000,
      responseTime: "Within 4 hours"
    },
    {
      id: 2,
      name: "Creative Minds Studio",
      type: "agency",
      category: "design",
      location: "New York, NY",
      country: "United States",
      rating: 4.8,
      reviewCount: 89,
      description: "Creative Minds Studio is a design-focused agency that creates beautiful, user-centered experiences for brands across industries. We specialize in brand identity, UI/UX design, and creative campaigns that drive engagement and conversion.",
      shortDescription: "Design-focused agency creating user-centered experiences and brand identities.",
      services: ["Brand Identity", "UI/UX Design", "Creative Campaigns", "Packaging Design", "Web Design", "Print Design"],
      industries: ["Fashion", "Beauty", "Lifestyle", "Technology", "Food & Beverage"],
      teamSize: "15-25",
      foundedYear: 2018,
      website: "https://creativeminds-studio.com",
      email: "hello@creativeminds-studio.com",
      phone: "+1 (555) 987-6543",
      logo: "CM",
      verified: true,
      featured: false,
      clientsServed: 200,
      projectsCompleted: 450,
      certificates: ["Adobe Certified", "Design Thinking Certified"],
      languages: ["English"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/creative-minds-studio",
        website: "https://creativeminds-studio.com"
      },
      portfolio: [
        {
          title: "Beauty Brand Rebrand",
          description: "Complete brand overhaul for a sustainable beauty company",
          image: "/placeholder-project.jpg",
          tags: ["Branding", "Packaging", "UI/UX"]
        }
      ],
      testimonials: [
        {
          client: "Sarah Johnson, CMO of BeautyNature",
          content: "The Creative Minds team transformed our brand identity completely. The new design increased our brand recognition by 300%.",
          rating: 5,
          project: "Brand Rebrand"
        }
      ],
      pricingModel: "Project-based",
      minBudget: 5000,
      responseTime: "Within 2 hours"
    },
    {
      id: 3,
      name: "Global Manufacturing Co.",
      type: "manufacturer",
      category: "manufacturing",
      location: "Shenzhen, Guangdong",
      country: "China",
      rating: 4.7,
      reviewCount: 156,
      description: "Global Manufacturing Co. is a leading manufacturer specializing in electronics, consumer goods, and custom product development. With state-of-the-art facilities and quality certifications, we serve clients worldwide with competitive pricing and reliable delivery.",
      shortDescription: "Leading manufacturer of electronics and consumer goods with global reach.",
      services: ["Product Manufacturing", "Custom Development", "Quality Assurance", "Packaging", "Supply Chain", "OEM/ODM"],
      industries: ["Electronics", "Consumer Goods", "Automotive", "Healthcare", "Industrial"],
      teamSize: "500+",
      foundedYear: 2010,
      website: "https://globalmfg.com",
      email: "sales@globalmfg.com",
      phone: "+86 755-1234-5678",
      logo: "GM",
      verified: true,
      featured: true,
      clientsServed: 500,
      projectsCompleted: 2000,
      certificates: ["ISO 9001", "ISO 14001", "CE Certified", "FCC Approved"],
      languages: ["English", "Chinese", "Spanish"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/global-manufacturing",
        website: "https://globalmfg.com"
      },
      portfolio: [
        {
          title: "Smart Home Device Manufacturing",
          description: "Manufacturing IoT devices for smart home automation",
          image: "/placeholder-project.jpg",
          tags: ["IoT", "Electronics", "Quality Control"]
        }
      ],
      testimonials: [
        {
          client: "Mike Chen, Product Manager at SmartTech",
          content: "Excellent manufacturing quality and on-time delivery. They helped us scale our production efficiently.",
          rating: 5,
          project: "Smart Device Production"
        }
      ],
      pricingModel: "Volume-based",
      minBudget: 25000,
      responseTime: "Within 1 day"
    },
    {
      id: 4,
      name: "Supply Chain Solutions Inc.",
      type: "supplier",
      category: "logistics",
      location: "Chicago, IL",
      country: "United States",
      rating: 4.6,
      reviewCount: 203,
      description: "Supply Chain Solutions Inc. provides comprehensive supply chain and sourcing services for businesses of all sizes. We specialize in finding reliable suppliers, managing vendor relationships, and optimizing supply chain operations.",
      shortDescription: "Comprehensive supply chain and sourcing services with vendor relationship management.",
      services: ["Supplier Sourcing", "Vendor Management", "Quality Control", "Logistics Coordination", "Cost Optimization", "Risk Management"],
      industries: ["Retail", "Manufacturing", "E-commerce", "Healthcare", "Automotive"],
      teamSize: "50-100",
      foundedYear: 2015,
      website: "https://supplychainsolutions.com",
      email: "info@supplychainsolutions.com",
      phone: "+1 (555) 456-7890",
      logo: "SC",
      verified: true,
      featured: false,
      clientsServed: 300,
      projectsCompleted: 800,
      certificates: ["APICS Certified", "Lean Six Sigma"],
      languages: ["English"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/supply-chain-solutions",
        website: "https://supplychainsolutions.com"
      },
      portfolio: [
        {
          title: "Retail Supply Chain Optimization",
          description: "Optimized supply chain reducing costs by 30%",
          image: "/placeholder-project.jpg",
          tags: ["Supply Chain", "Cost Reduction", "Efficiency"]
        }
      ],
      testimonials: [
        {
          client: "Lisa Wang, Operations Director at RetailPlus",
          content: "They helped us reduce supply chain costs by 30% while improving delivery times. Exceptional service!",
          rating: 5,
          project: "Supply Chain Optimization"
        }
      ],
      pricingModel: "Retainer & Commission",
      minBudget: 15000,
      responseTime: "Within 6 hours"
    },
    {
      id: 5,
      name: "FastTrack Logistics",
      type: "logistics",
      category: "logistics",
      location: "Los Angeles, CA",
      country: "United States",
      rating: 4.8,
      reviewCount: 178,
      description: "FastTrack Logistics is a premier logistics partner providing end-to-end shipping, warehousing, and distribution services. We leverage cutting-edge technology to ensure fast, reliable, and cost-effective logistics solutions.",
      shortDescription: "Premier logistics partner with end-to-end shipping and distribution services.",
      services: ["Freight Shipping", "Warehousing", "Last-Mile Delivery", "Distribution", "Customs Clearance", "Tracking & Analytics"],
      industries: ["E-commerce", "Retail", "Manufacturing", "Healthcare", "Fashion"],
      teamSize: "200-500",
      foundedYear: 2012,
      website: "https://fasttracklogistics.com",
      email: "logistics@fasttracklogistics.com",
      phone: "+1 (555) 321-0987",
      logo: "FT",
      verified: true,
      featured: true,
      clientsServed: 1000,
      projectsCompleted: 5000,
      certificates: ["C-TPAT Certified", "ISO 28000", "DOT Approved"],
      languages: ["English", "Spanish"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/fasttrack-logistics",
        website: "https://fasttracklogistics.com"
      },
      portfolio: [
        {
          title: "E-commerce Fulfillment Network",
          description: "Built nationwide fulfillment network for major e-commerce brand",
          image: "/placeholder-project.jpg",
          tags: ["Fulfillment", "Distribution", "Technology"]
        }
      ],
      testimonials: [
        {
          client: "David Brown, CEO of ShopFast",
          content: "FastTrack transformed our logistics operations. Delivery times improved by 40% and costs decreased significantly.",
          rating: 5,
          project: "Fulfillment Network"
        }
      ],
      pricingModel: "Volume-based",
      minBudget: 20000,
      responseTime: "Within 2 hours"
    },
    {
      id: 6,
      name: "RetailMax Partners",
      type: "retail",
      category: "retail",
      location: "Miami, FL",
      country: "United States",
      rating: 4.5,
      reviewCount: 134,
      description: "RetailMax Partners is a retail distribution network connecting brands with retail outlets across the Americas. We specialize in product placement, retail partnerships, and market expansion strategies.",
      shortDescription: "Retail distribution network connecting brands with outlets across the Americas.",
      services: ["Retail Distribution", "Store Placement", "Market Expansion", "Retail Partnerships", "Category Management", "Trade Marketing"],
      industries: ["Consumer Goods", "Beauty", "Fashion", "Electronics", "Home & Garden"],
      teamSize: "100-200",
      foundedYear: 2014,
      website: "https://retailmaxpartners.com",
      email: "partnerships@retailmaxpartners.com",
      phone: "+1 (555) 234-5678",
      logo: "RM",
      verified: true,
      featured: false,
      clientsServed: 400,
      projectsCompleted: 1200,
      certificates: ["Retail Industry Certified"],
      languages: ["English", "Spanish", "Portuguese"],
      socialMedia: {
        linkedin: "https://linkedin.com/company/retailmax-partners",
        website: "https://retailmaxpartners.com"
      },
      portfolio: [
        {
          title: "Beauty Brand Retail Expansion",
          description: "Expanded beauty brand to 500+ retail locations",
          image: "/placeholder-project.jpg",
          tags: ["Retail Expansion", "Beauty", "Distribution"]
        }
      ],
      testimonials: [
        {
          client: "Maria Garcia, Brand Manager at GlowCosmetics",
          content: "RetailMax helped us expand to 500+ stores in just 6 months. Their retail network is impressive.",
          rating: 4,
          project: "Retail Expansion"
        }
      ],
      pricingModel: "Commission-based",
      minBudget: 30000,
      responseTime: "Within 1 day"
    }
  ]

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         partner.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || partner.location.includes(selectedLocation)
    const matchesType = selectedPartnerType === 'all' || partner.type === selectedPartnerType
    
    return matchesSearch && matchesCategory && matchesLocation && matchesType
  })

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : Building
  }

  const getPartnerTypeIcon = (typeId: string) => {
    const type = partnerTypes.find(t => t.id === typeId)
    return type ? type.icon : Building
  }

  const openPartnerProfile = (partner: Partner) => {
    setSelectedPartner(partner)
    setShowProfileModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2>Partners</h2>
            <p className="text-gray-500 text-sm">Find trusted companies offering services as agencies, consultancies, manufacturers, suppliers, and logistics partners</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Building className="w-4 h-4 mr-2" />
          Join as Partner
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by company name, services, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#F7F9FF] border-[#C8D6FF]"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <Select value={selectedPartnerType} onValueChange={setSelectedPartnerType}>
                <SelectTrigger className="w-full md:w-48 bg-[#F7F9FF] border-[#C8D6FF]">
                  <SelectValue placeholder="Partner Type" />
                </SelectTrigger>
                <SelectContent>
                  {partnerTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48 bg-[#F7F9FF] border-[#C8D6FF]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <category.icon className="w-4 h-4" />
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-full md:w-40 bg-[#F7F9FF] border-[#C8D6FF]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredPartners.length} of {partners.length} partners
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="grid gap-6">
        {filteredPartners.map((partner) => {
          const CategoryIcon = getCategoryIcon(partner.category)
          const TypeIcon = getPartnerTypeIcon(partner.type)
          return (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 border-[#C8D6FF]">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Partner Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative">
                        <Avatar className="w-16 h-16 ring-2 ring-[#C8D6FF]/30">
                          <AvatarImage src="/placeholder-company.jpg" />
                          <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-lg">
                            {partner.logo}
                          </AvatarFallback>
                        </Avatar>
                        {partner.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#06CB1D] rounded-full flex items-center justify-center shadow-md">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3>{partner.name}</h3>
                              {partner.featured && (
                                <Badge variant="outline" className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                                  <Star className="w-3 h-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1.5">
                              <Badge variant="outline" className="text-xs bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                                {partnerTypes.find(t => t.id === partner.type)?.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                                {partner.teamSize} employees
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1.5">
                            <TypeIcon className="w-4 h-4" />
                            <span>{categories.find(cat => cat.id === partner.category)?.label}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{partner.location}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Star className="w-4 h-4 fill-[#3CE5A7] text-[#3CE5A7]" />
                            <span>{partner.rating} ({partner.reviewCount} reviews)</span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {partner.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {partner.services.slice(0, 4).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                              {service}
                            </Badge>
                          ))}
                          {partner.services.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                              +{partner.services.length - 4} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {partner.industries.slice(0, 3).map((industry) => (
                            <Badge key={industry} variant="secondary" className="text-xs bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                              {industry}
                            </Badge>
                          ))}
                          {partner.industries.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                              +{partner.industries.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats and Actions */}
                    <div className="lg:w-64 space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Founded:</span>
                          <span className="text-gray-800">{partner.foundedYear}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Clients:</span>
                          <span className="text-gray-800">{partner.clientsServed}+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Projects:</span>
                          <span className="text-gray-800">{partner.projectsCompleted}+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Response:</span>
                          <span className="text-gray-800">{partner.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button 
                          className="w-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                          onClick={() => openPartnerProfile(partner)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]" size="sm">
                            <Heart className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Load More */}
      {filteredPartners.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
            Load More Partners
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredPartners.length === 0 && (
        <Card className="border-[#C8D6FF]">
          <CardContent className="text-center p-12">
            <div className="w-16 h-16 bg-[#F7F9FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2">No partners found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or browse all categories
            </p>
            <Button variant="outline" className="border-[#C8D6FF] hover:bg-[#EDF2FF]" onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedLocation('all')
              setSelectedPartnerType('all')
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Partner Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPartner && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                    <AvatarImage src="/placeholder-company.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                      {selectedPartner.logo}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span>{selectedPartner.name}</span>
                      {selectedPartner.verified && (
                        <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {partnerTypes.find(t => t.id === selectedPartner.type)?.label} • {selectedPartner.location}
                    </p>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  View detailed company profile, services, portfolio, and contact information for {selectedPartner.name}.
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Company Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-[#C8D6FF]">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl text-[#114DFF]">{selectedPartner.rating}</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </CardContent>
                    </Card>
                    <Card className="border-[#C8D6FF]">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl text-[#06CB1D]">{selectedPartner.clientsServed}+</div>
                        <div className="text-xs text-gray-500">Clients Served</div>
                      </CardContent>
                    </Card>
                    <Card className="border-[#C8D6FF]">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl text-[#3CE5A7]">{selectedPartner.projectsCompleted}+</div>
                        <div className="text-xs text-gray-500">Projects</div>
                      </CardContent>
                    </Card>
                    <Card className="border-[#C8D6FF]">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl text-[#114DFF]">{selectedPartner.foundedYear}</div>
                        <div className="text-xs text-gray-500">Founded</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="mb-2">About</h3>
                    <p className="text-gray-600">{selectedPartner.description}</p>
                  </div>

                  {/* Industries */}
                  <div>
                    <h3 className="mb-2">Industries We Serve</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.industries.map((industry) => (
                        <Badge key={industry} variant="secondary" className="bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certificates */}
                  <div>
                    <h3 className="mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartner.certificates.map((cert) => (
                        <Badge key={cert} variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  {selectedPartner.testimonials.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Client Testimonials</h3>
                      <div className="space-y-4">
                        {selectedPartner.testimonials.map((testimonial, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-1">
                                  <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-sm">{testimonial.client}</p>
                                      <p className="text-xs text-muted-foreground">{testimonial.project}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Services Offered</h3>
                    <div className="grid gap-4">
                      {selectedPartner.services.map((service) => (
                        <Card key={service}>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span className="font-medium">{service}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Pricing Model</h3>
                    <p className="text-muted-foreground">{selectedPartner.pricingModel}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Minimum budget: ${selectedPartner.minBudget.toLocaleString()}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-6">
                  {selectedPartner.portfolio.length > 0 ? (
                    <div className="grid gap-6">
                      {selectedPartner.portfolio.map((project, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <h4 className="font-semibold">{project.title}</h4>
                              <p className="text-sm text-muted-foreground">{project.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No portfolio items available</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Website</p>
                            <a href={selectedPartner.website} target="_blank" rel="noopener noreferrer" 
                               className="text-sm text-blue-600 hover:underline flex items-center">
                              {selectedPartner.website}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">Email</p>
                            <a href={`mailto:${selectedPartner.email}`} 
                               className="text-sm text-blue-600 hover:underline">
                              {selectedPartner.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-medium">Phone</p>
                            <a href={`tel:${selectedPartner.phone}`} 
                               className="text-sm text-blue-600 hover:underline">
                              {selectedPartner.phone}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedPartner.socialMedia.linkedin && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                            <div>
                              <p className="font-medium">LinkedIn</p>
                              <a href={selectedPartner.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                                 className="text-sm text-blue-600 hover:underline flex items-center">
                                Company Profile
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}