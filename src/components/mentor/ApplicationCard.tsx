import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarContent, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Briefcase,
  Clock,
  ChevronRight,
  Eye,
  MessageCircle,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  requestedFunding: number;
  aiScore: number;
  marketScore: number;
  teamScore: number;
  ideaScore: number;
  fitScore: number;
  submittedAt: string;
  status: "pending" | "reviewing" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-ongoing" | "agreement-successful";
  description: string;
  teamSize: number;
  previousFunding: number;
  revenueStage: string;
}

interface ApplicationCardProps {
  application: Application;
  onViewDetails: () => void;
  onNavigateToProfile?: (userId: string) => void;
  onScheduleInterview?: () => void;
  onShowDecisionWorkflow?: () => void;
  onReviewDecide?: () => void;
  onStartAgreement?: () => void;
}

export function ApplicationCard({ application, onViewDetails, onNavigateToProfile, onScheduleInterview, onShowDecisionWorkflow, onReviewDecide, onStartAgreement }: ApplicationCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending Review",
          color: "bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]",
          icon: Clock,
        };
      case "reviewing":
        return {
          label: "Under Review",
          color: "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]",
          icon: Eye,
        };
      case "interview-scheduled":
        return {
          label: "Interview Scheduled",
          color: "bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]",
          icon: Calendar,
        };
      case "interview-completed":
        return {
          label: "Interview Completed",
          color: "bg-[#EDF2FF] text-[#3CE5A7] border-[#C8D6FF]",
          icon: CheckCircle,
        };
      case "accepted":
        return {
          label: "Accepted",
          color: "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]",
          icon: CheckCircle,
        };
      case "rejected":
        return {
          label: "Rejected",
          color: "bg-[#F5F5F5] text-[#FF220E] border-[#CCCCCC]",
          icon: XCircle,
        };
      case "agreement-ongoing":
        return {
          label: "Agreement Ongoing",
          color: "bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF]",
          icon: Clock,
        };
      case "agreement-successful":
        return {
          label: "Agreement Successful",
          color: "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]",
          icon: CheckCircle,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]",
          icon: Clock,
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#06CB1D]";
    if (score >= 80) return "text-[#114DFF]";
    if (score >= 70) return "text-[#3CE5A7]";
    return "text-[#FF220E]";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-[#EDF2FF] border-[#C8D6FF]";
    if (score >= 80) return "bg-[#F7F9FF] border-[#C8D6FF]";
    if (score >= 70) return "bg-[#EDF2FF] border-[#C8D6FF]";
    return "bg-[#F5F5F5] border-[#CCCCCC]";
  };

  const statusConfig = getStatusConfig(application.status);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="border-[#C8D6FF] shadow-sm hover:shadow-md transition-all duration-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start space-x-4 flex-1">
            <Avatar className="w-14 h-14 ring-2 ring-[#C8D6FF]/30">
              <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white text-lg">
                {application.startupName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="mb-1">
                {application.startupName}
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                by {application.founderName}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{application.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{application.industry}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{application.stage}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3 ml-4">
            <Badge variant="outline" className={statusConfig.color + " px-3 py-1"}>
              <statusConfig.icon className="w-3.5 h-3.5 mr-1.5" />
              {statusConfig.label}
            </Badge>
            <div className={`text-center px-4 py-2.5 rounded-lg border-2 ${getScoreBgColor(application.aiScore)} min-w-[80px]`}>
              <div className={`text-2xl ${getScoreColor(application.aiScore)}`}>
                {application.aiScore}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">AI Score</div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
          {application.description}
        </p>

        {/* Help Looking For */}
        <div className="mb-5">
          <h4 className="mb-3 text-gray-700">Help Looking for from Mentor</h4>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] text-gray-700 rounded-full border border-[#CCCCCC] text-sm">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Fundraising</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] text-gray-700 rounded-full border border-[#CCCCCC] text-sm">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Strategy</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] text-gray-700 rounded-full border border-[#CCCCCC] text-sm">
              <Users className="w-3.5 h-3.5" />
              <span>Team Building</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F5F5] text-gray-700 rounded-full border border-[#CCCCCC] text-sm">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Market Access</span>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Market Analysis */}
          <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4.5 h-4.5 text-[#06CB1D]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-gray-700">Market Analysis</h4>
                  <span className="text-sm text-[#06CB1D]">{application.marketScore}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Large addressable market with growing demand for clean energy solutions. Strong market timing as residential and commercial segments accelerate adoption.
                </p>
              </div>
            </div>
          </div>

          {/* Innovation Score */}
          <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                <Star className="w-4.5 h-4.5 text-[#3CE5A7]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-gray-700">Innovation Score</h4>
                  <span className="text-sm text-[#3CE5A7]">{application.ideaScore}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Proprietary AI optimization technology with proven efficiency gains. Three patents filed. Clear differentiation from existing solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Team Assessment */}
          <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                <Users className="w-4.5 h-4.5 text-[#114DFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-gray-700">Team Assessment</h4>
                  <span className="text-sm text-[#114DFF]">{application.teamScore}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Strong technical background with Tesla and Google alumni. CEO has deep domain expertise. Needs business development experience and sales leadership for scaling.
                </p>
              </div>
            </div>
          </div>

          {/* Incubator Fit */}
          <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4.5 h-4.5 text-[#114DFF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-gray-700">Incubator Fit</h4>
                  <span className="text-sm text-[#114DFF]">{application.fitScore}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Perfect alignment with our cleantech investment thesis. Complements existing portfolio in renewable energy sector. Would benefit from our network of energy industry partners.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-5 border-t border-[#C8D6FF]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Submitted {formatDate(application.submittedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Pending Review - Show Review & Decide button */}
            {application.status === "pending" && onReviewDecide && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReviewDecide}
                className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] hover:bg-[#C8D6FF] h-9"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Review & Decide
              </Button>
            )}

            {/* Interview Completed - Show Make Decision button */}
            {application.status === "interview-completed" && onReviewDecide && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReviewDecide}
                className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF] hover:bg-[#C8D6FF] h-9"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Make Decision
              </Button>
            )}

            {/* Accepted - Show Start Agreement button */}
            {application.status === "accepted" && onStartAgreement && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onStartAgreement}
                className="bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF] hover:bg-[#C8D6FF] h-9"
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Agreement
              </Button>
            )}

            {/* Agreement Ongoing - Show View Agreement button */}
            {application.status === "agreement-ongoing" && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#F7F9FF] text-[#114DFF] border-[#C8D6FF] hover:bg-[#EDF2FF] h-9"
              >
                <FileText className="w-4 h-4 mr-2" />
                View Agreement
              </Button>
            )}

            {/* Agreement Successful - Show Manage Startup button */}
            {application.status === "agreement-successful" && (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-[#EDF2FF] text-[#3CE5A7] border-[#C8D6FF] hover:bg-[#C8D6FF] h-9"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Manage Startup
              </Button>
            )}

            {/* Contact button for accepted and ongoing agreements */}
            {(application.status === "accepted" || 
              application.status === "agreement-ongoing" || 
              application.status === "agreement-successful") && (
              <Button variant="outline" size="sm" className="border-[#C8D6FF] h-9">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            )}
            
            <Button onClick={onViewDetails} size="sm" className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white h-9">
              <Eye className="w-4 h-4 mr-2" />
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}