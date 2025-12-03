import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Send,
  AlertCircle,
} from "lucide-react";

interface Decision {
  id: string;
  companyName: string;
  founderName: string;
  reviewedDate: string;
  decision: "accepted" | "rejected" | "pending";
  reason?: string;
  nextSteps?: string;
  communicationSent: boolean;
}

export function DecisionsList() {
  const [filter, setFilter] = useState<"all" | "accepted" | "rejected" | "pending">("all");

  // Mock data
  const decisions: Decision[] = [
    {
      id: "1",
      companyName: "TechFlow AI",
      founderName: "Sarah Chen",
      reviewedDate: "2024-01-18",
      decision: "accepted",
      reason: "Strong team, innovative AI solution, good market fit",
      nextSteps: "Send acceptance letter and schedule onboarding",
      communicationSent: true,
    },
    {
      id: "2",
      companyName: "EcoGrow",
      founderName: "Michael Torres",
      reviewedDate: "2024-01-17",
      decision: "pending",
      reason: "Awaiting final committee review",
      communicationSent: false,
    },
    {
      id: "3",
      companyName: "DataSync Pro",
      founderName: "John Davis",
      reviewedDate: "2024-01-16",
      decision: "rejected",
      reason: "Product not aligned with our focus areas",
      nextSteps: "Send rejection with feedback",
      communicationSent: true,
    },
  ];

  const filteredDecisions = decisions.filter((decision) => {
    if (filter === "all") return true;
    return decision.decision === filter;
  });

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "accepted":
        return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      case "rejected":
        return "bg-[#F5F5F5] text-[#FF220E] border-[#CCCCCC]";
      case "pending":
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
      default:
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const stats = {
    total: decisions.length,
    accepted: decisions.filter((d) => d.decision === "accepted").length,
    rejected: decisions.filter((d) => d.decision === "rejected").length,
    pending: decisions.filter((d) => d.decision === "pending").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl text-gray-900">Application Decisions</h2>
        <p className="text-gray-600">Track decisions and manage communications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#114DFF]">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Decisions</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#06CB1D]">{stats.accepted}</p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#FF220E]">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#C8D6FF]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-700">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
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
              All Decisions
            </Button>
            <Button
              variant={filter === "accepted" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("accepted")}
              className={
                filter === "accepted"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Accepted
            </Button>
            <Button
              variant={filter === "rejected" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("rejected")}
              className={
                filter === "rejected"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Rejected
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className={
                filter === "pending"
                  ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                  : "border-[#C8D6FF]"
              }
            >
              Pending
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Decisions List */}
      <div className="space-y-4">
        {filteredDecisions.map((decision) => (
          <Card
            key={decision.id}
            className="border-[#C8D6FF] hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {decision.companyName}
                    </h3>
                    <Badge variant="outline" className={getDecisionColor(decision.decision)}>
                      <span className="flex items-center gap-1">
                        {getDecisionIcon(decision.decision)}
                        {decision.decision.charAt(0).toUpperCase() + decision.decision.slice(1)}
                      </span>
                    </Badge>
                    {!decision.communicationSent && decision.decision !== "pending" && (
                      <Badge variant="outline" className="bg-[#F5F5F5] text-[#FF220E] border-[#CCCCCC]">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Action Required
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{decision.founderName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>Reviewed {decision.reviewedDate}</span>
                    </div>
                  </div>

                  {decision.reason && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                      <p className="text-sm text-gray-600">{decision.reason}</p>
                    </div>
                  )}

                  {decision.nextSteps && (
                    <div className="p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Next Steps: </span>
                        {decision.nextSteps}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {!decision.communicationSent && decision.decision !== "pending" && (
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]"
                    >
                      <Send className="w-4 h-4" />
                      Send Email
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-[#C8D6FF] hover:bg-[#EDF2FF]"
                  >
                    <FileText className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>

              {decision.communicationSent && (
                <div className="flex items-center gap-2 text-sm text-[#06CB1D] pt-3 border-t border-[#C8D6FF]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Communication sent to founder</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDecisions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decisions found</h3>
          <p className="text-gray-600">
            {filter !== "all"
              ? `No ${filter} decisions at this time`
              : "Application decisions will appear here"}
          </p>
        </div>
      )}
    </div>
  );
}