import { supabase } from './client';

// Types
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
  mentorId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 
  | "pending" 
  | "reviewing" 
  | "interview-scheduled" 
  | "interview-completed" 
  | "accepted" 
  | "rejected" 
  | "agreement-ongoing" 
  | "agreement-successful";

export interface InterviewNotes {
  id?: string;
  application_id: string;
  overall_impression: string;
  strengths: string;
  concerns?: string;
  market_fit?: string;
  team_capability?: string;
  next_steps?: string;
  rating: number;
  interview_date: string;
  interview_duration?: string;
  attendees: string[];
  key_questions: Array<{
    question: string;
    answer: string;
  }>;
  follow_up_actions: string[];
  recommendation: "strong-accept" | "accept" | "maybe" | "decline" | "strong-decline";
  mentor_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface AcceptanceEmail {
  id?: string;
  application_id: string;
  template_name: string;
  subject: string;
  body: string;
  recipient_email: string;
  program_details: Record<string, any>;
  links: Record<string, string>;
  sent_at: string;
  mentor_id: string;
  created_at?: string;
}

export interface ApplicationRejection {
  id?: string;
  application_id: string;
  reason: string;
  category: string;
  email_subject: string;
  email_content: string;
  offer_feedback: boolean;
  future_consideration: boolean;
  rejected_at: string;
  mentor_id: string;
  created_at?: string;
}

export class MentorApplicationService {
  // ============= APPLICATION MANAGEMENT =============
  
  /**
   * Get all applications for a mentor
   */
  static async getApplicationsForMentor(mentorId: string): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(this.transformApplicationFromDB);
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  /**
   * Get applications by status
   */
  static async getApplicationsByStatus(mentorId: string, status: ApplicationStatus): Promise<Application[]> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(this.transformApplicationFromDB);
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw error;
    }
  }

  /**
   * Get a single application by ID
   */
  static async getApplication(applicationId: string): Promise<Application | null> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (error) throw error;
      
      return data ? this.transformApplicationFromDB(data) : null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  }

  /**
   * Update application status
   */
  static async updateApplicationStatus(
    applicationId: string, 
    status: ApplicationStatus, 
    additionalData?: Record<string, any>
  ): Promise<void> {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { error } = await supabase
        .from('mentor_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  /**
   * Create a new application (for demo purposes)
   */
  static async createApplication(applicationData: Partial<Application>, mentorId: string): Promise<Application> {
    try {
      const dbData = this.transformApplicationToDB({
        ...applicationData,
        id: crypto.randomUUID(),
        mentor_id: mentorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: applicationData.status || "pending"
      } as Application);

      const { data, error } = await supabase
        .from('mentor_applications')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      
      return this.transformApplicationFromDB(data);
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  // ============= INTERVIEW NOTES MANAGEMENT =============

  /**
   * Save interview notes
   */
  static async saveInterviewNotes(notes: InterviewNotes): Promise<InterviewNotes> {
    try {
      const dbData = {
        application_id: notes.application_id,
        overall_impression: notes.overall_impression,
        strengths: notes.strengths,
        concerns: notes.concerns,
        market_fit: notes.market_fit,
        team_capability: notes.team_capability,
        next_steps: notes.next_steps,
        rating: notes.rating,
        interview_date: notes.interview_date,
        interview_duration: notes.interview_duration,
        attendees: notes.attendees,
        key_questions: notes.key_questions,
        follow_up_actions: notes.follow_up_actions,
        recommendation: notes.recommendation,
        mentor_id: notes.mentor_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = notes.id
        ? await supabase
            .from('interview_notes')
            .update({ ...dbData, updated_at: new Date().toISOString() })
            .eq('id', notes.id)
            .select()
            .single()
        : await supabase
            .from('interview_notes')
            .insert([dbData])
            .select()
            .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error saving interview notes:', error);
      throw error;
    }
  }

  /**
   * Get interview notes for an application
   */
  static async getInterviewNotes(applicationId: string): Promise<InterviewNotes | null> {
    try {
      const { data, error } = await supabase
        .from('interview_notes')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      return data || null;
    } catch (error) {
      console.error('Error fetching interview notes:', error);
      throw error;
    }
  }

  // ============= EMAIL MANAGEMENT =============

  /**
   * Save acceptance email data
   */
  static async saveAcceptanceEmail(emailData: AcceptanceEmail): Promise<AcceptanceEmail> {
    try {
      const dbData = {
        application_id: emailData.application_id,
        template_name: emailData.template_name,
        subject: emailData.subject,
        body: emailData.body,
        recipient_email: emailData.recipient_email,
        program_details: emailData.program_details,
        links: emailData.links,
        sent_at: emailData.sent_at,
        mentor_id: emailData.mentor_id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('acceptance_emails')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error saving acceptance email:', error);
      throw error;
    }
  }

  /**
   * Get acceptance emails for an application
   */
  static async getAcceptanceEmails(applicationId: string): Promise<AcceptanceEmail[]> {
    try {
      const { data, error } = await supabase
        .from('acceptance_emails')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching acceptance emails:', error);
      throw error;
    }
  }

  // ============= REJECTION MANAGEMENT =============

  /**
   * Save application rejection with email data
   */
  static async saveApplicationRejection(rejectionData: {
    application_id: string;
    reason: string;
    category: string;
    email_subject: string;
    email_content: string;
    mentor_id: string;
    offer_feedback?: boolean;
    future_consideration?: boolean;
  }): Promise<ApplicationRejection> {
    try {
      const dbData = {
        application_id: rejectionData.application_id,
        reason: rejectionData.reason,
        category: rejectionData.category,
        email_subject: rejectionData.email_subject,
        email_content: rejectionData.email_content,
        offer_feedback: rejectionData.offer_feedback || false,
        future_consideration: rejectionData.future_consideration || false,
        rejected_at: new Date().toISOString(),
        mentor_id: rejectionData.mentor_id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('application_rejections')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error saving application rejection:', error);
      throw error;
    }
  }

  /**
   * Get rejection details for an application
   */
  static async getApplicationRejection(applicationId: string): Promise<ApplicationRejection | null> {
    try {
      const { data, error } = await supabase
        .from('application_rejections')
        .select('*')
        .eq('application_id', applicationId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      
      return data || null;
    } catch (error) {
      console.error('Error fetching application rejection:', error);
      throw error;
    }
  }

  // ============= STATISTICS =============

  /**
   * Get mentor application statistics
   */
  static async getMentorStats(mentorId: string): Promise<{
    total: number;
    pending: number;
    interviewScheduled: number;
    interviewCompleted: number;
    accepted: number;
    rejected: number;
    agreementOngoing: number;
    agreementSuccessful: number;
    averageAiScore: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('status, ai_score')
        .eq('mentor_id', mentorId);

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: 0,
        interviewScheduled: 0,
        interviewCompleted: 0,
        accepted: 0,
        rejected: 0,
        agreementOngoing: 0,
        agreementSuccessful: 0,
        averageAiScore: 0
      };

      let totalScore = 0;
      data.forEach(app => {
        switch (app.status) {
          case 'pending':
            stats.pending++;
            break;
          case 'interview-scheduled':
            stats.interviewScheduled++;
            break;
          case 'interview-completed':
            stats.interviewCompleted++;
            break;
          case 'accepted':
            stats.accepted++;
            break;
          case 'rejected':
            stats.rejected++;
            break;
          case 'agreement-ongoing':
            stats.agreementOngoing++;
            break;
          case 'agreement-successful':
            stats.agreementSuccessful++;
            break;
        }
        totalScore += app.ai_score || 0;
      });

      stats.averageAiScore = data.length > 0 ? Math.round(totalScore / data.length) : 0;

      return stats;
    } catch (error) {
      console.error('Error fetching mentor stats:', error);
      throw error;
    }
  }

  // ============= HELPER METHODS =============

  /**
   * Transform database row to Application object
   */
  private static transformApplicationFromDB(dbRow: any): Application {
    return {
      id: dbRow.id,
      startupName: dbRow.startup_name,
      founderName: dbRow.founder_name,
      founderEmail: dbRow.founder_email,
      industry: dbRow.industry,
      stage: dbRow.stage,
      location: dbRow.location,
      requestedFunding: dbRow.requested_funding,
      aiScore: dbRow.ai_score,
      marketScore: dbRow.market_score,
      teamScore: dbRow.team_score,
      ideaScore: dbRow.idea_score,
      fitScore: dbRow.fit_score,
      submittedAt: dbRow.submitted_at,
      status: dbRow.status,
      description: dbRow.description,
      teamSize: dbRow.team_size,
      previousFunding: dbRow.previous_funding,
      revenueStage: dbRow.revenue_stage,
      mentorId: dbRow.mentor_id,
      createdAt: dbRow.created_at,
      updatedAt: dbRow.updated_at
    };
  }

  /**
   * Transform Application object to database format
   */
  private static transformApplicationToDB(app: Application): any {
    return {
      id: app.id,
      startup_name: app.startupName,
      founder_name: app.founderName,
      founder_email: app.founderEmail,
      industry: app.industry,
      stage: app.stage,
      location: app.location,
      requested_funding: app.requestedFunding,
      ai_score: app.aiScore,
      market_score: app.marketScore,
      team_score: app.teamScore,
      idea_score: app.ideaScore,
      fit_score: app.fitScore,
      submitted_at: app.submittedAt,
      status: app.status,
      description: app.description,
      team_size: app.teamSize,
      previous_funding: app.previousFunding,
      revenue_stage: app.revenueStage,
      mentor_id: app.mentorId,
      created_at: app.createdAt,
      updated_at: app.updatedAt
    };
  }

  // ============= DEMO DATA SEEDING =============

  /**
   * Seed demo data for testing - all applications in pending status
   */
  static async seedDemoData(mentorId: string): Promise<void> {
    const demoApplications = [
      {
        startupName: "EcoCharge Solutions",
        founderName: "Sarah Chen",
        founderEmail: "sarah@ecocharge.com",
        industry: "Clean Energy",
        stage: "Seed",
        location: "San Francisco, CA",
        requestedFunding: 250000,
        aiScore: 87,
        marketScore: 92,
        teamScore: 78,
        ideaScore: 85,
        fitScore: 89,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        status: "pending" as ApplicationStatus,
        description: "Revolutionary AI-powered solar panel optimization system that increases energy efficiency by 40% through real-time weather prediction and grid balancing. Our proprietary machine learning algorithms analyze weather patterns, energy demand, and grid conditions to optimize panel positioning and energy storage in real-time.",
        teamSize: 5,
        previousFunding: 50000,
        revenueStage: "Pre-revenue",
        mentorId: mentorId
      },
      {
        startupName: "HealthAI Diagnostics",
        founderName: "Dr. Michael Rodriguez",
        founderEmail: "michael@healthai.com",
        industry: "Healthcare",
        stage: "Series A",
        location: "Boston, MA",
        requestedFunding: 500000,
        aiScore: 93,
        marketScore: 95,
        teamScore: 88,
        ideaScore: 91,
        fitScore: 94,
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        status: "pending" as ApplicationStatus,
        description: "AI-powered medical imaging platform that can detect early-stage diseases with 99.2% accuracy, reducing diagnosis time from weeks to minutes. Our deep learning models are trained on over 2 million medical images and can identify 15+ different conditions including early-stage cancers, neurological disorders, and cardiovascular anomalies.",
        teamSize: 12,
        previousFunding: 1200000,
        revenueStage: "$500K ARR",
        mentorId: mentorId
      },
      {
        startupName: "FinFlow Analytics",
        founderName: "Alex Kumar",
        founderEmail: "alex@finflow.com",
        industry: "FinTech",
        stage: "Seed",
        location: "New York, NY",
        requestedFunding: 300000,
        aiScore: 76,
        marketScore: 82,
        teamScore: 72,
        ideaScore: 75,
        fitScore: 77,
        submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: "pending" as ApplicationStatus,
        description: "Small business cash flow prediction platform using machine learning to help SMEs optimize their financial planning and avoid cash crunches. Our predictive models analyze transaction patterns, seasonal trends, and market conditions to provide 90-day cash flow forecasts with 95% accuracy.",
        teamSize: 8,
        previousFunding: 150000,
        revenueStage: "$100K ARR",
        mentorId: mentorId
      },
      {
        startupName: "AgriTech Innovations",
        founderName: "Maria Gonzalez",
        founderEmail: "maria@agritech.com",
        industry: "Agriculture",
        stage: "Pre-Seed",
        location: "Austin, TX",
        requestedFunding: 180000,
        aiScore: 82,
        marketScore: 85,
        teamScore: 79,
        ideaScore: 83,
        fitScore: 81,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: "pending" as ApplicationStatus,
        description: "IoT-based precision farming solution that uses soil sensors and satellite imagery to optimize crop yields while reducing water usage by 30%. Our system combines edge computing with satellite data to provide real-time insights on soil moisture, nutrient levels, and pest detection across large farming operations.",
        teamSize: 4,
        previousFunding: 25000,
        revenueStage: "Pre-revenue",
        mentorId: mentorId
      },
      {
        startupName: "EduTech Catalyst",
        founderName: "James Thompson",
        founderEmail: "james@edutech.com",
        industry: "Education Technology",
        stage: "Seed",
        location: "Seattle, WA",
        requestedFunding: 400000,
        aiScore: 89,
        marketScore: 91,
        teamScore: 85,
        ideaScore: 88,
        fitScore: 90,
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        status: "pending" as ApplicationStatus,
        description: "AI-powered personalized learning platform that adapts to each student's learning style, pace, and preferences. Our adaptive algorithms create unique learning paths for K-12 students, improving engagement by 65% and learning outcomes by 40% compared to traditional methods.",
        teamSize: 9,
        previousFunding: 200000,
        revenueStage: "$150K ARR",
        mentorId: mentorId
      },
      {
        startupName: "CyberShield Security",
        founderName: "Raj Patel",
        founderEmail: "raj@cybershield.com",
        industry: "Cybersecurity",
        stage: "Series A",
        location: "Palo Alto, CA",
        requestedFunding: 750000,
        aiScore: 91,
        marketScore: 94,
        teamScore: 87,
        ideaScore: 89,
        fitScore: 92,
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        status: "pending" as ApplicationStatus,
        description: "Next-generation AI-driven cybersecurity platform that uses behavioral analysis and machine learning to detect and prevent sophisticated cyber attacks in real-time. Our system identifies zero-day exploits and advanced persistent threats with 99.7% accuracy while reducing false positives by 85%.",
        teamSize: 15,
        previousFunding: 2000000,
        revenueStage: "$800K ARR",
        mentorId: mentorId
      },
      {
        startupName: "GreenLogistics",
        founderName: "Emma Wilson",
        founderEmail: "emma@greenlogistics.com",
        industry: "Logistics & Supply Chain",
        stage: "Pre-Seed",
        location: "Denver, CO",
        requestedFunding: 220000,
        aiScore: 78,
        marketScore: 81,
        teamScore: 75,
        ideaScore: 79,
        fitScore: 77,
        submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        status: "pending" as ApplicationStatus,
        description: "Sustainable last-mile delivery optimization platform that reduces carbon emissions by 45% through AI-powered route optimization and electric vehicle fleet management. Our solution integrates with existing logistics systems and provides real-time tracking and environmental impact reporting.",
        teamSize: 6,
        previousFunding: 75000,
        revenueStage: "Pre-revenue",
        mentorId: mentorId
      },
      {
        startupName: "MoodWell Mental Health",
        founderName: "Dr. Lisa Chang",
        founderEmail: "lisa@moodwell.com",
        industry: "Digital Health",
        stage: "Seed",
        location: "Chicago, IL",
        requestedFunding: 350000,
        aiScore: 85,
        marketScore: 88,
        teamScore: 82,
        ideaScore: 86,
        fitScore: 84,
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
        status: "pending" as ApplicationStatus,
        description: "AI-powered mental health platform that provides personalized therapy recommendations and real-time mood tracking through voice analysis and behavioral patterns. Our HIPAA-compliant platform combines evidence-based therapy techniques with machine learning to improve mental health outcomes by 60%.",
        teamSize: 7,
        previousFunding: 120000,
        revenueStage: "$80K ARR",
        mentorId: mentorId
      },
      {
        startupName: "BlockChain Supply Co",
        founderName: "David Kim",
        founderEmail: "david@blockchainsupply.com",
        industry: "Blockchain",
        stage: "Series A",
        location: "Miami, FL",
        requestedFunding: 600000,
        aiScore: 73,
        marketScore: 76,
        teamScore: 70,
        ideaScore: 74,
        fitScore: 72,
        submittedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days ago
        status: "pending" as ApplicationStatus,
        description: "Blockchain-based supply chain transparency platform that enables complete product traceability from manufacturer to consumer. Our solution uses smart contracts and IoT sensors to create immutable records of product journey, reducing counterfeiting by 90% and improving consumer trust.",
        teamSize: 11,
        previousFunding: 800000,
        revenueStage: "$250K ARR",
        mentorId: mentorId
      },
      {
        startupName: "RoboKitchen AI",
        founderName: "Sophie Martinez",
        founderEmail: "sophie@robokitchen.com",
        industry: "Food Technology",
        stage: "Pre-Seed",
        location: "Portland, OR",
        requestedFunding: 320000,
        aiScore: 80,
        marketScore: 83,
        teamScore: 77,
        ideaScore: 81,
        fitScore: 79,
        submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        status: "pending" as ApplicationStatus,
        description: "Autonomous kitchen robotics system powered by computer vision and machine learning that can prepare complex meals with restaurant-quality precision. Our robots can cook 200+ recipes, adapt to dietary restrictions, and learn from user preferences to personalize meal preparation.",
        teamSize: 8,
        previousFunding: 180000,
        revenueStage: "Pre-revenue",
        mentorId: mentorId
      },
      {
        startupName: "CloudSync Analytics",
        founderName: "Ryan Foster",
        founderEmail: "ryan@cloudsync.com",
        industry: "SaaS & Cloud Computing",
        stage: "Seed",
        location: "San Diego, CA",
        requestedFunding: 450000,
        aiScore: 88,
        marketScore: 90,
        teamScore: 86,
        ideaScore: 87,
        fitScore: 89,
        submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        status: "accepted" as ApplicationStatus,
        description: "Enterprise-grade cloud data analytics platform that provides real-time insights across multi-cloud environments. Our platform unifies data from AWS, Azure, and Google Cloud, offering advanced analytics, predictive modeling, and automated reporting. With 150+ enterprise clients, we're processing 10TB+ of data daily with 99.99% uptime.",
        teamSize: 14,
        previousFunding: 350000,
        revenueStage: "$400K ARR",
        mentorId: mentorId
      }
    ];

    try {
      for (const app of demoApplications) {
        const appData: Application = {
          ...app,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const dbData = this.transformApplicationToDB(appData);

        const { error } = await supabase
          .from('mentor_applications')
          .insert([dbData]);

        if (error) {
          console.error('Error seeding application:', error);
          // Continue with other applications
        }
      }
    } catch (error) {
      console.error('Error seeding demo data:', error);
      throw error;
    }
  }

  /**
   * Seed comprehensive pending applications for testing the full review workflow
   */
  static async seedPendingTestData(mentorId: string): Promise<void> {
    // Clear existing demo data first
    await this.clearDemoData(mentorId);
    
    // Use the existing seedDemoData method which now creates all pending applications
    await this.seedDemoData(mentorId);
  }

  /**
   * Clear all demo data for a mentor (useful for resetting test environment)
   */
  static async clearDemoData(mentorId: string): Promise<void> {
    try {
      // Delete all applications for this mentor
      const { error } = await supabase
        .from('mentor_applications')
        .delete()
        .eq('mentor_id', mentorId);

      if (error) {
        console.error('Error clearing demo data:', error);
        throw error;
      }
      
      console.log('Successfully cleared all demo data for mentor:', mentorId);
    } catch (error) {
      console.error('Error clearing demo data:', error);
      throw error;
    }
  }

  /**
   * Get applications summary for testing purposes
   */
  static async getApplicationsSummary(mentorId: string): Promise<{
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    byIndustry: Record<string, number>;
    byStage: Record<string, number>;
    averageAiScore: number;
    totalFundingRequested: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .eq('mentor_id', mentorId);

      if (error) throw error;

      const summary = {
        total: data.length,
        byStatus: {} as Record<ApplicationStatus, number>,
        byIndustry: {} as Record<string, number>,
        byStage: {} as Record<string, number>,
        averageAiScore: 0,
        totalFundingRequested: 0
      };

      let totalAiScore = 0;
      let totalFunding = 0;

      data.forEach(app => {
        // Count by status
        summary.byStatus[app.status as ApplicationStatus] = (summary.byStatus[app.status as ApplicationStatus] || 0) + 1;
        
        // Count by industry
        summary.byIndustry[app.industry] = (summary.byIndustry[app.industry] || 0) + 1;
        
        // Count by stage
        summary.byStage[app.stage] = (summary.byStage[app.stage] || 0) + 1;
        
        // Sum scores and funding
        totalAiScore += app.ai_score;
        totalFunding += app.requested_funding;
      });

      summary.averageAiScore = data.length > 0 ? Math.round(totalAiScore / data.length) : 0;
      summary.totalFundingRequested = totalFunding;

      return summary;
    } catch (error) {
      console.error('Error fetching applications summary:', error);
      throw error;
    }
  }
}

// Database schema creation (SQL commands to run in Supabase SQL editor)
export const DATABASE_SCHEMA = `
-- Create mentor_applications table
CREATE TABLE IF NOT EXISTS mentor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_name TEXT NOT NULL,
  founder_name TEXT NOT NULL,
  founder_email TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage TEXT NOT NULL,
  location TEXT NOT NULL,
  requested_funding INTEGER NOT NULL,
  ai_score INTEGER NOT NULL,
  market_score INTEGER NOT NULL,
  team_score INTEGER NOT NULL,
  idea_score INTEGER NOT NULL,
  fit_score INTEGER NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'reviewing', 'interview-scheduled', 'interview-completed', 'accepted', 'rejected', 'agreement-ongoing', 'agreement-successful')),
  description TEXT NOT NULL,
  team_size INTEGER NOT NULL,
  previous_funding INTEGER NOT NULL,
  revenue_stage TEXT NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create interview_notes table
CREATE TABLE IF NOT EXISTS interview_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  overall_impression TEXT NOT NULL,
  strengths TEXT NOT NULL,
  concerns TEXT,
  market_fit TEXT,
  team_capability TEXT,
  next_steps TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  interview_date DATE NOT NULL,
  interview_duration TEXT,
  attendees JSONB NOT NULL,
  key_questions JSONB NOT NULL,
  follow_up_actions JSONB NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('strong-accept', 'accept', 'maybe', 'decline', 'strong-decline')),
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create acceptance_emails table
CREATE TABLE IF NOT EXISTS acceptance_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  program_details JSONB NOT NULL,
  links JSONB NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application_rejections table
CREATE TABLE IF NOT EXISTS application_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES mentor_applications(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  rejected_at TIMESTAMP WITH TIME ZONE NOT NULL,
  mentor_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_applications_mentor_id ON mentor_applications(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_status ON mentor_applications(status);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_created_at ON mentor_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_interview_notes_application_id ON interview_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_acceptance_emails_application_id ON acceptance_emails(application_id);
CREATE INDEX IF NOT EXISTS idx_application_rejections_application_id ON application_rejections(application_id);

-- Enable Row Level Security (RLS)
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE acceptance_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_rejections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (replace with your auth logic)
CREATE POLICY "mentors_can_view_their_applications" ON mentor_applications
  FOR ALL USING (auth.uid()::text = mentor_id::text);

CREATE POLICY "mentors_can_view_their_interview_notes" ON interview_notes
  FOR ALL USING (auth.uid()::text = mentor_id::text);

CREATE POLICY "mentors_can_view_their_emails" ON acceptance_emails
  FOR ALL USING (auth.uid()::text = mentor_id::text);

CREATE POLICY "mentors_can_view_their_rejections" ON application_rejections
  FOR ALL USING (auth.uid()::text = mentor_id::text);
`;