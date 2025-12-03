import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { 
  MessageSquare, 
  Star, 
  Save, 
  ArrowRight, 
  Calendar,
  Clock,
  User,
  Building,
  MapPin,
  TrendingUp,
  Plus,
  X,
  AlertCircle
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
  description: string;
  submittedAt: string;
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
  interviewDate: string;
  interviewDuration: string;
  attendees: string[];
  keyQuestions: Array<{
    question: string;
    answer: string;
  }>;
  followUpActions: string[];
  recommendation: "strong-accept" | "accept" | "maybe" | "decline" | "strong-decline";
}

interface InterviewNotesCaptureProps {
  application: Application;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes: (notes: InterviewNotes) => void;
  onProceedToDecision: (notes: InterviewNotes) => void;
  existingNotes?: Partial<InterviewNotes>;
}

export function InterviewNotesCapture({
  application,
  isOpen,
  onClose,
  onSaveNotes,
  onProceedToDecision,
  existingNotes
}: InterviewNotesCaptureProps) {
  const [notes, setNotes] = useState<InterviewNotes>({
    overallImpression: existingNotes?.overallImpression || "",
    strengths: existingNotes?.strengths || "",
    concerns: existingNotes?.concerns || "",
    marketFit: existingNotes?.marketFit || "",
    teamCapability: existingNotes?.teamCapability || "",
    nextSteps: existingNotes?.nextSteps || "",
    rating: existingNotes?.rating || 0,
    interviewDate: existingNotes?.interviewDate || new Date().toISOString().split('T')[0],
    interviewDuration: existingNotes?.interviewDuration || "",
    attendees: existingNotes?.attendees || [application.founderName],
    keyQuestions: existingNotes?.keyQuestions || [
      { question: "", answer: "" }
    ],
    followUpActions: existingNotes?.followUpActions || [],
    recommendation: existingNotes?.recommendation || "maybe"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [newAttendee, setNewAttendee] = useState("");
  const [newAction, setNewAction] = useState("");

  const handleNotesChange = (field: keyof InterviewNotes, value: any) => {
    setNotes(prev => ({ ...prev, [field]: value }));
  };

  const handleAddQuestion = () => {
    setNotes(prev => ({
      ...prev,
      keyQuestions: [...prev.keyQuestions, { question: "", answer: "" }]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setNotes(prev => ({
      ...prev,
      keyQuestions: prev.keyQuestions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (index: number, field: 'question' | 'answer', value: string) => {
    setNotes(prev => ({
      ...prev,
      keyQuestions: prev.keyQuestions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleAddAttendee = () => {
    if (newAttendee.trim()) {
      setNotes(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee("");
    }
  };

  const handleRemoveAttendee = (index: number) => {
    setNotes(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const handleAddFollowUpAction = () => {
    if (newAction.trim()) {
      setNotes(prev => ({
        ...prev,
        followUpActions: [...prev.followUpActions, newAction.trim()]
      }));
      setNewAction("");
    }
  };

  const handleRemoveFollowUpAction = (index: number) => {
    setNotes(prev => ({
      ...prev,
      followUpActions: prev.followUpActions.filter((_, i) => i !== index)
    }));
  };

  const validateNotes = () => {
    return notes.overallImpression.trim() && 
           notes.strengths.trim() && 
           notes.rating > 0 &&
           notes.interviewDate &&
           notes.recommendation !== "maybe";
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSaveNotes(notes);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProceedToDecision = () => {
    if (validateNotes()) {
      onProceedToDecision(notes);
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "strong-accept": return "bg-green-100 text-green-800 border-green-200";
      case "accept": return "bg-blue-100 text-blue-800 border-blue-200";
      case "maybe": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "decline": return "bg-orange-100 text-orange-800 border-orange-200";
      case "strong-decline": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-blue-600";
    if (rating >= 2) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5" />
            Interview Notes - {application.startupName}
          </DialogTitle>
          <DialogDescription>
            Document your interview assessment to proceed with the decision process.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[75vh] space-y-6">
          {/* Application Summary Header */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{application.founderName}</div>
                    <div className="text-gray-600">Founder</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{application.industry}</div>
                    <div className="text-gray-600">Industry</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{application.stage}</div>
                    <div className="text-gray-600">Stage</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{application.location}</div>
                    <div className="text-gray-600">Location</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Interview Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Interview Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="interview-date">Interview Date</Label>
                    <Input
                      id="interview-date"
                      type="date"
                      value={notes.interviewDate}
                      onChange={(e) => handleNotesChange('interviewDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interview-duration">Duration</Label>
                    <Input
                      id="interview-duration"
                      placeholder="e.g., 45 minutes"
                      value={notes.interviewDuration}
                      onChange={(e) => handleNotesChange('interviewDuration', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Attendees */}
                  <div>
                    <Label>Interview Attendees</Label>
                    <div className="mt-2 space-y-2">
                      {notes.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                            {attendee}
                          </span>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAttendee(index)}
                              className="p-1 h-auto"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add attendee"
                          value={newAttendee}
                          onChange={(e) => setNewAttendee(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddAttendee()}
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddAttendee}
                          disabled={!newAttendee.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label>Overall Rating</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={notes.rating >= rating ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleNotesChange('rating', rating)}
                          className="p-2"
                        >
                          <Star className={`w-4 h-4 ${notes.rating >= rating ? 'fill-current' : ''}`} />
                        </Button>
                      ))}
                      <span className={`text-sm ml-2 self-center font-medium ${getRatingColor(notes.rating)}`}>
                        {notes.rating > 0 ? `${notes.rating}/5` : 'Not rated'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div>
                    <Label>Recommendation</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {[
                        { value: "strong-accept", label: "Strong Accept" },
                        { value: "accept", label: "Accept" },
                        { value: "maybe", label: "Maybe" },
                        { value: "decline", label: "Decline" },
                        { value: "strong-decline", label: "Strong Decline" }
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={notes.recommendation === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleNotesChange('recommendation', option.value)}
                          className={notes.recommendation === option.value ? getRecommendationColor(option.value) : ""}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Assessment Notes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interview Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Impression */}
                  <div>
                    <Label htmlFor="overall-impression">Overall Impression *</Label>
                    <Textarea
                      id="overall-impression"
                      placeholder="Your general thoughts about the founder and startup..."
                      value={notes.overallImpression}
                      onChange={(e) => handleNotesChange('overallImpression', e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  {/* Strengths */}
                  <div>
                    <Label htmlFor="strengths">Key Strengths *</Label>
                    <Textarea
                      id="strengths"
                      placeholder="What are the main strengths of this application..."
                      value={notes.strengths}
                      onChange={(e) => handleNotesChange('strengths', e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  {/* Concerns */}
                  <div>
                    <Label htmlFor="concerns">Areas of Concern</Label>
                    <Textarea
                      id="concerns"
                      placeholder="Any concerns or areas that need improvement..."
                      value={notes.concerns}
                      onChange={(e) => handleNotesChange('concerns', e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Market Fit */}
                    <div>
                      <Label htmlFor="market-fit">Market Fit Assessment</Label>
                      <Textarea
                        id="market-fit"
                        placeholder="How well does this startup fit the market opportunity..."
                        value={notes.marketFit}
                        onChange={(e) => handleNotesChange('marketFit', e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    {/* Team Capability */}
                    <div>
                      <Label htmlFor="team-capability">Team Capability</Label>
                      <Textarea
                        id="team-capability"
                        placeholder="Assessment of founder and team capabilities..."
                        value={notes.teamCapability}
                        onChange={(e) => handleNotesChange('teamCapability', e.target.value)}
                        rows={3}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <Label htmlFor="next-steps">Recommended Next Steps</Label>
                    <Textarea
                      id="next-steps"
                      placeholder="What should be the next steps if accepted..."
                      value={notes.nextSteps}
                      onChange={(e) => handleNotesChange('nextSteps', e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Key Questions & Answers */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Key Questions & Answers</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddQuestion}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {notes.keyQuestions.map((qa, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Question {index + 1}</Label>
                        {notes.keyQuestions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuestion(index)}
                            className="p-1 h-auto"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="What question did you ask?"
                        value={qa.question}
                        onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="What was their response?"
                        value={qa.answer}
                        onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Follow-up Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Follow-up Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {notes.followUpActions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex-1">
                          {action}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFollowUpAction(index)}
                          className="p-1 h-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add follow-up action"
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFollowUpAction()}
                      className="text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddFollowUpAction}
                      disabled={!newAction.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Validation Alert */}
          {!validateNotes() && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Required Fields Missing</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Please complete the following required fields to proceed:
                    </p>
                    <ul className="text-sm text-amber-700 mt-2 list-disc list-inside">
                      {!notes.overallImpression.trim() && <li>Overall Impression</li>}
                      {!notes.strengths.trim() && <li>Key Strengths</li>}
                      {notes.rating === 0 && <li>Rating (1-5 stars)</li>}
                      {!notes.interviewDate && <li>Interview Date</li>}
                      {notes.recommendation === "maybe" && <li>Final Recommendation</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant="outline" className={getRecommendationColor(notes.recommendation)}>
            Recommendation: {notes.recommendation.replace('-', ' ').toUpperCase()}
          </Badge>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveNotes}
              disabled={isSaving}
            >
              {isSaving ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Notes
            </Button>
            
            <Button
              onClick={handleProceedToDecision}
              disabled={!validateNotes()}
              className="bg-green-600 hover:bg-green-700"
            >
              Proceed to Decision
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}