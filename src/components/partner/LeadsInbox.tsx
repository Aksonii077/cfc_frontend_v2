import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useLeads } from '../../hooks/useLeads';
import { 
  Inbox,
  Filter,
  Search,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Star
} from 'lucide-react';

export function LeadsInbox() {
  const { leads } = useLeads();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && lead.priority !== priorityFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]';
      case 'contacted': return 'bg-[#EDF2FF] text-[#3CE5A7] border-[#C8D6FF]';
      case 'qualified': return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      case 'proposal_sent': return 'bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]';
      case 'won': return 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]';
      case 'lost': return 'bg-[#FFE5E5] text-[#FF220E] border-[#FF220E]/30';
      default: return 'bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-[#FF220E]';
      case 'medium': return 'text-[#FF8C00]';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Leads Inbox</h2>
          <p className="text-gray-600">Manage and respond to potential partnership inquiries</p>
        </div>
        <Badge className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white border-0">
          {filteredLeads.length} Leads
        </Badge>
      </div>

      {/* Filters */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">Filters:</span>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-[#C8D6FF] rounded-lg bg-white text-gray-700"
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-1 border border-[#C8D6FF] rounded-lg bg-white text-gray-700"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <Button variant="outline" size="sm" className="ml-auto gap-2 border-[#C8D6FF]">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="border-[#C8D6FF] hover:border-[#114DFF] transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{lead.contactName}</h3>
                        <Star className={`w-4 h-4 ${getPriorityColor(lead.priority)}`} fill="currentColor" />
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{lead.contactEmail}</span>
                        {lead.contactPhone && (
                          <>
                            <span className="text-gray-400">•</span>
                            <Phone className="w-4 h-4" />
                            <span>{lead.contactPhone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(lead.status)}>
                        {formatStatus(lead.status)}
                      </Badge>
                      {lead.dealValue && (
                        <Badge className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] gap-1">
                          <DollarSign className="w-3 h-3" />
                          {lead.dealValue.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 mb-3">{lead.message}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    {lead.budgetIndication && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>Budget: {lead.budgetIndication}</span>
                      </>
                    )}
                    {lead.urgency && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>Urgency: {lead.urgency.replace('_', ' ')}</span>
                      </>
                    )}
                  </div>

                  {/* Tags */}
                  {lead.tags && lead.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      {lead.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-[#F7F9FF] text-gray-700 border-[#C8D6FF]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f]">
                    <Inbox className="w-4 h-4" />
                    Respond
                  </Button>
                  <Button variant="outline" size="sm" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredLeads.length === 0 && (
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-12 text-center">
              <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for new inquiries.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
