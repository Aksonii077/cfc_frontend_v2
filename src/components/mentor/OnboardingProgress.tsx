import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  FileText,
  Phone,
  Mail,
  Target,
  Calendar,
  TrendingUp,
  Star,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

interface OnboardedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  acceptedAt: string;
  onboardingStatus: "pending" | "in-progress" | "completed";
  checklist: {
    agreementSigned: boolean;
    welcomeCallCompleted: boolean;
    onboardingMaterialsSent: boolean;
    initialGoalsSet: boolean;
    mentorIntroductionsMade: boolean;
  };
  documents: {
    investmentAgreement?: { status: "pending" | "signed"; url?: string };
    safeNote?: { status: "pending" | "signed"; url?: string };
    programAgreement?: { status: "pending" | "signed"; url?: string };
  };
  welcomeCallScheduled?: {
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  };
  assignedMentor?: {
    name: string;
    email: string;
    expertise: string[];
  };
  initialGoals?: string[];
  notes?: string;
}

interface OnboardingProgressProps {
  startup: OnboardedStartup;
}

export function OnboardingProgress({ startup }: OnboardingProgressProps) {
  const completedTasks = Object.values(startup.checklist).filter(Boolean).length;
  const totalTasks = Object.keys(startup.checklist).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const signedDocuments = Object.values(startup.documents).filter(doc => doc?.status === "signed").length;
  const totalDocuments = Object.keys(startup.documents).length;
  const documentProgress = totalDocuments > 0 ? (signedDocuments / totalDocuments) * 100 : 0;

  const daysSinceAcceptance = Math.floor(
    (new Date().getTime() - new Date(startup.acceptedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const timelineEvents = [
    {
      date: startup.acceptedAt,
      title: "Startup Accepted",
      description: `${startup.startupName} was accepted into the program`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      completed: true,
    },
    {
      date: startup.checklist.onboardingMaterialsSent ? new Date(Date.now() - 86400000).toISOString() : null,
      title: "Onboarding Materials Sent",
      description: "Welcome pack and program materials delivered",
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      completed: startup.checklist.onboardingMaterialsSent,
    },
    {
      date: startup.documents.programAgreement?.status === "signed" ? new Date(Date.now() - 43200000).toISOString() : null,
      title: "Agreement Signed",
      description: "Program participation agreement completed",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      completed: startup.checklist.agreementSigned,
    },
    {
      date: startup.checklist.welcomeCallCompleted ? new Date(Date.now() - 21600000).toISOString() : null,
      title: "Welcome Call Completed",
      description: "Initial onboarding conversation conducted",
      icon: Phone,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      completed: startup.checklist.welcomeCallCompleted,
    },
    {
      date: startup.checklist.mentorIntroductionsMade ? new Date(Date.now() - 10800000).toISOString() : null,
      title: "Mentor Introductions",
      description: "Key mentors connected with the startup",
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      completed: startup.checklist.mentorIntroductionsMade,
    },
    {
      date: startup.checklist.initialGoalsSet ? new Date().toISOString() : null,
      title: "Initial Goals Set",
      description: "Startup objectives and milestones defined",
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      completed: startup.checklist.initialGoalsSet,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{progressPercentage.toFixed(0)}%</span>
                {getStatusBadge(startup.onboardingStatus)}
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-gray-600">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Document Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{documentProgress.toFixed(0)}%</span>
                <Badge variant="outline" className={
                  documentProgress === 100 
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-orange-50 text-orange-700 border-orange-200"
                }>
                  <FileText className="w-3 h-3 mr-1" />
                  {signedDocuments}/{totalDocuments} Signed
                </Badge>
              </div>
              <Progress value={documentProgress} className="h-3" />
              <p className="text-sm text-gray-600">
                Documents signed and completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Time in Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{daysSinceAcceptance}</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Calendar className="w-3 h-3 mr-1" />
                  Days
                </Badge>
              </div>
              <div className="h-3 bg-gray-200 rounded-full">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${Math.min((daysSinceAcceptance / 84) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                Since program acceptance
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Onboarding Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${event.bgColor} ${
                  event.completed ? '' : 'opacity-50 grayscale'
                }`}>
                  <event.icon className={`w-5 h-5 ${event.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-medium ${
                      event.completed ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {event.title}
                    </h4>
                    {event.completed && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className={`text-sm ${
                    event.completed ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {event.description}
                  </p>
                  {event.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>

                {index < timelineEvents.length - 1 && (
                  <div className={`w-px h-12 ${
                    event.completed ? 'bg-gray-300' : 'bg-gray-200'
                  } ml-6 -mb-6`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Founder</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-medium">{startup.founderName}</span>
                <Badge variant="outline" className="text-xs">Primary Contact</Badge>
              </div>
              <p className="text-sm text-gray-600">{startup.founderEmail}</p>
            </div>

            {startup.assignedMentor && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Assigned Mentor</Label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{startup.assignedMentor.name}</span>
                  <Badge variant="outline" className="text-xs">Mentor</Badge>
                </div>
                <p className="text-sm text-gray-600">{startup.assignedMentor.email}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {startup.assignedMentor.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Initial Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            {startup.initialGoals && startup.initialGoals.length > 0 ? (
              <div className="space-y-2">
                {startup.initialGoals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <Star className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No initial goals set yet</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Set Goals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!startup.checklist.agreementSigned && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <div className="font-medium text-red-900">Agreement Signature Required</div>
                  <div className="text-sm text-red-700">Follow up on program agreement signature</div>
                </div>
                <Button size="sm" variant="outline">
                  Follow Up
                </Button>
              </div>
            )}

            {!startup.checklist.welcomeCallCompleted && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <div className="font-medium text-blue-900">Schedule Welcome Call</div>
                  <div className="text-sm text-blue-700">Initial onboarding conversation with founder</div>
                </div>
                <Button size="sm" variant="outline">
                  Schedule
                </Button>
              </div>
            )}

            {!startup.checklist.mentorIntroductionsMade && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Users className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-green-900">Assign Mentors</div>
                  <div className="text-sm text-green-700">Connect startup with relevant mentors</div>
                </div>
                <Button size="sm" variant="outline">
                  Assign
                </Button>
              </div>
            )}

            {startup.onboardingStatus === "completed" && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="font-medium text-green-900">Onboarding Complete!</div>
                  <div className="text-sm text-green-700">Ready to begin program activities</div>
                </div>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Program
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {startup.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{startup.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}