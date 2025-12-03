'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { CompanyForm } from './CompanyForm'
import { CompanyProfileView } from './CompanyProfileView'
import { 
  Plus, 
  Building, 
  Edit, 
  Eye, 
  Share, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Trash2
} from 'lucide-react'

export interface PartnerCompany {
  id: string
  partnerType: string
  industryParent: string
  industrySubCategory: string
  companyName: string
  companyAddress: string
  companyCity: string
  companyCountry: string
  companyPincode: string
  companyFoundingYear: number
  companySubtext: string
  companyOverview: string
  industriesServed: string[]
  certifications: string[]
  servicesOffered: string[]
  pricingModel: string
  portfolio: Array<{
    title: string
    description: string
    tags: string[]
    link?: string
  }>
  companyWebsite: string
  companyLinkedinUrl: string
  companyEmail: string
  companyContactNumber: string
  createdAt: string
  updatedAt: string
}

// Mock data for demonstration
const MOCK_COMPANIES: PartnerCompany[] = [
  {
    id: 'company-1',
    partnerType: 'agency',
    industryParent: 'Technology',
    industrySubCategory: 'Software Development',
    companyName: 'TechCraft Solutions',
    companyAddress: '123 Innovation Street',
    companyCity: 'San Francisco',
    companyCountry: 'United States',
    companyPincode: '94105',
    companyFoundingYear: 2018,
    companySubtext: 'Transforming ideas into scalable digital solutions',
    companyOverview: 'TechCraft Solutions is a full-service digital agency specializing in cutting-edge web and mobile application development. We combine technical expertise with creative problem-solving to deliver products that drive business growth.',
    industriesServed: ['FinTech', 'HealthTech', 'E-commerce', 'SaaS'],
    certifications: ['AWS Certified', 'Google Cloud Partner', 'ISO 27001'],
    servicesOffered: ['Web Development', 'Mobile Apps', 'Cloud Infrastructure', 'DevOps', 'UI/UX Design'],
    pricingModel: 'Fixed Price & Hourly',
    portfolio: [
      {
        title: 'FinTech Banking App',
        description: 'Complete mobile banking solution with advanced security features',
        tags: ['React Native', 'Node.js', 'AWS'],
        link: 'https://example.com/portfolio/banking-app'
      },
      {
        title: 'E-commerce Platform',
        description: 'Scalable e-commerce platform handling 10M+ transactions',
        tags: ['React', 'Microservices', 'Kubernetes']
      }
    ],
    companyWebsite: 'https://techcraft-solutions.com',
    companyLinkedinUrl: 'https://linkedin.com/company/techcraft-solutions',
    companyEmail: 'contact@techcraft-solutions.com',
    companyContactNumber: '+1 (555) 123-4567',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-15T14:30:00Z'
  },
  {
    id: 'company-2',
    partnerType: 'manufacturer',
    industryParent: 'Manufacturing',
    industrySubCategory: 'Electronics Manufacturing',
    companyName: 'Precision Electronics Ltd',
    companyAddress: '456 Industrial Park Road',
    companyCity: 'Shenzhen',
    companyCountry: 'China',
    companyPincode: '518000',
    companyFoundingYear: 2012,
    companySubtext: 'High-precision electronics manufacturing for global brands',
    companyOverview: 'Precision Electronics Ltd is a leading contract manufacturer specializing in high-quality electronic components and complete product assembly. We serve clients from prototyping to mass production with state-of-the-art facilities and rigorous quality control.',
    industriesServed: ['Consumer Electronics', 'IoT Devices', 'Automotive', 'Medical Devices'],
    certifications: ['ISO 9001', 'ISO 14001', 'IATF 16949', 'FDA Registered'],
    servicesOffered: ['PCB Assembly', 'Product Design', 'Prototyping', 'Mass Production', 'Quality Testing'],
    pricingModel: 'Volume-based Pricing',
    portfolio: [
      {
        title: 'Smart Home Hub',
        description: 'Complete manufacturing solution for IoT home automation device',
        tags: ['IoT', 'WiFi', 'Bluetooth', 'Mobile App'],
        link: 'https://example.com/portfolio/smart-hub'
      },
      {
        title: 'Medical Monitoring Device',
        description: 'FDA-approved wearable health monitoring device with cloud connectivity',
        tags: ['Medical', 'Wearable', 'Cloud', 'Mobile']
      },
      {
        title: 'Automotive ECU',
        description: 'High-reliability electronic control unit for electric vehicles',
        tags: ['Automotive', 'ECU', 'Electric Vehicle', 'Safety']
      }
    ],
    companyWebsite: 'https://precision-electronics.com',
    companyLinkedinUrl: 'https://linkedin.com/company/precision-electronics',
    companyEmail: 'business@precision-electronics.com',
    companyContactNumber: '+86 755 8888 9999',
    createdAt: '2024-02-20T08:30:00Z',
    updatedAt: '2024-08-20T12:15:00Z'
  },
  {
    id: 'company-3',
    partnerType: 'consultancy',
    industryParent: 'Business Services',
    industrySubCategory: 'Strategy Consulting',
    companyName: 'Growth Strategy Partners',
    companyAddress: '789 Business District',
    companyCity: 'London',
    companyCountry: 'United Kingdom',
    companyPincode: 'EC2V 8AS',
    companyFoundingYear: 2015,
    companySubtext: 'Strategic growth consulting for emerging businesses',
    companyOverview: 'Growth Strategy Partners helps startups and scale-ups develop winning strategies, optimize operations, and achieve sustainable growth. Our team of experienced consultants brings deep industry knowledge and proven methodologies.',
    industriesServed: ['Tech Startups', 'FinTech', 'SaaS', 'E-commerce', 'HealthTech'],
    certifications: ['CMI Chartered', 'ISO 20000', 'Prince2 Certified'],
    servicesOffered: ['Go-to-Market Strategy', 'Business Model Design', 'Fundraising Support', 'Operational Excellence', 'Digital Transformation'],
    pricingModel: 'Project-based & Retainer',
    portfolio: [
      {
        title: 'FinTech Startup Strategy',
        description: 'Complete go-to-market strategy for digital banking startup resulting in $50M Series A',
        tags: ['Strategy', 'FinTech', 'Fundraising', 'GTM']
      },
      {
        title: 'SaaS Scale-up Optimization',
        description: 'Operational transformation enabling 300% revenue growth in 18 months',
        tags: ['SaaS', 'Operations', 'Growth', 'Process']
      },
      {
        title: 'E-commerce Platform Launch',
        description: 'End-to-end launch strategy for B2B marketplace achieving $10M GMV in year 1',
        tags: ['E-commerce', 'Marketplace', 'B2B', 'Launch']
      }
    ],
    companyWebsite: 'https://growthstrategypartners.co.uk',
    companyLinkedinUrl: 'https://linkedin.com/company/growth-strategy-partners',
    companyEmail: 'hello@growthstrategypartners.co.uk',
    companyContactNumber: '+44 20 7123 4567',
    createdAt: '2024-03-10T14:20:00Z',
    updatedAt: '2024-08-25T16:45:00Z'
  },
  {
    id: 'company-4',
    partnerType: 'supplier',
    industryParent: 'Materials',
    industrySubCategory: 'Sustainable Packaging',
    companyName: 'EcoPackaging Solutions',
    companyAddress: '321 Green Valley Industrial Estate',
    companyCity: 'Portland',
    companyCountry: 'United States',
    companyPincode: '97201',
    companyFoundingYear: 2019,
    companySubtext: 'Sustainable packaging solutions for conscious brands',
    companyOverview: 'EcoPackaging Solutions provides eco-friendly packaging materials and design services for brands committed to sustainability. We offer compostable, recyclable, and biodegradable alternatives to traditional packaging.',
    industriesServed: ['Food & Beverage', 'Cosmetics', 'E-commerce', 'Fashion', 'Consumer Goods'],
    certifications: ['FSC Certified', 'Cradle to Cradle', 'USDA BioPreferred', 'Carbon Neutral'],
    servicesOffered: ['Sustainable Packaging Design', 'Material Sourcing', 'Custom Manufacturing', 'Lifecycle Assessment', 'Brand Integration'],
    pricingModel: 'Volume Tiers & Custom Quotes',
    portfolio: [
      {
        title: 'Organic Food Brand Packaging',
        description: 'Complete packaging redesign using 100% compostable materials',
        tags: ['Compostable', 'Food Safe', 'Branding', 'Organic']
      },
      {
        title: 'Beauty Brand Sustainable Makeover',
        description: 'Luxury cosmetics packaging with 90% recycled content',
        tags: ['Beauty', 'Recycled', 'Luxury', 'Sustainable']
      },
      {
        title: 'E-commerce Shipping Solutions',
        description: 'Plastic-free shipping materials for online retailers',
        tags: ['Shipping', 'Plastic-free', 'E-commerce', 'Protective']
      }
    ],
    companyWebsite: 'https://ecopackagingsolutions.com',
    companyLinkedinUrl: 'https://linkedin.com/company/ecopackaging-solutions',
    companyEmail: 'sales@ecopackagingsolutions.com',
    companyContactNumber: '+1 (503) 555-0123',
    createdAt: '2024-04-05T11:30:00Z',
    updatedAt: '2024-08-30T09:20:00Z'
  },
  {
    id: 'company-5',
    partnerType: 'logistics',
    industryParent: 'Logistics',
    industrySubCategory: 'Cold Chain Logistics',
    companyName: 'ColdChain Express',
    companyAddress: '654 Logistics Hub Drive',
    companyCity: 'Mumbai',
    companyCountry: 'India',
    companyPincode: '400001',
    companyFoundingYear: 2016,
    companySubtext: 'Temperature-controlled logistics for sensitive products',
    companyOverview: 'ColdChain Express specializes in temperature-controlled transportation and warehousing solutions across India and Southeast Asia. We ensure product integrity from farm to consumer for pharmaceuticals, food, and biotechnology products.',
    industriesServed: ['Pharmaceuticals', 'Fresh Food', 'Biotechnology', 'Vaccines', 'Dairy Products'],
    certifications: ['GDP Certified', 'HACCP', 'ISO 22000', 'WHO PQS'],
    servicesOffered: ['Cold Storage', 'Temperature Monitoring', 'Last Mile Delivery', 'Cross-docking', 'Inventory Management'],
    pricingModel: 'Distance & Temperature Based',
    portfolio: [
      {
        title: 'Vaccine Distribution Network',
        description: 'National cold chain network for COVID-19 vaccine distribution',
        tags: ['Vaccines', 'Healthcare', 'Temperature Control', 'Nationwide']
      },
      {
        title: 'Organic Food Delivery',
        description: 'Farm-to-table cold chain for premium organic food retailers',
        tags: ['Organic', 'Farm-to-table', 'Fresh', 'Retail']
      },
      {
        title: 'Biotech Sample Transport',
        description: 'Ultra-low temperature transport for research institutions',
        tags: ['Biotech', 'Research', 'Ultra-low', 'Samples']
      }
    ],
    companyWebsite: 'https://coldchainexpress.in',
    companyLinkedinUrl: 'https://linkedin.com/company/coldchain-express',
    companyEmail: 'operations@coldchainexpress.in',
    companyContactNumber: '+91 22 2345 6789',
    createdAt: '2024-05-12T13:45:00Z',
    updatedAt: '2024-08-28T15:30:00Z'
  },
  {
    id: 'company-6',
    partnerType: 'retail',
    industryParent: 'Retail',
    industrySubCategory: 'Specialty Electronics Retail',
    companyName: 'NextGen Tech Retail',
    companyAddress: '987 Tech Boulevard',
    companyCity: 'Toronto',
    companyCountry: 'Canada',
    companyPincode: 'M5V 3A8',
    companyFoundingYear: 2020,
    companySubtext: 'Curated technology retail for innovative products',
    companyOverview: 'NextGen Tech Retail specializes in bringing cutting-edge technology products to market through our network of premium retail locations and online platform. We focus on emerging tech categories and provide expert customer education.',
    industriesServed: ['Consumer Electronics', 'Smart Home', 'Wearables', 'Gaming', 'AR/VR'],
    certifications: ['Apple Authorized Reseller', 'Google Partner', 'Microsoft Certified'],
    servicesOffered: ['Retail Distribution', 'Product Launch Support', 'Customer Education', 'Technical Support', 'Market Analytics'],
    pricingModel: 'Revenue Share & Margin Based',
    portfolio: [
      {
        title: 'Smart Home Product Launch',
        description: 'Successful retail launch of IoT home security system across 50+ stores',
        tags: ['Smart Home', 'IoT', 'Security', 'Retail Launch']
      },
      {
        title: 'VR Gaming Experience Centers',
        description: 'In-store VR demo stations driving 40% conversion rate',
        tags: ['VR', 'Gaming', 'Experience', 'Demo']
      },
      {
        title: 'Wearable Tech Showcase',
        description: 'Curated health wearables section with expert consultations',
        tags: ['Wearables', 'Health Tech', 'Consultation', 'Curation']
      }
    ],
    companyWebsite: 'https://nextgentechretail.ca',
    companyLinkedinUrl: 'https://linkedin.com/company/nextgen-tech-retail',
    companyEmail: 'partnerships@nextgentechretail.ca',
    companyContactNumber: '+1 (416) 555-7890',
    createdAt: '2024-06-18T10:15:00Z',
    updatedAt: '2024-08-26T14:20:00Z'
  }
]

interface MyPartnerCompanyProps {
  userProfile?: any
}

export function MyPartnerCompany({ userProfile }: MyPartnerCompanyProps) {
  const [companies, setCompanies] = useState<PartnerCompany[]>(MOCK_COMPANIES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showProfileView, setShowProfileView] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<PartnerCompany | null>(null)
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit' | 'view'>('list')

  const handleAddCompany = (companyData: Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: PartnerCompany = {
      ...companyData,
      id: `company-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setCompanies(prev => [...prev, newCompany])
    setShowAddForm(false)
    setCurrentView('list')
  }

  const handleEditCompany = (companyData: Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedCompany) return
    
    const updatedCompany: PartnerCompany = {
      ...companyData,
      id: selectedCompany.id,
      createdAt: selectedCompany.createdAt,
      updatedAt: new Date().toISOString()
    }
    
    setCompanies(prev => prev.map(company => 
      company.id === selectedCompany.id ? updatedCompany : company
    ))
    setShowEditForm(false)
    setSelectedCompany(null)
    setCurrentView('list')
  }

  const handleDeleteCompany = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId))
  }

  const getPartnerTypeLabel = (type: string) => {
    const types = {
      'agency': 'Agency',
      'consultancy': 'Consultancy',
      'manufacturer': 'Manufacturer',
      'supplier': 'Supplier',
      'logistics': 'Logistics Partner',
      'distributor': 'Distributor',
      'retail': 'Retail Partner'
    }
    return types[type as keyof typeof types] || type
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

  if (currentView === 'add') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('list')}
          >
            ← Back to Companies
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Add Partner Company</h2>
            <p className="text-muted-foreground text-sm">Create your company profile</p>
          </div>
        </div>
        
        <CompanyForm
          onSubmit={handleAddCompany}
          onCancel={() => setCurrentView('list')}
        />
      </div>
    )
  }

  if (currentView === 'edit' && selectedCompany) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => {
              setCurrentView('list')
              setSelectedCompany(null)
            }}
          >
            ← Back to Companies
          </Button>
          <div>
            <h2 className="text-xl font-semibold">Edit Company</h2>
            <p className="text-muted-foreground text-sm">Update your company information</p>
          </div>
        </div>
        
        <CompanyForm
          initialData={selectedCompany}
          onSubmit={handleEditCompany}
          onCancel={() => {
            setCurrentView('list')
            setSelectedCompany(null)
          }}
        />
      </div>
    )
  }

  if (currentView === 'view' && selectedCompany) {
    return (
      <CompanyProfileView 
        company={selectedCompany}
        onBack={() => {
          setCurrentView('list')
          setSelectedCompany(null)
        }}
        onEdit={() => setCurrentView('edit')}
        isOwner={true}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">My Partner Companies</h2>
          <p className="text-muted-foreground">Manage your company profiles and share them with potential partners</p>
        </div>
        <Button 
          onClick={() => setCurrentView('add')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Companies Grid */}
      {companies.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex items-center justify-center py-12 text-center">
            <div>
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-gray-900 mb-2">No companies yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Create your first company profile to start connecting with partners
              </p>
              <Button 
                onClick={() => setCurrentView('add')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Company
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {company.companyName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{company.companyName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{company.companySubtext}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Badge variant="outline" className={getPartnerTypeColor(company.partnerType)}>
                      {getPartnerTypeLabel(company.partnerType)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {company.industryParent}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{company.companyCity}, {company.companyCountry}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Founded {company.companyFoundingYear}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{company.servicesOffered.length} services</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Industries Served</p>
                    <div className="flex flex-wrap gap-1">
                      {company.industriesServed.slice(0, 3).map((industry) => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                      {company.industriesServed.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{company.industriesServed.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {company.certifications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {company.certifications.slice(0, 2).map((cert) => (
                          <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                        {company.certifications.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{company.certifications.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4 border-t">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCompany(company)
                        setCurrentView('view')
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCompany(company)
                        setCurrentView('edit')
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        // Handle share functionality
                        navigator.clipboard.writeText(`${window.location.origin}/company/${company.id}`)
                        // You could add a toast notification here
                      }}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <span>Updated {new Date(company.updatedAt).toLocaleDateString()}</span>
                    <div className="flex space-x-2">
                      {company.companyWebsite && (
                        <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-4 h-4 hover:text-blue-600" />
                        </a>
                      )}
                      {company.companyLinkedinUrl && (
                        <a href={company.companyLinkedinUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 hover:text-blue-600" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {companies.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{companies.length}</div>
              <p className="text-sm text-muted-foreground">Total Companies</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {companies.reduce((sum, company) => sum + company.servicesOffered.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Services Offered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {companies.reduce((sum, company) => sum + company.industriesServed.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Industries Served</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {companies.reduce((sum, company) => sum + company.certifications.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Certifications</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}