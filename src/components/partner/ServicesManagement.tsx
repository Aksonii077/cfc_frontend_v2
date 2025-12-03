import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useServices } from '../../hooks/useServices';
import { 
  Package,
  Plus,
  Edit,
  Eye,
  MessageSquare,
  DollarSign,
  Star
} from 'lucide-react';

export function ServicesManagement() {
  const { services } = useServices();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technology': return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]';
      case 'marketing': return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      case 'design': return 'bg-[#FFE5E5] text-[#FF220E] border-[#FF220E]/30';
      case 'consulting': return 'bg-[#EDF2FF] text-[#3CE5A7] border-[#C8D6FF]';
      default: return 'bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Services Management</h2>
          <p className="text-gray-600">Create and manage your service offerings</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="border-[#C8D6FF] hover:border-[#114DFF] transition-colors">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{service.title}</h3>
                    {service.isFeatured && (
                      <Star className="w-4 h-4 text-[#FF8C00]" fill="currentColor" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(service.category)}>
                      {service.category}
                    </Badge>
                    <Badge className={
                      service.status === 'active' 
                        ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]'
                        : 'bg-[#F5F5F5] text-gray-600 border-[#CCCCCC]'
                    }>
                      {service.status}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 line-clamp-2">{service.shortDescription}</p>

              {/* Pricing */}
              <div className="mb-4 p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#114DFF]" />
                    <span className="text-gray-900">
                      ${service.priceAmount.toLocaleString()}
                    </span>
                    {service.billingFrequency !== 'one_time' && (
                      <span className="text-gray-600">/{service.billingFrequency}</span>
                    )}
                  </div>
                  {service.hasSpecialOffer && (
                    <Badge className="bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]">
                      Special Offer
                    </Badge>
                  )}
                </div>
              </div>

              {/* Special Offer Details */}
              {service.hasSpecialOffer && service.specialOfferDetails && (
                <div className="mb-4 p-3 bg-[#FFF7ED] rounded-lg border border-[#FFD4A8]">
                  <p className="text-[#FF8C00]">{service.specialOfferDetails.terms}</p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#EDF2FF] rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#114DFF]" />
                  </div>
                  <div>
                    <p className="text-gray-900">{service.viewCount}</p>
                    <p className="text-gray-500">Views</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#EDF2FF] rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#114DFF]" />
                  </div>
                  <div>
                    <p className="text-gray-900">{service.inquiryCount}</p>
                    <p className="text-gray-500">Inquiries</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#C8D6FF]">
                <Button variant="outline" size="sm" className="flex-1 gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No services yet</h3>
            <p className="text-gray-600 mb-4">Create your first service offering to start receiving inquiries.</p>
            <Button className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
              <Plus className="w-4 h-4" />
              Create Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
