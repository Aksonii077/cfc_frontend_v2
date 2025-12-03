import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { 
  FileText, 
  Copy, 
  RefreshCw, 
  User, 
  Building, 
  Calendar,
  Clock,
  MapPin
} from "lucide-react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  industry: string;
  stage: string;
  location: string;
}

interface EmailData {
  template: string;
  subject: string;
  content: string;
  schedulingInfo: {
    date: string;
    time: string;
    duration: number;
    timezone: string;
  };
}

interface EmailDraftingToolProps {
  application: Application;
  emailData: EmailData;
  onEmailDataChange: (data: Partial<EmailData>) => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: "formal" | "friendly" | "detailed" | "brief";
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "formal_professional",
    name: "Formal Professional",
    description: "Professional and concise invitation",
    category: "formal",
    subject: "Interview Invitation - {startupName} Application Review",
    content: `Dear {founderName},

Thank you for submitting your application for {startupName} to our incubator program. After reviewing your application, we are impressed with your {industry} solution and would like to schedule a 30-minute interview to discuss your startup further.

Interview Details:
• Date: {date}
• Time: {time} {timezone}
• Duration: 30 minutes
• Format: Video call (Zoom link will be provided)

During our conversation, we'll discuss:
- Your business model and market strategy
- Team composition and expertise
- Growth projections and funding plans
- How our incubator program can support your goals

Please confirm your availability by replying to this email. If the proposed time doesn't work for you, please suggest 2-3 alternative times that work better.

We look forward to learning more about {startupName} and exploring how we can work together.

Best regards,
[Your Name]
[Your Title]
[Incubator Name]`
  },
  {
    id: "friendly_enthusiastic",
    name: "Friendly & Enthusiastic",
    description: "Warm and encouraging tone",
    category: "friendly",
    subject: "Exciting News! Let's chat about {startupName} 🚀",
    content: `Hi {founderName}!

Great news! We've been reviewing applications and {startupName} really caught our attention. Your work in {industry} looks promising, and we'd love to learn more about your vision.

We'd like to invite you for a friendly 30-minute chat to dive deeper into your startup journey.

Here's what we're thinking:
📅 Date: {date}
⏰ Time: {time} {timezone}
⏱️ Duration: 30 minutes
💻 Platform: Zoom (we'll send the link)

This is your chance to:
✨ Share your story and passion
💡 Discuss your innovative approach
🎯 Learn about our incubator program
🤝 See if we're a great fit together

Sound good? Just hit reply to confirm, or let us know if you need a different time. We're flexible!

Can't wait to meet you and hear more about the amazing things you're building.

Cheers,
[Your Name]
[Your Title] 
[Incubator Name]

P.S. We've seen some incredible startups come through our program, and we think {startupName} has that same potential! 🌟`
  },
  {
    id: "detailed_comprehensive",
    name: "Detailed & Comprehensive",
    description: "Thorough explanation with preparation guidelines",
    category: "detailed",
    subject: "Interview Invitation & Preparation Guide - {startupName}",
    content: `Dear {founderName},

Congratulations! After careful review of your {startupName} application, our investment committee has decided to move forward with an interview. Your {industry} startup shows significant promise, and we're excited to learn more.

INTERVIEW SCHEDULE:
Date: {date}
Time: {time} {timezone}
Duration: 30 minutes
Format: Video conference via Zoom

AGENDA OVERVIEW:
1. Company Introduction & Vision (5 minutes)
   - Brief overview of {startupName}
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

Please confirm your attendance by replying to this email. If you need to reschedule, please provide at least 24 hours notice with alternative times.

We're looking forward to our conversation and potentially welcoming {startupName} into our portfolio.

Best regards,
[Your Name]
[Your Title]
[Incubator Name]
[Phone Number]
[Email Address]`
  },
  {
    id: "brief_efficient",
    name: "Brief & Efficient",
    description: "Short and to the point",
    category: "brief",
    subject: "Interview Request - {startupName}",
    content: `Hi {founderName},

We'd like to schedule a 30-minute interview to discuss {startupName}.

Available: {date} at {time} {timezone}

Agenda:
- Business overview
- Market strategy  
- Team & funding needs
- Incubator fit

Please confirm or suggest alternative times.

Best,
[Your Name]
[Incubator Name]`
  }
];

export function EmailDraftingTool({
  application,
  emailData,
  onEmailDataChange
}: EmailDraftingToolProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isCustomizing, setIsCustomizing] = useState(false);

  const applyTemplate = (template: EmailTemplate) => {
    const personalizedSubject = template.subject
      .replace(/\{startupName\}/g, application.startupName)
      .replace(/\{founderName\}/g, application.founderName);

    const personalizedContent = template.content
      .replace(/\{founderName\}/g, application.founderName)
      .replace(/\{startupName\}/g, application.startupName)
      .replace(/\{industry\}/g, application.industry)
      .replace(/\{date\}/g, emailData.schedulingInfo.date || "[Date will be set]")
      .replace(/\{time\}/g, emailData.schedulingInfo.time || "[Time will be set]")
      .replace(/\{timezone\}/g, emailData.schedulingInfo.timezone);

    setSelectedTemplate(template.id);
    onEmailDataChange({
      template: template.id,
      subject: personalizedSubject,
      content: personalizedContent
    });
    setIsCustomizing(false);
  };

  const handleSubjectChange = (subject: string) => {
    onEmailDataChange({ subject });
    setIsCustomizing(true);
  };

  const handleContentChange = (content: string) => {
    onEmailDataChange({ content });
    setIsCustomizing(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetTemplate = () => {
    if (selectedTemplate) {
      const template = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        applyTemplate(template);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "formal": return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "friendly": return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      case "detailed": return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "brief": return "bg-[#F5F5F5] text-gray-800 border-[#CCCCCC]";
      default: return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  return (
    <div>
      {/* Template Selection */}
      <div className="p-6 border-b border-[#C8D6FF]">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Choose Email Template
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {EMAIL_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all border ${
                selectedTemplate === template.id 
                  ? 'border-[#114DFF] bg-[#EDF2FF]' 
                  : 'border-[#CCCCCC] hover:border-[#C8D6FF]'
              }`}
              onClick={() => applyTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm">{template.name}</h4>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                <p className="text-xs text-gray-500 truncate">
                  Subject: {template.subject.replace(/\{startupName\}/g, application.startupName)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Context */}
      <div className="p-6 border-b border-[#C8D6FF] bg-[#F7F9FF]">
        <h3 className="text-gray-900 mb-3">Application Context</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Founder:</span>
            <span>{application.founderName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Company:</span>
            <span>{application.startupName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Industry:</span>
            <span>{application.industry}</span>
          </div>
        </div>
      </div>

      {/* Email Editor */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Email Composition</h3>
            <div className="flex gap-2">
              {isCustomizing && selectedTemplate && (
                <Button variant="outline" size="sm" onClick={resetTemplate} className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reset Template
                </Button>
              )}
              {emailData.content && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => copyToClipboard(emailData.content)}
                  className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>

          {/* Subject Line */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Subject Line
            </label>
            <Input
              value={emailData.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full bg-[#F7F9FF] border-[#C8D6FF]"
            />
          </div>

          {/* Email Content */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Content
            </label>
            <Textarea
              value={emailData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Compose your email message..."
              className="w-full min-h-96 font-mono text-sm bg-[#F7F9FF] border-[#C8D6FF]"
            />
          </div>

          {/* Quick Insert Variables */}
          <div>
            <h4 className="text-sm text-gray-700 mb-2">Quick Insert</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Founder Name", value: application.founderName },
                { label: "Startup Name", value: application.startupName },
                { label: "Industry", value: application.industry },
                { label: "Stage", value: application.stage },
                { label: "Location", value: application.location }
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newContent = emailData.content + ` ${item.value}`;
                    handleContentChange(newContent);
                  }}
                  className="text-xs border-[#C8D6FF] hover:bg-[#EDF2FF]"
                >
                  + {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {emailData.content && (
            <div>
              <h4 className="text-sm text-gray-700 mb-2">Preview</h4>
              <Card className="border-[#C8D6FF]">
                <CardContent className="p-4 bg-[#F7F9FF]">
                  <div className="text-sm space-y-2">
                    <div><strong>To:</strong> {application.founderEmail}</div>
                    <div><strong>Subject:</strong> {emailData.subject}</div>
                    <hr className="my-3 border-[#C8D6FF]" />
                    <div className="whitespace-pre-wrap text-gray-700">
                      {emailData.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}