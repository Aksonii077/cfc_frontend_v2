"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AIAvatar } from "./AIAvatar";
import { TypewriterText } from "./TypewriterText";
import { Badge } from "./ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import {
  Send,
  X,
  MapPin,
  UserPlus,
  MessageSquare,
  Star,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Message {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: string;
  emotion?:
    | "excited"
    | "thinking"
    | "happy"
    | "encouraging"
    | "analytical"
    | "welcoming"
    | "celebrating";
  isTypingComplete?: boolean;
  onTypingComplete?: () => void;
}

interface ConnectionRecommendation {
  id: string;
  name: string;
  title: string;
  company: string;
  roleType:
    | "founder"
    | "investor"
    | "mentor"
    | "service_provider"
    | "supplier"
    | "expert";
  location: string;
  expertise: string[];
  matchScore: number;
  bio: string;
  connectionReason: string;
  avatar?: string;
}

interface EnhancedAIChatProps {
  context?: string
  welcomeMessage?: string
  onIdeaValidationStart?: (idea?: { title: string; description: string }) => void
  onIdeaValidationComplete?: (result: any) => void
  onSpotlightUpdate?: (mode: 'validation' | 'tasks' | 'connections' | 'actions', data?: any) => void
  onChatContextUpdate?: (context: string) => void
  userIdea?: { title: string; description: string } | null
}

export function EnhancedAIChat({ 
  context = 'ideation',
  welcomeMessage,
  onIdeaValidationStart,
  onIdeaValidationComplete,
  onSpotlightUpdate,
  onChatContextUpdate,
  userIdea
}: EnhancedAIChatProps = {}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [
    connectionRecommendations,
    setConnectionRecommendations,
  ] = useState<ConnectionRecommendation[]>([]);
  const [showProfilePopup, setShowProfilePopup] =
    useState(false);
  const [selectedConnectionId, setSelectedConnectionId] =
    useState<string | null>(null);
  const [isConnectionsExpanded, setIsConnectionsExpanded] =
    useState(true);
  const [hasSharedIdea, setHasSharedIdea] = useState(false); // Track if user has shared their idea
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Check if user is first time visitor
  useEffect(() => {
    if (user) {
      // Skip welcome animation and go directly to chat
      initializeChat();
    }
  }, [user]);

  // Generate connection recommendations
  useEffect(() => {
    generateConnectionRecommendations();
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const initializeChat = async () => {
    // Start with a welcome message
    setTimeout(() => {
      addAIMessage(
        welcomeMessage || `🎉 Welcome to RACE AI, ${user?.firstName}! I'm here to help you transform your business ideas into reality. Share your idea with me to get started and unlock personalized connections!`,
        "welcoming",
      );
    }, 1000);
  };

  const generateConnectionRecommendations = () => {
    // Extended mock connection recommendations
    const mockConnections: ConnectionRecommendation[] = [
      {
        id: "1",
        name: "Dr. Priya Sharma",
        title: "Ayurvedic Practitioner",
        company: "Ayurveda Institute",
        roleType: "expert",
        location: "Mumbai, India",
        expertise: [
          "Ayurvedic Medicine",
          "Panchakarma",
          "Herbal Formulations",
        ],
        matchScore: 95,
        bio: "Leading Ayurvedic practitioner with 15+ years experience.",
        connectionReason:
          "Expert practitioner for authentic treatment protocols",
        avatar: "/api/placeholder/48/48",
      },
      {
        id: "2",
        name: "Sarah Chen",
        title: "Wellness Investor",
        company: "Holistic Ventures",
        roleType: "investor",
        location: "San Francisco, CA",
        expertise: [
          "Health Tech",
          "Wellness Startups",
          "Seed Funding",
        ],
        matchScore: 88,
        bio: "Angel investor specializing in wellness startups.",
        connectionReason:
          "Actively seeking wellness startups for investment",
        avatar: "/api/placeholder/48/48",
      },
      {
        id: "3",
        name: "Michael Rodriguez",
        title: "Spa Consultant",
        company: "Wellness Solutions",
        roleType: "mentor",
        location: "Austin, TX",
        expertise: ["Spa Operations", "Business Development"],
        matchScore: 92,
        bio: "Helped 50+ spa businesses scale successfully.",
        connectionReason:
          "Expert in spa business operations and scaling",
        avatar: "/api/placeholder/48/48",
      },
      {
        id: "4",
        name: "Organic Wellness Co.",
        title: "Product Supplier",
        company: "Organic Wellness",
        roleType: "supplier",
        location: "Kerala, India",
        expertise: ["Organic Oils", "Herbal Products"],
        matchScore: 87,
        bio: "Certified organic supplier of Ayurvedic products.",
        connectionReason:
          "High-quality, certified organic products",
        avatar: "/api/placeholder/48/48",
      },
      {
        id: "5",
        name: "Lisa Thompson",
        title: "UX Designer",
        company: "Mindful Designs",
        roleType: "service_provider",
        location: "Seattle, WA",
        expertise: ["UX Design", "Wellness Apps"],
        matchScore: 83,
        bio: "Wellness and health brand digital experiences.",
        connectionReason:
          "Design booking systems and brand experience",
        avatar: "/api/placeholder/48/48",
      },
      {
        id: "6",
        name: "Raj Patel",
        title: "Wellness Entrepreneur",
        company: "Zen Studios",
        roleType: "founder",
        location: "Toronto, Canada",
        expertise: ["Wellness Centers", "Ayurveda"],
        matchScore: 90,
        bio: "Launched 3 successful wellness centers.",
        connectionReason:
          "Fellow wellness entrepreneur with insights",
        avatar: "/api/placeholder/48/48",
      },
    ];

    setConnectionRecommendations(mockConnections);
  };

  const addAIMessage = async (
    message: string,
    emotion: string = "helpful",
  ): Promise<void> => {
    return new Promise((resolve) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        message,
        sender: "ai",
        timestamp: new Date().toISOString(),
        emotion: emotion as any,
        isTypingComplete: false,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Handle typing completion
      const handleTypingComplete = () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessage.id
              ? { ...m, isTypingComplete: true }
              : m,
          ),
        );
        resolve();
      };

      // Set completion handler for TypewriterText
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessage.id
              ? { ...m, onTypingComplete: handleTypingComplete }
              : m,
          ),
        );
      }, 100);
    });
  };

  const addUserMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      message,
      sender: "user",
      timestamp: new Date().toISOString(),
      isTypingComplete: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Update chat context if callback is provided
    if (onChatContextUpdate) {
      onChatContextUpdate(message);
    }

    // Check if this message contains an idea
    if (!hasSharedIdea && message.length > 10) {
      const businessKeywords = [
        "startup",
        "business",
        "idea",
        "company",
        "service",
        "product",
        "app",
        "platform",
        "website",
        "salon",
        "restaurant",
        "store",
        "market",
        "sell",
        "customer",
        "brand",
        "launch",
        "create",
        "build",
        "develop",
        "want to start",
        "planning to",
        "working on",
      ];
      const hasBusinessKeyword = businessKeywords.some(
        (keyword) => message.toLowerCase().includes(keyword),
      );

      // If message is substantial (20+ chars) or contains business keywords, consider it an idea sharing
      if (message.length > 20 || hasBusinessKeyword) {
        setHasSharedIdea(true);

        // Add a delayed AI response acknowledging the unlocked connections
        setTimeout(() => {
          addAIMessage(
            `🎉 Exciting! I can see the potential in your idea. I've now unlocked personalized connection recommendations for you - check them out on the right to connect with experts who can help bring your vision to life!`,
            "excited",
          );
        }, 2000);
      }
    }
  };

  // Handle sending user messages from input
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const messageText = currentMessage.trim();
    setCurrentMessage("");
    setIsLoading(true);

    try {
      await addUserMessage(messageText);

      // Add AI response (simulate processing)
      setTimeout(async () => {
        await addAIMessage(
          `That's interesting! Tell me more about ${messageText.toLowerCase().includes("idea") ? "your idea" : "what you have in mind"}. I'd love to help you develop this further and connect you with the right people.`,
          "encouraging",
        );
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  // Main chat interface
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {message.sender === "ai" && (
                <AIAvatar
                  emotion={message.emotion || "helpful"}
                  size="md"
                />
              )}
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] text-white"
                    : "bg-white border border-[#C8D6FF] shadow-sm"
                }`}
              >
                {message.sender === "ai" &&
                !message.isTypingComplete ? (
                  <TypewriterText
                    text={message.message}
                    className={
                      message.sender === "user"
                        ? "text-white"
                        : "text-gray-800"
                    }
                    speed={40}
                    onComplete={message.onTypingComplete}
                  />
                ) : (
                  <div
                    className={`whitespace-pre-wrap ${
                      message.sender === "user"
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {message.message.split('\n').map((line, index) => {
                      // Check if line is a bullet point
                      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                        return (
                          <div key={index} className="flex items-start gap-2 my-1">
                            <span className={message.sender === "user" ? "text-white" : "text-[#114DFF]"}>•</span>
                            <span className="flex-1">{line.replace(/^[•\-]\s*/, '').trim()}</span>
                          </div>
                        );
                      }
                      // Check if line is bold (marked with **)
                      else if (line.includes('**')) {
                        const parts = line.split('**');
                        return (
                          <div key={index} className="my-1">
                            {parts.map((part, i) => 
                              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : <span key={i}>{part}</span>
                            )}
                          </div>
                        );
                      }
                      // Regular line
                      else if (line.trim()) {
                        return <div key={index} className="my-1">{line}</div>;
                      }
                      // Empty line (paragraph break)
                      else {
                        return <div key={index} className="h-2" />;
                      }
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <AIAvatar
                emotion="thinking"
                size="md"
                isAnimating={true}
              />
              <div className="bg-white border shadow-sm px-4 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    Thinking
                  </span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Input
            value={currentMessage}
            onChange={(e) =>
              setCurrentMessage(e.target.value)
            }
            placeholder="Share your business idea..."
            onKeyPress={(e) =>
              e.key === "Enter" && handleSendMessage()
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}