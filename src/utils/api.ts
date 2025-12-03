// API utility for making authenticated requests to the backend
// Now powered by axios with interceptors for better error handling and consistency

import { api, tokenUtils } from './axios';

// Initialize access token on app load
export const initializeAccessToken = tokenUtils.initializeToken;

// Token management functions
export const getAccessToken = tokenUtils.getToken;
export const setAccessToken = tokenUtils.setToken;
export const removeAccessToken = tokenUtils.removeToken;

// Update user role
export const updateUserRole = async (role: string): Promise<any> => {
  const response = await api.put('/user/update-role', { role });
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to update user role');
  }
  
  return response.data;
};


// Mentor API endpoints
export const mentorAPI = {
  // Get all mentors with pagination (Find a Mentor)
  getMentors: async (limit: number = 50, offset: number = 0) => {
    const response = await api.get(`/mentor-onboarding/list?limit=${limit}&offset=${offset}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get mentors');
    }
    return response.data;
  },
  
  // Get single mentor by ID
  getMentorById: async (mentorId: string) => {
    const response = await api.get(`/mentor-onboarding/${mentorId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get mentor details');
    }
    return response.data;
  },
  
  // Submit mentor application
  submitApplication: async (applicationData: MentorApplicationData) => {
    const response = await api.post(`/mentor-onboarding/applications`, applicationData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit application');
    }
    return response.data;
  },
  
  // Get received mentor applications (for mentors)
  getReceivedApplications: async (): Promise<any[]> => {
    const response = await api.get(`/mentor-onboarding/applications/received`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get received applications');
    }
    return response.data;
  },
  
  // Get detailed idea information (for mentors viewing application profiles)
  getIdeaDetails: async (ideaId: string): Promise<any> => {
    const response = await api.get(`/mentor-onboarding/ideas/${ideaId}/details`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get idea details');
    }
    return response.data;
  },
  
  // Update application status (accept or reject)
  updateApplicationStatus: async (
    applicationId: string,
    status: 'accepted' | 'rejected',
    mentorRejectionNote?: string
  ): Promise<any> => {
    const payload: Record<string, any> = { application_status: status };

    if (status === 'rejected' && mentorRejectionNote && mentorRejectionNote.trim().length > 0) {
      payload.mentor_rejection_note = mentorRejectionNote.trim();
    }

    const response = await api.put(
      `/mentor-onboarding/applications/${applicationId}/status`,
      payload
    );
    if (!response.success) {
      throw new Error(response.error || 'Failed to update application status');
    }
    return response.data;
  },
  
  // Get mentor's own profile
  getMyMentorProfile: async (): Promise<any> => {
    const response = await api.get(`/mentor-onboarding/my-profile`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get mentor profile');
    }
    return response.data;
  },
  
  // Update mentor profile
  updateProfile: async (payload: any): Promise<any> => {
    const response = await api.put(`/mentor-onboarding/my-profile`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
    return response.data;
  },
  
  // Get my mentors (accepted mentorships)
  getMyMentors: async (): Promise<MyMentorsResponse[]> => {
    const response = await api.get(`/mentor-onboarding/my-mentors`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get my mentors');
    }
    return response.data;
  },
  
  // Get my mentor applications (submitted by founder)
  getMyApplications: async (): Promise<any[]> => {
    const response = await api.get(`/mentor-onboarding/applications/my-applications`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get my applications');
    }
    return response.data;
  },

  // Get a single application by ID (for editing)
  getApplicationById: async (applicationId: string): Promise<any> => {
    const response = await api.get(`/mentor-onboarding/applications/${applicationId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get application');
    }
    return response.data;
  },
  
  // Submit monthly update for an idea
  submitMonthlyUpdate: async (ideaId: string, updateData: MonthlyUpdateData): Promise<any> => {
    const response = await api.post(`/simple-ideas/${ideaId}/monthly-updates`, updateData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit monthly update');
    }
    return response.data;
  },
  
  // Get all monthly updates for the current user
  getMyMonthlyUpdates: async (): Promise<any[]> => {
    const response = await api.get(`/my-monthly-updates`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get monthly updates');
    }
    return response.data;
  },

  // Get monthly updates visible to mentor (unwraps { updates: [...] })
  getMentorMonthlyUpdates: async (): Promise<any[]> => {
    const response = await api.get(`/mentor/monthly-updates`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get mentor monthly updates');
    }
    const data: any = response.data;
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.updates)) return data.updates;
    return [];
  },
  
  // Upload document for an idea
  uploadIdeaDocument: async (ideaId: string, file: File, documentCategory: string, mentorUserId: string): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_category', documentCategory);
    formData.append('mentor_user_id', mentorUserId);
    
    const response = await api.upload(`/simple-ideas/${ideaId}/documents/upload`, formData);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload document');
    }
    
    return response.data;
  },
  
  // Get all documents for the current user
  getMyDocuments: async (): Promise<any[]> => {
    const response = await api.get(`/my-documents`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get documents');
    }
    return response.data;
  },

  // Email sending endpoint
  sendEmail: async (emailData: {
    sender_email: string;
    receiver_email: string;
    subject: string;
    body: string;
    is_html?: boolean;
  }) => {
    const response = await api.post(`/email/send-user-to-user`, emailData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send email');
    }
    return response.data;
  },

  // Interview scheduling endpoint
  scheduleInterview: async (applicationId: string, scheduleData: {
    mentor_email: string;
    founder_email: string;
    scheduled_at: string;
    notes?: string;
  }) => {
    const response = await api.post(`/mentor-onboarding/applications/${applicationId}/schedule-interview`, scheduleData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to schedule interview');
    }
    return response.data;
  },

  // Create agreement endpoint
  createAgreement: async (agreementData: {
    application_id: string;
    tenure: string;
    equity_percentage: number;
    time_commitment: string;
    introduction_to_network: string;
    expertise_guidance_areas: string;
    additional_deliverables: string;
  }) => {
    const response = await api.post(`/mentor-onboarding/agreements`, agreementData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to create agreement');
    }
    return response.data;
  },

  // Get agreements for a specific application
  getApplicationAgreements: async (applicationId: string) => {
    const response = await api.get(`/mentor-onboarding/applications/${applicationId}/agreements`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get application agreements');
    }
    return response.data;
  },

  // Approve an agreement
  approveAgreement: async (agreementId: string) => {
    const response = await api.post(`/mentor-onboarding/agreements/${agreementId}/approve`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to approve agreement');
    }
    return response.data;
  },

  // Update an agreement (counter proposal)
  updateAgreement: async (agreementId: string, updateData: {
    tenure?: string;
    equity_percentage?: number;
    time_commitment?: string;
    introduction_to_network?: string;
    expertise_guidance_areas?: string;
    additional_deliverables?: string;
    notes?: string;
  }) => {
    const response = await api.post(`/mentor-onboarding/agreements/${agreementId}/update`, updateData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update agreement');
    }
    return response.data;
  },

  // Save mentor application step data (POST to create)
  saveMentorApplicationStep: async (stepData: any) => {
    const response = await api.post(`/mentor-onboarding/applications`, stepData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to save application step');
    }
    return response.data;
  },

  // Update mentor application step data (PUT to update)
  updateMentorApplicationStep: async (applicationId: string, stepData: any) => {
    const response = await api.put(`/mentor-onboarding/applications/${applicationId}`, stepData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update application step');
    }
    return response.data;
  },

  // Upload mentor application files (deck and product images)
  uploadMentorApplicationFiles: async (files: { deckFile?: File; productImages?: File[] }, applicationId?: string) => {
    const formData = new FormData();
    
    if (files.deckFile) {
      formData.append('deck_file', files.deckFile);
    }
    
    if (files.productImages && files.productImages.length > 0) {
      files.productImages.forEach((image, index) => {
        formData.append(`product_image_${index}`, image);
      });
    }
    
    if (applicationId) {
      formData.append('application_id', applicationId);
    }
    
    const response = await api.upload(`/mentor-onboarding/applications/upload-files`, formData);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload files');
    }
    
    return response.data;
  },

  // Upload pitch deck for pitch tank waitlist
  uploadPitchDeck: async (file: File, userId: string): Promise<{ deck_url?: string; pitch_deck_url?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    
    const response = await api.upload(`/api/waitlist/pitch-tank/upload-deck`, formData);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to upload pitch deck');
    }
    
    return response.data;
  },
};

// Monthly Update Data Interface
export interface MonthlyUpdateData {
  update_date: string; // Format: "2024-10"
  mentor_user_id: string;
  mrr: number;
  active_users: number;
  runway: number;
  cac: number;
  key_highlights: string;
  challenges: string;
  key_milestones_achieved: string[];
  upcoming_milestones: string[];
  team_updates: string;
  funding_update: string;
  ask_from_investors_mentors: string;
}

// Type definitions for mentor data from backend
export interface MentorBasicInfo {
  fullName: string;
  professionalHeadline: string;
  city: string;
  country: string;
}

// My Mentors API response structure
export interface MyMentorsResponse {
  application_id: string;
  mentor_profile: MentorData;
  application_created_at: string;
  application_accepted_at: string;
}

export interface MentorExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  summary: string;
}

export interface MentorshipFocus {
  industryVerticals: string[];
  functionalAreas: string[];
  availability: string | null;
}

export interface MentorSocials {
  linkedinProfile: string | null;
  twitterProfile: string | null;
  personalWebsite: string | null;
  angelListProfile: string | null;
}

export interface MentorData {
  mentor_id: string;
  basic_information: MentorBasicInfo;
  about: string;
  experiences: MentorExperience[];
  mentorship_focus: MentorshipFocus;
  socials: MentorSocials;
  referrals: any[];
  recommendation_1_name: string | null;
  recommendation_1_email: string | null;
  recommendation_1_text: string | null;
  recommendation_2_name: string | null;
  recommendation_2_email: string | null;
  recommendation_2_text: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  has_applied?: boolean;
  application_step?: string | null;
  application_status?: string | null;
}

export interface MentorApplicationData {
  mentor_user_id: string;
  idea_id: string;
  why_want_mentor: string;
  mentorship_goals: string;
  applicant_background: string;
  preferred_meeting_frequency: string;
}

// Idea API endpoints
export interface IdeaSubmissionData {
  title: string;
  industry: string;
  description: string;
  idea_type: 'idea' | 'startup';
}

export interface IdeaSubmissionResponse {
  id?: string;
  idea_id?: string; // Backend might use this field name
  title: string;
  industry: string;
  description: string;
  idea_type: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Founder API endpoints
export const founderAPI = {
  // Get founder's own profile
  getMyFounderProfile: async (): Promise<any> => {
    const response = await api.get(`/profile/me`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get founder profile');
    }
    return response.data;
  },
  
  // Update founder profile
  updateProfile: async (payload: any): Promise<any> => {
    const response = await api.put(`/profile/update`, payload);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update profile');
    }
    return response.data;
  },
};

// Partners API endpoints
export const partnersAPI = {
  // Get all partners with pagination
  getPartners: async (limit: number = 10, offset: number = 0) => {
    const response = await api.get(`/partners/all?limit=${limit}&offset=${offset}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get partners');
    }
    return response.data;
  },
};

// Idea API endpoints
export const ideaAPI = {
  // Submit a new simple idea
  submitSimpleIdea: async (ideaData: IdeaSubmissionData): Promise<IdeaSubmissionResponse> => {
    const response = await api.post(`/submit-simple-idea`, ideaData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to submit idea');
    }
    return response.data;
  },
  
  // Get all ideas for the current user
  getAllIdeas: async (): Promise<IdeaSubmissionResponse[]> => {
    const response = await api.get(`/user-ideas-summary`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get ideas');
    }
    return response.data;
  },
  
  // Get detailed progress for a specific idea
  getIdeaProgressDetails: async (ideaId: string): Promise<any> => {
    const response = await api.get(`/idea-progress-details/${ideaId}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to get idea progress details');
    }
    return response.data;
  },
  
  // Update startup progress
  updateStartupProgress: async (data: {
    idea_id: string;
    step: string;
    completed: boolean;
  }): Promise<any> => {
    const response = await api.post(`/update-startup-progress`, data);
    if (!response.success) {
      throw new Error(response.error || 'Failed to update startup progress');
    }
    return response.data;
  },
};