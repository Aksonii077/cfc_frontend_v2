import { Search, Filter, MapPin, Clock, DollarSign } from 'lucide-react'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { FILTER_OPTIONS } from '../../config/needsLeads.config'

interface NeedsFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  urgencyFilter: string
  setUrgencyFilter: (urgency: string) => void
  locationFilter: string
  setLocationFilter: (location: string) => void
}

export function NeedsFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  typeFilter,
  setTypeFilter,
  urgencyFilter,
  setUrgencyFilter,
  locationFilter,
  setLocationFilter
}: NeedsFiltersProps) {
  const activeFilters = [
    categoryFilter !== 'all' && { label: `Category: ${categoryFilter}`, clear: () => setCategoryFilter('all') },
    typeFilter !== 'all' && { label: `Type: ${typeFilter}`, clear: () => setTypeFilter('all') },
    urgencyFilter !== 'all' && { label: `Urgency: ${urgencyFilter}`, clear: () => setUrgencyFilter('all') },
    locationFilter !== 'all' && { label: `Location: ${locationFilter}`, clear: () => setLocationFilter('all') }
  ].filter(Boolean)

  const clearAllFilters = () => {
    setCategoryFilter('all')
    setTypeFilter('all')
    setUrgencyFilter('all')
    setLocationFilter('all')
    setSearchTerm('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search needs by title, description, skills, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.category.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.type.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <SelectValue placeholder="Urgency" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.urgency.map(urgency => (
                    <SelectItem key={urgency.value} value={urgency.value}>
                      {urgency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <SelectValue placeholder="Location" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.location.map(location => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter: any, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={filter.clear}
                  >
                    {filter.label} ×
                  </Badge>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}