import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Eye,
  Inbox,
  Package,
  X,
  TrendingUp,
  Calendar,
  Globe,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PartnerStatsProps {
  stats: {
    profileViews: number;
    totalLeads: number;
    newLeads: number;
    activeServices: number;
    conversionRate: number;
    totalRevenue?: number;
  };
  onNavigateToLeadsInbox?: () => void;
}

type StatType = 'Profile Views' | 'Total Leads' | 'Active Services' | null;

export function PartnerStats({ stats, onNavigateToLeadsInbox }: PartnerStatsProps) {
  const [selectedStat, setSelectedStat] = useState<StatType>(null);

  const statCards = [
    {
      title: 'Profile Views' as const,
      value: stats.profileViews,
      icon: Eye,
      color: 'bg-[#EDF2FF] text-[#114DFF]',
      iconColor: 'text-[#114DFF]',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Leads' as const,
      value: stats.totalLeads,
      icon: Inbox,
      color: 'bg-[#F7F9FF] text-[#114DFF]',
      iconColor: 'text-[#114DFF]',
      urgent: stats.newLeads > 0,
      badge: stats.newLeads > 0 ? `${stats.newLeads} new` : undefined,
    },
    {
      title: 'Active Services' as const,
      value: stats.activeServices,
      icon: Package,
      color: 'bg-[#EDF2FF] text-[#3CE5A7]',
      iconColor: 'text-[#3CE5A7]',
    },
  ];

  // Mock data for detailed views
  const profileViewsData = {
    trends: [
      { period: 'Today', views: 47, change: '+15%' },
      { period: 'This Week', views: 285, change: '+12%' },
      { period: 'This Month', views: 1247, change: '+8%' },
    ],
    topSources: [
      { source: 'Direct Search', views: 487, percentage: 39 },
      { source: 'LinkedIn Referral', views: 356, percentage: 29 },
      { source: 'Google Search', views: 234, percentage: 19 },
      { source: 'Partner Directory', views: 170, percentage: 13 },
    ],
  };

  const leadsData = [
    { id: 1, company: 'TechStart Inc', contact: 'Sarah Chen', service: 'Cloud Infrastructure', status: 'new', date: '2 hours ago' },
    { id: 2, company: 'GreenVenture', contact: 'Mike Johnson', service: 'Marketing Strategy', status: 'contacted', date: '1 day ago' },
    { id: 3, company: 'FinTech Pro', contact: 'Emily Davis', service: 'Financial Planning', status: 'qualified', date: '2 days ago' },
    { id: 4, company: 'HealthCo', contact: 'David Lee', service: 'Legal Services', status: 'proposal', date: '3 days ago' },
    { id: 5, company: 'EduSmart', contact: 'Lisa Wang', service: 'HR Consulting', status: 'negotiation', date: '5 days ago' },
  ];

  const servicesData = [
    { name: 'Cloud Infrastructure', status: 'active', leads: 12, conversions: 5, rating: 4.8 },
    { name: 'Marketing Strategy', status: 'active', leads: 8, conversions: 3, rating: 4.9 },
    { name: 'Financial Planning', status: 'active', leads: 6, conversions: 2, rating: 4.7 },
    { name: 'Legal Services', status: 'paused', leads: 4, conversions: 1, rating: 4.6 },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]';
      case 'contacted':
        return 'bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]';
      case 'qualified':
        return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      case 'proposal':
      case 'negotiation':
        return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      case 'active':
        return 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]';
      case 'paused':
        return 'bg-[#F5F5F5] text-gray-600 border-[#CCCCCC]';
      default:
        return 'bg-[#F5F5F5] text-gray-600 border-[#CCCCCC]';
    }
  };

  const renderDetailedView = () => {
    if (!selectedStat) return null;

    switch (selectedStat) {
      case 'Profile Views':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-gray-900 mb-4">View Trends</h4>
              <div className="grid grid-cols-3 gap-4">
                {profileViewsData.trends.map((trend, index) => (
                  <Card key={index} className="border-[#C8D6FF]">
                    <CardContent className="p-4">
                      <p className="text-gray-600 mb-2">{trend.period}</p>
                      <h3 className="text-gray-900 mb-1">{trend.views}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-[#06CB1D]" />
                        <span className="text-[#06CB1D]">{trend.change}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-gray-900 mb-4">Top Traffic Sources</h4>
              <div className="space-y-3">
                {profileViewsData.topSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-[#114DFF]" />
                      <div>
                        <p className="text-gray-900">{source.source}</p>
                        <p className="text-gray-600">{source.views} views</p>
                      </div>
                    </div>
                    <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]">
                      {source.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Total Leads':
        return (
          <div className="space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-[#F7F9FF]">
                <TabsTrigger value="all">All Leads</TabsTrigger>
                <TabsTrigger value="new">New ({stats.newLeads})</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-3 mt-4">
                {leadsData.map((lead) => (
                  <Card key={lead.id} className="border-[#C8D6FF] hover:border-[#114DFF] transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-gray-900">{lead.company}</h4>
                            <Badge className={getStatusBadgeClass(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{lead.contact}</p>
                          <p className="text-gray-600">Service: {lead.service}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{lead.date}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="new" className="mt-4">
                <p className="text-gray-600 text-center py-8">
                  {stats.newLeads} new leads requiring attention
                </p>
              </TabsContent>
              
              <TabsContent value="active" className="mt-4">
                <p className="text-gray-600 text-center py-8">
                  Active leads in progress
                </p>
              </TabsContent>
              
              <TabsContent value="closed" className="mt-4">
                <p className="text-gray-600 text-center py-8">
                  No closed leads yet
                </p>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'Active Services':
        return (
          <div className="space-y-4">
            {servicesData.map((service, index) => (
              <Card key={index} className="border-[#C8D6FF]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-gray-900">{service.name}</h4>
                        <Badge className={getStatusBadgeClass(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-[#FF8C00]">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                      <p className="text-gray-600 mb-1">Total Leads</p>
                      <h4 className="text-gray-900">{service.leads}</h4>
                    </div>
                    <div className="p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                      <p className="text-gray-600 mb-1">Conversions</p>
                      <h4 className="text-gray-900">{service.conversions}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden border-[#C8D6FF] shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-gray-900">
                    {stat.value}
                  </h3>
                  {stat.badge && (
                    <Badge className="mt-2 bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]">
                      {stat.badge}
                    </Badge>
                  )}
                  {stat.change && (
                    <p className={`mt-1 ${
                      stat.changeType === 'positive' ? 'text-[#06CB1D]' : 'text-[#FF220E]'
                    }`}>
                      {stat.change}
                    </p>
                  )}
                </div>
                <div 
                  className={`p-2 rounded-lg ${stat.color} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => {
                    if (stat.title === 'Total Leads' && onNavigateToLeadsInbox) {
                      onNavigateToLeadsInbox();
                    } else {
                      setSelectedStat(stat.title);
                    }
                  }}
                  role="button"
                  aria-label={`View details for ${stat.title}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              {stat.urgent && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF220E] rounded-full animate-pulse" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedStat} onOpenChange={() => setSelectedStat(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {selectedStat} Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedStat === 'Profile Views' && 'View detailed analytics and traffic sources for your profile'}
              {selectedStat === 'Total Leads' && 'Manage and track all your incoming leads'}
              {selectedStat === 'Active Services' && 'Monitor performance of your service offerings'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            {renderDetailedView()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}