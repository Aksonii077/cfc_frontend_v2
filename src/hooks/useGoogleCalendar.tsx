import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService, CalendarStatus, CalendarEvent } from '../utils/googleCalendarService';
import { toast } from 'sonner';

interface UseGoogleCalendarReturn {
  // State
  status: CalendarStatus | null;
  loading: boolean;
  syncing: boolean;
  connecting: boolean;
  isConnected: boolean;

  // Actions
  checkStatus: () => Promise<void>;
  connectCalendar: () => Promise<void>;
  syncCalendar: () => Promise<void>;
  disconnectCalendar: () => Promise<void>;
  getEvents: (startDate: string, endDate: string) => Promise<CalendarEvent[]>;
}

/**
 * React Hook for Google Calendar Integration
 * 
 * Usage:
 * ```tsx
 * const { status, isConnected, connectCalendar, syncCalendar, disconnectCalendar } = useGoogleCalendar();
 * 
 * // Check if connected
 * if (isConnected) {
 *   // Show connected UI
 * } else {
 *   // Show connect button
 *   <button onClick={connectCalendar}>Connect Calendar</button>
 * }
 * 
 * // Sync calendar
 * await syncCalendar();
 * ```
 */
export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  /**
   * 1️⃣ Check Calendar Status
   * Call this first to see if calendar is connected
   */
  const checkStatus = useCallback(async () => {
    setLoading(true);
    try {
      // Derive status via sync-only flow
      const result = await googleCalendarService.syncCalendar();
      if (result.success && result.result) {
        setStatus({
          user_id: result.result.user_id,
          calendar_connected: true,
          last_sync: result.result.sync_result?.last_sync,
          message: result.result.message || 'Calendar synced',
        });
      } else {
        console.error('Failed to check calendar status:', result.error);
        toast.error('Failed to check calendar status', {
          description: result.error || 'Unknown error',
        });
      }
    } catch (error) {
      console.error('Error checking calendar status:', error);
      toast.error('Error checking calendar status', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 2️⃣ Connect Calendar
   * Initiates OAuth flow - will redirect to Google
   */
  const connectCalendar = useCallback(async () => {
    setConnecting(true);
    try {
      const result = await googleCalendarService.connect();
      
      if (result.success) {
        toast.success('Calendar Connected!', {
          description: result.message,
        });
        
        // Refresh status after connection
        await checkStatus();
      } else {
        toast.error('Failed to Connect Calendar', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      console.error('Error connecting calendar:', error);
      toast.error('Connection Error', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setConnecting(false);
    }
  }, [checkStatus]);

  /**
   * 3️⃣ Sync Calendar
   * Syncs events from Google Calendar to backend
   */
  const syncCalendar = useCallback(async () => {
    setSyncing(true);
    try {
      const result = await googleCalendarService.syncCalendar();
      if (result.success && result.result) {
        const eventCount = result.result.sync_result?.events_synced || 0;
        toast.success('Calendar Synced!', {
          description: `Successfully synced ${eventCount} event${eventCount !== 1 ? 's' : ''}`,
        });
        if (result.result.sync_result?.last_sync) {
          setStatus(prev => prev ? { ...prev, last_sync: result.result!.sync_result!.last_sync } : null);
        } else if (result.result.user_id) {
          setStatus({ user_id: result.result.user_id, calendar_connected: true, last_sync: new Date().toISOString(), message: 'Calendar synced' });
        }
      } else {
        toast.error('Sync Failed', { description: result.error || 'Please try again' });
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast.error('Sync Error', { description: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setSyncing(false);
    }
  }, []);

  /**
   * Disconnect Calendar
   * Removes calendar connection and credentials
   */
  const disconnectCalendar = useCallback(async () => {
    try {
      const result = await googleCalendarService.disconnect();
      
      if (result.success) {
        toast.success('Calendar Disconnected', {
          description: result.message || 'Your calendar has been disconnected',
        });
        
        // Clear status
        setStatus(prev => prev ? {
          ...prev,
          calendar_connected: false,
          last_sync: undefined,
          credentials_stored_at: undefined,
          scopes: undefined,
          message: 'Calendar not connected',
        } : null);
        
        // Refresh status
        await checkStatus();
      } else {
        toast.error('Failed to Disconnect', {
          description: result.error || 'Please try again',
        });
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast.error('Disconnect Error', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [checkStatus]);

  /**
   * Get Calendar Events for Date Range
   */
  const getEvents = useCallback(async (
    startDate: string,
    endDate: string
  ): Promise<CalendarEvent[]> => {
    try {
      const result = await googleCalendarService.getEvents(startDate, endDate);
      if (result.success && result.data) {
        return result.data.events;
      }
      console.error('Failed to get events:', result.error);
      return [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }, []);

  // Check status on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Compute isConnected from status
  const isConnected = status?.calendar_connected === true;

  return {
    status,
    loading,
    syncing,
    connecting,
    isConnected,
    checkStatus,
    connectCalendar,
    syncCalendar,
    disconnectCalendar,
    getEvents,
  };
}

