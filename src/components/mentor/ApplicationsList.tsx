import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  Building,
  MapPin,
  DollarSign,
  Users,
} from "lucide-react";

interface Application {
  id: string;
  companyName: string;
  founderName: string;
  industry: string;
  stage: string;
  fundingNeeded: string;
  location: string;
  submittedDate: string;
  status: "new" | "reviewing" | "shortlisted";
  score: number;
}

export function ApplicationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const applications: Application[] = [
    {
      id: "1",
      companyName: "TechFlow AI",
      founderName: "Sarah Chen",
      industry: "AI/ML",
      stage: "Pre-seed",
      fundingNeeded: "$500K",
      location: "San Francisco, CA",
      submittedDate: "2024-01-15",
      status: "new",
      score: 85,
    },
    {
      id: "2",
      companyName: "EcoGrow",
      founderName: "Michael Torres",
      industry: "AgriTech",
      stage: "Seed",
      fundingNeeded: "$1M",
      location: "Austin, TX",
      submittedDate: "2024-01-14",
      status: "reviewing",
      score: 92,
    },
    {
      id: "3",
      companyName: "HealthBridge",
      founderName: "Emily Watson",
      industry: "HealthTech",
      stage: "Pre-seed",
      fundingNeeded: "$750K",
      location: "Boston, MA",
      submittedDate: "2024-01-13",
      status: "shortlisted",
      score: 88,
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.founderName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "reviewing":
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
      case "shortlisted":
        return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      default:
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-[#06CB1D]";
    if (score >= 70) return "text-[#114DFF]";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Applications Inbox</h2>
        <p className="text-gray-600">Review and manage incoming startup applications</p>
      </div>

      {/* Filters */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by company or founder name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#C8D6FF]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#114DFF]" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-[#C8D6FF] rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card
            key={app.id}
            className="border-[#C8D6FF] hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.companyName}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`w-4 h-4 ${getScoreColor(app.score)}`} />
                      <span className={`font-semibold ${getScoreColor(app.score)}`}>
                        {app.score}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">
                    Founded by <span className="font-medium">{app.founderName}</span>
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4 text-[#114DFF]" />
                      <span>{app.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-[#114DFF]" />
                      <span>{app.stage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-[#06CB1D]" />
                      <span>{app.fundingNeeded}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-[#114DFF]" />
                      <span>{app.location}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                >
                  <Eye className="w-4 h-4" />
                  Review
                </Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#C8D6FF]">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Submitted {app.submittedDate}</span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-[#114DFF] hover:bg-[#EDF2FF]"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "New applications will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}