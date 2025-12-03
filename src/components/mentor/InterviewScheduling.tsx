import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { StartupProfileView } from "./StartupProfileView";
import { toast } from "sonner@2.0.3";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Mail,
  Phone,
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Filter,
  Search,
  X,
  RefreshCw,
  Eye,
  ArrowLeft,
} from "lucide-react";

interface InterviewSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  available: boolean;
  applicationId?: string;
  startupName?: string;
  founderName?: string;
}

interface ScheduledInterview {
  id: string;
  applicationId: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  notes?: string;
  aiScore: number;
}

// Mock data for interviews - matching ApplicationManagement data
const mockScheduledInterviews: ScheduledInterview[] = [
  {
    id: "1",
    applicationId: "2",
    startupName: "HealthAI",
    founderName: "Dr. Michael Rodriguez",
    founderEmail: "michael@healthai.com",
    date: "2024-10-15",
    time: "15:00",
    duration: 30,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    status: "scheduled",
    aiScore: 87,
  },
  {
    id: "2",
    applicationId: "3",
    startupName: "AgriBot",
    founderName: "James Kim",
    founderEmail: "james@agribot.com",
    date: "2024-10-08",
    time: "10:00",
    duration: 30,
    meetingLink: "https://zoom.us/j/123456789",
    status: "completed",
    notes: "Strong technical team, proven pilot customers, but high capital requirements for scaling. Recommended for acceptance with conditions.",
    aiScore: 84,
  },
  {
    id: "3",
    applicationId: "4",
    startupName: "GreenTech Innovations",
    founderName: "Alex Chen",
    founderEmail: "alex@greentech.com",
    date: "2024-10-12",
    time: "14:30",
    duration: 30,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/xyz",
    status: "scheduled",
    aiScore: 91,
  },
  {
    id: "4",
    applicationId: "7",
    startupName: "CloudSync Analytics",
    founderName: "Ryan Foster",
    founderEmail: "ryan@cloudsync.com",
    date: "2024-09-15",
    time: "11:00",
    duration: 45,
    meetingLink: "https://meet.google.com/cloudsync-interview",
    status: "completed",
    notes: "Excellent presentation. Strong product-market fit. Team has extensive enterprise experience. Highly recommended for acceptance.",
    aiScore: 88,
  },
];

const mockAvailableSlots: InterviewSlot[] = [
  { id: "1", date: "2024-01-23", time: "09:00", duration: 30, available: true },
  { id: "2", date: "2024-01-23", time: "10:00", duration: 30, available: true },
  { id: "3", date: "2024-01-23", time: "11:00", duration: 30, available: true },
  { id: "4", date: "2024-01-23", time: "14:00", duration: 30, available: true },
  { id: "5", date: "2024-01-23", time: "15:00", duration: 30, available: true },
  { id: "6", date: "2024-01-24", time: "09:00", duration: 30, available: true },
  { id: "7", date: "2024-01-24", time: "10:00", duration: 30, available: false, applicationId: "2", startupName: "HealthAI", founderName: "Dr. Michael Rodriguez" },
  { id: "8", date: "2024-01-24", time: "11:00", duration: 30, available: true },
];

export function InterviewScheduling() {
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>(mockScheduledInterviews);
  const [availableSlots] = useState<InterviewSlot[]>(mockAvailableSlots);
  const [activeTab, setActiveTab] = useState("scheduled");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<ScheduledInterview | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [selectedApplicationForView, setSelectedApplicationForView] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2024-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Scheduled',
          color: 'bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]',
          icon: Calendar,
        };
      case 'completed':
        return {
          label: 'Completed',
          color: 'bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]',
          icon: CheckCircle,
        };
      case 'missed':
        return {
          label: 'Missed',
          color: 'bg-[#EDF2FF] text-[#FF220E] border-[#C8D6FF]',
          icon: AlertCircle,
        };
      case 'rescheduled':
        return {
          label: 'Rescheduled',
          color: 'bg-[#F7F9FF] text-gray-700 border-[#CCCCCC]',
          icon: Clock,
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]',
          icon: Clock,
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#06CB1D]";
    if (score >= 80) return "text-[#114DFF]";
    if (score >= 70) return "text-gray-700";
    return "text-[#FF220E]";
  };

  // Filter interviews based on status and search
  const filteredInterviews = scheduledInterviews.filter(interview => {
    const matchesStatus = filterStatus === "all" || interview.status === filterStatus;
    const matchesSearch = 
      interview.startupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.founderName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, InterviewSlot[]>);

  // Handle reschedule
  const handleRescheduleClick = (interview: ScheduledInterview) => {
    setSelectedInterview(interview);
    setNewDate(interview.date);
    setNewTime(interview.time);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = () => {
    if (!selectedInterview || !newDate || !newTime) return;

    // Update the interview in the list
    setScheduledInterviews(prev =>
      prev.map(interview =>
        interview.id === selectedInterview.id
          ? { ...interview, date: newDate, time: newTime, status: 'scheduled' as const }
          : interview
      )
    );

    toast.success("Interview Rescheduled Successfully", {
      description: `Interview with ${selectedInterview.founderName} has been rescheduled to ${formatDate(newDate)} at ${formatTime(newTime)}. An email notification has been sent.`,
      duration: 5000,
    });

    setShowRescheduleModal(false);
    setSelectedInterview(null);
  };

  // Convert interview data to application data for profile view
  const convertInterviewToApplication = (interview: ScheduledInterview) => {
    // Map interview status to application status
    const getApplicationStatus = () => {
      if (interview.status === 'completed') return 'interview-completed';
      if (interview.status === 'scheduled') return 'interview-scheduled';
      return 'pending';
    };

    // Create mock application data based on startup
    const mockApplicationData: any = {
      id: interview.applicationId,
      startupName: interview.startupName,
      founderName: interview.founderName,
      founderEmail: interview.founderEmail,
      industry: interview.startupName.includes('Health') ? 'HealthTech' : 
                interview.startupName.includes('Cloud') ? 'SaaS & Cloud Computing' :
                interview.startupName.includes('Green') ? 'CleanTech' : 
                interview.startupName.includes('Agri') ? 'AgTech' : 'Technology',
      stage: 'Seed',
      location: interview.startupName.includes('Health') ? 'Boston, MA' :
                interview.startupName.includes('Cloud') ? 'San Diego, CA' :
                interview.startupName.includes('Green') ? 'Austin, TX' :
                'San Francisco, CA',
      requestedFunding: 500000,
      aiScore: interview.aiScore,
      marketScore: interview.aiScore + 2,
      teamScore: interview.aiScore - 3,
      ideaScore: interview.aiScore + 1,
      fitScore: interview.aiScore,
      submittedAt: new Date(interview.date).toISOString(),
      status: getApplicationStatus(),
      description: interview.startupName === 'CloudSync Analytics' 
        ? "Enterprise-grade cloud data analytics platform that provides real-time insights across multi-cloud environments. Our platform unifies data from AWS, Azure, and Google Cloud, offering advanced analytics, predictive modeling, and automated reporting."
        : `${interview.startupName} is building innovative solutions in their industry. We're focused on creating value and solving real problems for our customers.`,
      teamSize: 8,
      previousFunding: 200000,
      revenueStage: interview.startupName === 'CloudSync Analytics' ? '$400K ARR' : 'Pre-revenue',
      interviewDate: interview.date,
      interviewNotes: interview.notes,
    };

    return mockApplicationData;
  };

  // Handle view application
  const handleViewApplication = (interview: ScheduledInterview) => {
    const applicationData = convertInterviewToApplication(interview);
    setSelectedApplicationForView(applicationData);
  };

  // If viewing an application, show the profile view
  if (selectedApplicationForView) {
    return (
      <StartupProfileView
        application={selectedApplicationForView}
        onBack={() => setSelectedApplicationForView(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Interview Scheduling</h2>
          <p className="text-gray-600 mt-1">
            Manage your startup interview calendar and availability
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Time Slot
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Scheduled ({scheduledInterviews.length})
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            My Calendar
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Availability
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {/* Search and Filter */}
          <Card className="border-[#C8D6FF]">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by startup or founder name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#F7F9FF] border-[#C8D6FF]"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-[#C8D6FF] rounded-lg bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="missed">Missed</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Interviews List */}
          <div className="space-y-4">
            {filteredInterviews.length === 0 ? (
              <Card className="border-[#C8D6FF]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-2">
                    No interviews found
                  </h3>
                  <p className="text-gray-600">
                    No interviews match your current filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredInterviews.map((interview) => {
                const statusConfig = getStatusConfig(interview.status);
                return (
                  <Card key={interview.id} className="border-[#C8D6FF] shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12 ring-2 ring-[#C8D6FF]/30">
                            <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                              {interview.startupName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-gray-900">
                              {interview.startupName}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              with {interview.founderName}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(interview.date)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatTime(interview.time)} ({interview.duration} min)
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={statusConfig.color}>
                            <statusConfig.icon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                          <div className="text-right">
                            <div className={`text-lg ${getScoreColor(interview.aiScore)}`}>
                              {interview.aiScore}
                            </div>
                            <div className="text-xs text-gray-600">AI Score</div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center gap-6 mb-4 p-3 bg-[#F7F9FF] rounded-lg border border-[#C8D6FF]">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a href={`mailto:${interview.founderEmail}`} className="text-[#114DFF] hover:underline text-sm">
                            {interview.founderEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-gray-500" />
                          <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-[#114DFF] hover:underline text-sm">
                            Join Meeting
                          </a>
                        </div>
                      </div>

                      {/* Interview Notes */}
                      {interview.notes && (
                        <div className="p-4 bg-[#EDF2FF] rounded-lg mb-4 border border-[#C8D6FF]">
                          <h4 className="text-[#114DFF] mb-1">Interview Notes</h4>
                          <p className="text-gray-700 text-sm">{interview.notes}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#C8D6FF]">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="w-4 h-4" />
                          <span>Scheduled for {formatDate(interview.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {interview.status === 'scheduled' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                                onClick={() => {
                                  toast.success("Reminder Sent", {
                                    description: `Interview reminder sent to ${interview.founderName}`,
                                    duration: 3000,
                                  });
                                }}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Send Reminder
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-[#114DFF] text-[#114DFF] hover:bg-[#EDF2FF]"
                                onClick={() => handleRescheduleClick(interview)}
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Reschedule
                              </Button>
                            </>
                          )}
                          {interview.status === 'completed' && (
                            <Button size="sm" className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                              Make Decision
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-[#C8D6FF] hover:bg-[#EDF2FF]"
                            onClick={() => handleViewApplication(interview)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Application
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="border-[#C8D6FF]">
            <CardHeader>
              <CardTitle>Weekly Calendar View</CardTitle>
              <p className="text-gray-600">
                Overview of your scheduled interviews and available time slots
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(slotsByDate).map(([date, slots]) => (
                  <div key={date} className="border border-[#C8D6FF] rounded-lg p-4 bg-[#F7F9FF]">
                    <h3 className="mb-3">{formatDate(date)}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-3 rounded-lg border ${
                            slot.available
                              ? 'bg-[#EDF2FF] border-[#C8D6FF]'
                              : 'bg-[#F7F9FF] border-[#C8D6FF]'
                          }`}
                        >
                          <div className="text-sm">
                            {formatTime(slot.time)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {slot.available ? (
                              <span className="text-[#06CB1D]">Available</span>
                            ) : (
                              <span className="text-[#114DFF]">
                                {slot.startupName}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card className="border-[#C8D6FF]">
            <CardHeader>
              <CardTitle>Manage Availability</CardTitle>
              <p className="text-gray-600">
                Set your available time slots for startup interviews
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Date</label>
                    <Input type="date" className="bg-[#F7F9FF] border-[#C8D6FF]" />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Duration (minutes)</label>
                    <select className="w-full px-3 py-2 border border-[#C8D6FF] rounded-lg bg-white">
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Time Slots</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        className="justify-start border-[#C8D6FF] hover:bg-[#EDF2FF]"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(time)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white">
                    Add Time Slots
                  </Button>
                  <Button variant="outline" className="border-[#C8D6FF] hover:bg-[#EDF2FF]">
                    Bulk Import
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reschedule Modal */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#114DFF]" />
              Reschedule Interview
            </DialogTitle>
            <DialogDescription>
              Update the interview date and time for {selectedInterview?.startupName}
            </DialogDescription>
          </DialogHeader>

          {selectedInterview && (
            <div className="space-y-6 pt-4">
              {/* Current Interview Details */}
              <div className="bg-[#F7F9FF] border border-[#C8D6FF] rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Schedule</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 ring-2 ring-[#C8D6FF]/30">
                      <AvatarFallback className="bg-gradient-to-br from-[#114DFF] to-[#3CE5A7] text-white">
                        {selectedInterview.startupName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{selectedInterview.startupName}</p>
                      <p className="text-sm text-gray-600">{selectedInterview.founderName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedInterview.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(selectedInterview.time)} ({selectedInterview.duration} min)
                    </div>
                  </div>
                </div>
              </div>

              {/* New Schedule Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900">New Schedule</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="reschedule-date">Date *</Label>
                    <Input
                      id="reschedule-date"
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-[#F7F9FF] border-[#C8D6FF]"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="reschedule-time">Time *</Label>
                    <Input
                      id="reschedule-time"
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="bg-[#F7F9FF] border-[#C8D6FF]"
                    />
                  </div>
                </div>

                {/* Quick Time Slots */}
                <div className="space-y-2">
                  <Label>Quick Select Time</Label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewTime(time)}
                        className={`${newTime === time ? 'border-[#114DFF] bg-[#EDF2FF] text-[#114DFF]' : 'border-[#C8D6FF]'}`}
                      >
                        {formatTime(time)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#C8D6FF]">
                <Button
                  variant="outline"
                  className="flex-1 border-[#CCCCCC] hover:bg-[#F5F5F5]"
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedInterview(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRescheduleSubmit}
                  disabled={!newDate || !newTime}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Confirm Reschedule
                </Button>
              </div>

              {/* Info Note */}
              <div className="bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#114DFF] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium text-gray-900 mb-1">Note:</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>• {selectedInterview.founderName} will receive an email notification about the reschedule</li>
                      <li>• The meeting link will remain the same</li>
                      <li>• Calendar invites will be automatically updated</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
