import { useState } from "react";
import { ReviewDecisionWorkflow } from "./ReviewDecisionWorkflow";
import { InterviewNotesCapture } from "./InterviewNotesCapture";
import { EnhancedAcceptanceEmailTemplate } from "./EnhancedAcceptanceEmailTemplate";
import { InterviewScheduling } from "./InterviewScheduling";
// DecisionWorkflow removed - using only ReviewDecisionWorkflow for proper status-based flow
import { MentorApplicationService, type InterviewNotes as DBInterviewNotes } from "../../utils/supabase/mentorApplicationService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";

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

interface InterviewNotes {
  overallImpression: string;
  strengths: string;
  concerns: string;
  marketFit: string;
  teamCapability: string;
  nextSteps: string;
  rating: number;
  interviewDate: string;
  interviewDuration: string;
  attendees: string[];
  keyQuestions: Array<{
    question: string;
    answer: string;
  }>;
  followUpActions: string[];
  recommendation: "strong-accept" | "accept" | "maybe" | "decline" | "strong-decline";
}

interface ApplicationReviewFlowProps {
  application: Application;
  onUpdateApplicationStatus: (applicationId: string, newStatus: string, data?: any) => void;
  onClose: () => void;
}

export function ApplicationReviewFlow({
  application,
  onUpdateApplicationStatus,
  onClose
}: ApplicationReviewFlowProps) {
  const { user } = useAuth();
  const [currentFlow, setCurrentFlow] = useState<
    "review-decide" | "interview-scheduling" | "interview-notes" | "acceptance-email" | null
  >(null);
  const [interviewNotes, setInterviewNotes] = useState<InterviewNotes | null>(null);
  const [flowData, setFlowData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load existing interview notes if available
  const loadInterviewNotes = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const notes = await MentorApplicationService.getInterviewNotes(application.id);
      if (notes) {
        // Convert DB notes to component format
        setInterviewNotes({
          overallImpression: notes.overall_impression,
          strengths: notes.strengths,
          concerns: notes.concerns || "",
          marketFit: notes.market_fit || "",
          teamCapability: notes.team_capability || "",
          nextSteps: notes.next_steps || "",
          rating: notes.rating,
          interviewDate: notes.interview_date,
          interviewDuration: notes.interview_duration || "",
          attendees: notes.attendees,
          keyQuestions: notes.key_questions,
          followUpActions: notes.follow_up_actions,
          recommendation: notes.recommendation
        });
      }
    } catch (error) {
      console.error('Error loading interview notes:', error);
      toast.error('Failed to load interview notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Main Review & Decide Flow
  const handleShowReviewDecide = () => {
    setCurrentFlow("review-decide");
  };

  // Interview Scheduling Flow
  const handleScheduleInterview = () => {
    setCurrentFlow("interview-scheduling");
  };

  const handleInterviewScheduled = async (scheduleData: any) => {
    if (!user) return;

    try {
      setIsLoading(true);
      await MentorApplicationService.updateApplicationStatus(
        application.id, 
        "interview-scheduled", 
        { interview_scheduled_at: new Date().toISOString() }
      );
      onUpdateApplicationStatus(application.id, "interview-scheduled", scheduleData);
      toast.success('Interview scheduled successfully!');
      setCurrentFlow(null);
      onClose();
    } catch (error) {
      console.error('Error scheduling interview:', error);
      toast.error('Failed to schedule interview');
    } finally {
      setIsLoading(false);
    }
  };

  // Interview Notes Flow (for interview-completed status)
  const handleShowInterviewNotes = () => {
    setCurrentFlow("interview-notes");
  };

  const handleInterviewNotesComplete = async (notes: InterviewNotes) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Save interview notes to database
      const dbNotes: DBInterviewNotes = {
        application_id: application.id,
        overall_impression: notes.overallImpression,
        strengths: notes.strengths,
        concerns: notes.concerns,
        market_fit: notes.marketFit,
        team_capability: notes.teamCapability,
        next_steps: notes.nextSteps,
        rating: notes.rating,
        interview_date: notes.interviewDate,
        interview_duration: notes.interviewDuration,
        attendees: notes.attendees,
        key_questions: notes.keyQuestions,
        follow_up_actions: notes.followUpActions,
        recommendation: notes.recommendation,
        mentor_id: user.id
      };

      await MentorApplicationService.saveInterviewNotes(dbNotes);
      setInterviewNotes(notes);
      toast.success('Interview notes saved successfully!');
      
      // After notes are captured, show review-decide again for final decision
      setCurrentFlow("review-decide");
    } catch (error) {
      console.error('Error saving interview notes:', error);
      toast.error('Failed to save interview notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Rejection Flow - handled directly in ReviewDecisionWorkflow
  const handleReject = async (reason: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Save rejection to database
      await MentorApplicationService.saveApplicationRejection({
        application_id: application.id,
        reason,
        rejected_at: new Date().toISOString(),
        mentor_id: user.id
      });

      // Update application status
      await MentorApplicationService.updateApplicationStatus(application.id, "rejected");
      
      onUpdateApplicationStatus(application.id, "rejected", { 
        rejectionReason: reason,
        rejectedAt: new Date().toISOString()
      });
      
      toast.success('Application rejected and reason saved');
      setCurrentFlow(null);
      onClose();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setIsLoading(false);
    }
  };

  // Acceptance Flow
  const handleAccept = (notes: InterviewNotes) => {
    setInterviewNotes(notes);
    setCurrentFlow("acceptance-email");
  };

  const handleAcceptanceEmailSent = async (emailData: any) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Save acceptance email data to database
      await MentorApplicationService.saveAcceptanceEmail({
        application_id: application.id,
        template_name: emailData.template,
        subject: emailData.subject,
        body: emailData.body,
        recipient_email: emailData.recipient || application.founderEmail,
        program_details: emailData.programDetails || {},
        links: emailData.links || {},
        sent_at: emailData.sentAt,
        mentor_id: user.id
      });

      // Update application status to accepted
      await MentorApplicationService.updateApplicationStatus(
        application.id, 
        "accepted",
        { accepted_at: new Date().toISOString() }
      );

      onUpdateApplicationStatus(application.id, "accepted", {
        interviewNotes,
        acceptanceEmailData: emailData,
        acceptedAt: new Date().toISOString()
      });
      
      toast.success('Acceptance email sent and application accepted!');
      setCurrentFlow(null);
      onClose();
    } catch (error) {
      console.error('Error sending acceptance email:', error);
      toast.error('Failed to send acceptance email');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which flow should be shown based on application status
  const getInitialFlow = async () => {
    switch (application.status) {
      case "pending":
        return "review-decide";
      case "interview-completed":
        // Load existing notes if available
        await loadInterviewNotes();
        // If interview notes don't exist, capture them first
        const notes = await MentorApplicationService.getInterviewNotes(application.id);
        if (!notes) {
          return "interview-notes";
        }
        // If notes exist, show review-decide for final decision
        return "review-decide";
      default:
        return "review-decide";
    }
  };

  // Start the appropriate flow if none is active
  if (!currentFlow && !isLoading) {
    getInitialFlow().then(flow => setCurrentFlow(flow));
  }

  return (
    <>
      {/* Main Review & Decide Workflow - Handles all decisions based on status */}
      {currentFlow === "review-decide" && (
        <ReviewDecisionWorkflow
          application={application}
          isOpen={true}
          onClose={() => {
            setCurrentFlow(null);
            onClose();
          }}
          onReject={handleReject}
          onAccept={handleAccept}
          onScheduleInterview={handleScheduleInterview}
          onUpdateStatus={onUpdateApplicationStatus}
        />
      )}

      {/* Interview Scheduling */}
      {currentFlow === "interview-scheduling" && (
        <InterviewScheduling
          application={application}
          isOpen={true}
          onClose={() => setCurrentFlow("review-decide")}
          onScheduleComplete={handleInterviewScheduled}
        />
      )}

      {/* Interview Notes Capture */}
      {currentFlow === "interview-notes" && (
        <InterviewNotesCapture
          application={application}
          isOpen={true}
          onClose={() => setCurrentFlow("review-decide")}
          onSaveNotes={(notes) => {
            setInterviewNotes(notes);
            // Notes saved, but stay in the same view
          }}
          onProceedToDecision={handleInterviewNotesComplete}
          existingNotes={interviewNotes || undefined}
        />
      )}

      {/* Acceptance Email Template */}
      {currentFlow === "acceptance-email" && interviewNotes && (
        <EnhancedAcceptanceEmailTemplate
          application={application}
          interviewNotes={interviewNotes}
          isOpen={true}
          onClose={() => setCurrentFlow("review-decide")}
          onSendEmail={handleAcceptanceEmailSent}
        />
      )}

      {/* Rejection Flow is now handled directly in ReviewDecisionWorkflow */}
      {/* Old DecisionWorkflow component removed to prevent showing all 3 options */}
    </>
  );
}

// Hook to integrate with ApplicationCard
export function useApplicationReviewFlow() {
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const [isFlowOpen, setIsFlowOpen] = useState(false);

  const startReviewFlow = (application: Application) => {
    setActiveApplication(application);
    setIsFlowOpen(true);
  };

  const closeReviewFlow = () => {
    setIsFlowOpen(false);
    setActiveApplication(null);
  };

  return {
    activeApplication,
    isFlowOpen,
    startReviewFlow,
    closeReviewFlow
  };
}