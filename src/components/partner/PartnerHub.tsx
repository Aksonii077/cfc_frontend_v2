import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { usePartner } from '../../contexts/PartnerContext';
import { useLeads } from '../../hooks/useLeads';
import { useServices } from '../../hooks/useServices';
import { mockActivities, mockAnalytics } from '../../utils/partner/mockPartnerData';
import { PartnerStats } from './PartnerStats';
import { 
  Eye, 
  Inbox, 
  Handshake, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Package,
  BarChart3,
  Activity,
  Building2,
  Star
} from 'lucide-react';

interface PartnerHubProps {
  onNavigateToLeadsInbox?: () => void;
}

export function PartnerHub({ onNavigateToLeadsInbox }: PartnerHubProps) {
  const { partner } = usePartner();
  const { leads } = useLeads();
  const { services } = useServices();

  // Calculate metrics
  const totalProfileViews = mockAnalytics.reduce((sum, a) => sum + (a.profileViews || 0), 0);
  const totalLeads = leads.length;
  const activeServices = services.filter(s => s.status === 'active').length;

  // Lead status counts
  const newLeads = leads.filter(l => l.status === 'new').length;
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;

  // Conversion rate
  const conversionRate = totalLeads > 0 ? parseFloat(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

  // Total revenue (mock)
  const totalRevenue = 47500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900">Partner Dashboard</h1>
                <p className="text-gray-600">
                  Powered by RACE AI • Manage Services, Leads & Partnerships
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] gap-1">
              <CheckCircle className="w-4 h-4" />
              {partner?.status || 'Active'}
            </Badge>
            <Badge variant="outline" className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] gap-1">
              <Package className="w-4 h-4" />
              {activeServices} Services
            </Badge>
            <Badge variant="outline" className="bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8] gap-1">
              <Inbox className="w-4 h-4" />
              {newLeads} New Leads
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <PartnerStats 
        stats={{
          profileViews: totalProfileViews,
          totalLeads,
          newLeads,
          activeServices,
          conversionRate,
          totalRevenue,
        }}
        onNavigateToLeadsInbox={onNavigateToLeadsInbox}
      />

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Services */}
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[#114DFF]" />
              <h3>Top Services</h3>
            </div>
            <div className="space-y-4">
              {services.slice(0, 3).map((service) => (
                <div key={service.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EDF2FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-[#114DFF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{service.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-500">{service.viewCount} views</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{service.inquiryCount} inquiries</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[#114DFF]" />
              <h3>Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {mockActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#EDF2FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-[#114DFF]" />
                  </div>
                  <div className="flex-1">
                    <p>{activity.description}</p>
                    <p className="text-gray-500 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-6">
            <h3 className="mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
                <Inbox className="w-4 h-4" />
                View {newLeads} New Leads
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                <CheckCircle className="w-4 h-4" />
                Complete Profile ({partner?.profileCompletionPercentage}%)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]">
                <BarChart3 className="w-4 h-4" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}