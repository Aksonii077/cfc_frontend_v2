import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RejectionEmailDraftingTool } from "./RejectionEmailDraftingTool";
import { MentorApplicationService } from "../../utils/supabase/mentorApplicationService";
import { useAuth } from "../../hooks/useAuth";
import { X, Mail, Send, AlertTriangle, Heart, FileText } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
}

interface RejectionCommunicationFlowProps {
  application: Application;
  onClose: () => void;
  onEmailSent?: (emailData: any) => void;
}

interface RejectionEmailData {
  template: string;
  subject: string;
  content: string;
  rejectionReason: string;
  category: "fit" | "timing" | "stage" | "resources";
  offerFeedback: boolean;
  futureConsideration: boolean;
}

export function RejectionCommunicationFlow({
  application,
  onClose,
  onEmailSent
}: RejectionCommunicationFlowProps) {
  const { user } = useAuth();
  const [emailData, setEmailData] = useState<RejectionEmailData>({
    template: "",
    subject: "",
    content: "",
    rejectionReason: "",
    category: "fit",
    offerFeedback: false,
    futureConsideration: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailDataChange = (newEmailData: Partial<RejectionEmailData>) => {
    setEmailData(prev => ({
      ...prev,
      ...newEmailData
    }));
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    
    try {
      // Save rejection data to database
      await MentorApplicationService.saveApplicationRejection({
        application_id: application.id,
        reason: emailData.rejectionReason,
        category: emailData.category,
        email_subject: emailData.subject,
        email_content: emailData.content,
        offer_feedback: emailData.offerFeedback,
        future_consideration: emailData.futureConsideration,
        mentor_id: user?.id || "demo-mentor"
      });

      // Update application status to rejected
      await MentorApplicationService.updateApplicationStatus(
        application.id,
        "rejected"
      );

      // In a real implementation, this would call your email service
      // Email would be sent to: application.founderEmail with subject: emailData.subject

      toast.success("Rejection email sent successfully", {
        description: `Application from ${application.founderName} has been rejected and email has been sent.`
      });

      // Call the callback with email data
      if (onEmailSent) {
        onEmailSent({
          applicationId: application.id,
          recipientEmail: application.founderEmail,
          emailType: "rejection",
          status: "rejected",
          ...emailData
        });
      }

      // Close the communication flow
      onClose();
    } catch (error) {
      console.error("Error sending rejection email:", error);
      toast.error("Failed to send rejection email", {
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isReadyToSend = emailData.subject && emailData.content && emailData.rejectionReason;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "fit": return "bg-orange-50 text-orange-700 border-orange-200";
      case "timing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "stage": return "bg-purple-50 text-purple-700 border-purple-200";
      case "resources": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fit": return AlertTriangle;
      case "timing": return FileText;
      case "stage": return Heart;
      case "resources": return Mail;
      default: return Mail;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-[#C8D6FF]">
        {/* Header */}
        <div className="border-b border-[#C8D6FF] p-6 bg-gradient-to-r from-[#FF220E]/10 to-[#FF220E]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF220E] to-[#d11d0c] rounded-xl flex items-center justify-center ring-2 ring-[#FF220E]/30">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">
                  Application Rejection Communication
                </h2>
                <p className="text-gray-600">
                  Send professional rejection email to {application.founderName} at {application.startupName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-[#FF220E]/10 text-[#FF220E] border-[#FF220E]/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Rejection Process
              </Badge>
              <Button variant="outline" size="sm" onClick={onClose} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Email Composition */}
          <div className="flex-1 border-r border-[#C8D6FF]">
            <div className="h-full overflow-y-auto">
              <RejectionEmailDraftingTool
                application={application}
                emailData={emailData}
                onEmailDataChange={handleEmailDataChange}
              />
            </div>
          </div>

          {/* Right Panel - Preview & Send */}
          <div className="w-80 p-6 bg-[#F7F9FF] flex flex-col overflow-y-auto">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2 flex-shrink-0">
              <Send className="w-4 h-4" />
              Rejection Email Preview
            </h3>

            {/* Recipient Info */}
            <Card className="mb-4 border-[#C8D6FF]">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">To:</span>
                    <span>{application.founderEmail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Company:</span>
                    <span>{application.startupName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Founder:</span>
                    <span>{application.founderName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Summary */}
            <Card className="mb-4 border-[#C8D6FF]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Email Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <span className="text-xs text-gray-500 block">Subject</span>
                  <p className="text-sm">
                    {emailData.subject || "No subject set"}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Content Preview</span>
                  <p className="text-xs text-gray-700 line-clamp-3">
                    {emailData.content ? 
                      emailData.content.substring(0, 100) + "..." : 
                      "No content drafted"
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Rejection Details */}
            <Card className="mb-6 border-[#C8D6FF]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Rejection Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div>
                  <span className="text-xs text-gray-500 block">Category</span>
                  <div className="flex items-center gap-2 mt-1">
                    {emailData.category && (
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(emailData.category)}`}>
                        {emailData.category.charAt(0).toUpperCase() + emailData.category.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Reason</span>
                  <p className="text-sm">
                    {emailData.rejectionReason || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Offer Feedback:</span>
                    <span className={emailData.offerFeedback ? "text-[#06CB1D]" : "text-gray-400"}>
                      {emailData.offerFeedback ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Future Consideration:</span>
                    <span className={emailData.futureConsideration ? "text-[#114DFF]" : "text-gray-400"}>
                      {emailData.futureConsideration ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <div className="mt-auto flex-shrink-0">
              <Button
                onClick={handleSendEmail}
                disabled={!isReadyToSend || isLoading}
                className="w-full bg-[#FF220E] hover:bg-[#d11d0c] text-white"
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
                    Send Rejection Email
                  </>
                )}
              </Button>
              
              {!isReadyToSend && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Complete email content and rejection reason to send
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}