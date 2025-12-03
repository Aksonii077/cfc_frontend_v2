'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'
import { 
  Star, 
  MapPin, 
  Users, 
  MessageSquare,
  Heart,
  Share,
  Building,
  Globe,
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  Calendar,
  Award,
  CheckCircle,
  Target,
  BarChart3,
  Factory,
  Package,
  Truck,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Clock,
  FileText,
  Video,
  Download,
  ArrowLeft
} from 'lucide-react'

interface PartnerProfileProps {
  partner: {
    id: number
    name: string
    type: string
    category: string
    location: string
    country: string
    rating: number
    reviewCount: number
    description: string
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
  onBack?: () => void
}

export function PartnerProfile({ partner, onBack }: PartnerProfileProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showContactForm, setShowContactForm] = useState(false)

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'agency': return TrendingUp
      case 'consultancy': return Target
      case 'manufacturer': return Factory
      case 'supplier': return Package
      case 'logistics': return Truck
      case 'distributor': return BarChart3
      case 'retail': return ShoppingCart
      default: return Building
    }
  }

  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case 'agency': return 'Agency'
      case 'consultancy': return 'Consultancy'
      case 'manufacturer': return 'Manufacturer'
      case 'supplier': return 'Supplier'
      case 'logistics': return 'Logistics Partner'
      case 'distributor': return 'Distributor'
      case 'retail': return 'Retail Partner'
      default: return 'Partner'
    }
  }

  const TypeIcon = getPartnerTypeIcon(partner.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-6">
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Partners
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Company Logo and Basic Info */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="/placeholder-company.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                    {partner.logo}
                  </AvatarFallback>
                </Avatar>
                {partner.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{partner.name}</h1>
                  {partner.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <TypeIcon className="w-3 h-3" />
                    <span>{getPartnerTypeLabel(partner.type)}</span>
                  </Badge>
                  <Badge variant="outline">{partner.teamSize} employees</Badge>
                  <Badge variant="outline">Founded {partner.foundedYear}</Badge>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{partner.location}, {partner.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{partner.rating} ({partner.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Responds {partner.responseTime}</span>
                  </div>
                </div>

                <p className="text-muted-foreground max-w-2xl">
                  {partner.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:w-64 space-y-3">
              <Button className="w-full" onClick={() => setShowContactForm(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Partner
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1" size="sm">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{partner.rating}</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(partner.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{partner.clientsServed}+</div>
                  <div className="text-sm text-muted-foreground">Clients Served</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{partner.projectsCompleted}+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{new Date().getFullYear() - partner.foundedYear}+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </CardContent>
              </Card>
            </div>

            {/* Industries and Services */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industries We Serve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {partner.industries.map((industry) => (
                      <Badge key={industry} variant="secondary">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Core Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {partner.services.slice(0, 6).map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {partner.certificates.map((cert) => (
                    <Badge key={cert} className="bg-green-100 text-green-800 border-green-200">
                      <Award className="w-3 h-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            <Card>
              <CardHeader>
                <CardTitle>Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {partner.languages.map((language) => (
                    <Badge key={language} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {partner.services.map((service, index) => (
                    <motion.div
                      key={service}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{service}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Pricing Model</h4>
                    <p className="text-muted-foreground">{partner.pricingModel}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Minimum Budget</h4>
                    <p className="text-muted-foreground">${partner.minBudget.toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Response Time</h4>
                    <p className="text-muted-foreground">{partner.responseTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {partner.portfolio.length > 0 ? (
              <div className="grid gap-6">
                {partner.portfolio.map((project, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <p className="text-muted-foreground mt-2">{project.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Case Study
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-12">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Portfolio Items</h3>
                  <p className="text-muted-foreground">This partner hasn't added portfolio items yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {partner.testimonials.length > 0 ? (
              <div className="space-y-6">
                {partner.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gray-100">
                            {testimonial.client.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">• {testimonial.project}</span>
                          </div>
                          <p className="text-muted-foreground mb-3">"{testimonial.content}"</p>
                          <p className="font-medium text-sm">{testimonial.client}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center p-12">
                  <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground">Be the first to leave a review for this partner.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:underline flex items-center">
                        {partner.website}
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${partner.email}`} 
                         className="text-blue-600 hover:underline">
                        {partner.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${partner.phone}`} 
                         className="text-blue-600 hover:underline">
                        {partner.phone}
                      </a>
                    </div>
                  </div>

                  {partner.socialMedia.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <a href={partner.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline flex items-center">
                          Company Profile
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" onClick={() => setShowContactForm(true)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Request Quote
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}