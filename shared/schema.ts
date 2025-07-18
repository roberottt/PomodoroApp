import { z } from "zod";

// User profile schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Task schema
export const taskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean(),
  dueDate: z.date().optional(),
  estimatedTime: z.number().optional(), // in minutes
  actualTime: z.number().optional(), // in minutes
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Study session schema
export const studySessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  taskId: z.string().optional(),
  type: z.enum(["focus", "short-break", "long-break"]),
  duration: z.number(), // in minutes
  completed: z.boolean(),
  startTime: z.date(),
  endTime: z.date().optional(),
  createdAt: z.date(),
});

// Mood entry schema
export const moodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mood: z.enum(["happy", "good", "neutral", "tired", "stressed"]),
  date: z.date(),
  createdAt: z.date(),
});

// Settings schema
export const settingsSchema = z.object({
  userId: z.string(),
  workDuration: z.number().default(25), // in minutes
  shortBreakDuration: z.number().default(5), // in minutes
  longBreakDuration: z.number().default(15), // in minutes
  sessionCount: z.number().default(4), // number of pomodoro sessions to complete
  dailyGoal: z.number().default(4), // in hours
  restDays: z.array(z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])).default(["sunday"]),
  ambientSound: z.string().optional(),
  notifications: z.boolean().default(true),
  updatedAt: z.date(),
});

// Calendar event schema
export const calendarEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  type: z.enum(["exam", "deadline", "event", "reminder"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Insert schemas
export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertTaskSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudySessionSchema = studySessionSchema.omit({ id: true, createdAt: true });
export const insertMoodSchema = moodSchema.omit({ id: true, createdAt: true });
export const insertSettingsSchema = settingsSchema.omit({ updatedAt: true });
export const insertCalendarEventSchema = calendarEventSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = z.infer<typeof userSchema>;
export type Task = z.infer<typeof taskSchema>;
export type StudySession = z.infer<typeof studySessionSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type InsertCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
