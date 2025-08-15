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
    const sessionTime = Math.floor((now - timerState.startTime) / (1000 * 60)); // Convert to minutes
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
      const sessionTime = Math.floor((now - timerState.startTime) / (1000 * 60));
      
      const newState: TimerState = {
        isRunning: false,
        startTime: null,
        elapsedTime: timerState.elapsedTime + sessionTime,
      };
      saveTimerState(newState);
      
      // Update time usage when pausing
      if (sessionTime > 0 && onTimeUpdate.current) {
        onTimeUpdate.current(sessionTime);
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
      const sessionTime = Math.floor((now - timerState.startTime) / (1000 * 60));
      const totalElapsed = timerState.elapsedTime + sessionTime;
      
      if (totalElapsed > 0 && onTimeUpdate.current) {
        onTimeUpdate.current(totalElapsed);
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
        // Force re-render to update display
        setTimerState(prev => ({ ...prev }));
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
