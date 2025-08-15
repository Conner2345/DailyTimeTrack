import { z } from "zod";

export const timeEntrySchema = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM-DD format
  addedMinutes: z.number(),
  usedMinutes: z.number(),
  balance: z.number(), // can be negative
  lastUpdated: z.number(), // timestamp
});

export const settingsSchema = z.object({
  dailyTimeHours: z.number().min(0).max(24),
  dailyTimeMinutes: z.number().min(0).max(59),
  activeDays: z.array(z.number().min(0).max(6)), // 0 = Sunday, 6 = Saturday
  darkMode: z.boolean(),
});

export const timerStateSchema = z.object({
  isRunning: z.boolean(),
  startTime: z.number().nullable(), // timestamp when timer started
  elapsedTime: z.number(), // accumulated time in seconds
});

export type TimeEntry = z.infer<typeof timeEntrySchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type TimerState = z.infer<typeof timerStateSchema>;

export const insertTimeEntrySchema = timeEntrySchema.omit({ id: true });
export const insertSettingsSchema = settingsSchema;
export const insertTimerStateSchema = timerStateSchema;

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type InsertTimerState = z.infer<typeof insertTimerStateSchema>;
