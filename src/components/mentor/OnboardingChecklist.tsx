import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import {
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  Users,
  Target,
  Plus,
  Calendar,
  User,
  BookOpen,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

interface OnboardedStartup {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  acceptedAt: string;
  onboardingStatus: "pending" | "in-progress" | "completed";
  checklist: {
    agreementSigned: boolean;
    welcomeCallCompleted: boolean;
    onboardingMaterialsSent: boolean;
    initialGoalsSet: boolean;
    mentorIntroductionsMade: boolean;
  };
  welcomeCallScheduled?: {
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
  };
  assignedMentor?: {
    name: string;
    email: string;
    expertise: string[];
  };
  initialGoals?: string[];
  notes?: string;
}

interface OnboardingChecklistProps {
  startup: OnboardedStartup;
  onUpdate: (checklist: typeof startup.checklist) => void;
}

export function OnboardingChecklist({ startup, onUpdate }: OnboardingChecklistProps) {
  const [localChecklist, setLocalChecklist] = useState(startup.checklist);
  const [notes, setNotes] = useState(startup.notes || "");
  const [showWelcomeCallDialog, setShowWelcomeCallDialog] = useState(false);
  const [showMentorDialog, setShowMentorDialog] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  
  // Welcome Call state
  const [welcomeCallDate, setWelcomeCallDate] = useState("");
  const [welcomeCallTime, setWelcomeCallTime] = useState("");
  const [welcomeCallNotes, setWelcomeCallNotes] = useState("");
  
  // Mentor assignment state
  const [selectedMentor, setSelectedMentor] = useState("");
  const [mentorNotes, setMentorNotes] = useState("");
  
  // Goals state
  const [goals, setGoals] = useState<string[]>(startup.initialGoals || []);
  const [newGoal, setNewGoal] = useState("");

  const checklistItems = [
    {
      key: "agreementSigned" as keyof typeof localChecklist,
      label: "Agreement Signed",
      description: "Program participation agreement has been signed",
      icon: FileText,
      color: "text-[#114DFF]",
      bgColor: "bg-[#EDF2FF]",
      borderColor: "border-[#C8D6FF]",
      action: "View Documents",
    },
    {
      key: "welcomeCallCompleted" as keyof typeof localChecklist,
      label: "Welcome Call Completed",
      description: "Initial onboarding call with founder has been conducted",
      icon: Phone,
      color: "text-[#114DFF]",
      bgColor: "bg-[#EDF2FF]",
      borderColor: "border-[#C8D6FF]",
      action: "Schedule Call",
      dialog: "welcomeCall",
    },
    {
      key: "onboardingMaterialsSent" as keyof typeof localChecklist,
      label: "Onboarding Materials Sent",
      description: "Welcome pack and program materials have been delivered",
      icon: Mail,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      action: "Send Materials",
    },
    {
      key: "initialGoalsSet" as keyof typeof localChecklist,
      label: "Initial Goals Set",
      description: "Startup objectives and milestones have been defined",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      action: "Set Goals",
      dialog: "goals",
    },
    {
      key: "mentorIntroductionsMade" as keyof typeof localChecklist,
      label: "Key Mentor Introductions Made",
      description: "Relevant mentors have been connected with the startup",
      icon: Users,
      color: "text-[#3CE5A7]",
      bgColor: "bg-[#EDF2FF]",
      borderColor: "border-[#C8D6FF]",
      action: "Assign Mentors",
      dialog: "mentor",
    },
  ];

  const availableMentors = [
    { id: "1", name: "Sarah Johnson", expertise: ["Product Development", "UI/UX"], email: "sarah@example.com" },
    { id: "2", name: "Michael Chen", expertise: ["Technical Strategy", "AI/ML"], email: "michael@example.com" },
    { id: "3", name: "Lisa Rodriguez", expertise: ["Marketing", "Growth"], email: "lisa@example.com" },
    { id: "4", name: "David Park", expertise: ["Finance", "Fundraising"], email: "david@example.com" },
    { id: "5", name: "Emma Thompson", expertise: ["Operations", "Scaling"], email: "emma@example.com" },
  ];

  const handleChecklistChange = (key: keyof typeof localChecklist, checked: boolean) => {
    const updatedChecklist = { ...localChecklist, [key]: checked };
    setLocalChecklist(updatedChecklist);
    onUpdate(updatedChecklist);
    
    if (checked) {
      toast.success(`${checklistItems.find(item => item.key === key)?.label} marked as complete!`);
    }
  };

  const handleScheduleWelcomeCall = () => {
    if (!welcomeCallDate || !welcomeCallTime) {
      toast.error("Please select both date and time for the welcome call.");
      return;
    }
    
    // Here you would integrate with calendar API
    toast.success("Welcome call scheduled successfully!");
    setShowWelcomeCallDialog(false);
    handleChecklistChange("welcomeCallCompleted", true);
  };

  const handleAssignMentor = () => {
    if (!selectedMentor) {
      toast.error("Please select a mentor to assign.");
      return;
    }
    
    toast.success("Mentor assigned successfully!");
    setShowMentorDialog(false);
    handleChecklistChange("mentorIntroductionsMade", true);
  };

  const handleSetGoals = () => {
    if (goals.length === 0) {
      toast.error("Please add at least one goal.");
      return;
    }
    
    toast.success("Initial goals set successfully!");
    setShowGoalsDialog(false);
    handleChecklistChange("initialGoalsSet", true);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const completedTasks = Object.values(localChecklist).filter(Boolean).length;
  const totalTasks = Object.keys(localChecklist).length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const getDialogContent = (dialogType: string) => {
    switch (dialogType) {
      case "welcomeCall":
        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Welcome Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={welcomeCallDate}
                    onChange={(e) => setWelcomeCallDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={welcomeCallTime}
                    onChange={(e) => setWelcomeCallTime(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Call Notes (Optional)</Label>
                <Textarea
                  placeholder="Add any specific topics or agenda items..."
                  value={welcomeCallNotes}
                  onChange={(e) => setWelcomeCallNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowWelcomeCallDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleScheduleWelcomeCall}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </DialogContent>
        );
      
      case "mentor":
        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Mentor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Mentor</Label>
                <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a mentor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{mentor.name}</span>
                          <span className="text-sm text-gray-500">
                            {mentor.expertise.join(", ")}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Introduction Notes (Optional)</Label>
                <Textarea
                  placeholder="Add context for the introduction..."
                  value={mentorNotes}
                  onChange={(e) => setMentorNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMentorDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignMentor}>
                  <User className="w-4 h-4 mr-2" />
                  Assign Mentor
                </Button>
              </div>
            </div>
          </DialogContent>
        );
      
      case "goals":
        return (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Initial Goals</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Add Goal</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter a goal for the startup..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addGoal()}
                  />
                  <Button onClick={addGoal} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {goals.length > 0 && (
                <div>
                  <Label>Current Goals</Label>
                  <div className="space-y-2 mt-2">
                    {goals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="flex-1">{goal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGoal(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowGoalsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSetGoals}>
                  <Target className="w-4 h-4 mr-2" />
                  Set Goals
                </Button>
              </div>
            </div>
          </DialogContent>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Onboarding Progress</CardTitle>
            <Badge variant="outline" className={
              progressPercentage === 100 
                ? "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]"
                : "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]"
            }>
              {completedTasks}/{totalTasks} Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Overall Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-[#114DFF] to-[#06CB1D] h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {progressPercentage === 100 && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Onboarding Complete!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklistItems.map((item) => (
          <Card key={item.key} className={`border-l-4 ${item.borderColor} ${
            localChecklist[item.key] ? "bg-gray-50" : "bg-white"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={localChecklist[item.key]}
                      onCheckedChange={(checked) => handleChecklistChange(item.key, checked as boolean)}
                      className="mt-1"
                    />
                    <div className={`p-2 rounded-lg ${item.bgColor}`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      localChecklist[item.key] ? "text-gray-500 line-through" : "text-gray-900"
                    }`}>
                      {item.label}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>
                    
                    {localChecklist[item.key] ? (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.dialog && !localChecklist[item.key] && (
                    <Dialog 
                      open={
                        (item.dialog === "welcomeCall" && showWelcomeCallDialog) ||
                        (item.dialog === "mentor" && showMentorDialog) ||
                        (item.dialog === "goals" && showGoalsDialog)
                      }
                      onOpenChange={(open) => {
                        if (item.dialog === "welcomeCall") setShowWelcomeCallDialog(open);
                        if (item.dialog === "mentor") setShowMentorDialog(open);
                        if (item.dialog === "goals") setShowGoalsDialog(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {item.action}
                        </Button>
                      </DialogTrigger>
                      {getDialogContent(item.dialog)}
                    </Dialog>
                  )}
                  
                  {!item.dialog && !localChecklist[item.key] && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleChecklistChange(item.key, true)}
                    >
                      {item.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Onboarding Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any notes or observations about the onboarding process..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mb-4"
          />
          <Button variant="outline" size="sm">
            Save Notes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}