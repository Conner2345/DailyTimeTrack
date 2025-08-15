import { z } from "zod";

export const timeEntrySchema = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM-DD format
  addedMinutes: z.number(),
  usedMinutes: z.number(),
  balance: z.number(), // can be negative, in minutes
  balanceSeconds: z.number().optional(), // precise balance in seconds
  lastUpdated: z.number(), // timestamp
});

export const settingsSchema = z.object({
  dailyTimeHours: z.number().min(0).max(24),
  dailyTimeMinutes: z.number().min(0).max(59),
  activeDays: z.array(z.number().min(0).max(6)), // 0 = Sunday, 6 = Saturday
  darkMode: z.boolean(),
});

export const timerEventSchema = z.object({
  id: z.string(),
  type: z.enum(['start', 'pause', 'resume']),
  timestamp: z.number(),
  sessionDuration: z.number().optional(), // duration of the session that just ended (for pause events)
});

export const timerStateSchema = z.object({
  isRunning: z.boolean(),
  startTime: z.number().nullable(), // timestamp when timer started
  elapsedTime: z.number(), // accumulated time in seconds
  lastActiveTimestamp: z.number().nullable(), // when app was last active
});

export type TimeEntry = z.infer<typeof timeEntrySchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type TimerState = z.infer<typeof timerStateSchema>;
export type TimerEvent = z.infer<typeof timerEventSchema>;

export const insertTimeEntrySchema = timeEntrySchema.omit({ id: true });
export const insertSettingsSchema = settingsSchema;
export const insertTimerStateSchema = timerStateSchema;
export const insertTimerEventSchema = timerEventSchema.omit({ id: true });

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type InsertTimerState = z.infer<typeof insertTimerStateSchema>;
export type InsertTimerEvent = z.infer<typeof insertTimerEventSchema>;
