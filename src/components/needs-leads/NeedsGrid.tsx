import { 
  Building2, 
  MapPin, 
  Clock, 
  Eye, 
  Users, 
  ChevronRight,
  Settings,
  Lightbulb,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Need,
  getCategoryInfo, 
  getUrgencyInfo, 
  getTypeInfo, 
  formatBudget, 
  formatSkillsOffered, 
  getTimeAgo,
  canUserRespondToNeed,
  canUserManageNeed
} from '../../config/needsLeads.config'

interface NeedsGridProps {
  needs: Need[]
  onNeedClick: (need: Need) => void
  onRespondClick?: (need: Need) => void
  onManageClick?: (need: Need) => void
  userProfile: any
  showManageButton?: boolean
  loading?: boolean
}

export function NeedsGrid({ 
  needs, 
  onNeedClick, 
  onRespondClick, 
  onManageClick,
  userProfile,
  showManageButton = false,
  loading = false 
}: NeedsGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (needs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Lightbulb className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No needs found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or check back later for new opportunities.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {needs.map((need) => {
        const categoryInfo = getCategoryInfo(need.category)
        const urgencyInfo = getUrgencyInfo(need.urgency)
        const typeInfo = getTypeInfo(need.type)
        const canRespond = canUserRespondToNeed(need, userProfile)
        const canManage = canUserManageNeed(need, userProfile)

        return (
          <Card key={need.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
            <CardContent className="p-6">
              <div onClick={() => onNeedClick(need)} className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-xl flex items-center justify-center text-white shadow-md">
                      <span className="text-lg">{categoryInfo.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={typeInfo.value === 'barter' ? 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]' : 'bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]'}>
                          {typeInfo.icon} {typeInfo.label}
                        </Badge>
                        <Badge variant="outline" className={urgencyInfo.color}>
                          {urgencyInfo.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#114DFF] transition-colors" />
                </div>

                {/* Title and Description */}
                <div>
                  <h3 className="mb-2 line-clamp-2 group-hover:text-[#114DFF] transition-colors">
                    {need.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3 leading-relaxed">
                    {need.description}
                  </p>
                </div>

                {/* Skills Required */}
                <div>
                  <h4 className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Skills Required</h4>
                  <div className="flex flex-wrap gap-2">
                    {need.skillsRequired.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                        {skill}
                      </Badge>
                    ))}
                    {need.skillsRequired.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]">
                        +{need.skillsRequired.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Exchange/Payment Info */}
                <div>
                  {need.type === 'barter' && need.skillsOffered ? (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Skills Offered</h4>
                      <p className="text-sm text-[#06CB1D]">
                        <RefreshCw className="w-3 h-3 inline mr-1" />
                        {formatSkillsOffered(need.skillsOffered)}
                      </p>
                    </div>
                  ) : need.type === 'paid' && need.budget ? (
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Budget</h4>
                      <p className="text-sm text-[#114DFF]">
                        <DollarSign className="w-3 h-3 inline mr-1" />
                        {formatBudget(need.budget, need.budgetType || 'fixed')}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Company and Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {need.posterCompany && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {need.posterCompany}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {need.isRemote ? '🌐 Remote' : need.location || 'Location TBD'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {getTimeAgo(need.createdAt)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {need.viewCount}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {need.leadCount} interested
                      </span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="pt-2 border-t border-[#C8D6FF]">
                  <p className="text-xs text-gray-600">
                    <strong>Duration:</strong> {need.duration}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#C8D6FF]">
                {canRespond && onRespondClick && (
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      onRespondClick(need)
                    }}
                    className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                  >
                    Show Interest
                  </Button>
                )}
                
                {(showManageButton || canManage) && onManageClick && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onManageClick(need)
                    }}
                    className="flex items-center gap-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                  >
                    <Settings className="w-3 h-3" />
                    Manage Leads ({need.leadCount})
                  </Button>
                )}
                
                {!canRespond && !canManage && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNeedClick(need)}
                    className="flex-1 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}