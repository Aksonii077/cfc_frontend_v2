import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MessageSquare,
  ArrowLeft,
  Star,
  Clock,
  Send,
  FileText,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  status: "pending" | "reviewing" | "interview-scheduled" | "interview-completed" | "accepted" | "rejected" | "agreement-ongoing" | "agreement-successful";
  aiScore: number;
  marketScore: number;
  teamScore: number;
  ideaScore: number;
  fitScore: number;
  description: string;
  submittedAt: string;
}

interface InterviewNotes {
  overallImpression: string;
  strengths: string;
  concerns: string;
  marketFit: string;
  teamCapability: string;
  nextSteps: string;
  rating: number;
}

interface ReviewDecisionWorkflowProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  onAccept: (notes: InterviewNotes) => void;
  onScheduleInterview: () => void;
  onUpdateStatus: (applicationId: string, newStatus: string, data?: any) => void;
}

export function ReviewDecisionWorkflow({
  application,
  isOpen,
  onClose,
  onReject,
  onAccept,
  onScheduleInterview,
  onUpdateStatus
}: ReviewDecisionWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<"decision" | "reject" | "interview-notes" | "accept">("decision");
  const [rejectReason, setRejectReason] = useState("");
  const [interviewNotes, setInterviewNotes] = useState<InterviewNotes>({
    overallImpression: "",
    strengths: "",
    concerns: "",
    marketFit: "",
    teamCapability: "",
    nextSteps: "",
    rating: 0
  });

  const handleBackToDecision = () => {
    setCurrentStep("decision");
    setRejectReason("");
  };

  const handleReject = () => {
    setCurrentStep("reject");
  };

  const handleScheduleInterview = () => {
    onScheduleInterview();
    onClose();
  };

  const handleMarkInterviewCompleted = async () => {
    try {
      await onUpdateStatus(application.id, "interview-completed", {
        interview_completed_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Error marking interview as completed:', error);
    }
  };

  const handleSubmitRejection = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      onClose();
    }
  };

  const handleInterviewNotesRequired = () => {
    setCurrentStep("interview-notes");
  };

  const handleAccept = () => {
    if (validateInterviewNotes()) {
      setCurrentStep("accept");
    }
  };

  const validateInterviewNotes = () => {
    return interviewNotes.overallImpression.trim() && 
           interviewNotes.strengths.trim() && 
           interviewNotes.rating > 0;
  };

  const handleFinalAccept = () => {
    onAccept(interviewNotes);
    onClose();
  };

  const getAvailableActions = () => {
    // Normalize status to ensure consistent matching
    const normalizedStatus = application.status?.toLowerCase()?.trim();
    
    switch (normalizedStatus) {
      case "pending":
        // For pending applications: only Reject or Schedule Interview
        return ["reject", "schedule-interview"];
      case "interview-completed":
        // For interview completed: only Reject or Accept (after notes)
        return ["reject", "accept"];
      case "interview-scheduled":
        // For scheduled interviews: only Reject (can't accept until interview is completed)
        return ["reject"];
      default:
        return [];
    }
  };

  const availableActions = getAvailableActions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            {currentStep !== "decision" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToDecision}
                className="p-1 h-auto"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <span>Review & Decide - {application.startupName}</span>
          </DialogTitle>
          <DialogDescription>
            Application Status: {application.status.replace("-", " ").toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh]">
          <AnimatePresence mode="wait">
            {/* Main Decision Screen */}
            {currentStep === "decision" && (
              <motion.div
                key="decision"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Application Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Application Summary</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        AI Score: {application.aiScore}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Founder</Label>
                        <p>{application.founderName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Industry</Label>
                        <p>{application.industry}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Stage</Label>
                        <p>{application.stage}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Location</Label>
                        <p>{application.location}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-gray-600 mt-1">{application.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Assessment Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Market Potential</span>
                        <span className="font-bold text-green-600">{application.marketScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Innovation Score</span>
                        <span className="font-bold text-purple-600">{application.ideaScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Team Strength</span>
                        <span className="font-bold text-blue-600">{application.teamScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-medium">Incubator Fit</span>
                        <span className="font-bold text-orange-600">{application.fitScore}/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Decision Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Make Your Decision</CardTitle>
                    <DialogDescription>
                      {application.status === "pending" 
                        ? "Review this application and decide whether to reject or schedule an interview."
                        : application.status === "interview-completed"
                        ? "The interview has been completed. Review the interview notes and make your final decision to accept or reject."
                        : application.status === "interview-scheduled"
                        ? "Interview has been scheduled. You can only reject at this stage until the interview is completed."
                        : "Review the application and make your decision."
                      }
                    </DialogDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      {availableActions.includes("reject") && (
                        <Button 
                          variant="destructive" 
                          onClick={handleReject}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Application
                        </Button>
                      )}
                      
                      {availableActions.includes("schedule-interview") && (
                        <Button 
                          onClick={handleScheduleInterview}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Interview
                        </Button>
                      )}
                      
                      {availableActions.includes("accept") && (
                        <Button 
                          onClick={handleInterviewNotesRequired}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Application
                        </Button>
                      )}
                    </div>
                    
                    {application.status === "interview-completed" && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800">Interview Completed - Decision Required</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              The interview has been completed. Please review the interview notes and make your final decision to either accept or reject this application.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {application.status === "interview-scheduled" && (
                      <div className="mt-4 space-y-4">
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-purple-800">Interview Scheduled</h4>
                              <p className="text-sm text-purple-700 mt-1">
                                An interview has been scheduled with this startup. Once you complete the interview, mark it as completed to proceed with the final decision.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handleMarkInterviewCompleted}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Interview as Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Reject Flow */}
            {currentStep === "reject" && (
              <motion.div
                key="reject"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      Reject Application
                    </CardTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this application. This will be used for internal records and potential feedback to the founder.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="reject-reason">Rejection Reason</Label>
                      <Textarea
                        id="reject-reason"
                        placeholder="Explain why this application is not suitable for the incubator program..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={6}
                        className="mt-2"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToDecision}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleSubmitRejection}
                        disabled={!rejectReason.trim()}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Confirm Rejection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Interview Notes Flow */}
            {currentStep === "interview-notes" && (
              <motion.div
                key="interview-notes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Interview Notes
                    </CardTitle>
                    <DialogDescription>
                      Document your interview assessment before making the final decision.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Rating */}
                    <div>
                      <Label>Overall Interview Rating</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant={interviewNotes.rating >= rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => setInterviewNotes(prev => ({ ...prev, rating }))}
                            className="p-2"
                          >
                            <Star className={`w-4 h-4 ${interviewNotes.rating >= rating ? 'fill-current' : ''}`} />
                          </Button>
                        ))}
                        <span className="text-sm text-gray-500 ml-2 self-center">
                          {interviewNotes.rating > 0 ? `${interviewNotes.rating}/5` : 'Not rated'}
                        </span>
                      </div>
                    </div>

                    {/* Overall Impression */}
                    <div>
                      <Label htmlFor="overall-impression">Overall Impression *</Label>
                      <Textarea
                        id="overall-impression"
                        placeholder="Your general thoughts about the founder and startup..."
                        value={interviewNotes.overallImpression}
                        onChange={(e) => setInterviewNotes(prev => ({ ...prev, overallImpression: e.target.value }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    {/* Strengths */}
                    <div>
                      <Label htmlFor="strengths">Key Strengths *</Label>
                      <Textarea
                        id="strengths"
                        placeholder="What are the main strengths of this application..."
                        value={interviewNotes.strengths}
                        onChange={(e) => setInterviewNotes(prev => ({ ...prev, strengths: e.target.value }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    {/* Concerns */}
                    <div>
                      <Label htmlFor="concerns">Areas of Concern</Label>
                      <Textarea
                        id="concerns"
                        placeholder="Any concerns or areas that need improvement..."
                        value={interviewNotes.concerns}
                        onChange={(e) => setInterviewNotes(prev => ({ ...prev, concerns: e.target.value }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Market Fit */}
                      <div>
                        <Label htmlFor="market-fit">Market Fit Assessment</Label>
                        <Textarea
                          id="market-fit"
                          placeholder="How well does this startup fit the market opportunity..."
                          value={interviewNotes.marketFit}
                          onChange={(e) => setInterviewNotes(prev => ({ ...prev, marketFit: e.target.value }))}
                          rows={2}
                          className="mt-2"
                        />
                      </div>

                      {/* Team Capability */}
                      <div>
                        <Label htmlFor="team-capability">Team Capability</Label>
                        <Textarea
                          id="team-capability"
                          placeholder="Assessment of founder and team capabilities..."
                          value={interviewNotes.teamCapability}
                          onChange={(e) => setInterviewNotes(prev => ({ ...prev, teamCapability: e.target.value }))}
                          rows={2}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <Label htmlFor="next-steps">Recommended Next Steps</Label>
                      <Textarea
                        id="next-steps"
                        placeholder="What should be the next steps if accepted..."
                        value={interviewNotes.nextSteps}
                        onChange={(e) => setInterviewNotes(prev => ({ ...prev, nextSteps: e.target.value }))}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleBackToDecision}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAccept}
                        disabled={!validateInterviewNotes()}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Continue to Accept
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Accept Confirmation */}
            {currentStep === "accept" && (
              <motion.div
                key="accept"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Accept Application
                    </CardTitle>
                    <DialogDescription>
                      Confirm that you want to accept this application. This will trigger the acceptance workflow.
                    </DialogDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">What happens next:</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Acceptance email will be sent to the founder</li>
                        <li>• Agreement documents will be prepared</li>
                        <li>• Onboarding checklist will be activated</li>
                        <li>• Startup will be added to your portfolio</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Your Interview Assessment:</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p><strong>Rating:</strong> {interviewNotes.rating}/5 stars</p>
                        <p><strong>Key Strengths:</strong> {interviewNotes.strengths.substring(0, 100)}...</p>
                        {interviewNotes.concerns && (
                          <p><strong>Concerns:</strong> {interviewNotes.concerns.substring(0, 100)}...</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentStep("interview-notes")}
                        className="flex-1"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Notes
                      </Button>
                      <Button 
                        onClick={handleFinalAccept}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Acceptance
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}