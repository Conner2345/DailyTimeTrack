import { Settings, TimeEntry, TimerState, TimerEvent } from "@shared/schema";

const STORAGE_KEYS = {
  SETTINGS: 'timetracker_settings',
  TIME_ENTRIES: 'timetracker_entries',
  TIMER_STATE: 'timetracker_timer',
  TIMER_EVENTS: 'timetracker_timer_events',
} as const;

export const storage = {
  // Settings
  getSettings(): Settings {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
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
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Time Entries
  getTimeEntries(): TimeEntry[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
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
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
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

  // Timer State
  getTimerState(): TimerState {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMER_STATE);
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
    localStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
  },

  // Timer Events
  getTimerEvents(): TimerEvent[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TIMER_EVENTS);
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
    localStorage.setItem(STORAGE_KEYS.TIMER_EVENTS, JSON.stringify(events));
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

  // Data management
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
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
