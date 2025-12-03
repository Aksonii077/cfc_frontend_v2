import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
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
  Star,
  Award,
  Zap,
  ArrowRight,
  Edit,
  Settings
} from "lucide-react";
import { motion } from "motion/react";

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
  aiScore: number;
}

interface InterviewNotes {
  overallImpression: string;
  strengths: string;
  concerns: string;
  marketFit: string;
  teamCapability: string;
  nextSteps: string;
  rating: number;
  recommendation: string;
}

interface EnhancedAcceptanceEmailTemplateProps {
  application: Application;
  interviewNotes: InterviewNotes;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (emailData: any) => void;
}

export function EnhancedAcceptanceEmailTemplate({
  application,
  interviewNotes,
  isOpen,
  onClose,
  onSendEmail
}: EnhancedAcceptanceEmailTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [programDetails, setProgramDetails] = useState({
    programName: "TechVenture Accelerator",
    duration: "12 weeks",
    investment: "$50,000",
    followOnInvestment: "$250,000",
    startDate: "March 15, 2024",
    demoDay: "June 15, 2024",
    mentorsCount: "200+",
    investorsCount: "500+"
  });
  const [links, setLinks] = useState({
    calendlyLink: "https://calendly.com/incubator/welcome-call",
    programOverviewLink: "https://program.example.com/overview",
    digitalAgreementLink: "https://documents.example.com/agreement",
    onboardingPortal: "https://portal.example.com/onboarding"
  });
  const [isSending, setIsSending] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);

  const emailTemplates = {
    comprehensive: {
      name: "Comprehensive Welcome Package",
      description: "Detailed welcome with full program information",
      subject: `🎉 Welcome to ${programDetails.programName} - ${application.startupName} Accepted!`,
      body: `Dear ${application.founderName},

🎉 **Congratulations! ${application.startupName} has been accepted into ${programDetails.programName}!**

After an impressive interview and careful evaluation of your application, we are thrilled to welcome you to our ${programDetails.duration} accelerator program. Your innovative approach to ${application.industry} and the strong potential we see in your ${application.stage} startup make you a perfect fit for our cohort.

## 🚀 What impressed us most:
${interviewNotes.strengths}

## 💰 Program Investment & Benefits:
• **Initial Investment:** ${programDetails.investment} upon program acceptance
• **Follow-on Potential:** Up to ${programDetails.followOnInvestment} based on milestones
• **Mentor Network:** Access to ${programDetails.mentorsCount} industry experts
• **Demo Day:** Present to ${programDetails.investorsCount} investors
• **Dedicated Workspace:** Premium office space in our innovation hub
• **Legal & Technical Support:** Full-service startup support

## 📅 Important Dates:
• **Program Kickoff:** ${programDetails.startDate}
• **Demo Day:** ${programDetails.demoDay}
• **Welcome Call:** Schedule within 48 hours

## 🎯 Your Next Steps:

### 1. Schedule Your Welcome Call (URGENT - within 48 hours)
Book your 30-minute welcome call with your assigned program director:
🔗 **[Schedule Welcome Call](${links.calendlyLink})**

### 2. Access Your Onboarding Portal
Complete your startup profile and program preferences:
🔗 **[Onboarding Portal](${links.onboardingPortal})**

### 3. Review & Sign Program Agreement
Your personalized participation agreement is ready:
🔗 **[Digital Agreement](${links.digitalAgreementLink})**

### 4. Download Program Guide
Everything you need to know about the next ${programDetails.duration}:
🔗 **[Program Overview](${links.programOverviewLink})**

## 👥 Your Program Team:
You'll be assigned a dedicated program manager and mentor within 24 hours who will guide you through every step of your journey with us.

${interviewNotes.nextSteps ? `## 🎯 Recommended Focus Areas:
Based on our interview, we recommend prioritizing:
${interviewNotes.nextSteps}` : ''}

## 💬 Questions or Concerns?
- **Email:** program@${programDetails.programName.toLowerCase().replace(/\s+/g, '')}.com
- **Phone:** (555) 123-4567
- **Slack:** You'll receive an invite to our cohort Slack channel

We're incredibly excited to be part of your entrepreneurial journey and can't wait to see what ${application.startupName} achieves over the next ${programDetails.duration}!

**Welcome to the ${programDetails.programName} family!** 🎉

Best regards,

**[YOUR NAME]**
Program Director
${programDetails.programName}
[email] | [phone]

---
*This email was sent to ${application.founderEmail}. If you have any concerns about this acceptance, please contact us immediately.*`,
    },

    executive: {
      name: "Executive Brief",
      description: "Concise, professional acceptance letter",
      subject: `Program Acceptance - ${application.startupName} | ${programDetails.programName}`,
      body: `Dear ${application.founderName},

**${application.startupName} has been accepted into ${programDetails.programName}.**

**Program Details:**
• Duration: ${programDetails.duration}
• Investment: ${programDetails.investment}
• Start Date: ${programDetails.startDate}
• Demo Day: ${programDetails.demoDay}

**Immediate Actions Required:**
1. Schedule welcome call: [${links.calendlyLink}](${links.calendlyLink})
2. Complete onboarding: [${links.onboardingPortal}](${links.onboardingPortal})
3. Sign agreement: [${links.digitalAgreementLink}](${links.digitalAgreementLink})

Your program manager will contact you within 24 hours.

Congratulations and welcome aboard.

**[YOUR NAME]**
${programDetails.programName}`,
    },

    personal: {
      name: "Personal & Enthusiastic",
      description: "Warm, personal tone with excitement",
      subject: `🌟 INCREDIBLE NEWS: ${application.startupName} is joining us! 🌟`,
      body: `${application.founderName}!

I can hardly contain my excitement as I write this! 🎉

Your interview was absolutely phenomenal, and the entire team is buzzing about ${application.startupName}. The way you articulated your vision for ${application.industry} and demonstrated your ${application.stage} traction left us all impressed.

**What really stood out:**
${interviewNotes.strengths}

**Here's what happens now (and trust me, it's going to be amazing):**

🎯 **Your Welcome Call** - Let's celebrate and plan your success!
I personally want to chat with you: [${links.calendlyLink}](${links.calendlyLink})

📚 **Your Success Toolkit** - Everything you need to dominate
Access your resources: [${links.onboardingPortal}](${links.onboardingPortal})

✍️ **Make It Official** - Let's seal the deal
Your agreement awaits: [${links.digitalAgreementLink}](${links.digitalAgreementLink})

**The next ${programDetails.duration} are going to transform ${application.startupName}.** Based on what I saw in our interview, I have zero doubt you're going to be one of our standout success stories.

${interviewNotes.rating >= 4 ? `P.S. - You scored a ${interviewNotes.rating}/5 in our interview process. That puts you in the top 10% of all applications we've ever received! 🏆` : ''}

Ready to change the world? Let's do this! 🚀

Cheering you on,

**[YOUR NAME]**
Chief Cheerleader & Program Director
${programDetails.programName}

*Seriously, book that call ASAP. I've got so many ideas to share! 💡*`,
    },

    milestone: {
      name: "Milestone-Focused",
      description: "Achievement-oriented with clear milestones",
      subject: `🏆 Achievement Unlocked: ${application.startupName} Accepted!`,
      body: `Dear ${application.founderName},

**🏆 ACHIEVEMENT UNLOCKED: ${programDetails.programName} Acceptance!**

You've successfully completed the most competitive part of your startup journey - getting into our accelerator! Out of thousands of applications, ${application.startupName} stood out as exceptional.

**Your Acceptance Metrics:**
• AI Assessment Score: ${application.aiScore}/100
• Interview Rating: ${interviewNotes.rating}/5 ⭐
• Application Rank: Top 5% of all submissions

## 🎯 Your ${programDetails.duration} Milestone Roadmap:

**WEEK 1-2: Foundation**
• Program kickoff & team integration
• Market validation workshop
• Initial mentor matching

**WEEK 3-6: Build**
• Product development acceleration
• Customer discovery intensive
• Prototype refinement

**WEEK 7-10: Scale**
• Go-to-market strategy execution
• Fundraising preparation
• Investor readiness workshop

**WEEK 11-12: Launch**
• Demo day presentation
• Investor meetings
• Graduation & next steps

## 📋 Immediate Mission Objectives:

### MISSION 1: Secure Your Spot ⏰
**Deadline: 48 hours**
Schedule your strategic planning call: [${links.calendlyLink}](${links.calendlyLink})

### MISSION 2: Access Your Dashboard 🖥️
**Deadline: 72 hours**
Complete your startup profile: [${links.onboardingPortal}](${links.onboardingPortal})

### MISSION 3: Sign Your Partnership Agreement 📝
**Deadline: 1 week**
Review and execute your agreement: [${links.digitalAgreementLink}](${links.digitalAgreementLink})

## 🎖️ Rewards Unlocked:
• ${programDetails.investment} investment deployed upon completion
• Access to ${programDetails.mentorsCount} mentor network
• Priority consideration for ${programDetails.followOnInvestment} Series A extension

**Achievement Progress: 25% Complete**
*Complete all missions to unlock the next level!*

Game on, ${application.founderName}! 🎮

**[YOUR NAME]**
Lead Game Master
${programDetails.programName}`,
    }
  };

  const currentTemplate = emailTemplates[selectedTemplate as keyof typeof emailTemplates];

  const handleSendEmail = async () => {
    setIsSending(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const emailData = {
        template: selectedTemplate,
        subject: customSubject || currentTemplate.subject,
        body: currentTemplate.body,
        recipient: application.founderEmail,
        programDetails,
        links,
        interviewNotes,
        sentAt: new Date().toISOString()
      };
      
      onSendEmail(emailData);
      toast.success("Acceptance email sent successfully!");
      onClose();
      
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
    const previewWindow = window.open("", "_blank", "width=800,height=600,scrollbars=yes");
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
          <head>
            <title>Email Preview - ${application.startupName}</title>
            <style>
              body { 
                font-family: 'Segoe UI', Arial, sans-serif; 
                max-width: 600px; 
                margin: 20px auto; 
                padding: 20px; 
                line-height: 1.6;
                color: #333;
              }
              .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .subject { 
                font-weight: bold; 
                margin-bottom: 20px; 
                padding: 15px; 
                background: #f8f9fa; 
                border-radius: 8px;
                border-left: 4px solid #667eea;
              }
              .body { 
                white-space: pre-wrap; 
                line-height: 1.8;
                font-size: 14px;
              }
              h2 { color: #667eea; margin-top: 30px; }
              ul { margin: 10px 0; padding-left: 20px; }
              a { color: #667eea; text-decoration: none; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Email Preview</h1>
              <p>Recipient: ${application.founderEmail}</p>
            </div>
            <div class="subject">Subject: ${customSubject || currentTemplate.subject}</div>
            <div class="body">${currentTemplate.body.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <Mail className="w-5 h-5" />
            Acceptance Email - {application.startupName}
          </DialogTitle>
          <DialogDescription>
            Send a personalized acceptance email with program details and next steps.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Template Style</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(emailTemplates).map(([key, template]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-gray-500">{template.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Recipient</Label>
                    <Input value={application.founderEmail} readOnly className="bg-gray-50" />
                  </div>

                  <div>
                    <Label>Custom Subject (Optional)</Label>
                    <Input
                      placeholder="Override template subject"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowCustomization(!showCustomization)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {showCustomization ? 'Hide' : 'Show'} Customization
                  </Button>
                </CardContent>
              </Card>

              {/* Interview Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Rating: {interviewNotes.rating}/5</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Key Strengths:</div>
                    <p className="text-gray-600">{interviewNotes.strengths.substring(0, 100)}...</p>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-700 mb-1">Recommendation:</div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {interviewNotes.recommendation.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Email Preview & Customization */}
            <div className="lg:col-span-2 space-y-4">
              {showCustomization && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Program Customization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Program Name</Label>
                        <Input
                          value={programDetails.programName}
                          onChange={(e) => setProgramDetails(prev => ({ ...prev, programName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Duration</Label>
                        <Input
                          value={programDetails.duration}
                          onChange={(e) => setProgramDetails(prev => ({ ...prev, duration: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Investment Amount</Label>
                        <Input
                          value={programDetails.investment}
                          onChange={(e) => setProgramDetails(prev => ({ ...prev, investment: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Start Date</Label>
                        <Input
                          value={programDetails.startDate}
                          onChange={(e) => setProgramDetails(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Program Links</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(links).map(([key, value]) => (
                          <div key={key}>
                            <Label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</Label>
                            <Input
                              value={value}
                              onChange={(e) => setLinks(prev => ({ ...prev, [key]: e.target.value }))}
                              className="text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email Preview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Email Preview</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handlePreviewEmail}>
                        <Eye className="w-4 h-4 mr-2" />
                        Full Preview
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
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-600 mb-1">Subject:</div>
                      <div className="font-medium text-blue-900">
                        {customSubject || currentTemplate.subject}
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-white max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                        {currentTemplate.body}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Ready to send to {application.founderEmail}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSending ? (
                <Clock className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSending ? "Sending..." : "Send Acceptance Email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}