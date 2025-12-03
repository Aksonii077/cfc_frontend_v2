import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import {
  Mail,
  Send,
  Eye,
  Copy,
  Calendar,
  FileText,
  ExternalLink,
  Clock,
  CheckCircle,
} from "lucide-react";

interface OnboardedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  acceptedAt: string;
  onboardingStatus: "pending" | "in-progress" | "completed";
}

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
  requestedFunding: number;
  description: string;
}

interface AcceptanceEmailTemplateProps {
  startup: OnboardedStartup;
  application: Application;
}

export function AcceptanceEmailTemplate({ startup, application }: AcceptanceEmailTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("https://calendly.com/incubator/welcome-call");
  const [programOverviewLink, setProgramOverviewLink] = useState("https://program.example.com/overview");
  const [digitalAgreementLink, setDigitalAgreementLink] = useState("https://documents.example.com/agreement");
  const [isSending, setIsSending] = useState(false);
  const [sentEmails, setSentEmails] = useState<Array<{
    type: string;
    sentAt: string;
    status: "sent" | "opened" | "clicked";
  }>>([]);

  const emailTemplates = {
    comprehensive: {
      name: "Comprehensive Welcome Pack",
      subject: `🎉 Welcome to [INCUBATOR NAME] - ${startup.startupName} Accepted!`,
      body: `Dear ${startup.founderName},

Congratulations! We are thrilled to inform you that ${startup.startupName} has been accepted into our accelerator program!

After careful review of your application, we were impressed by your innovative approach to ${application.industry} and the strong potential of your ${application.stage} stage startup. Your vision aligns perfectly with our mission to support groundbreaking entrepreneurs.

🚀 WHAT'S NEXT?

1. **Schedule Your Welcome Call**
   Book your 30-minute welcome call with our program director:
   📅 ${calendlyLink}

2. **Review Program Overview**
   Get familiar with our program structure, expectations, and benefits:
   📖 ${programOverviewLink}

3. **Complete Digital Agreement**
   Please review and sign your program participation agreement:
   📝 ${digitalAgreementLink}

💼 PROGRAM HIGHLIGHTS

• 12-week intensive accelerator program
• $50K initial investment + up to $250K follow-on
• Access to our network of 200+ mentors and investors
• Dedicated workspace in our innovation hub
• Weekly masterclasses and workshops
• Demo Day presentation to 500+ investors

👥 YOUR PROGRAM MANAGER

You'll be assigned a dedicated program manager within 48 hours who will guide you through the onboarding process and serve as your primary point of contact throughout the program.

🎯 IMPORTANT DATES

• Program Kickoff: [DATE]
• First Milestone Review: [DATE]
• Demo Day: [DATE]

We're excited to be part of your entrepreneurial journey and look forward to helping ${startup.startupName} reach new heights!

If you have any questions, please don't hesitate to reach out to us at program@incubator.com or call us at (555) 123-4567.

Welcome to the family! 🎉

Best regards,

[YOUR NAME]
[TITLE]
[INCUBATOR NAME]
[EMAIL] | [PHONE]

P.S. Follow us on social media [@incubator] for the latest updates and success stories from our portfolio companies.

---
This email was sent to ${startup.founderEmail}. If you have any concerns, please contact us immediately.`,
    },
    
    concise: {
      name: "Concise Professional",
      subject: `${startup.startupName} - Program Acceptance Confirmation`,
      body: `Dear ${startup.founderName},

We are pleased to inform you that ${startup.startupName} has been accepted into our accelerator program.

Next Steps:
1. Schedule your welcome call: ${calendlyLink}
2. Review program details: ${programOverviewLink}
3. Sign participation agreement: ${digitalAgreementLink}

Your program manager will contact you within 48 hours to begin the onboarding process.

Program Start Date: [INSERT DATE]

Congratulations and welcome aboard!

Best regards,
[YOUR NAME]
[INCUBATOR NAME]`,
    },
    
    enthusiastic: {
      name: "Enthusiastic & Personal",
      subject: `🌟 AMAZING NEWS: ${startup.startupName} is in! 🌟`,
      body: `${startup.founderName}!

I can barely contain my excitement as I write this email! 

Your application for ${startup.startupName} absolutely blew us away. The way you're approaching the ${application.industry} space is exactly the kind of innovative thinking we love to see, and frankly, we couldn't be more thrilled to have you join our accelerator family.

Here's what happens now (and trust me, it's going to be an incredible journey):

🎯 **Your Welcome Call** - Let's get this party started!
Click here to book your slot: ${calendlyLink}
(I promise it'll be fun, not just another boring intro call!)

📚 **Program Deep Dive** - Everything you need to know
Check out all the awesome details: ${programOverviewLink}

✍️ **Make It Official** - Time to sign on the dotted line
Your digital agreement is ready: ${digitalAgreementLink}

I personally can't wait to see what you build over the next 12 weeks. Based on what I've seen from ${startup.startupName}, I have a feeling you're going to be one of our standout success stories.

Ready to change the world? Let's do this! 🚀

Cheering you on,

[YOUR NAME]
[TITLE] & Chief Cheerleader
[INCUBATOR NAME]

P.S. - Seriously, book that call ASAP. I've got so many ideas to share with you! 💡`,
    }
  };

  const currentTemplate = emailTemplates[selectedTemplate as keyof typeof emailTemplates];

  const handleSendEmail = async () => {
    setIsSending(true);
    
    try {
      // Simulate API call to send email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSentEmails([
        ...sentEmails,
        {
          type: currentTemplate.name,
          sentAt: new Date().toISOString(),
          status: "sent"
        }
      ]);
      
      toast.success("Acceptance email sent successfully!");
      
    } catch (error) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyEmail = () => {
    const emailContent = `Subject: ${customSubject || currentTemplate.subject}\n\n${currentTemplate.body}`;
    navigator.clipboard.writeText(emailContent);
    toast.success("Email content copied to clipboard!");
  };

  const handlePreviewEmail = () => {
    // Open preview in new window
    const previewWindow = window.open("", "_blank", "width=800,height=600");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Email Preview</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; }
              .subject { font-weight: bold; margin-bottom: 20px; padding: 10px; background: #f5f5f5; }
              .body { white-space: pre-wrap; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="subject">Subject: ${customSubject || currentTemplate.subject}</div>
            <div class="body">${currentTemplate.body}</div>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Acceptance Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Recipient</Label>
              <Input value={startup.founderEmail} readOnly className="bg-gray-50" />
            </div>
          </div>

          <div>
            <Label>Custom Subject (Optional)</Label>
            <Input
              placeholder="Leave blank to use template subject"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
            />
          </div>

          {/* Links Configuration */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Program Links</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-sm">Calendly Link</Label>
                <Input
                  value={calendlyLink}
                  onChange={(e) => setCalendlyLink(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-sm">Program Overview Link</Label>
                <Input
                  value={programOverviewLink}
                  onChange={(e) => setProgramOverviewLink(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-sm">Digital Agreement Link</Label>
                <Input
                  value={digitalAgreementLink}
                  onChange={(e) => setDigitalAgreementLink(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Email Preview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviewEmail}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopyEmail}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Subject:</div>
              <div className="font-medium">
                {customSubject || currentTemplate.subject}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-white max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {currentTemplate.body}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Send Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">
                  Ready to send acceptance email?
                </div>
                <div className="text-sm text-gray-600">
                  This will be sent to {startup.founderEmail}
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="gap-2"
            >
              {isSending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? "Sending..." : "Send Acceptance Email"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email History */}
      {sentEmails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Email History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">{email.type}</div>
                      <div className="text-sm text-gray-600">
                        Sent {new Date(email.sentAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {email.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Schedule Follow-up
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Send Documents
            </Button>
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Calendly
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}