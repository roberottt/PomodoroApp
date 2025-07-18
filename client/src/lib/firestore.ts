import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
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
    } else if (converted[key] && typeof converted[key] === 'object' && converted[key].type === 'firestore/timestamp/1.0') {
      // Handle serialized Firestore timestamps
      converted[key] = new Date(converted[key].seconds * 1000 + converted[key].nanoseconds / 1000000);
    } else if (converted[key] && typeof converted[key] === 'object' && converted[key].seconds) {
      // Handle Firestore timestamp objects
      converted[key] = new Date(converted[key].seconds * 1000);
    }
  });
  return converted;
};

// Tasks
export const createTask = async (userId: string, task: Omit<InsertTask, 'userId'>) => {
  try {
    console.log("Creating task for user:", userId, "with data:", task);
    const taskData = {
      ...task,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log("Task data to save:", taskData);
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    console.log("Task created successfully with ID:", docRef.id);
    return { id: docRef.id, ...taskData };
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    console.log("Fetching tasks for user:", userId);
    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    console.log("Found", querySnapshot.docs.length, "tasks");
    const tasks = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as Task[];
    console.log("Processed tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // If orderBy fails due to missing index, try without it
    try {
      console.log("Retrying without orderBy...");
      const q = query(
        collection(db, "tasks"), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      console.log("Found", querySnapshot.docs.length, "tasks (no orderBy)");
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Task[];
      console.log("Returning fallback tasks:", tasks);
      return tasks;
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }
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
  try {
    // First try with orderBy
    const q = query(
      collection(db, "studySessions"),
      where("userId", "==", userId),
      orderBy("startTime", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime.toDate(),
      endTime: doc.data().endTime?.toDate(),
    })) as StudySession[];
  } catch (error) {
    console.error("Error fetching study sessions:", error);

    // Fallback without orderBy
    try {
      console.log("Retrying study sessions without orderBy...");
      const fallbackQ = query(
        collection(db, "studySessions"),
        where("userId", "==", userId)
      );

      const fallbackSnapshot = await getDocs(fallbackQ);
      const sessions = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime?.toDate(),
      })) as StudySession[];

      console.log("Found", sessions.length, "study sessions (no orderBy)");

      // Sort manually by startTime descending
      sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

      console.log("Returning fallback study sessions:", sessions);
      return sessions;
    } catch (fallbackError) {
      console.error("Fallback query also failed:", fallbackError);
      return [];
    }
  }
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
  try {
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
  } catch (error) {
    console.error("Error fetching moods:", error);
    // Fallback without orderBy
    try {
      console.log("Retrying moods without orderBy...");
      const fallbackQ = query(
        collection(db, "moods"),
        where("userId", "==", userId)
      );
      const fallbackSnapshot = await getDocs(fallbackQ);
      const moods = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Mood[];
      
      // Sort manually by date descending
      moods.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      console.log("Returning fallback moods:", moods);
      return moods;
    } catch (fallbackError) {
      console.error("Fallback moods query also failed:", fallbackError);
      return [];
    }
  }
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
  await setDoc(doc(db, "settings", userId), settingsData);
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
  try {
    console.log("Fetching calendar events for user:", userId);
    const q = query(
      collection(db, "calendarEvents"), 
      where("userId", "==", userId),
      orderBy("startDate", "asc")
    );
    const querySnapshot = await getDocs(q);
    console.log("Found", querySnapshot.docs.length, "calendar events");
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as CalendarEvent[];
    console.log("Processed calendar events:", events);
    return events;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    // If orderBy fails due to missing index, try without it
    try {
      console.log("Retrying calendar events without orderBy...");
      const q = query(
        collection(db, "calendarEvents"), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      console.log("Found", querySnapshot.docs.length, "calendar events (no orderBy)");
      const events = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as CalendarEvent[];
      // Sort manually by startDate
      events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      console.log("Returning fallback calendar events:", events);
      return events;
    } catch (fallbackError) {
      console.error("Fallback calendar events query also failed:", fallbackError);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }
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