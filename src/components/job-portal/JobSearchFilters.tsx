import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FILTER_OPTIONS } from '../../config/jobPortal.config'

interface JobSearchFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  locationFilter: string
  setLocationFilter: (filter: string) => void
  jobTypeFilter: string
  setJobTypeFilter: (filter: string) => void
  experienceFilter: string
  setExperienceFilter: (filter: string) => void
}

export function JobSearchFilters({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  jobTypeFilter,
  setJobTypeFilter,
  experienceFilter,
  setExperienceFilter
}: JobSearchFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Search & Filter Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search jobs by title, company, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.location.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.jobType.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.experience.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}