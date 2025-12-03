import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { usePartner } from '../../contexts/PartnerContext';
import { useServices } from '../../hooks/useServices';
import { useState } from 'react';
import { 
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Edit,
  CheckCircle,
  Package,
  Eye,
  MessageSquare,
  Briefcase,
  Award,
  TrendingUp,
  Star,
  Shield,
  DollarSign,
  Target,
  Quote,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

export function PartnerProfileSection() {
  const { partner } = usePartner();
  const { services } = useServices();
  
  // Company Information edit state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    companyName: '',
    websiteUrl: '',
    headquartersLocation: '',
    companySize: '',
    foundedYear: '',
    industry: ''
  });

  // About Us edit state
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutFormData, setAboutFormData] = useState('');

  // Industries edit state
  const [isEditingIndustries, setIsEditingIndustries] = useState(false);
  const [industriesFormData, setIndustriesFormData] = useState<string[]>([]);

  // Certifications edit state
  const [isEditingCertifications, setIsEditingCertifications] = useState(false);
  const [certificationsFormData, setCertificationsFormData] = useState<Array<{id: string, name: string, description: string}>>([]);

  // Pricing edit state
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [pricingFormData, setPricingFormData] = useState({
    projectBased: { enabled: true, price: '$5,000/project' },
    hourlyConsulting: { enabled: true, price: '$150/hour' },
    retainer: { enabled: true, price: '$8,000/month' }
  });

  // Company Information handlers
  const handleEditCompany = () => {
    setCompanyFormData({
      companyName: partner.companyName,
      websiteUrl: partner.websiteUrl,
      headquartersLocation: partner.headquartersLocation,
      companySize: partner.companySize,
      foundedYear: partner.foundedYear,
      industry: partner.industry
    });
    setIsEditingCompany(true);
  };

  const handleSaveCompany = () => {
    console.log('Saving company info:', companyFormData);
    setIsEditingCompany(false);
  };

  const handleCancelCompany = () => {
    setIsEditingCompany(false);
  };

  const handleCompanyInputChange = (field: string, value: string) => {
    setCompanyFormData(prev => ({ ...prev, [field]: value }));
  };

  // About Us handlers
  const handleEditAbout = () => {
    setAboutFormData(partner.companyDescription);
    setIsEditingAbout(true);
  };

  const handleSaveAbout = () => {
    console.log('Saving about:', aboutFormData);
    setIsEditingAbout(false);
  };

  const handleCancelAbout = () => {
    setIsEditingAbout(false);
  };

  // Industries handlers
  const handleEditIndustries = () => {
    setIndustriesFormData([
      'Technology & SaaS',
      'Healthcare & MedTech',
      'FinTech & Finance',
      'E-commerce & Retail',
      'Education & EdTech',
      'Real Estate & PropTech',
      'Manufacturing & IoT',
      'Sustainability & GreenTech'
    ]);
    setIsEditingIndustries(true);
  };

  const handleSaveIndustries = () => {
    console.log('Saving industries:', industriesFormData);
    setIsEditingIndustries(false);
  };

  const handleCancelIndustries = () => {
    setIsEditingIndustries(false);
  };

  const handleAddIndustry = () => {
    setIndustriesFormData([...industriesFormData, 'New Industry']);
  };

  const handleRemoveIndustry = (index: number) => {
    setIndustriesFormData(industriesFormData.filter((_, i) => i !== index));
  };

  const handleEditIndustryName = (index: number, value: string) => {
    const updated = [...industriesFormData];
    updated[index] = value;
    setIndustriesFormData(updated);
  };

  // Certifications handlers
  const handleEditCertifications = () => {
    setCertificationsFormData([
      { id: '1', name: 'ISO 27001 Certified', description: 'Information Security Management' },
      { id: '2', name: 'SOC 2 Type II', description: 'Security, Availability & Confidentiality' },
      { id: '3', name: 'GDPR Compliant', description: 'Data Protection & Privacy' },
      { id: '4', name: 'AWS Advanced Partner', description: 'Cloud Solutions Provider' }
    ]);
    setIsEditingCertifications(true);
  };

  const handleSaveCertifications = () => {
    console.log('Saving certifications:', certificationsFormData);
    setIsEditingCertifications(false);
  };

  const handleCancelCertifications = () => {
    setIsEditingCertifications(false);
  };

  const handleAddCertification = () => {
    setCertificationsFormData([
      ...certificationsFormData,
      { id: Date.now().toString(), name: 'New Certification', description: 'Description' }
    ]);
  };

  const handleRemoveCertification = (id: string) => {
    setCertificationsFormData(certificationsFormData.filter(cert => cert.id !== id));
  };

  const handleEditCertification = (id: string, field: 'name' | 'description', value: string) => {
    setCertificationsFormData(certificationsFormData.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  // Pricing handlers
  const handleEditPricing = () => {
    setPricingFormData({
      projectBased: { enabled: true, price: '$5,000/project' },
      hourlyConsulting: { enabled: true, price: '$150/hour' },
      retainer: { enabled: true, price: '$8,000/month' }
    });
    setIsEditingPricing(true);
  };

  const handleSavePricing = () => {
    console.log('Saving pricing:', pricingFormData);
    setIsEditingPricing(false);
  };

  const handleCancelPricing = () => {
    setIsEditingPricing(false);
  };

  if (!partner) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-600">Loading partner profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Partner Profile</h2>
          <p className="text-gray-600">Manage your company profile and settings</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Completion */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <h3>Profile Completion</h3>
            <span className="text-[#114DFF]">{partner.profileCompletionPercentage}%</span>
          </div>
          <div className="w-full bg-[#F5F5F5] rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] h-2 rounded-full transition-all"
              style={{ width: `${partner.profileCompletionPercentage}%` }}
            />
          </div>
          <p className="text-gray-600">Complete your profile to increase visibility and attract more leads</p>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3>Company Information</h3>
            {!isEditingCompany && (
              <Button
                variant="outline"
                className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                onClick={handleEditCompany}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Company Name</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.companyName}
                    onChange={(e) => handleCompanyInputChange('companyName', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{partner.companyName}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Website</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.websiteUrl}
                    onChange={(e) => handleCompanyInputChange('websiteUrl', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[#114DFF] hover:underline">
                    {partner.websiteUrl}
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Location</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.headquartersLocation}
                    onChange={(e) => handleCompanyInputChange('headquartersLocation', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{partner.headquartersLocation}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Company Size</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.companySize}
                    onChange={(e) => handleCompanyInputChange('companySize', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{partner.companySize}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Founded</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.foundedYear}
                    onChange={(e) => handleCompanyInputChange('foundedYear', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">{partner.foundedYear}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-[#114DFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Industry</p>
                {isEditingCompany ? (
                  <Input
                    value={companyFormData.industry}
                    onChange={(e) => handleCompanyInputChange('industry', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    {partner.industry}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {isEditingCompany && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                onClick={handleSaveCompany}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelCompany}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Description */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="mb-4">About Us</h3>
            {!isEditingAbout && (
              <Button
                variant="outline"
                className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                onClick={handleEditAbout}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          
          {isEditingAbout ? (
            <Textarea
              value={aboutFormData}
              onChange={(e) => setAboutFormData(e.target.value)}
              className="w-full h-40"
            />
          ) : (
            <p className="text-gray-700">{partner.companyDescription}</p>
          )}

          {isEditingAbout && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                onClick={handleSaveAbout}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelAbout}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <h3 className="mb-4">Account Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <p className="text-gray-600 mb-2">Plan</p>
              <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-0">
                {partner.planTier.toUpperCase()}
              </Badge>
            </div>

            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <p className="text-gray-600 mb-2">Status</p>
              <Badge className={
                partner.status === 'approved' 
                  ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] gap-1'
                  : 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8] gap-1'
              }>
                <CheckCircle className="w-3 h-3" />
                {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
              </Badge>
            </div>

            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <p className="text-gray-600 mb-2">Partner Type</p>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                {partner.partnerType.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <h3 className="mb-6">Key Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Rating */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-[#FF8C00]" />
                <p className="text-gray-600">Rating</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-gray-900">4.9</span>
                <span className="text-gray-600">/5.0</span>
              </div>
              <p className="text-gray-600 mt-1">(127 reviews)</p>
            </div>

            {/* Clients Served */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-[#114DFF]" />
                <p className="text-gray-600">Clients Served</p>
              </div>
              <span className="text-gray-900">250+</span>
              <p className="text-gray-600 mt-1">Satisfied clients</p>
            </div>

            {/* Projects Completed */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-[#06CB1D]" />
                <p className="text-gray-600">Projects</p>
              </div>
              <span className="text-gray-900">500+</span>
              <p className="text-gray-600 mt-1">Completed</p>
            </div>

            {/* Founded Year */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-[#114DFF]" />
                <p className="text-gray-600">Founded</p>
              </div>
              <span className="text-gray-900">{partner.foundedYear}</span>
              <p className="text-gray-600 mt-1">{new Date().getFullYear() - parseInt(partner.foundedYear)} years experience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industries We Serve */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="mb-4">Industries We Serve</h3>
            {!isEditingIndustries && (
              <Button
                variant="outline"
                className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                onClick={handleEditIndustries}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>
          
          {isEditingIndustries ? (
            <div className="space-y-2">
              {industriesFormData.map((industry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={industry}
                    onChange={(e) => handleEditIndustryName(index, e.target.value)}
                    className="w-full"
                  />
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleRemoveIndustry(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleAddIndustry}
              >
                <Plus className="w-4 h-4" />
                Add Industry
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Technology & SaaS
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Healthcare & MedTech
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                FinTech & Finance
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                E-commerce & Retail
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Education & EdTech
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Real Estate & PropTech
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Manufacturing & IoT
              </Badge>
              <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                Sustainability & GreenTech
              </Badge>
            </div>
          )}

          {isEditingIndustries && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                onClick={handleSaveIndustries}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelIndustries}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#114DFF]" />
              <h3>Certifications & Compliance</h3>
            </div>
            {!isEditingCertifications && (
              <Button
                variant="outline"
                className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                onClick={handleEditCertifications}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>

          {isEditingCertifications ? (
            <div className="space-y-2">
              {certificationsFormData.map(cert => (
                <div key={cert.id} className="flex items-start gap-2 mb-4">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={cert.name}
                      onChange={(e) => handleEditCertification(cert.id, 'name', e.target.value)}
                      className="w-full"
                      placeholder="Certification name"
                    />
                    <Input
                      value={cert.description}
                      onChange={(e) => handleEditCertification(cert.id, 'description', e.target.value)}
                      className="w-full"
                      placeholder="Description"
                    />
                  </div>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white mt-1"
                    onClick={() => handleRemoveCertification(cert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={handleAddCertification}
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#06CB1D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">ISO 27001 Certified</p>
                    <p className="text-gray-600">Information Security Management</p>
                    <Badge className="mt-2 bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#06CB1D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">SOC 2 Type II</p>
                    <p className="text-gray-600">Security, Availability & Confidentiality</p>
                    <Badge className="mt-2 bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#06CB1D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">GDPR Compliant</p>
                    <p className="text-gray-600">Data Protection & Privacy</p>
                    <Badge className="mt-2 bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#06CB1D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 mb-1">AWS Advanced Partner</p>
                    <p className="text-gray-600">Cloud Solutions Provider</p>
                    <Badge className="mt-2 bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isEditingCertifications && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                onClick={handleSaveCertifications}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelCertifications}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Model */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-[#114DFF]" />
            <h3>Pricing Model</h3>
            {!isEditingPricing && (
              <Button
                variant="outline"
                className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                onClick={handleEditPricing}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            )}
          </div>

          {isEditingPricing ? (
            <div className="space-y-4">
              {/* Project-Based */}
              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id="project-based"
                    checked={pricingFormData.projectBased.enabled}
                    onCheckedChange={(checked) => 
                      setPricingFormData(prev => ({ 
                        ...prev, 
                        projectBased: { ...prev.projectBased, enabled: checked as boolean } 
                      }))
                    }
                  />
                  <label htmlFor="project-based" className="text-gray-900 cursor-pointer">
                    Project-Based
                  </label>
                </div>
                {pricingFormData.projectBased.enabled && (
                  <>
                    <p className="text-gray-600 mb-3">Fixed scope, timeline, and budget for defined deliverables</p>
                    <div className="space-y-2">
                      <label className="text-gray-700">
                        <span className="text-gray-900">Price</span> (e.g., $5,000/project or $3,000-$10,000)
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <Input
                          value={pricingFormData.projectBased.price}
                          onChange={(e) => setPricingFormData(prev => ({ 
                            ...prev, 
                            projectBased: { ...prev.projectBased, price: e.target.value } 
                          }))}
                          placeholder="Enter price (e.g., $5,000/project)"
                          className="w-full bg-white border-2 border-[#114DFF] focus:border-[#3CE5A7]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Hourly Consulting */}
              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id="hourly-consulting"
                    checked={pricingFormData.hourlyConsulting.enabled}
                    onCheckedChange={(checked) => 
                      setPricingFormData(prev => ({ 
                        ...prev, 
                        hourlyConsulting: { ...prev.hourlyConsulting, enabled: checked as boolean } 
                      }))
                    }
                  />
                  <label htmlFor="hourly-consulting" className="text-gray-900 cursor-pointer">
                    Hourly Consulting
                  </label>
                </div>
                {pricingFormData.hourlyConsulting.enabled && (
                  <>
                    <p className="text-gray-600 mb-3">Flexible engagement for ongoing support and advisory</p>
                    <div className="space-y-2">
                      <label className="text-gray-700">
                        <span className="text-gray-900">Hourly Rate</span> (e.g., $150/hour or $100-$200/hour)
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <Input
                          value={pricingFormData.hourlyConsulting.price}
                          onChange={(e) => setPricingFormData(prev => ({ 
                            ...prev, 
                            hourlyConsulting: { ...prev.hourlyConsulting, price: e.target.value } 
                          }))}
                          placeholder="Enter hourly rate (e.g., $150/hour)"
                          className="w-full bg-white border-2 border-[#114DFF] focus:border-[#3CE5A7]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Retainer */}
              <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center gap-3 mb-3">
                  <Checkbox
                    id="retainer"
                    checked={pricingFormData.retainer.enabled}
                    onCheckedChange={(checked) => 
                      setPricingFormData(prev => ({ 
                        ...prev, 
                        retainer: { ...prev.retainer, enabled: checked as boolean } 
                      }))
                    }
                  />
                  <label htmlFor="retainer" className="text-gray-900 cursor-pointer">
                    Retainer
                  </label>
                </div>
                {pricingFormData.retainer.enabled && (
                  <>
                    <p className="text-gray-600 mb-3">Monthly packages with dedicated team support</p>
                    <div className="space-y-2">
                      <label className="text-gray-700">
                        <span className="text-gray-900">Monthly Rate</span> (e.g., $8,000/month or $5,000-$15,000/month)
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-500" />
                        <Input
                          value={pricingFormData.retainer.price}
                          onChange={(e) => setPricingFormData(prev => ({ 
                            ...prev, 
                            retainer: { ...prev.retainer, price: e.target.value } 
                          }))}
                          placeholder="Enter monthly rate (e.g., $8,000/month)"
                          className="w-full bg-white border-2 border-[#114DFF] focus:border-[#3CE5A7]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pricingFormData.projectBased.enabled && (
                <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
                    <p className="text-gray-900">Project-Based</p>
                  </div>
                  <p className="text-gray-600 mb-2">Fixed scope, timeline, and budget for defined deliverables</p>
                  <p className="text-gray-900">{pricingFormData.projectBased.price}</p>
                </div>
              )}

              {pricingFormData.hourlyConsulting.enabled && (
                <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
                    <p className="text-gray-900">Hourly Consulting</p>
                  </div>
                  <p className="text-gray-600 mb-2">Flexible engagement for ongoing support and advisory</p>
                  <p className="text-gray-900">{pricingFormData.hourlyConsulting.price}</p>
                </div>
              )}

              {pricingFormData.retainer.enabled && (
                <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-[#06CB1D]" />
                    <p className="text-gray-900">Retainer</p>
                  </div>
                  <p className="text-gray-600 mb-2">Monthly packages with dedicated team support</p>
                  <p className="text-gray-900">{pricingFormData.retainer.price}</p>
                </div>
              )}
            </div>
          )}

          {isEditingPricing && (
            <div className="mt-4 flex items-center gap-2">
              <Button
                className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]"
                onClick={handleSavePricing}
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                className="bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelPricing}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}

          <div className="mt-4 p-4 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
            <p className="text-gray-700">
              <span className="text-gray-900">Starting from:</span> {pricingFormData.projectBased.price}
            </p>
            <p className="text-gray-600 mt-2">Custom quotes available based on project scope and requirements</p>
          </div>
        </CardContent>
      </Card>

      {/* Client Testimonials */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Quote className="w-5 h-5 text-[#114DFF]" />
            <h3>Client Testimonials</h3>
          </div>

          <div className="space-y-4">
            {/* Testimonial 1 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF8C00] text-[#FF8C00]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Outstanding partner! They delivered our cloud infrastructure ahead of schedule and under budget. Their team's expertise in DevOps and scalability was invaluable to our growth."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-full flex items-center justify-center">
                  <span className="text-white">JS</span>
                </div>
                <div>
                  <p className="text-gray-900">John Smith</p>
                  <p className="text-gray-600">CTO, TechStart Innovation Hub</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF8C00] text-[#FF8C00]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The custom CRM solution transformed our business operations. Customer retention increased by 65% and our team productivity doubled. Highly recommend their services!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-full flex items-center justify-center">
                  <span className="text-white">MJ</span>
                </div>
                <div>
                  <p className="text-gray-900">Maria Johnson</p>
                  <p className="text-gray-600">CEO, GreenEco Solutions</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FF8C00] text-[#FF8C00]" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Exceptional work on our telehealth platform. HIPAA compliance handled flawlessly, and the system has maintained 99.9% uptime serving over 10,000 patients. True professionals."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-full flex items-center justify-center">
                  <span className="text-white">DP</span>
                </div>
                <div>
                  <p className="text-gray-900">Dr. David Park</p>
                  <p className="text-gray-600">Medical Director, HealthFirst Medical</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#114DFF]" />
              <h3>Services Offered</h3>
            </div>
            <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
              {services.filter(s => s.status === 'active').length} Active
            </Badge>
          </div>
          
          <div className="space-y-4">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF] hover:border-[#114DFF] transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#114DFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 mb-1">{service.title}</p>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{service.viewCount} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">{service.inquiryCount} inquiries</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 mb-1">{service.pricing}</p>
                    <Badge className={
                      service.status === 'active'
                        ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]'
                        : 'bg-[#F5F5F5] text-gray-600 border-[#CCCCCC]'
                    }>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {services.length > 6 && (
            <div className="mt-4 text-center">
              <Button variant="outline" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                View All Services ({services.length})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#114DFF]" />
              <h3>Portfolio & Case Studies</h3>
            </div>
            <Button className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
              <Edit className="w-4 h-4" />
              Add Case Study
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Study 1 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">TechStart Innovation Hub</p>
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    Technology
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Provided cloud infrastructure setup and DevOps consulting to accelerate product launch by 40%.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Result</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#06CB1D]" />
                    <span className="text-[#06CB1D]">40% faster</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Duration</p>
                  <p className="text-gray-900">3 months</p>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">GreenEco Solutions</p>
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    Sustainability
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Developed custom CRM solution that increased customer retention by 65% and streamlined operations.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Result</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#06CB1D]" />
                    <span className="text-[#06CB1D]">65% retention</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Duration</p>
                  <p className="text-gray-900">6 months</p>
                </div>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">HealthFirst Medical</p>
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    Healthcare
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Implemented HIPAA-compliant telehealth platform serving 10,000+ patients with 99.9% uptime.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Result</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#06CB1D]" />
                    <span className="text-[#06CB1D]">10K+ users</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Duration</p>
                  <p className="text-gray-900">8 months</p>
                </div>
              </div>
            </div>

            {/* Case Study 4 */}
            <div className="p-4 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">FinanceFlow App</p>
                  <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                    FinTech
                  </Badge>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Built secure payment processing infrastructure handling $2M+ monthly transactions with zero fraud.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Result</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#06CB1D]" />
                    <span className="text-[#06CB1D]">$2M+ monthly</span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-[#C8D6FF]">
                  <p className="text-gray-600 mb-1">Duration</p>
                  <p className="text-gray-900">5 months</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}