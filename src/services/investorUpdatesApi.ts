/**
 * Investor Updates API Service
 * Simple API service to fetch investor updates
 */

import { api } from '../utils/axios';

export interface ApiUpdate {
  update_id: number;
  idea_id: string;
  user_id: string;
  month: number;
  year: number;
  mrr: number;
  mrr_growth: number;
  burn_rate: number;
  cash_runway: number;
  user_growth: number;
  customer_churn: number | null;
  cac: number | null;
  ltv: number | null;
  new_customers: number | null;
  active_users: number | null;
  key_highlights: string;
  challenges: string | null;
  team_updates: string | null;
  fundraising_update: string | null;
  ask_from_investors: string | null;
  additional_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestorUpdateApiResponse {
  idea_id: string;
  total_updates: number;
  updates: ApiUpdate[];
}

export interface CreateUpdateRequest {
  month: number;
  year: number;
  mrr: number;
  mrr_growth: number;
  burn_rate: number;
  cash_runway: number;
  user_growth: number;
  customer_churn: number;
  cac: number;
  ltv: number;
  new_customers: number;
  active_users: number;
  key_highlights: string;
  challenges: string;
  team_updates: string;
  fundraising_update: string;
  ask_from_investors: string;
  additional_notes: string;
}

export class InvestorUpdatesApi {
  /**
   * Fetch investor updates for a specific idea
   */
  static async getInvestorUpdates(ideaId: string) {
    try {
      console.log(`InvestorUpdatesApi - Fetching updates for idea: ${ideaId}`);
      
      const response = await api.get<InvestorUpdateApiResponse>(
        `/mentor-onboarding/ideas/${ideaId}/investor-updates`
      );
      
      console.log('InvestorUpdatesApi - Response:', response);
      console.log('InvestorUpdatesApi - Data:', response.data);
      
      return response;
    } catch (error) {
      console.error('InvestorUpdatesApi - Error:', error);
      throw error;
    }
  }

  /**
   * Create a new investor update
   */
  static async createInvestorUpdate(ideaId: string, updateData: CreateUpdateRequest) {
    try {
      console.log(`InvestorUpdatesApi - Creating update for idea: ${ideaId}`);
      console.log('InvestorUpdatesApi - Update data:', updateData);
      
      const response = await api.post<ApiUpdate>(
        `/mentor-onboarding/ideas/${ideaId}/investor-updates`,
        updateData
      );
      
      console.log('InvestorUpdatesApi - Create response:', response);
      console.log('InvestorUpdatesApi - Created update:', response.data);
      
      return response;
    } catch (error) {
      console.error('InvestorUpdatesApi - Create error:', error);
      throw error;
    }
  }

  /**
   * Transform API update to UI format
   */
  static transformApiUpdate(apiUpdate: ApiUpdate) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    return {
      id: apiUpdate.update_id.toString(),
      month: monthNames[apiUpdate.month - 1] || 'Unknown',
      year: apiUpdate.year,
      status: 'submitted' as const,
      submittedAt: apiUpdate.created_at,
      submittedBy: 'Founder',
      metrics: {
        mrr: apiUpdate.mrr || 0,
        mrrGrowth: apiUpdate.mrr_growth || 0,
        burnRate: apiUpdate.burn_rate || 0,
        cashRunway: apiUpdate.cash_runway || 0,
        userGrowth: apiUpdate.user_growth || 0,
        customerChurn: apiUpdate.customer_churn || 0,
        cac: apiUpdate.cac || 0,
        ltv: apiUpdate.ltv || 0,
        newCustomers: apiUpdate.new_customers || 0,
        activeUsers: apiUpdate.active_users || 0,
      },
      highlights: apiUpdate.key_highlights || '',
      challenges: apiUpdate.challenges || '',
      keyMilestones: [],
      upcomingMilestones: [],
      teamUpdates: apiUpdate.team_updates || '',
      fundraisingUpdate: apiUpdate.fundraising_update || '',
      askFromInvestors: apiUpdate.ask_from_investors || '',
      attachments: [],
      notes: apiUpdate.additional_notes || '',
    };
  }
}

export default InvestorUpdatesApi;