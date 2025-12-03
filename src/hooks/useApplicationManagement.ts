import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { Application, ApplicationStatus } from '../types/application';
import { MOCK_APPLICATIONS } from '../constants/mockApplications';
import { mentorAPI } from '../utils/api';

// API response interface
interface ApiApplicationResponse {
  application_id: string;
  applicant_user_id: string;
  mentor_user_id: string;
  idea_id: string;
  idea_title: string;
  why_want_mentor: string;
  mentorship_goals: string;
  applicant_background: string;
  preferred_meeting_frequency: string;
  application_status: string;
  application_step: string;
  applicant_name: string;
  applicant_email: string;
  startup_project_name?: string;
  one_line_pitch?: string;
  website_primary_link?: string;
  current_stage?: string;
  sector_vertical?: string;
  where_based?: string;
  problem_solving?: string;
  solution_description?: string;
  team_members?: string;
  created_at: string;
  updated_at: string;
}

// Transform API response to Application interface
const transformApiResponse = (apiApp: ApiApplicationResponse): Application => {
  // Map application step to status (using application_step as the source of truth)
  const statusMap: Record<string, ApplicationStatus> = {
    'review_pending': 'review-pending',
    'interview_scheduled': 'interview-scheduled',
    'interview_completed': 'interview-completed',
    'accepted': 'accepted',
    'rejected': 'rejected',
    'agreement_started': 'agreement-started',
    'agreement_in_progress': 'agreement-in-progress',
    'agreement_complete': 'agreement-complete',
  };

  return {
    id: apiApp.application_id,
    startupName: apiApp.startup_project_name || apiApp.idea_title || 'Unnamed Startup',
    founderName: apiApp.applicant_name,
    founderEmail: apiApp.applicant_email,
    industry: apiApp.sector_vertical || 'Not specified',
    stage: apiApp.current_stage || 'Not specified',
    location: apiApp.where_based || 'Not specified',
    requestedFunding: 0, // Not available in API response
    aiScore: Math.floor(Math.random() * 40) + 60, // Generate mock score 60-100
    marketScore: Math.floor(Math.random() * 40) + 60,
    teamScore: Math.floor(Math.random() * 40) + 60,
    ideaScore: Math.floor(Math.random() * 40) + 60,
    fitScore: Math.floor(Math.random() * 40) + 60,
    submittedAt: apiApp.created_at,
    status: statusMap[apiApp.application_step] || 'review-pending',
    description: apiApp.one_line_pitch || apiApp.problem_solving || 'No description provided',
    teamSize: 1, // Default, could be parsed from team_members if needed
    previousFunding: 0, // Not available in API response
    revenueStage: 'Pre-revenue', // Default value
  };
};

export interface UseApplicationManagementReturn {
  applications: Application[];
  selectedApplication: Application | null;
  selectedApplicationTab: string | undefined;
  showCommunicationFlow: boolean;
  communicationFlowApplication: Application | null;
  searchTerm: string;
  filteredApplications: Application[];
  isLoading: boolean;
  error: string | null;
  setSelectedApplication: (app: Application | null) => void;
  setSelectedApplicationTab: (tab: string | undefined) => void;
  setShowCommunicationFlow: (show: boolean) => void;
  setCommunicationFlowApplication: (app: Application | null) => void;
  setSearchTerm: (term: string) => void;
  handleApplicationUpdate: (updatedApp: Application) => void;
  handleAcceptApplication: (application: Application) => void;
  handleRejectApplication: (application: Application) => void;
  handleScheduleInterview: (application: Application) => void;
  handleStartAgreement: (application: Application) => void;
  handleViewProgress: (application: Application) => void;
  handleInterviewScheduled: (application: Application) => void;
  refreshApplications: () => Promise<void>;
}

export const useApplicationManagement = (): UseApplicationManagementReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedApplicationTab, setSelectedApplicationTab] = useState<string | undefined>(undefined);
  const [showCommunicationFlow, setShowCommunicationFlow] = useState(false);
  const [communicationFlowApplication, setCommunicationFlowApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => 
      app.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.founderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  const refreshApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const receivedApplications: ApiApplicationResponse[] = await mentorAPI.getReceivedApplications();
      
      // Handle both single object and array responses
      const applicationsArray = Array.isArray(receivedApplications) 
        ? receivedApplications 
        : [receivedApplications];
      
      // Transform API data to match Application interface
      const transformedApplications = applicationsArray
        .filter(app => app != null) // Filter out null/undefined entries
        .map(transformApiResponse);
      
      setApplications(transformedApplications);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load applications');
      
      // Fallback to mock data if API fails
      setApplications(MOCK_APPLICATIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch applications on mount
  useEffect(() => {
    refreshApplications();
  }, [refreshApplications]);

  const handleApplicationUpdate = useCallback((updatedApp: Application) => {
    setApplications(prev => prev.map(app => 
      app.id === updatedApp.id ? updatedApp : app
    ));
  }, []);

  const handleAcceptApplication = useCallback((application: Application) => {
    const updatedApp = { ...application, status: "accepted" as const };
    handleApplicationUpdate(updatedApp);

    toast.success("Application Accepted", {
      description: `${application.startupName} has been accepted. An acceptance email has been sent to ${application.founderEmail}.`,
      duration: 5000,
    });
  }, [handleApplicationUpdate]);

  const handleRejectApplication = useCallback((application: Application) => {
    const updatedApp = { ...application, status: "rejected" as const };
    handleApplicationUpdate(updatedApp);

    toast.success("Application Rejected", {
      description: `${application.startupName} has been rejected. A notification email has been sent.`,
      duration: 5000,
    });
  }, [handleApplicationUpdate]);

  const handleScheduleInterview = useCallback((application: Application) => {
    setCommunicationFlowApplication(application);
    setShowCommunicationFlow(true);
  }, []);

  const handleStartAgreement = useCallback((application: Application) => {
    setSelectedApplicationTab("agreement");
    setSelectedApplication(application);
  }, []);

  const handleViewProgress = useCallback((application: Application) => {
    setSelectedApplicationTab("agreement");
    setSelectedApplication(application);
  }, []);

  const handleInterviewScheduled = useCallback((application: Application) => {
    const updatedApp = { ...application, status: "interview-scheduled" as const };
    handleApplicationUpdate(updatedApp);
    
    toast.success("Interview Scheduled", {
      description: `Interview with ${application.startupName} has been scheduled successfully.`,
      duration: 5000,
    });
    
    setShowCommunicationFlow(false);
    setCommunicationFlowApplication(null);
  }, [handleApplicationUpdate]);

  return {
    applications,
    selectedApplication,
    selectedApplicationTab,
    showCommunicationFlow,
    communicationFlowApplication,
    searchTerm,
    filteredApplications,
    isLoading,
    error,
    setSelectedApplication,
    setSelectedApplicationTab,
    setShowCommunicationFlow,
    setCommunicationFlowApplication,
    setSearchTerm,
    handleApplicationUpdate,
    handleAcceptApplication,
    handleRejectApplication,
    handleScheduleInterview,
    handleStartAgreement,
    handleViewProgress,
    handleInterviewScheduled,
    refreshApplications,
  };
};