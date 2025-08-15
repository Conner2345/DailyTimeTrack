import { Settings, TimeEntry, TimerState } from "@shared/schema";

const STORAGE_KEYS = {
  SETTINGS: 'timetracker_settings',
  TIME_ENTRIES: 'timetracker_entries',
  TIMER_STATE: 'timetracker_timer',
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
      elapsedTime: 0,
    };
  },

  setTimerState(state: TimerState): void {
    localStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
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
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  },
};
