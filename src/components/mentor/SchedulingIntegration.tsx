import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Calendar } from "../ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  Video, 
  Phone,
  MapPin,
  Plus,
  Check
} from "lucide-react";

interface Application {
  id: string;
  startupName: string;
  founderName: string;
  founderEmail: string;
  location: string;
}

interface SchedulingInfo {
  date: string;
  time: string;
  duration: number;
  timezone: string;
}

interface SchedulingIntegrationProps {
  schedulingInfo: SchedulingInfo;
  onSchedulingChange: (schedulingInfo: SchedulingInfo) => void;
  application: Application;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

const DURATIONS = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 }
];

const TIMEZONES = [
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Central Time (CT)", value: "America/Chicago" },
  { label: "Mountain Time (MT)", value: "America/Denver" },
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "GMT", value: "GMT" },
  { label: "Central European Time", value: "Europe/Berlin" },
  { label: "India Standard Time", value: "Asia/Kolkata" },
  { label: "Singapore Time", value: "Asia/Singapore" }
];

const INTERVIEW_TYPES = [
  {
    id: "video",
    name: "Video Call",
    icon: Video,
    description: "Zoom/Teams meeting",
    popular: true
  },
  {
    id: "phone",
    name: "Phone Call",
    icon: Phone,
    description: "Traditional phone interview"
  },
  {
    id: "in-person",
    name: "In-Person",
    icon: MapPin,
    description: "Office meeting"
  }
];

export function SchedulingIntegration({
  schedulingInfo,
  onSchedulingChange,
  application
}: SchedulingIntegrationProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    schedulingInfo.date ? new Date(schedulingInfo.date) : undefined
  );
  const [interviewType, setInterviewType] = useState<string>("video");
  const [customNotes, setCustomNotes] = useState<string>("");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onSchedulingChange({
        ...schedulingInfo,
        date: date.toISOString().split('T')[0]
      });
    }
  };

  const handleTimeSelect = (time: string) => {
    onSchedulingChange({
      ...schedulingInfo,
      time
    });
  };

  const handleDurationChange = (duration: string) => {
    onSchedulingChange({
      ...schedulingInfo,
      duration: parseInt(duration)
    });
  };

  const handleTimezoneChange = (timezone: string) => {
    onSchedulingChange({
      ...schedulingInfo,
      timezone
    });
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimezoneAbbreviation = (timezone: string) => {
    const tz = TIMEZONES.find(t => t.value === timezone);
    return tz ? tz.label.match(/\(([^)]+)\)/)?.[1] || timezone : timezone;
  };

  // Generate suggested time slots based on location/timezone
  const getSuggestedSlots = () => {
    if (!selectedDate) return [];
    
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    const currentHour = today.getHours();
    
    return TIME_SLOTS.filter(time => {
      const [hour] = time.split(':').map(Number);
      return !isToday || hour > currentHour;
    }).slice(0, 6);
  };

  return (
    <div>
      {/* Header */}
      <div className="p-6 border-b border-[#C8D6FF]">
        <h3 className="text-gray-900 mb-2 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          Schedule Interview with {application.founderName}
        </h3>
        <p className="text-sm text-gray-600">
          Set up a 30-minute interview to discuss {application.startupName}
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Calendar */}
          <div className="space-y-6">
            {/* Calendar */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border border-[#C8D6FF]"
                />
                {selectedDate && (
                  <div className="mt-3 p-3 bg-[#EDF2FF] rounded-lg border border-[#C8D6FF]">
                    <p className="text-sm text-[#114DFF]">
                      Selected: {formatSelectedDate(selectedDate)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interview Type */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="text-sm">Interview Format</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {INTERVIEW_TYPES.map((type) => (
                    <div
                      key={type.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        interviewType === type.id
                          ? 'border-[#114DFF] bg-[#EDF2FF]'
                          : 'border-[#C8D6FF] hover:border-[#114DFF]'
                      }`}
                      onClick={() => setInterviewType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-4 h-4 text-gray-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{type.name}</span>
                            {type.popular && (
                              <Badge variant="outline" className="text-xs bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{type.description}</p>
                        </div>
                        {interviewType === type.id && (
                          <Check className="w-4 h-4 text-[#114DFF]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Time & Settings */}
          <div className="space-y-6">
            {/* Time Selection */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    {/* Suggested Times */}
                    <div>
                      <h4 className="text-sm mb-2">Suggested Times</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {getSuggestedSlots().map((time) => (
                          <Button
                            key={time}
                            variant={schedulingInfo.time === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeSelect(time)}
                            className={schedulingInfo.time === time ? 
                              "text-xs bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white" : 
                              "text-xs border-[#C8D6FF] hover:bg-[#EDF2FF]"
                            }
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* All Available Times */}
                    <div>
                      <h4 className="text-sm mb-2">All Available Times</h4>
                      <Select value={schedulingInfo.time} onValueChange={handleTimeSelect}>
                        <SelectTrigger className="border-[#C8D6FF]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Please select a date first
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Duration & Timezone */}
            <Card className="border-[#C8D6FF]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Meeting Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Duration</label>
                  <Select 
                    value={schedulingInfo.duration.toString()} 
                    onValueChange={handleDurationChange}
                  >
                    <SelectTrigger className="border-[#C8D6FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATIONS.map((duration) => (
                        <SelectItem key={duration.value} value={duration.value.toString()}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Timezone</label>
                  <Select value={schedulingInfo.timezone} onValueChange={handleTimezoneChange}>
                    <SelectTrigger className="border-[#C8D6FF]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            {selectedDate && schedulingInfo.time && (
              <Card className="border-[#C8D6FF]">
                <CardHeader>
                  <CardTitle className="text-sm">Interview Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>{formatSelectedDate(selectedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span>
                        {schedulingInfo.time} {getTimezoneAbbreviation(schedulingInfo.timezone)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{schedulingInfo.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span>
                        {INTERVIEW_TYPES.find(t => t.id === interviewType)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participant:</span>
                      <span>{application.founderName}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-[#EDF2FF] border border-[#C8D6FF] rounded-lg">
                    <div className="flex items-center gap-2 text-[#06CB1D]">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Ready to schedule</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      All required information has been set
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
