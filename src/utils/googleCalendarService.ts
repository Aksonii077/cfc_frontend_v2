// Google Calendar Service - Real Backend Integration
// Integrates with backend API for Google Calendar OAuth and sync
// Now powered by axios with interceptors

import { api, tokenUtils } from './axios';
import { supabase } from './supabase/client';

// Check if we're in mock mode - controlled by environment variable
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true' || false;

export interface CalendarEvent {
  id: string;
  google_event_id?: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  location?: string;
  meeting_link?: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  user_id?: string;
}

export interface CalendarStatus {
  user_id: string;
  calendar_connected: boolean;
  last_sync?: string;
  credentials_stored_at?: string;
  scopes?: string[];
  message: string;
}

export interface CalendarEventsResponse {
  email: string;
  total_events: number;
  total_free_slots: number;
  total_blocked_slots: number;
  date_range: {
    start: string;
    end: string;
  };
  events: CalendarEvent[];
  free_slots: Array<{ start: string; end: string }>;
  blocked_slots: Array<{ start: string; end: string }>;
}

export interface SyncResult {
  success: boolean;
  message: string;
  user_id: string;
  sync_result?: {
    success: boolean;
    events_synced: number;
    events: CalendarEvent[];
    last_sync: string;
  };
}

class GoogleCalendarService {
  // Get JWT token from auth
  private async getAuthToken(): Promise<string | null> {
    console.log('🔑 Getting JWT token...');
    console.log('Mode:', MOCK_MODE ? 'MOCK' : 'PRODUCTION');

    // 1) Prefer an existing JWT from localStorage (authoritative)
    const localToken = tokenUtils.getToken();
    if (localToken && localToken.trim().length > 0) {
      console.log('✅ Using localStorage access_token:', localToken.substring(0, 30) + '...');
      return localToken;
    }

    // 2) Fallback to Supabase session token if available
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        console.log('✅ Using Supabase JWT token:', session.access_token.substring(0, 30) + '...');
        return session.access_token;
      }
    } catch (e) {
      console.error('Failed to get Supabase session:', e);
    }

    console.error('❌ No JWT token found!');
    return null;
  }

  /**
   * 1️⃣ Check Calendar Connection Status (derived via a narrow sync window)
   */
  async checkStatus(): Promise<{ success: boolean; status?: CalendarStatus; error?: string }> {
    try {
      const now = new Date();
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString();
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59)).toISOString();
      
      const response = await api.post<SyncResult>('/calendar/sync', {
        start_date: start,
        end_date: end,
      });

      if (!response.success || !response.data) {
        return { success: false, error: response.error };
      }

      const lastSync = response.data.sync_result?.last_sync || new Date().toISOString();
      return {
        success: true,
        status: {
          user_id: response.data.user_id,
          calendar_connected: true,
          last_sync: lastSync,
          message: 'Calendar connected',
        },
      };
    } catch (e) {
      return { 
        success: false, 
        error: e instanceof Error ? e.message : 'Status check failed' 
      };
    }
  }

  /**
   * 2️⃣ Start Authorization - get Google OAuth URL
   */
  async startAuth(): Promise<{ success: boolean; auth_url?: string; error?: string }> {
    const response = await api.get<{ auth_url: string }>('/calendar/start-auth');
    
    return response.success 
      ? { success: true, auth_url: response.data?.auth_url } 
      : { success: false, error: response.error };
  }

  /**
   * 3️⃣ Complete Authorization with code
   */
  async completeAuth(authCode: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await api.post<{ success: boolean; message: string; user_id: string }>(
      '/calendar/complete-auth',
      { auth_code: authCode }
    );
    
    return response.success 
      ? { success: true, message: response.data?.message } 
      : { success: false, error: response.error };
  }

  /**
   * Connect Calendar - Wrapper around getAuthUrl that handles the redirect
   * ALWAYS calls backend API - no mock mode for connection
   */
  async connect(): Promise<{ success: boolean; message: string; error?: string }> {
    // Start OAuth and redirect user
    console.log('🔗 Starting Google Calendar OAuth');
    const res = await this.startAuth();
    
    if (!res.success || !res.auth_url) {
      return { 
        success: false, 
        message: '', 
        error: res.error || 'No auth URL' 
      };
    }
    
    window.location.href = res.auth_url;
    return { success: true, message: 'Redirecting to Google...' };
  }

  /**
   * 3️⃣ Sync Calendar
   * Call this after OAuth is complete to sync events from Google Calendar
   * ALWAYS calls backend API - no mock mode
   */
  async syncCalendar(startDate?: string, endDate?: string): Promise<{ success: boolean; result?: SyncResult; error?: string }> {
    console.log('🔄 Syncing Google Calendar...');
    
    const now = new Date();
    const defaultStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString();
    const defaultEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 30, 23, 59, 59)).toISOString();
    
    const response = await api.post<SyncResult>('/calendar/sync', {
      start_date: startDate || defaultStart,
      end_date: endDate || defaultEnd,
    });
    
    console.log('📥 Sync response:', response);
    
    return response.success 
      ? { success: true, result: response.data } 
      : { success: false, error: response.error };
  }

  /**
   * Get Calendar Events for Date Range
   */
  async getEvents(startDate: string, endDate: string): Promise<{ success: boolean; data?: CalendarEventsResponse; error?: string }> {
    // Reuse sync endpoint to fetch events
    const res = await this.syncCalendar(startDate, endDate);
    
    if (!res.success || !res.result) {
      return { success: false, error: res.error };
    }
    
    const events = (res.result.sync_result?.events || []) as CalendarEvent[];
    
    return {
      success: true,
      data: {
        email: '',
        total_events: events.length,
        total_free_slots: 0,
        total_blocked_slots: 0,
        date_range: { start: startDate, end: endDate },
        events,
        free_slots: [],
        blocked_slots: [],
      },
    };
  }

  /**
   * Disconnect Calendar
   */
  async disconnect(): Promise<{ success: boolean; message?: string; error?: string }> {
    if (MOCK_MODE) {
      localStorage.removeItem('google_calendar_connected');
      return {
        success: true,
        message: 'Calendar disconnected successfully',
      };
    }

    const response = await api.delete<{ success: boolean; message: string }>('/calendar/disconnect');
    
    return response.success 
      ? { success: true, message: response.data?.message }
      : { success: false, error: response.error };
  }

  /**
   * Check if calendar is connected (convenience method)
   */
  async isConnected(): Promise<boolean> {
    const result = await this.checkStatus();
    return result.success && result.status?.calendar_connected === true;
  }

  // Helper: Get mock events for testing
  private getMockEvents(): CalendarEvent[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 0, 0, 0);

    return [
      {
        id: 'evt_1',
        google_event_id: 'google_evt_1',
        title: 'Interview: HealthAI Startup',
        description: 'Mentorship interview with HealthAI',
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
        attendees: ['michael@healthai.com'],
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        status: 'confirmed',
      },
      {
        id: 'evt_2',
        google_event_id: 'google_evt_2',
        title: 'Portfolio Review Meeting',
        description: 'Monthly portfolio review',
        start_time: nextWeek.toISOString(),
        end_time: new Date(nextWeek.getTime() + 120 * 60 * 1000).toISOString(),
        attendees: ['team@racai.com'],
        status: 'confirmed',
      },
      {
        id: 'evt_3',
        google_event_id: 'google_evt_3',
        title: 'Team Standup',
        description: 'Daily standup meeting',
        start_time: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        attendees: ['team@example.com'],
        status: 'confirmed',
      },
      {
        id: 'evt_4',
        google_event_id: 'google_evt_4',
        title: 'Investment Committee',
        description: 'Review new applications',
        start_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendees: ['committee@racai.com'],
        location: 'Conference Room A',
        status: 'confirmed',
      },
      {
        id: 'evt_5',
        google_event_id: 'google_evt_5',
        title: 'Founder Onboarding',
        description: 'Welcome new founder to the program',
        start_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        attendees: ['founder@startup.com'],
        meeting_link: 'https://meet.google.com/xyz-abcd-efg',
        status: 'confirmed',
      },
    ];
  }
}

// Export singleton instance
export const googleCalendarService = new GoogleCalendarService();