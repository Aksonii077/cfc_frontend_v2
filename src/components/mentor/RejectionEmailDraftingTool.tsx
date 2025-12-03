import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { 
  FileText, 
  Copy, 
  RefreshCw, 
  User, 
  Building, 
  AlertTriangle,
  Heart,
  Clock,
  Target
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

interface RejectionEmailData {
  template: string;
  subject: string;
  content: string;
  rejectionReason: string;
  category: "fit" | "timing" | "stage" | "resources";
  offerFeedback: boolean;
  futureConsideration: boolean;
}

interface RejectionEmailDraftingToolProps {
  application: Application;
  emailData: RejectionEmailData;
  onEmailDataChange: (data: Partial<RejectionEmailData>) => void;
}

interface RejectionEmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  content: string;
  category: "professional" | "encouraging" | "brief" | "future-opportunity";
  defaultRejectionCategory: "fit" | "timing" | "stage" | "resources";
}

const REJECTION_TEMPLATES: RejectionEmailTemplate[] = [
  {
    id: "professional_respectful",
    name: "Professional & Respectful",
    description: "Formal, professional tone with clear reasoning",
    category: "professional",
    defaultRejectionCategory: "fit",
    subject: "Re: {startupName} Application - Decision Update",
    content: `Dear {founderName},

Thank you for taking the time to submit your application for {startupName} to our incubator program. We were impressed by your dedication and the innovative approach you're taking in the {industry} space.

After careful consideration by our review committee, we regret to inform you that we will not be moving forward with your application at this time. This decision was not made lightly, and we recognize the significant effort and passion you've invested in building {startupName}.

Our decision was primarily based on {rejectionReason}. Please understand that this decision does not reflect the quality of your idea or your capabilities as an entrepreneur.

We encourage you to continue pursuing your entrepreneurial journey and wish you the very best in your future endeavors. {startupName} has potential, and we hope you'll find the right partners to help you achieve your goals.

Thank you again for considering our program.

Best regards,
[Your Name]
[Your Title]
[Incubator Name]`
  },
  {
    id: "encouraging_constructive",
    name: "Encouraging & Constructive",
    description: "Supportive tone with developmental feedback",
    category: "encouraging",
    defaultRejectionCategory: "stage",
    subject: "Your {startupName} Journey - Next Steps Forward",
    content: `Hi {founderName},

Thank you for sharing {startupName} with us. Your passion for solving problems in {industry} really came through in your application, and we appreciate the time you invested in the process.

While we won't be able to offer you a spot in our current cohort, we wanted to provide some perspective that might be helpful for your journey ahead.

{rejectionReason}

Here's what we'd recommend as you continue building {startupName}:

• Focus on achieving key milestones that demonstrate market validation
• Consider connecting with other entrepreneurs in the {industry} space
• Look into alternative funding sources that might be a better fit for your current stage
• Keep iterating based on customer feedback and market signals

Your entrepreneurial spirit is exactly what the world needs more of. We're confident that with persistence and the right approach, you'll find success with {startupName}.

Keep building amazing things!

Best,
[Your Name]
[Your Title]
[Incubator Name]

P.S. We'd love to stay connected and hear about your progress. Feel free to reach out with updates!`
  },
  {
    id: "brief_direct",
    name: "Brief & Direct",
    description: "Concise and clear communication",
    category: "brief",
    defaultRejectionCategory: "resources",
    subject: "Application Decision - {startupName}",
    content: `Dear {founderName},

Thank you for your interest in our incubator program and for submitting your application for {startupName}.

After reviewing all applications, we have decided not to move forward with {startupName} in our current cohort. {rejectionReason}

We appreciate the time you invested in the application process and encourage you to continue pursuing your entrepreneurial goals.

Best of luck with {startupName}.

Regards,
[Your Name]
[Incubator Name]`
  },
  {
    id: "future_opportunity",
    name: "Future Opportunity",
    description: "Leaves door open for future consideration",
    category: "future-opportunity",
    defaultRejectionCategory: "timing",
    subject: "Re: {startupName} - Not the Right Time, But Keep Us Posted",
    content: `Dear {founderName},

Thank you for introducing us to {startupName}. We were genuinely interested in your approach to {industry} and the problem you're solving.

Unfortunately, we won't be able to offer you a place in our current program. {rejectionReason}

However, we'd like to keep the door open for future opportunities. We believe {startupName} has potential, and we'd welcome the chance to reconnect when the timing is better aligned.

Here's what we'd love to see in the future:
• Continued progress on your key milestones
• Evidence of market traction and customer validation
• Team development and operational scaling

Please don't hesitate to reapply in the future or reach out when you've hit significant milestones. We'd be excited to see how {startupName} evolves.

In the meantime, we're happy to provide introductions to other resources that might be helpful for your current stage.

Wishing you continued success,

[Your Name]
[Your Title]
[Incubator Name]

P.S. Feel free to send us updates on your progress. We love seeing entrepreneurs succeed!`
  }
];

const REJECTION_CATEGORIES = [
  { 
    value: "fit", 
    label: "Program Fit", 
    description: "Not aligned with our focus areas or investment thesis",
    icon: Target 
  },
  { 
    value: "timing", 
    label: "Timing", 
    description: "Great company, but timing isn't right for our program",
    icon: Clock 
  },
  { 
    value: "stage", 
    label: "Development Stage", 
    description: "Too early or too advanced for our program",
    icon: AlertTriangle 
  },
  { 
    value: "resources", 
    label: "Resource Constraints", 
    description: "Limited capacity in current cohort",
    icon: Heart 
  }
];

export function RejectionEmailDraftingTool({
  application,
  emailData,
  onEmailDataChange
}: RejectionEmailDraftingToolProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isCustomizing, setIsCustomizing] = useState(false);

  const applyTemplate = (template: RejectionEmailTemplate) => {
    const personalizedSubject = template.subject
      .replace(/\{startupName\}/g, application.startupName)
      .replace(/\{founderName\}/g, application.founderName);

    const personalizedContent = template.content
      .replace(/\{founderName\}/g, application.founderName)
      .replace(/\{startupName\}/g, application.startupName)
      .replace(/\{industry\}/g, application.industry)
      .replace(/\{rejectionReason\}/g, emailData.rejectionReason || "[Rejection reason will be inserted here]");

    setSelectedTemplate(template.id);
    onEmailDataChange({
      template: template.id,
      subject: personalizedSubject,
      content: personalizedContent,
      category: template.defaultRejectionCategory
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

  const handleRejectionReasonChange = (rejectionReason: string) => {
    onEmailDataChange({ rejectionReason });
    
    // Update content if template is selected and reason changes
    if (selectedTemplate && !isCustomizing) {
      const template = REJECTION_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        const updatedContent = template.content
          .replace(/\{founderName\}/g, application.founderName)
          .replace(/\{startupName\}/g, application.startupName)
          .replace(/\{industry\}/g, application.industry)
          .replace(/\{rejectionReason\}/g, rejectionReason);
        onEmailDataChange({ content: updatedContent });
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const resetTemplate = () => {
    if (selectedTemplate) {
      const template = REJECTION_TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        applyTemplate(template);
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "professional": return "bg-blue-50 text-blue-700 border-blue-200";
      case "encouraging": return "bg-green-50 text-green-700 border-green-200";
      case "brief": return "bg-orange-50 text-orange-700 border-orange-200";
      case "future-opportunity": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div>
      {/* Template Selection */}
      <div className="p-6 border-b border-[#C8D6FF]">
        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Choose Rejection Email Template
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {REJECTION_TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all border ${
                selectedTemplate === template.id 
                  ? 'border-[#FF220E] bg-[#FF220E]/5' 
                  : 'border-[#C8D6FF] hover:border-[#FF220E]'
              }`}
              onClick={() => applyTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm">{template.name}</h4>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category.replace('-', ' ')}
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
            <AlertTriangle className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Industry:</span>
            <span>{application.industry}</span>
          </div>
        </div>
      </div>

      {/* Email Editor */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Rejection Email Composition</h3>
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

          {/* Rejection Category & Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Rejection Category
              </label>
              <Select 
                value={emailData.category} 
                onValueChange={(value: any) => onEmailDataChange({ category: value })}
              >
                <SelectTrigger className="border-[#C8D6FF]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Specific Reason
              </label>
              <Input
                value={emailData.rejectionReason}
                onChange={(e) => handleRejectionReasonChange(e.target.value)}
                placeholder="e.g., not aligned with our current investment thesis..."
                className="w-full bg-[#F7F9FF] border-[#C8D6FF]"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="block text-sm text-gray-700">
              Additional Options
            </label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offer-feedback"
                  checked={emailData.offerFeedback}
                  onCheckedChange={(checked) => onEmailDataChange({ offerFeedback: !!checked })}
                />
                <label htmlFor="offer-feedback" className="text-sm text-gray-700">
                  Offer to provide detailed feedback
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="future-consideration"
                  checked={emailData.futureConsideration}
                  onCheckedChange={(checked) => onEmailDataChange({ futureConsideration: !!checked })}
                />
                <label htmlFor="future-consideration" className="text-sm text-gray-700">
                  Invite future reapplication
                </label>
              </div>
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
              placeholder="Compose your rejection email message..."
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
                    <div><strong>Category:</strong> <Badge variant="outline" className="text-xs border-[#C8D6FF]">{emailData.category}</Badge></div>
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