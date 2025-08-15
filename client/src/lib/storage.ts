import { Settings, TimeEntry, TimerState, TimerEvent } from "@shared/schema";

const STORAGE_KEYS = {
  SETTINGS: 'timetracker_settings',
  TIME_ENTRIES: 'timetracker_entries',
  TIMER_STATE: 'timetracker_timer',
  TIMER_EVENTS: 'timetracker_timer_events',
} as const;

// Browser compatibility helper
const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Fallback storage for browsers with localStorage issues
const fallbackStorage = new Map<string, string>();

const getItem = (key: string): string | null => {
  if (isStorageAvailable()) {
    try {
      return localStorage.getItem(key);
    } catch {
      return fallbackStorage.get(key) || null;
    }
  }
  return fallbackStorage.get(key) || null;
};

const setItem = (key: string, value: string): void => {
  if (isStorageAvailable()) {
    try {
      localStorage.setItem(key, value);
      return;
    } catch {}
  }
  fallbackStorage.set(key, value);
};

const removeItem = (key: string): void => {
  if (isStorageAvailable()) {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
  fallbackStorage.delete(key);
};

export const storage = {
  // Settings with cross-browser compatibility
  getSettings(): Settings {
    const stored = getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to defaults
      }
    }
    return {
      dailyTimeHours: 6,
      dailyTimeMinutes: 0,
      activeDays: [1, 2, 3, 4, 5], // Monday to Friday
      darkMode: false,
    };
  },

  setSettings(settings: Settings): void {
    setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Time Entries with browser compatibility
  getTimeEntries(): TimeEntry[] {
    const stored = getItem(STORAGE_KEYS.TIME_ENTRIES);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  },

  setTimeEntries(entries: TimeEntry[]): void {
    setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
  },

  getTimeEntry(date: string): TimeEntry | undefined {
    const entries = this.getTimeEntries();
    return entries.find(entry => entry.date === date);
  },

  updateTimeEntry(entry: TimeEntry): void {
    const entries = this.getTimeEntries();
    const index = entries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    this.setTimeEntries(entries);
  },

  // Timer State with browser compatibility
  getTimerState(): TimerState {
    const stored = getItem(STORAGE_KEYS.TIMER_STATE);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to defaults
      }
    }
    return {
      isRunning: false,
      startTime: null,
      elapsedTime: 0, // now in seconds
      lastActiveTimestamp: Date.now(),
    };
  },

  setTimerState(state: TimerState): void {
    setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
  },

  // Timer Events with browser compatibility
  getTimerEvents(): TimerEvent[] {
    const stored = getItem(STORAGE_KEYS.TIMER_EVENTS);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  },

  setTimerEvents(events: TimerEvent[]): void {
    setItem(STORAGE_KEYS.TIMER_EVENTS, JSON.stringify(events));
  },

  addTimerEvent(event: TimerEvent): void {
    const events = this.getTimerEvents();
    events.push(event);
    // Keep only last 100 events to prevent storage bloat
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    this.setTimerEvents(events);
  },

  // Data management with browser compatibility
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeItem(key);
    });
    // Clear fallback storage as well
    fallbackStorage.clear();
  },

  exportData(): string {
    const data = {
      settings: this.getSettings(),
      timeEntries: this.getTimeEntries(),
      timerState: this.getTimerState(),
      timerEvents: this.getTimerEvents(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },
};
