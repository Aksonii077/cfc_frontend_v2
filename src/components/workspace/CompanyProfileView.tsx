'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { PartnerCompany } from './MyPartnerCompany'
import { 
  ArrowLeft,
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
  Edit
} from 'lucide-react'

interface CompanyProfileViewProps {
  company: PartnerCompany
  onBack?: () => void
  onEdit?: () => void
  isOwner?: boolean
}

export function CompanyProfileView({ company, onBack, onEdit, isOwner = false }: CompanyProfileViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

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

  const getPartnerTypeColor = (type: string) => {
    const colors = {
      'agency': 'bg-blue-100 text-blue-800 border-blue-200',
      'consultancy': 'bg-purple-100 text-purple-800 border-purple-200',
      'manufacturer': 'bg-orange-100 text-orange-800 border-orange-200',
      'supplier': 'bg-green-100 text-green-800 border-green-200',
      'logistics': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'distributor': 'bg-pink-100 text-pink-800 border-pink-200',
      'retail': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const TypeIcon = getPartnerTypeIcon(company.partnerType)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company.companyName,
        text: company.companySubtext,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-6">
            {onBack && (
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Company Logo and Basic Info */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-2xl">
                    {company.companyName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold">{company.companyName}</h1>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="outline" className={`flex items-center space-x-1 ${getPartnerTypeColor(company.partnerType)}`}>
                    <TypeIcon className="w-3 h-3" />
                    <span>{getPartnerTypeLabel(company.partnerType)}</span>
                  </Badge>
                  <Badge variant="outline">Founded {company.companyFoundingYear}</Badge>
                  <Badge variant="outline">{company.industryParent}</Badge>
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.companyCity}, {company.companyCountry}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{company.servicesOffered.length} services</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{company.industriesServed.length} industries</span>
                  </div>
                </div>

                <p className="text-muted-foreground max-w-2xl">
                  {company.companySubtext}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="lg:w-64 space-y-3">
              {isOwner ? (
                <>
                  <Button className="w-full" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Company
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Company
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
                    <Button variant="outline" className="flex-1" size="sm" onClick={handleShare}>
                      <Share className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </>
              )}
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
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{company.companyFoundingYear}</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{company.servicesOffered.length}</div>
                  <div className="text-sm text-muted-foreground">Services</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{company.industriesServed.length}</div>
                  <div className="text-sm text-muted-foreground">Industries</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{company.certifications.length}</div>
                  <div className="text-sm text-muted-foreground">Certifications</div>
                </CardContent>
              </Card>
            </div>

            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle>About {company.companyName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{company.companyOverview}</p>
              </CardContent>
            </Card>

            {/* Industries and Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Industries We Serve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {company.industriesServed.map((industry) => (
                      <Badge key={industry} variant="secondary">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{company.companyAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{company.companyCity}, {company.companyCountry} {company.companyPincode}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {company.servicesOffered.map((service, index) => (
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
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {company.pricingModel && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Pricing Model</h4>
                      <p className="text-muted-foreground">{company.pricingModel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {company.portfolio.length > 0 ? (
              <div className="grid gap-6">
                {company.portfolio.map((project, index) => (
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
                        {project.link && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Project
                              </a>
                            </Button>
                          </div>
                        )}
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
                  <p className="text-muted-foreground">This company hasn't added portfolio items yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            {company.certifications.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Certifications & Patents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {company.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{cert}</h4>
                          <p className="text-sm text-muted-foreground">Certification</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center p-12">
                  <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-medium mb-2">No Certifications</h3>
                  <p className="text-muted-foreground">This company hasn't added certifications yet.</p>
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
                  {company.companyWebsite && (
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Website</p>
                        <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline flex items-center">
                          {company.companyWebsite}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}

                  {company.companyEmail && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${company.companyEmail}`} 
                           className="text-blue-600 hover:underline">
                          {company.companyEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {company.companyContactNumber && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href={`tel:${company.companyContactNumber}`} 
                           className="text-blue-600 hover:underline">
                          {company.companyContactNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {company.companyLinkedinUrl && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <div>
                        <p className="font-medium">LinkedIn</p>
                        <a href={company.companyLinkedinUrl} target="_blank" rel="noopener noreferrer"
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
                  {!isOwner && (
                    <>
                      <Button className="w-full">
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
                    </>
                  )}
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
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