import { useState, useEffect, useRef } from 'react';
import { TimerState, TimerEvent } from '@shared/schema';
import { storage } from '@/lib/storage';
import { nanoid } from 'nanoid';

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>(() => {
    const stored = storage.getTimerState();
    // Check if app was closed while timer was running and correct balance
    const correctedState = handleAppRelaunch(stored);
    return correctedState;
  });
  const [timerEvents, setTimerEvents] = useState<TimerEvent[]>([]);

  // Load timer events from storage
  useEffect(() => {
    const stored = localStorage.getItem('timetracker_timer_events');
    if (stored) {
      try {
        setTimerEvents(JSON.parse(stored));
      } catch {}
    }
  }, []);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpdate = useRef<((minutes: number) => void) | null>(null);

  // Handle app relaunch - correct balance if timer was running when app was closed
  function handleAppRelaunch(storedState: TimerState): TimerState {
    if (!storedState.isRunning || !storedState.startTime || !storedState.lastActiveTimestamp) {
      return { ...storedState, lastActiveTimestamp: Date.now() };
    }

    const now = Date.now();
    const timeSinceLastActive = now - storedState.lastActiveTimestamp;
    
    // If more than 5 minutes have passed, assume app was closed
    if (timeSinceLastActive > 5 * 60 * 1000) {
      const totalElapsedSeconds = Math.floor((now - storedState.startTime) / 1000);
      const sessionDuration = totalElapsedSeconds - storedState.elapsedTime;
      
      // Add pause event for the time app was closed
      const pauseEvent: TimerEvent = {
        id: nanoid(),
        type: 'pause',
        timestamp: storedState.lastActiveTimestamp,
        sessionDuration: sessionDuration,
      };
      
      // Add pause event for the time app was closed
      const events = timerEvents;
      events.push(pauseEvent);
      localStorage.setItem('timetracker_timer_events', JSON.stringify(events));
      setTimerEvents([...events]);
      
      // Update time usage if callback is available
      if (sessionDuration > 60 && onTimeUpdate.current) {
        const sessionMinutes = Math.floor(sessionDuration / 60);
        onTimeUpdate.current(sessionMinutes);
      }

      // Return paused state with corrected elapsed time
      return {
        isRunning: false,
        startTime: null,
        elapsedTime: totalElapsedSeconds,
        lastActiveTimestamp: now,
      };
    }

    return { ...storedState, lastActiveTimestamp: now };
  }

  // Calculate current elapsed time including any running time
  const getCurrentElapsedTime = (): number => {
    if (!timerState.isRunning || !timerState.startTime) {
      return timerState.elapsedTime;
    }
    
    const now = Date.now();
    const sessionTime = Math.floor((now - timerState.startTime) / 1000); // Convert to seconds
    return timerState.elapsedTime + sessionTime;
  };

  // Save timer state to storage
  const saveTimerState = (state: TimerState) => {
    const stateWithTimestamp = { ...state, lastActiveTimestamp: Date.now() };
    storage.setTimerState(stateWithTimestamp);
    setTimerState(stateWithTimestamp);
  };

  // Add timer event
  const addTimerEvent = (type: TimerEvent['type'], sessionDuration?: number) => {
    const event: TimerEvent = {
      id: nanoid(),
      type,
      timestamp: Date.now(),
      sessionDuration,
    };
    
    const newEvents = [...timerEvents, event];
    // Keep only last 100 events to prevent storage bloat
    if (newEvents.length > 100) {
      newEvents.splice(0, newEvents.length - 100);
    }
    
    localStorage.setItem('timetracker_timer_events', JSON.stringify(newEvents));
    setTimerEvents(newEvents);
  };

  // Start the timer
  const startTimer = () => {
    const newState: TimerState = {
      ...timerState,
      isRunning: true,
      startTime: Date.now(),
    };
    saveTimerState(newState);
    
    // Add start event (or resume if there's already elapsed time)
    addTimerEvent(timerState.elapsedTime > 0 ? 'resume' : 'start');
  };

  // Pause the timer
  const pauseTimer = () => {
    if (timerState.isRunning && timerState.startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - timerState.startTime) / 1000); // seconds
      
      const newState: TimerState = {
        isRunning: false,
        startTime: null,
        elapsedTime: timerState.elapsedTime + sessionTime,
      };
      saveTimerState(newState);
      
      // Add pause event
      addTimerEvent('pause', sessionTime);
      
      // Update time usage when pausing (convert to minutes)
      const sessionMinutes = Math.floor(sessionTime / 60);
      if (sessionMinutes > 0 && onTimeUpdate.current) {
        onTimeUpdate.current(sessionMinutes);
      }
    }
  };

  // Toggle timer start/pause
  const toggleTimer = () => {
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  // Get timer events
  const getTimerEvents = () => {
    return timerEvents;
  };

  // Set callback for time updates
  const setOnTimeUpdate = (callback: (minutes: number) => void) => {
    onTimeUpdate.current = callback;
  };

  // Update timer display every second when running
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        // Force re-render to update display and update last active timestamp
        setTimerState(prev => {
          const newState = { ...prev, lastActiveTimestamp: Date.now() };
          storage.setTimerState(newState);
          return newState;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning]);

  // Handle page visibility changes to ensure timer works in background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && timerState.isRunning) {
        // When returning to the app, recalculate elapsed time
        const stored = storage.getTimerState();
        if (stored.isRunning && stored.startTime) {
          const now = Date.now();
          const actualElapsed = Math.floor((now - stored.startTime) / 1000);
          const correctedState = {
            ...stored,
            elapsedTime: actualElapsed,
            lastActiveTimestamp: now,
          };
          setTimerState(correctedState);
          storage.setTimerState(correctedState);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerState.isRunning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning: timerState.isRunning,
    elapsedTime: getCurrentElapsedTime(),
    toggleTimer,
    getTimerEvents,
    setOnTimeUpdate,
  };
}
