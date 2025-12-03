// Mock Google Calendar Service
// NOTE: This is a frontend simulation. Real implementation requires backend OAuth and API integration.

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  location?: string;
  meetingLink?: string;
  type: 'interview' | 'meeting' | 'reminder' | 'other';
  status: 'scheduled' | 'completed' | 'cancelled';
  color?: string;
}

// Mock calendar events storage
const CALENDAR_STORAGE_KEY = 'mock_calendar_events';

class MockGoogleCalendarService {
  private isConnected: boolean = false;

  // Simulate OAuth connection
  connect(): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        localStorage.setItem('google_calendar_connected', 'true');
        resolve({
          success: true,
          message: 'Successfully connected to Google Calendar (Mock)',
        });
      }, 1500);
    });
  }

  // Check connection status
  isGoogleCalendarConnected(): boolean {
    return localStorage.getItem('google_calendar_connected') === 'true';
  }

  // Disconnect
  disconnect(): void {
    this.isConnected = false;
    localStorage.removeItem('google_calendar_connected');
  }

  // Get all events
  getEvents(): CalendarEvent[] {
    const stored = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (!stored) return this.getDefaultEvents();
    return JSON.parse(stored);
  }

  // Get events for a specific date range
  getEventsByDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
    const events = this.getEvents();
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  // Create a new calendar event
  createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: CalendarEvent = {
          ...event,
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };

        const events = this.getEvents();
        events.push(newEvent);
        this.saveEvents(events);

        resolve(newEvent);
      }, 800);
    });
  }

  // Update an event
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const events = this.getEvents();
        const index = events.findIndex((e) => e.id === eventId);

        if (index === -1) {
          reject(new Error('Event not found'));
          return;
        }

        events[index] = { ...events[index], ...updates };
        this.saveEvents(events);
        resolve(events[index]);
      }, 500);
    });
  }

  // Delete an event
  deleteEvent(eventId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const events = this.getEvents();
        const filtered = events.filter((e) => e.id !== eventId);
        this.saveEvents(filtered);
        resolve();
      }, 500);
    });
  }

  // Create interview event
  createInterviewEvent(
    startupName: string,
    founderEmail: string,
    interviewDate: string,
    interviewTime: string
  ): Promise<CalendarEvent> {
    const [hours, minutes] = interviewTime.split(':');
    const startDateTime = new Date(interviewDate);
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour duration

    return this.createEvent({
      title: `Interview: ${startupName}`,
      description: `Mentorship interview with ${startupName}`,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      attendees: [founderEmail],
      meetingLink: `https://meet.google.com/mock-${Math.random().toString(36).substr(2, 9)}`,
      type: 'interview',
      status: 'scheduled',
      color: '#114DFF',
    });
  }

  // Private: Save events to localStorage
  private saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
  }

  // Private: Get default mock events
  private getDefaultEvents(): CalendarEvent[] {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 'evt_1',
        title: 'Interview: HealthAI',
        description: 'Mentorship interview with HealthAI startup',
        startTime: tomorrow.toISOString(),
        endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
        attendees: ['michael@healthai.com'],
        meetingLink: 'https://meet.google.com/mock-healthai',
        type: 'interview',
        status: 'scheduled',
        color: '#114DFF',
      },
      {
        id: 'evt_2',
        title: 'Portfolio Review Meeting',
        description: 'Monthly review of portfolio startups',
        startTime: nextWeek.toISOString(),
        endTime: new Date(nextWeek.getTime() + 120 * 60 * 1000).toISOString(),
        attendees: ['team@racai.com'],
        type: 'meeting',
        status: 'scheduled',
        color: '#3CE5A7',
      },
    ];
  }
}

export const googleCalendarService = new MockGoogleCalendarService();
