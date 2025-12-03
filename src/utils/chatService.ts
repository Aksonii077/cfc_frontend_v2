// Chat Service for AI Assistant Backend Integration
// Handles session management and message sending for the AI chat

import { api, ApiResponse } from './axios';
import { validateData, AskResponseSchema, ValidationError, validatePersonArray, validateNextStepArray } from './validation';

// Base URL for the chat API - different from the main API
const CHAT_API_BASE_URL = import.meta.env.VITE_AGENT_URL || 'http://localhost:8003';

// Timeout for agent API calls (default 120 seconds / 2 minutes, can be overridden via env)
const AGENT_API_TIMEOUT = import.meta.env.VITE_AGENT_API_TIMEOUT 
  ? parseInt(import.meta.env.VITE_AGENT_API_TIMEOUT, 10) 
  : 120000; // Default 120 seconds (2 minutes)

// Interface for session start request
export interface StartSessionRequest {
  system_prompt: string;
}

// Interface for session start response
export interface StartSessionResponse {
  session_id: string;
  message?: string;
  system_prompt: string;
}

// Interface for ask request
export interface AskRequest {
  query: string;
  session_id: string;
}

// Interface for people data from API response
export interface PersonData {
  id?: string;
  name: string;
  type?: string;
  industry?: string;
  similarity_score?: number;
  source?: string;
  professional_headline?: string;
  reasoning?: string;
  linkedin_url?: string;
  company_website?: string;
  company_contact_number?: string;
  group?: string;
  // Legacy fields
  title?: string;
  company?: string;
  email?: string;
  relevance?: string;
  tags?: string[];
}

// Interface for next step suggestion data from API response
export interface NextStepSuggestion {
  id: number;
  title: string;
  reason: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
}

// Interface for ask response
export interface AskResponse {
  response?: string;  // Some APIs use 'response'
  answer?: string;    // Some APIs use 'answer'
  session_id: string;
  message_id?: string;
  timestamp?: string;
  people?: PersonData[];
  next_step_suggestion?: NextStepSuggestion[];
}

class ChatService {
  private sessionId: string | null = null;
  private systemPrompt = "You are a helpful AI assistant for the Launch Pad. You help entrepreneurs brainstorm ideas, validate concepts, build prototypes, and take their first steps as entrepreneurs. Be encouraging, practical, and provide actionable advice.";

  /**
   * Start a new chat session
   */
  async startSession(customSystemPrompt?: string): Promise<StartSessionResponse> {
    try {
      const prompt = customSystemPrompt || this.systemPrompt;
      
      // Make API call to start session using axios with custom timeout
      const response = await api.post<StartSessionResponse>(
        `${CHAT_API_BASE_URL}/agentv3/session/start`, 
        {
          system_prompt: prompt
        },
        {
          timeout: AGENT_API_TIMEOUT
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to start session');
      }

      const data = response.data;
      
      if (!data) {
        throw new Error('No data received from session start');
      }
      
      // Store the session ID for future use
      this.sessionId = data.session_id;
      
      console.log('🚀 Chat session started:', data.session_id);
      return data;
    } catch (error) {
      console.error('❌ Error starting chat session:', error);
      throw error;
    }
  }

  /**
   * Send a message to the AI assistant
   */
  async askQuestion(query: string, sessionId?: string): Promise<AskResponse> {
    try {
      const currentSessionId = sessionId || this.sessionId;
      
      if (!currentSessionId) {
        throw new Error('No active session. Please start a session first.');
      }

      // Make API call to ask question using axios with custom timeout
      const response = await api.post<AskResponse>(
        `${CHAT_API_BASE_URL}/agentv3/ask`, 
        {
          query,
          session_id: currentSessionId
        },
        {
          timeout: AGENT_API_TIMEOUT
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }

      const data = response.data;
      
      if (!data) {
        throw new Error('No data received from ask question');
      }
      
      // Validate response data
      try {
        validateData(data, AskResponseSchema);
        
        // Sanitize arrays if they exist but contain invalid items
        if (data.people && Array.isArray(data.people)) {
          data.people = validatePersonArray(data.people);
        }
        if (data.next_step_suggestion && Array.isArray(data.next_step_suggestion)) {
          data.next_step_suggestion = validateNextStepArray(data.next_step_suggestion);
        }
      } catch (error) {
        console.warn('Invalid API response format:', error);
        // Continue with basic response but log the issue
        if (import.meta.env.DEV) {
          console.error('Response validation failed:', error);
        }
      }
      
      console.log('💬 AI response received for session:', currentSessionId);
      
      // Normalize response field - handle both 'response' and 'answer' fields
      if (data.answer && !data.response) {
        data.response = data.answer;
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      throw error;
    }
  }

  /**
   * Initialize session and send first message in one call
   */
  async initializeAndAsk(query: string, customSystemPrompt?: string): Promise<{ sessionData: StartSessionResponse; response: AskResponse }> {
    try {
      // Start new session
      const sessionData = await this.startSession(customSystemPrompt);
      
      // Send the first message
      const response = await this.askQuestion(query, sessionData.session_id);
      
      return { sessionData, response };
    } catch (error) {
      console.error('❌ Error in initialize and ask:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string, limit: number = 10, order: 'asc' | 'desc' = 'asc'): Promise<any> {
    try {
      const response = await api.get<any>(
        `${import.meta.env.VITE_API_BASE_URL}/chat/messages/${sessionId}/raw`,
        {
          params: {
            limit,
            order
          }
        }
      );

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch chat history');
      }

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * Set session ID (useful for continuing existing sessions)
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Clear current session
   */
  clearSession(): void {
    this.sessionId = null;
  }

  /**
   * Check if there's an active session
   */
  hasActiveSession(): boolean {
    return !!this.sessionId;
  }

  /**
   * Update system prompt for current session (would require a new session)
   */
  updateSystemPrompt(newPrompt: string): void {
    this.systemPrompt = newPrompt;
  }

  /**
   * Get current system prompt
   */
  getSystemPrompt(): string {
    return this.systemPrompt;
  }
}

// Export singleton instance
export const chatService = new ChatService();

// Export convenience functions
export const startChatSession = (systemPrompt?: string) => chatService.startSession(systemPrompt);
export const sendChatMessage = (query: string, sessionId?: string) => chatService.askQuestion(query, sessionId);
export const initializeChat = (query: string, systemPrompt?: string) => chatService.initializeAndAsk(query, systemPrompt);