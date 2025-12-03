'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { PartnerCompany } from './MyPartnerCompany'
import { 
  X, 
  Plus, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Award,
  Briefcase,
  DollarSign,
  Users,
  ExternalLink
} from 'lucide-react'

interface CompanyFormProps {
  initialData?: PartnerCompany
  onSubmit: (data: Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const PARTNER_TYPES = [
  { value: 'agency', label: 'Agency' },
  { value: 'consultancy', label: 'Consultancy' },
  { value: 'manufacturer', label: 'Manufacturer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'logistics', label: 'Logistics Partner' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'retail', label: 'Retail Partner' }
]

const INDUSTRY_PARENTS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Retail',
  'Education',
  'Real Estate',
  'Transportation',
  'Food & Beverage',
  'Entertainment',
  'Energy',
  'Agriculture',
  'Construction',
  'Consulting',
  'Marketing',
  'Other'
]

const INDUSTRY_SUBCATEGORIES = {
  'Technology': ['Software Development', 'AI/ML', 'Cybersecurity', 'Cloud Services', 'Mobile Apps', 'Web Development', 'Data Analytics', 'IoT'],
  'Healthcare': ['Medical Devices', 'Pharmaceuticals', 'Telemedicine', 'Health IT', 'Biotechnology', 'Digital Health'],
  'Finance': ['Fintech', 'Banking', 'Insurance', 'Investment', 'Cryptocurrency', 'Payment Processing'],
  'Manufacturing': ['Industrial Manufacturing', 'Consumer Goods', 'Automotive', 'Aerospace', 'Electronics', 'Textiles'],
  'Retail': ['E-commerce', 'Fashion', 'Beauty', 'Home & Garden', 'Sports & Outdoors', 'Luxury Goods'],
  'Education': ['EdTech', 'Online Learning', 'Training & Development', 'Academic Services'],
  'Real Estate': ['Property Management', 'Real Estate Tech', 'Construction', 'Architecture'],
  'Transportation': ['Logistics', 'Shipping', 'Ride-sharing', 'Automotive Services', 'Public Transport'],
  'Food & Beverage': ['Restaurants', 'Food Tech', 'Beverages', 'Food Delivery', 'Catering'],
  'Entertainment': ['Media', 'Gaming', 'Streaming', 'Events', 'Sports'],
  'Energy': ['Renewable Energy', 'Oil & Gas', 'Utilities', 'Clean Tech'],
  'Agriculture': ['AgTech', 'Farming', 'Food Production', 'Sustainable Agriculture'],
  'Construction': ['Building Materials', 'Construction Services', 'Architecture', 'Engineering'],
  'Consulting': ['Business Consulting', 'Strategy', 'Management', 'Operations'],
  'Marketing': ['Digital Marketing', 'Advertising', 'PR', 'Content Marketing', 'Social Media'],
  'Other': ['General Services', 'Non-profit', 'Government', 'Research']
}

const PRICING_MODELS = [
  'Hourly Rate',
  'Fixed Price',
  'Monthly Retainer',
  'Project-based',
  'Commission-based',
  'Subscription',
  'Volume-based',
  'Negotiable'
]

export function CompanyForm({ initialData, onSubmit, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    partnerType: initialData?.partnerType || '',
    industryParent: initialData?.industryParent || '',
    industrySubCategory: initialData?.industrySubCategory || '',
    companyName: initialData?.companyName || '',
    companyAddress: initialData?.companyAddress || '',
    companyCity: initialData?.companyCity || '',
    companyCountry: initialData?.companyCountry || '',
    companyPincode: initialData?.companyPincode || '',
    companyFoundingYear: initialData?.companyFoundingYear || new Date().getFullYear(),
    companyOverview: initialData?.companyOverview || '',
    companyWebsite: initialData?.companyWebsite || '',
    companyLinkedinUrl: initialData?.companyLinkedinUrl || '',
    companyEmail: initialData?.companyEmail || '',
    companyContactNumber: initialData?.companyContactNumber || '',
    pricingModel: initialData?.pricingModel || ''
  })

  const [industriesServed, setIndustriesServed] = useState<string[]>(initialData?.industriesServed || [])
  const [certifications, setCertifications] = useState<string[]>(initialData?.certifications || [])
  const [servicesOffered, setServicesOffered] = useState<string[]>(initialData?.servicesOffered || [])
  const [portfolio, setPortfolio] = useState(initialData?.portfolio || [])

  const [newIndustry, setNewIndustry] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newService, setNewService] = useState('')
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    description: '',
    tags: '',
    link: ''
  })

  const generateCompanySubtext = (overview: string) => {
    if (!overview) return ''
    // Extract first sentence or first 100 characters
    const firstSentence = overview.split('.')[0]
    return firstSentence.length > 100 ? overview.substring(0, 97) + '...' : firstSentence
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addItem = (item: string, setter: React.Dispatch<React.SetStateAction<string[]>>, inputSetter: React.Dispatch<React.SetStateAction<string>>) => {
    if (item.trim()) {
      setter(prev => [...prev, item.trim()])
      inputSetter('')
    }
  }

  const removeItem = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const addPortfolioItem = () => {
    if (newPortfolioItem.title && newPortfolioItem.description) {
      setPortfolio(prev => [...prev, {
        title: newPortfolioItem.title,
        description: newPortfolioItem.description,
        tags: newPortfolioItem.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        link: newPortfolioItem.link || undefined
      }])
      setNewPortfolioItem({ title: '', description: '', tags: '', link: '' })
    }
  }

  const removePortfolioItem = (index: number) => {
    setPortfolio(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const companySubtext = generateCompanySubtext(formData.companyOverview)
    
    onSubmit({
      ...formData,
      companySubtext,
      industriesServed,
      certifications,
      servicesOffered,
      portfolio
    })
  }

  const availableSubCategories = INDUSTRY_SUBCATEGORIES[formData.industryParent as keyof typeof INDUSTRY_SUBCATEGORIES] || []

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnerType">Partner Type *</Label>
              <Select value={formData.partnerType} onValueChange={(value) => handleInputChange('partnerType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select partner type" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industryParent">Industry Parent *</Label>
              <Select 
                value={formData.industryParent} 
                onValueChange={(value) => {
                  handleInputChange('industryParent', value)
                  handleInputChange('industrySubCategory', '') // Reset subcategory
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_PARENTS.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industrySubCategory">Industry Sub Category</Label>
              <Select 
                value={formData.industrySubCategory} 
                onValueChange={(value) => handleInputChange('industrySubCategory', value)}
                disabled={!formData.industryParent}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub category" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubCategories.map(subCategory => (
                    <SelectItem key={subCategory} value={subCategory}>
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyOverview">Company Overview *</Label>
            <Textarea
              id="companyOverview"
              value={formData.companyOverview}
              onChange={(e) => handleInputChange('companyOverview', e.target.value)}
              placeholder="Describe your company, its mission, and what makes it unique..."
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyFoundingYear">Company Founding Year</Label>
            <Input
              id="companyFoundingYear"
              type="number"
              value={formData.companyFoundingYear}
              onChange={(e) => handleInputChange('companyFoundingYear', parseInt(e.target.value))}
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Location Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              placeholder="Street address"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="companyCity">City</Label>
              <Input
                id="companyCity"
                value={formData.companyCity}
                onChange={(e) => handleInputChange('companyCity', e.target.value)}
                placeholder="City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyCountry">Country</Label>
              <Input
                id="companyCountry"
                value={formData.companyCountry}
                onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                placeholder="Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyPincode">Pincode/ZIP</Label>
              <Input
                id="companyPincode"
                value={formData.companyPincode}
                onChange={(e) => handleInputChange('companyPincode', e.target.value)}
                placeholder="Pincode"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services and Industries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" />
            <span>Services & Industries</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Industries Served */}
          <div className="space-y-3">
            <Label>Industries Served</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {industriesServed.map((industry, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{industry}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeItem(index, setIndustriesServed)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                placeholder="Add industry served"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newIndustry, setIndustriesServed, setNewIndustry))}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addItem(newIndustry, setIndustriesServed, setNewIndustry)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Services Offered */}
          <div className="space-y-3">
            <Label>Services Offered</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {servicesOffered.map((service, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{service}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-600" 
                    onClick={() => removeItem(index, setServicesOffered)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add service offered"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newService, setServicesOffered, setNewService))}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addItem(newService, setServicesOffered, setNewService)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Pricing Model */}
          <div className="space-y-2">
            <Label htmlFor="pricingModel">Pricing Model</Label>
            <Select value={formData.pricingModel} onValueChange={(value) => handleInputChange('pricingModel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select pricing model" />
              </SelectTrigger>
              <SelectContent>
                {PRICING_MODELS.map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Certifications & Patents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {certifications.map((cert, index) => (
              <Badge key={index} className="bg-green-100 text-green-800 border-green-200 flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>{cert}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                  onClick={() => removeItem(index, setCertifications)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add certification or patent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem(newCertification, setCertifications, setNewCertification))}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => addItem(newCertification, setCertifications, setNewCertification)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Portfolio</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Portfolio Items */}
          {portfolio.length > 0 && (
            <div className="space-y-3">
              {portfolio.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" 
                           className="text-xs text-blue-600 hover:underline flex items-center mt-1">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Project
                        </a>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removePortfolioItem(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Separator />
            </div>
          )}

          {/* Add New Portfolio Item */}
          <div className="space-y-3 p-3 border border-dashed rounded-lg">
            <h4 className="font-medium text-sm">Add Portfolio Item</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                value={newPortfolioItem.title}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Project title"
              />
              <Input
                value={newPortfolioItem.link}
                onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Project link (optional)"
              />
            </div>
            <Textarea
              value={newPortfolioItem.description}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              rows={2}
            />
            <Input
              value={newPortfolioItem.tags}
              onChange={(e) => setNewPortfolioItem(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Tags (comma separated)"
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={addPortfolioItem}
              disabled={!newPortfolioItem.title || !newPortfolioItem.description}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Portfolio Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Company Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyContactNumber">Contact Number</Label>
              <Input
                id="companyContactNumber"
                type="tel"
                value={formData.companyContactNumber}
                onChange={(e) => handleInputChange('companyContactNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                value={formData.companyWebsite}
                onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                placeholder="https://company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLinkedinUrl">LinkedIn URL</Label>
              <Input
                id="companyLinkedinUrl"
                type="url"
                value={formData.companyLinkedinUrl}
                onChange={(e) => handleInputChange('companyLinkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          {initialData ? 'Update Company' : 'Create Company'}
        </Button>
      </div>
    </form>
  )
}