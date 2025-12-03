import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  User,
  FileText,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Interview {
  id: string;
  companyName: string;
  founderName: string;
  date: string;
  time: string;
  type: "video" | "in-person";
  location?: string;
  meetingLink?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export function InterviewsList() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  // Mock data
  const interviews: Interview[] = [
    {
      id: "1",
      companyName: "TechFlow AI",
      founderName: "Sarah Chen",
      date: "2024-01-20",
      time: "10:00 AM",
      type: "video",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      status: "scheduled",
    },
    {
      id: "2",
      companyName: "EcoGrow",
      founderName: "Michael Torres",
      date: "2024-01-22",
      time: "2:00 PM",
      type: "in-person",
      location: "Innovation Hub, 123 Main St",
      status: "scheduled",
    },
    {
      id: "3",
      companyName: "HealthBridge",
      founderName: "Emily Watson",
      date: "2024-01-18",
      time: "11:00 AM",
      type: "video",
      meetingLink: "https://meet.google.com/xyz-abcd-efg",
      status: "completed",
      notes: "Strong technical team, good market fit",
    },
  ];

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return interview.status === "scheduled";
    if (filter === "completed") return interview.status === "completed";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "completed":
        return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      case "cancelled":
        return "bg-[#F5F5F5] text-[#FF220E] border-[#CCCCCC]";
      default:
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Interviews Schedule</h2>
        <p className="text-gray-600">Manage your interview schedule and meeting notes</p>
      </div>

      {/* Filter Tabs */}
      <Card className="border-[#C8D6FF]">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={
                filter === "all"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              All Interviews
            </Button>
            <Button
              variant={filter === "upcoming" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("upcoming")}
              className={
                filter === "upcoming"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Upcoming
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={
                filter === "completed"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Completed
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Interviews List */}
      <div className="space-y-4">
        {filteredInterviews.map((interview) => (
          <Card
            key={interview.id}
            className="border-[#C8D6FF] hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {interview.companyName}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(interview.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(interview.status)}
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="w-4 h-4" />
                    <span>{interview.founderName}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-[#114DFF]" />
                      <span>{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-[#114DFF]" />
                      <span>{interview.time}</span>
                    </div>
                    {interview.type === "video" ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Video className="w-4 h-4 text-[#06CB1D]" />
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#114DFF] hover:underline"
                        >
                          Join Video Call
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-[#114DFF]" />
                        <span>{interview.location}</span>
                      </div>
                    )}
                  </div>

                  {interview.notes && (
                    <div className="mt-3 p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes: </span>
                        {interview.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {interview.status === "scheduled" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <Edit className="w-4 h-4" />
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-[#CCCCCC] hover:bg-[#F5F5F5] text-[#FF220E]"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                  {interview.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                    >
                      <FileText className="w-4 h-4" />
                      View Notes
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
          <p className="text-gray-600">
            {filter !== "all"
              ? `No ${filter} interviews at this time`
              : "Schedule your first interview with a startup"}
          </p>
        </div>
      )}
    </div>
  );
}