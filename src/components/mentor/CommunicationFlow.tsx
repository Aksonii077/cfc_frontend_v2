import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { toast } from "sonner@2.0.3";
import { X, Mail, Calendar, Send, Video } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
}

interface CommunicationFlowProps {
  application: Application;
  onClose: () => void;
  onEmailSent?: (emailData: any) => void;
}

const EMAIL_TEMPLATE = (
  startupName: string,
  founderName: string,
  date: string,
  time: string,
  mentorName: string,
  mentorEmail: string,
) => `Dear ${founderName},

Congratulations! After careful review of your ${startupName} application, I have decided to move forward with an interview. Your startup shows significant promise, and we're excited to learn more.

INTERVIEW SCHEDULE:
Date: ${date || "[Date will be set]"}
Time: ${time || "[Time will be set]"} IST
Duration: 30 minutes
Format: Video conference via Google Meet

AGENDA OVERVIEW:
1. Company Introduction & Vision (5 minutes)
   - Brief overview of ${startupName}
   - Your founding story and motivation

2. Market & Product Deep Dive (10 minutes)
   - Target market analysis
   - Product demonstration (if applicable)
   - Competitive advantages

3. Business Model & Financials (8 minutes)
   - Revenue streams and pricing strategy
   - Current traction and key metrics
   - Funding requirements and use of capital

4. Team & Operations (5 minutes)
   - Team composition and key roles
   - Operational challenges and solutions

5. Q&A & Next Steps (2 minutes)

PREPARATION RECOMMENDATIONS:
• Prepare a brief pitch deck (8-10 slides maximum)
• Have your key metrics and financials ready
• Prepare 2-3 questions about our incubator program
• Test your video/audio setup beforehand

WHAT TO EXPECT NEXT:
Based on our discussion, we'll make a decision within 48 hours and communicate our next steps, which may include:
- Additional interviews with our partners
- Technical or market validation sessions
- Reference checks with previous employers/advisors

We're looking forward to our conversation and potentially welcoming ${startupName} into our portfolio.

Best regards,
${mentorName}
${mentorEmail}`;

export function CommunicationFlow({
  application,
  onClose,
  onEmailSent,
}: CommunicationFlowProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] =
    useState(false);

  const mentorName = user
    ? `${user.firstName} ${user.lastName}`
    : "";
  const mentorEmail = user?.email || "";

  // Initialize email template
  useEffect(() => {
    if (user) {
      setEmailContent(
        EMAIL_TEMPLATE(
          application.startupName,
          application.founderName,
          "",
          "",
          mentorName,
          mentorEmail,
        ),
      );
    }
  }, [
    user,
    application.startupName,
    application.founderName,
    mentorName,
    mentorEmail,
  ]);

  const formatDate = (date: string): string => {
    if (!date) return "[Date will be set]";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string): string => {
    if (!time) return "[Time will be set]";
    return new Date(`2024-01-01T${time}`).toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      },
    );
  };

  const handleDateTimeChange = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);

    setEmailContent(
      EMAIL_TEMPLATE(
        application.startupName,
        application.founderName,
        formatDate(date),
        formatTime(time),
        mentorName,
        mentorEmail,
      ),
    );
  };

  const handleConnectGoogleCalendar = () => {
    setIsCalendarConnected(true);
    setMeetingLink(
      `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
    );

    toast.success("Google Calendar Connected", {
      description:
        "Your Google Calendar has been connected successfully. Select a date and time to schedule the interview.",
      duration: 3000,
    });
  };

  const getValidationMessage = (): string => {
    if (!isCalendarConnected)
      return "Connect Google Calendar to continue";
    if (!selectedDate) return "Select a date to continue";
    if (!selectedTime) return "Select a time to continue";
    if (!user) return "Authentication required";
    return "";
  };

  const handleSendEmail = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Missing Information", {
        description:
          "Please select both date and time from Google Calendar",
        duration: 3000,
      });
      return;
    }

    if (!user) {
      toast.error("Authentication Error", {
        description:
          "Unable to verify mentor credentials. Please sign in again.",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (onEmailSent) {
        onEmailSent({
          applicationId: application.id,
          recipientEmail: application.founderEmail,
          emailType: "interview_invitation",
          subject: `Mentorship Application - Interview Invitation & Preparation Guide - ${application.startupName}`,
          content: emailContent,
          schedulingInfo: {
            date: selectedDate,
            time: selectedTime,
            duration: 30,
            meetingLink: meetingLink,
          },
        });
      }

      toast.success("Interview Invitation Sent!", {
        description: `Interview invitation sent to ${application.founderName} at ${application.founderEmail}`,
        duration: 5000,
      });

      onClose();
    } catch (error) {
      toast.error("Error", {
        description:
          "Failed to send interview invitation. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isReadyToSend = selectedDate && selectedTime && user;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-[#C8D6FF]">
        {/* Header */}
        <div className="border-b border-[#C8D6FF] p-7 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-white">
                  Schedule Interview Communication
                </h2>
                <p className="text-white/90">
                  Send interview invitation to{" "}
                  {application.founderName} at{" "}
                  {application.startupName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Interview Scheduling
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(90vh-120px)]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Google Calendar Integration */}
            <Card className="border-[#C8D6FF]">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#114DFF]" />
                  Google Calendar Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isCalendarConnected ? (
                  <div className="flex items-center justify-between py-2">
                    <p className="text-gray-600">
                      Connect to select time slots and create
                      meeting links
                    </p>
                    <Button
                      onClick={handleConnectGoogleCalendar}
                      className="bg-white border-2 border-[#C8D6FF] hover:bg-[#EDF2FF] text-gray-900"
                      size="sm"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Connect Calendar
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 p-2 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-[#06CB1D]" />
                      <span className="text-gray-700">
                        Calendar Connected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-700">
                          Select Date *
                        </label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) =>
                            handleDateTimeChange(
                              e.target.value,
                              selectedTime,
                            )
                          }
                          min={
                            new Date()
                              .toISOString()
                              .split("T")[0]
                          }
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-700">
                          Select Time *
                        </label>
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) =>
                            handleDateTimeChange(
                              selectedDate,
                              e.target.value,
                            )
                          }
                          className="bg-[#F7F9FF] border-[#C8D6FF]"
                        />
                      </div>
                    </div>

                    {meetingLink && (
                      <div className="p-2 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Video className="w-3 h-3 text-[#114DFF]" />
                          <span className="text-gray-700">
                            Google Meet:
                          </span>
                        </div>
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#114DFF] hover:underline break-all"
                        >
                          {meetingLink}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Email Template */}
            <Card className="border-[#C8D6FF]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#114DFF]" />
                  Interview Schedule Invite to{" "}
                  {application.startupName} -{" "}
                  {application.founderEmail}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <label className="text-gray-700">
                    Subject
                  </label>
                  <Input
                    type="text"
                    value={`Mentorship Application - Interview Invitation & Preparation Guide - ${application.startupName}`}
                    disabled
                    className="bg-[#F5F5F5] border-[#C8D6FF]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700">
                    Email Content
                  </label>
                  <Textarea
                    value={emailContent}
                    onChange={(e) =>
                      setEmailContent(e.target.value)
                    }
                    rows={20}
                    className="bg-[#F7F9FF] border-[#C8D6FF] font-mono"
                  />
                  <p className="text-xs text-gray-500">
                    You can edit the template above if needed.
                    Date and time will update automatically when
                    selected.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <div className="pt-6 border-t border-[#C8D6FF]">
              <Button
                onClick={handleSendEmail}
                disabled={!isReadyToSend || isLoading}
                className="w-full bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Interview Invitation
                  </>
                )}
              </Button>

              {!isReadyToSend && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {getValidationMessage()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}