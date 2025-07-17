import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { 
  InsertTask, 
  Task, 
  InsertStudySession, 
  StudySession, 
  InsertMood, 
  Mood, 
  InsertSettings, 
  Settings, 
  InsertCalendarEvent, 
  CalendarEvent 
} from "@shared/schema";

// Helper to convert Firestore timestamps to Date objects
const convertTimestamps = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Tasks
export const createTask = async (userId: string, task: Omit<InsertTask, 'userId'>) => {
  const taskData = {
    ...task,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "tasks"), taskData);
  return { id: docRef.id, ...taskData };
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  const q = query(
    collection(db, "tasks"), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data())
  })) as Task[];
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteTask = async (taskId: string) => {
  await deleteDoc(doc(db, "tasks", taskId));
};

// Study Sessions
export const createStudySession = async (userId: string, session: Omit<InsertStudySession, 'userId'>) => {
  const sessionData = {
    ...session,
    userId,
    createdAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "studySessions"), sessionData);
  return { id: docRef.id, ...sessionData };
};

export const getUserStudySessions = async (userId: string): Promise<StudySession[]> => {
  const q = query(
    collection(db, "studySessions"), 
    where("userId", "==", userId),
    orderBy("startTime", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data())
  })) as StudySession[];
};

export const updateStudySession = async (sessionId: string, updates: Partial<StudySession>) => {
  const sessionRef = doc(db, "studySessions", sessionId);
  await updateDoc(sessionRef, updates);
};

// Moods
export const createMood = async (userId: string, mood: Omit<InsertMood, 'userId'>) => {
  const moodData = {
    ...mood,
    userId,
    createdAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "moods"), moodData);
  return { id: docRef.id, ...moodData };
};

export const getUserMoods = async (userId: string): Promise<Mood[]> => {
  const q = query(
    collection(db, "moods"), 
    where("userId", "==", userId),
    orderBy("date", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data())
  })) as Mood[];
};

// Settings
export const getUserSettings = async (userId: string): Promise<Settings | null> => {
  const docRef = doc(db, "settings", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      userId,
      ...convertTimestamps(docSnap.data())
    } as Settings;
  }
  return null;
};

export const updateUserSettings = async (userId: string, settings: Partial<InsertSettings>) => {
  const settingsRef = doc(db, "settings", userId);
  await updateDoc(settingsRef, {
    ...settings,
    updatedAt: new Date(),
  });
};

export const createUserSettings = async (userId: string, settings: InsertSettings) => {
  const settingsData = {
    ...settings,
    userId,
    updatedAt: new Date(),
  };
  await updateDoc(doc(db, "settings", userId), settingsData);
  return settingsData;
};

// Calendar Events
export const createCalendarEvent = async (userId: string, event: Omit<InsertCalendarEvent, 'userId'>) => {
  const eventData = {
    ...event,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const docRef = await addDoc(collection(db, "calendarEvents"), eventData);
  return { id: docRef.id, ...eventData };
};

export const getUserCalendarEvents = async (userId: string): Promise<CalendarEvent[]> => {
  const q = query(
    collection(db, "calendarEvents"), 
    where("userId", "==", userId),
    orderBy("startDate", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamps(doc.data())
  })) as CalendarEvent[];
};

export const updateCalendarEvent = async (eventId: string, updates: Partial<CalendarEvent>) => {
  const eventRef = doc(db, "calendarEvents", eventId);
  await updateDoc(eventRef, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteCalendarEvent = async (eventId: string) => {
  await deleteDoc(doc(db, "calendarEvents", eventId));
};
