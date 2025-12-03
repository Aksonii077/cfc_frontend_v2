import { useState, useCallback, useRef, useEffect } from 'react';
import { chatService, PersonData, NextStepSuggestion } from '../utils/chatService';

export interface ChatMessage {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: string;
  emotion?: "excited" | "thinking" | "happy" | "encouraging" | "analytical" | "welcoming" | "celebrating" | "neutral";
  isTypingComplete?: boolean;
  onTypingComplete?: () => void;
}

export interface UseChatOptions {
  onPeopleUpdate?: (people: PersonData[]) => void;
  onActionsUpdate?: (actions: NextStepSuggestion[]) => void;
  onIdeaShared?: () => void;
  systemPrompt?: string;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isLoadingHistory: boolean;
  hasSharedIdea: boolean;
  sessionId: string | null;
  isInitialized: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  sendMessage: (message: string) => Promise<void>;
  initializeChat: (welcomeMessage?: string) => void;
  clearChat: () => void;
  retryLastMessage: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    onPeopleUpdate,
    onActionsUpdate,
    onIdeaShared,
    systemPrompt = "You are a helpful AI assistant for the Launch Pad. You help entrepreneurs brainstorm ideas, validate concepts, build prototypes, and take their first steps as entrepreneurs. Be encouraging, practical, and provide actionable advice."
  } = options;

  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasSharedIdea, setHasSharedIdea] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(() => {
    // Try to restore session ID from localStorage
    const savedSessionId = localStorage.getItem('chat_session_id');
    if (savedSessionId) {
      chatService.setSessionId(savedSessionId);
    }
    return savedSessionId;
  });
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Save session ID to localStorage whenever it changes
  useEffect(() => {
    if (sessionId) {
      localStorage.setItem('chat_session_id', sessionId);
    } else {
      localStorage.removeItem('chat_session_id');
    }
  }, [sessionId]);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Note: Message persistence disabled - messages are only stored in session memory

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat history when session is available
  useEffect(() => {
    const loadChatHistory = async () => {
      // Only load if we have a session ID and no messages yet
      if (sessionId && messages.length === 0 && !isLoading && !isLoadingHistory) {
        try {
          setIsLoadingHistory(true);
          console.log('📜 Loading chat history for session:', sessionId);
          const historyData = await chatService.getChatHistory(sessionId);
          
          if (historyData && historyData.messages && historyData.messages.length > 0) {
            const historyMessages: ChatMessage[] = historyData.messages.map((msg: any) => ({
              id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
              message: msg.content || '',
              sender: msg.message_type === 'user_message' ? 'user' : 'ai',
              timestamp: msg.timestamp || new Date().toISOString(),
              emotion: 'neutral',
              isTypingComplete: true,
            }));
            
            setMessages(historyMessages);
            console.log('✅ Loaded chat history:', historyMessages.length, 'messages');
          }
        } catch (error) {
          console.error('❌ Failed to load chat history:', error);
          // Don't block the UI if history loading fails
        } finally {
          setIsLoadingHistory(false);
        }
      }
    };
    
    loadChatHistory();
  }, [sessionId, messages.length, isLoading, isLoadingHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        console.log('🧹 Cleaning up chat session');
        chatService.clearSession();
      }
    };
  }, [sessionId]);

  // Utility functions
  const isBusinessIdea = useCallback((message: string): boolean => {
    if (message.length < 10) return false;
    
    const businessKeywords = [
      "startup", "business", "idea", "company", "service", "product", "app", 
      "platform", "website", "market", "sell", "customer", "brand", "launch", 
      "create", "build", "develop", "want to start", "planning to", "working on"
    ];
    
    const hasBusinessKeyword = businessKeywords.some(
      (keyword) => message.toLowerCase().includes(keyword),
    );

    return message.length > 20 || hasBusinessKeyword;
  }, []);

  const addAIMessage = useCallback(async (message: string, emotion: string = "neutral"): Promise<void> => {
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      message,
      sender: "ai",
      timestamp: new Date().toISOString(),
      emotion: emotion as any,
      isTypingComplete: true, // Show full message immediately
    };

    setMessages((prev) => [...prev, aiMessage]);
    return Promise.resolve();
  }, []);

  const addUserMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message,
      sender: "user",
      timestamp: new Date().toISOString(),
      isTypingComplete: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check if this is a business idea
    if (!hasSharedIdea && isBusinessIdea(message)) {
      setHasSharedIdea(true);
      onIdeaShared?.();
      // Note: Removed hardcoded message - AI will respond contextually through the ask API
    }
  }, [hasSharedIdea, isBusinessIdea, addAIMessage, onIdeaShared]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setIsLoading(true);
    setLastUserMessage(messageText);

    try {
      // Add user message to the chat
      await addUserMessage(messageText);

      // Check if we need to start a new session or continue existing one
      if (!sessionId || !chatService.hasActiveSession()) {
        console.log('🚀 Starting new chat session...');
        
        // Initialize chat session and send first message
        const { sessionData, response } = await chatService.initializeAndAsk(
          messageText,
          systemPrompt
        );
        
        // Store session ID
        setSessionId(sessionData.session_id);
        
        // Add AI response to chat
        console.log('🤖 New Session API Response:', response);
        console.log('🤖 Response text:', response.response);
        console.log('🤖 Answer text:', response.answer);
        const aiResponseText = response.response || response.answer || 'No response received';
        await addAIMessage(aiResponseText, "encouraging");
        
        // Update latest API response data
        if (response.people || response.next_step_suggestion) {
          onPeopleUpdate?.(response.people || []);
          onActionsUpdate?.(response.next_step_suggestion || []);
        }
      } else {
        console.log('💬 Continuing existing session:', sessionId);
        
        // Send message to existing session
        const response = await chatService.askQuestion(messageText, sessionId);
        
        // Add AI response to chat
        console.log('🤖 Existing Session API Response:', response);
        console.log('🤖 Response text:', response.response);
        console.log('🤖 Answer text:', response.answer);
        const aiResponseText = response.response || response.answer || 'No response received';
        await addAIMessage(aiResponseText, "encouraging");
        
        // Update latest API response data
        if (response.people || response.next_step_suggestion) {
          onPeopleUpdate?.(response.people || []);
          onActionsUpdate?.(response.next_step_suggestion || []);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      
      // Add generic error message to chat
      await addAIMessage(
        "I'm experiencing connection issues. Please try again.",
        "neutral"
      );
      
      setIsLoading(false);
    }
  }, [sessionId, isLoading, addUserMessage, addAIMessage, systemPrompt, onPeopleUpdate, onActionsUpdate]);

  const initializeChat = useCallback((welcomeMessage?: string) => {
    // Prevent multiple initializations
    if (isInitialized) {
      console.log('🚫 Chat already initialized, skipping...');
      return;
    }
    
    // Check if we already have messages, if so, don't add welcome message
    if (messages.length > 0) {
      console.log('📝 Messages already exist, just marking as initialized');
      setIsInitialized(true);
      return;
    }
    
    console.log('🚀 Initializing chat with welcome message...');
    setIsInitialized(true);
    
    setTimeout(() => {
      const defaultMessage = welcomeMessage || `Welcome! I'm here to help you with your entrepreneurial journey. How can I assist you today?`;
      
      addAIMessage(defaultMessage, "welcoming");
      
      // Add session status info in development
      if (import.meta.env.DEV) {
        console.log('🎯 Chat initialized. Session status:', {
          hasActiveSession: chatService.hasActiveSession(),
          sessionId: chatService.getCurrentSessionId(),
          chatApiUrl: import.meta.env.VITE_AGENT_URL,
        });
      }
    }, 1000);
  }, [isInitialized, messages.length, addAIMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHasSharedIdea(false);
    setSessionId(null);
    setLastUserMessage('');
    setIsInitialized(false);
    chatService.clearSession();
  }, []);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage && !isLoading) {
      await sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, isLoading, sendMessage]);

  const loadChatHistory = useCallback(async () => {
    if (!sessionId) {
      console.warn('⚠️ No session ID available to load history');
      return;
    }

    try {
      setIsLoadingHistory(true);
      console.log('📜 Manually loading chat history for session:', sessionId);
      const historyData = await chatService.getChatHistory(sessionId);
      
      if (historyData && historyData.messages && historyData.messages.length > 0) {
        const historyMessages: ChatMessage[] = historyData.messages.map((msg: any) => ({
          id: msg.message_id || `msg-${Date.now()}-${Math.random()}`,
          message: msg.content || '',
          sender: msg.message_type === 'user_message' ? 'user' : 'ai',
          timestamp: msg.timestamp || new Date().toISOString(),
          emotion: 'neutral',
          isTypingComplete: true,
        }));
        
        // If there are existing messages, append; otherwise replace
        if (messages.length === 0) {
          setMessages(historyMessages);
          console.log('✅ Loaded chat history:', historyMessages.length, 'messages');
        } else {
          // Prepend old messages to existing messages (for scroll-to-top scenario)
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMessages = historyMessages.filter(m => !existingIds.has(m.id));
            return [...newMessages, ...prev];
          });
          console.log('✅ Loaded older messages from history');
        }
      } else {
        console.log('ℹ️ No history found for this session');
      }
    } catch (error) {
      console.error('❌ Failed to load chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [sessionId, messages.length]);

  return {
    messages,
    isLoading,
    isLoadingHistory,
    hasSharedIdea,
    sessionId,
    isInitialized,
    messagesEndRef,
    sendMessage,
    initializeChat,
    clearChat,
    retryLastMessage,
    loadChatHistory
  };
}
