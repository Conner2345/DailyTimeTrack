import { useState, useEffect, useRef } from 'react';
import { TimerState } from '@shared/schema';
import { storage } from '@/lib/storage';

export function useTimer() {
  const [timerState, setTimerState] = useState<TimerState>(() => storage.getTimerState());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onTimeUpdate = useRef<((minutes: number) => void) | null>(null);

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
    storage.setTimerState(state);
    setTimerState(state);
  };

  // Start the timer
  const startTimer = () => {
    const newState: TimerState = {
      ...timerState,
      isRunning: true,
      startTime: Date.now(),
    };
    saveTimerState(newState);
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

  // Reset timer
  const resetTimer = () => {
    // If timer was running, record the elapsed time before reset
    if (timerState.isRunning && timerState.startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - timerState.startTime) / 1000); // seconds
      const totalElapsed = timerState.elapsedTime + sessionTime;
      
      const totalMinutes = Math.floor(totalElapsed / 60);
      if (totalMinutes > 0 && onTimeUpdate.current) {
        onTimeUpdate.current(totalMinutes);
      }
    }

    const newState: TimerState = {
      isRunning: false,
      startTime: null,
      elapsedTime: 0,
    };
    saveTimerState(newState);
  };

  // Set callback for time updates
  const setOnTimeUpdate = (callback: (minutes: number) => void) => {
    onTimeUpdate.current = callback;
  };

  // Update timer display every second when running
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(() => {
        // Force re-render to update display and persist state
        setTimerState(prev => {
          const newState = { ...prev };
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
            elapsedTime: actualElapsed
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
    resetTimer,
    setOnTimeUpdate,
  };
}
