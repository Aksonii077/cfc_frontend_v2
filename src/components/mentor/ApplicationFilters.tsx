import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";

interface ApplicationFiltersProps {
  statusFilter: string;
  industryFilter: string;
  stageFilter: string;
  minScore: number;
  onStatusChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onStageChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
}

export function ApplicationFilters({
  statusFilter,
  industryFilter,
  stageFilter,
  minScore,
  onStatusChange,
  onIndustryChange,
  onStageChange,
  onMinScoreChange,
}: ApplicationFiltersProps) {
  return (
    <div className="mt-4 pt-4 border-t">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Status
          </Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="reviewing">Under Review</SelectItem>
              <SelectItem value="interview-scheduled">Interview Scheduled</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Industry
          </Label>
          <Select value={industryFilter} onValueChange={onIndustryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              <SelectItem value="CleanTech">CleanTech</SelectItem>
              <SelectItem value="HealthTech">HealthTech</SelectItem>
              <SelectItem value="AgTech">AgTech</SelectItem>
              <SelectItem value="FinTech">FinTech</SelectItem>
              <SelectItem value="EdTech">EdTech</SelectItem>
              <SelectItem value="RetailTech">RetailTech</SelectItem>
              <SelectItem value="FoodTech">FoodTech</SelectItem>
              <SelectItem value="PropTech">PropTech</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="AI/ML">AI/ML</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Stage
          </Label>
          <Select value={stageFilter} onValueChange={onStageChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Idea">Idea</SelectItem>
              <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="Series B">Series B</SelectItem>
              <SelectItem value="Growth">Growth</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Minimum AI Score: {minScore}
          </Label>
          <div className="pt-2">
            <Slider
              value={[minScore]}
              onValueChange={(value) => onMinScoreChange(value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}