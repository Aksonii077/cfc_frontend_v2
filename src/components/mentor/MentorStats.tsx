import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Inbox,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

interface MentorStatsProps {
  stats: {
    totalApplications: number;
    pendingReview: number;
    interviewsScheduled: number;
    accepted: number;
    currentPortfolio: number;
    avgRating: number;
  };
}

export function MentorStats({ stats }: MentorStatsProps) {
  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Inbox,
      color: "bg-[#EDF2FF] text-[#114DFF]",
      iconColor: "text-[#114DFF]",
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      color: "bg-[#F7F9FF] text-[#114DFF]",
      iconColor: "text-[#114DFF]",
      urgent: stats.pendingReview > 0,
    },
    {
      title: "Interviews Scheduled",
      value: stats.interviewsScheduled,
      icon: Calendar,
      color: "bg-[#EDF2FF] text-[#114DFF]",
      iconColor: "text-[#114DFF]",
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      color: "bg-[#EDF2FF] text-[#06CB1D]",
      iconColor: "text-[#06CB1D]",
    },
    {
      title: "Portfolio Companies",
      value: stats.currentPortfolio,
      icon: Users,
      color: "bg-[#F7F9FF] text-[#3CE5A7]",
      iconColor: "text-[#3CE5A7]",
    },
    {
      title: "Success Rate",
      value: `${Math.round((stats.accepted / stats.totalApplications) * 100)}%`,
      icon: TrendingUp,
      color: "bg-[#EDF2FF] text-[#06CB1D]",
      iconColor: "text-[#06CB1D]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            {stat.urgent && (
              <Badge variant="destructive" className="absolute top-2 right-2 h-2 w-2 p-0">
                <span className="sr-only">Urgent</span>
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}