// React & Hooks
import { useState, useEffect } from "react";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Alert, AlertDescription } from "../ui/alert";

// Services
import { googleCalendarService, CalendarEvent } from "../../utils/mocks";

// Toast
import { toast } from "sonner@2.0.3";

// Icons
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

export function MentorCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  // Check Google Calendar connection status on mount
  useEffect(() => {
    const connected = googleCalendarService.isGoogleCalendarConnected();
    setIsConnected(connected);
    if (connected) {
      loadEvents();
    }
  }, []);

  // Load events from calendar service
  const loadEvents = () => {
    const calendarEvents = googleCalendarService.getEvents();
    setEvents(calendarEvents);
  };

  // Handle Google Calendar connection
  const handleConnectGoogleCalendar = async () => {
    setIsConnecting(true);
    try {
      const result = await googleCalendarService.connect();
      if (result.success) {
        setIsConnected(true);
        loadEvents();
        toast.success("Google Calendar Connected", {
          description: "Your calendar is now synced with the platform",
        });
        setShowConnectionDialog(false);
      }
    } catch (error) {
      toast.error("Connection Failed", {
        description: "Unable to connect to Google Calendar",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    googleCalendarService.disconnect();
    setIsConnected(false);
    setEvents([]);
    toast.success("Disconnected from Google Calendar");
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), day + 1);
    
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate >= dateStart && eventDate < dateEnd;
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "interview":
        return "bg-[#EDF2FF] text-[#114DFF] border-[#C8D6FF]";
      case "meeting":
        return "bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]";
      case "reminder":
        return "bg-[#FFF7ED] text-[#FF8C00] border-[#FFD4A8]";
      default:
        return "bg-[#F5F5F5] text-gray-700 border-[#CCCCCC]";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-[#C8D6FF] bg-[#F5F5F5]"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = 
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          className={`h-24 border border-[#C8D6FF] p-2 cursor-pointer hover:bg-[#F7F9FF] transition-colors ${
            isToday ? "bg-[#EDF2FF]" : "bg-white"
          }`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <div className={`mb-1 ${isToday ? "text-[#114DFF]" : "text-gray-700"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 rounded truncate bg-[#EDF2FF] text-[#114DFF]"
              >
                {formatTime(event.startTime)}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.startTime);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  });

  // If not connected, show connection prompt
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">My Calendar</h2>
            <p className="text-gray-600">Connect Google Calendar to manage your schedule</p>
          </div>
        </div>

        <Card className="border-[#C8D6FF]">
          <CardContent className="p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-[#114DFF] mx-auto mb-6" />
            <h3 className="text-gray-900 mb-3">Connect Your Google Calendar</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Sync your interview schedules and meetings with Google Calendar. Never miss an important event.
            </p>

            <Alert className="max-w-md mx-auto mb-6 border-[#FFD4A8] bg-[#FFF7ED]">
              <AlertCircle className="w-4 h-4 text-[#FF8C00]" />
              <AlertDescription className="text-[#FF8C00]">
                Note: This is a mock integration for demonstration. Real implementation requires backend OAuth.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setShowConnectionDialog(true)}
              className="bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Connect Google Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Connection Dialog */}
        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Google Calendar</DialogTitle>
              <DialogDescription>
                This will sync your interview schedules and meetings with Google Calendar
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert className="border-[#C8D6FF] bg-[#EDF2FF]">
                <CheckCircle className="w-4 h-4 text-[#114DFF]" />
                <AlertDescription className="text-gray-700">
                  <strong>What will be synced:</strong>
                  <ul className="mt-2 space-y-1 ml-4 list-disc">
                    <li>Interview schedules with founders</li>
                    <li>Portfolio review meetings</li>
                    <li>Mentorship sessions</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button
                  onClick={handleConnectGoogleCalendar}
                  disabled={isConnecting}
                  className="flex-1 bg-gradient-to-r from-[#114DFF] to-[#3CE5A7] hover:from-[#0d3eb8] hover:to-[#2bc78f] text-white"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConnectionDialog(false)}
                  disabled={isConnecting}
                  className="border-[#C8D6FF]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">My Calendar</h2>
          <p className="text-gray-600">Your schedule synced with Google Calendar</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-[#EDF2FF] text-[#06CB1D] border-[#C8D6FF]">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="border-[#CCCCCC]"
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2 border-[#C8D6FF]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#114DFF]" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousMonth}
                  className="border-[#C8D6FF]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextMonth}
                  className="border-[#C8D6FF]"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-0">{renderCalendar()}</div>
          </CardContent>
        </Card>

        {/* Upcoming Events Sidebar */}
        <div className="space-y-4">
          <Card className="border-[#C8D6FF]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#114DFF]" />
                Today's Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900">{event.title}</h4>
                      <Badge variant="outline" className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      </div>
                      {event.meetingLink && (
                        <div className="flex items-center gap-1">
                          <Video className="w-3 h-3 text-[#06CB1D]" />
                          <a
                            href={event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#114DFF] hover:underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No events today</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#C8D6FF]">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Events</span>
                <span className="text-[#114DFF]">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Interviews</span>
                <span className="text-[#06CB1D]">
                  {events.filter(e => e.type === 'interview').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Today</span>
                <span className="text-[#114DFF]">{todayEvents.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* All Upcoming Events */}
      <Card className="border-[#C8D6FF]">
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.filter(e => new Date(e.startTime) > new Date()).slice(0, 10).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-[#C8D6FF] rounded-lg hover:bg-[#F7F9FF] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-gray-900">{event.title}</h4>
                    <Badge variant="outline" className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.status === 'cancelled' && (
                      <Badge className="bg-[#FFE5E5] text-[#FF220E] border-[#FF220E]/30">
                        Cancelled
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                    </div>
                    {event.meetingLink && (
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4 text-[#06CB1D]" />
                        <span>Video Call</span>
                      </div>
                    )}
                  </div>
                </div>
                {event.meetingLink && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#C8D6FF]"
                    onClick={() => window.open(event.meetingLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Join
                  </Button>
                )}
              </div>
            ))}
            {events.filter(e => new Date(e.startTime) > new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
