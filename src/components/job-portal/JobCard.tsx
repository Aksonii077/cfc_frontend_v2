import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  CalendarDays, 
  ChevronRight,
  Settings
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Job, formatSalary, getLocationIcon, getJobType, getExperienceLevel } from '../../config/jobPortal.config'

interface JobCardProps {
  job: Job
  onJobClick: (job: Job) => void
  onApplyClick?: (job: Job) => void
  onManageClick?: (job: Job) => void
  showApplyButton?: boolean
  showManageButton?: boolean
}

export function JobCard({ 
  job, 
  onJobClick, 
  onApplyClick, 
  onManageClick, 
  showApplyButton = false,
  showManageButton = false 
}: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onJobClick(job)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-medium">
                {job.company.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium group-hover:text-primary transition-colors">{job.title}</h3>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {getLocationIcon(job.locationType)} {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatSalary(job.salary, job.salaryType)}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {job.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{getJobType(job.jobType)}</Badge>
                  <Badge variant="outline">{getExperienceLevel(job.experience)} level</Badge>
                  <Badge variant="outline">{job.department}</Badge>
                  {job.applicationCount > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  {job.applicationDeadline && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4 flex flex-col gap-2">
            {showApplyButton && onApplyClick && (
              <Button 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation()
                  onApplyClick(job)
                }}
              >
                Apply
              </Button>
            )}
            {showManageButton && onManageClick && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onManageClick(job)
                }}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage Applications
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}