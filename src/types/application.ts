export type ApplicationStatus = 
  | "review-pending" 
  | "interview-scheduled" 
  | "interview-completed" 
  | "accepted" 
  | "rejected" 
  | "agreement-started" 
  | "agreement-in-progress" 
  | "agreement-complete";

export type AgreementStatus = 
  | "pending-review" 
  | "counter-proposed" 
  | "accepted";

export interface AgreementTerms {
  version?: number;
  tenure?: string;
  equity?: string;
  equityPercentage?: number;
  deliverables?: string;
  status?: AgreementStatus;
}

export interface Application {
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
  status: ApplicationStatus;
  description: string;
  teamSize: number;
  previousFunding: number;
  revenueStage: string;
  interviewDate?: string;
  interviewNotes?: string;
  decisionReason?: string;
  agreementTerms?: AgreementTerms;
}

export interface ApplicationReviewProps {
  onNavigateToProfile?: (userId: string) => void;
}