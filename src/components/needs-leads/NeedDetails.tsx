import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Clock, 
  Eye, 
  Users, 
  DollarSign,
  RefreshCw,
  Calendar,
  AlertCircle,
  Settings,
  Heart,
  Share
} from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { 
  Need,
  getCategoryInfo, 
  getUrgencyInfo, 
  getTypeInfo, 
  formatBudget, 
  formatSkillsOffered, 
  getTimeAgo,
  canUserRespondToNeed,
  canUserManageNeed,
  isNeedExpired
} from '../../config/needsLeads.config'
import { projectId } from '../../utils/supabase/info'
import { createClient } from '../../utils/supabase/client'
import { toast } from 'sonner@2.0.3'

// Mock mode for when server is not available
const MOCK_MODE = true

interface NeedDetailsProps {
  need: Need
  onBack: () => void
  onRespond: () => void
  onManage: () => void
  canRespond: boolean
  userProfile: any
}

export function NeedDetails({ 
  need, 
  onBack, 
  onRespond, 
  onManage, 
  canRespond, 
  userProfile 
}: NeedDetailsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [viewCount, setViewCount] = useState(need.viewCount)
  
  const supabase = createClient()
  const categoryInfo = getCategoryInfo(need.category)
  const urgencyInfo = getUrgencyInfo(need.urgency)
  const typeInfo = getTypeInfo(need.type)
  const canManageThis = canUserManageNeed(need, userProfile)
  const canRespondToThis = canUserRespondToNeed(need, userProfile)
  const isExpired = isNeedExpired(need)

  useEffect(() => {
    // Increment view count
    incrementViewCount()
  }, [need.id])

  const incrementViewCount = async () => {
    try {
      if (MOCK_MODE) {
        setViewCount(prev => prev + 1)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-d1c33be8/needs/${need.id}/view`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: need.title,
        text: need.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Need Details</h2>
            <p className="text-muted-foreground">Review the requirements and details</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBookmark}>
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      {isExpired && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">This need has expired</span>
            </div>
          </CardContent>
        </Card>
      )}

      {need.status !== 'active' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">
                This need is currently {need.status}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white">
                    <span className="text-xl">{categoryInfo.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{need.title}</CardTitle>
                    <CardDescription>{categoryInfo.label}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={typeInfo.value === 'barter' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {typeInfo.icon} {typeInfo.label}
                  </Badge>
                  <Badge className={urgencyInfo.color}>
                    {urgencyInfo.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {need.description}
              </p>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {need.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exchange/Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {need.type === 'barter' ? 'Skills Exchange' : 'Payment Details'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {need.type === 'barter' && need.skillsOffered ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">Skills offered in exchange:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {need.skillsOffered.map((skill, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a skill exchange opportunity. You can offer your expertise in exchange for the poster's skills.
                  </p>
                </div>
              ) : need.type === 'paid' && need.budget ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">Budget:</span>
                    <span className="text-lg">{formatBudget(need.budget, need.budgetType || 'fixed')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This is a paid project opportunity.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Details to be discussed</p>
              )}
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Duration</h4>
                  <p className="text-muted-foreground">{need.duration}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Urgency</h4>
                  <Badge className={urgencyInfo.color}>
                    {urgencyInfo.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{urgencyInfo.description}</p>
                </div>
              </div>
              
              {need.expiresAt && (
                <div>
                  <h4 className="font-medium mb-1">Application Deadline</h4>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(need.expiresAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster Info */}
          <Card>
            <CardHeader>
              <CardTitle>Posted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback>
                    {need.posterName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{need.posterName}</h4>
                  <p className="text-sm text-muted-foreground">{need.posterRole}</p>
                  {need.posterCompany && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" />
                      {need.posterCompany}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Work Arrangement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {need.isRemote ? '🌐 Remote Work' : need.location || 'Location TBD'}
                </span>
              </div>
              {need.isRemote && (
                <p className="text-xs text-muted-foreground mt-2">
                  This opportunity supports remote collaboration
                </p>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  Views
                </span>
                <span className="font-medium">{viewCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  Interested
                </span>
                <span className="font-medium">{need.leadCount}</span>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Posted
                </span>
                <span className="text-sm">{getTimeAgo(need.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {canRespondToThis && canRespond && (
                  <Button onClick={onRespond} className="w-full" size="lg">
                    Show Interest
                  </Button>
                )}
                
                {canManageThis && (
                  <Button 
                    onClick={onManage} 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Manage Leads ({need.leadCount})
                  </Button>
                )}
                
                {!canRespondToThis && !canManageThis && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {need.postedBy === userProfile?.id || need.postedBy === userProfile?.roleId
                        ? "This is your posted need"
                        : isExpired
                        ? "This need has expired"
                        : need.status !== 'active'
                        ? "This need is not active"
                        : "You cannot respond to this need"
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}