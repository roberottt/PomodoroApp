import { useState, useEffect, useCallback } from "react";
import { createStudySession, updateStudySession } from "@/lib/firestore";

export type TimerMode = "focus" | "short-break" | "long-break";

export const useTimer = (userId: string | null, workDuration: number = 25, shortBreakDuration: number = 5, longBreakDuration: number = 15, sessionCount: number = 4) => {
  const [timeLeft, setTimeLeft] = useState(workDuration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = useCallback(async () => {
    if (!userId) return;

    setIsRunning(true);

    // Create a new study session
    const session = await createStudySession(userId, {
      type: mode,
      duration: Math.ceil(timeLeft / 60),
      completed: false,
      startTime: new Date(),
    });

    setCurrentSessionId(session.id);
  }, [userId, mode, timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(workDuration * 60);
    setCurrentSessionId(null);
    setCurrentSession(1);
    setCompletedSessions(0);
  }, [workDuration]);

  const completeSession = useCallback(async () => {
    if (currentSessionId && userId) {
      await updateStudySession(currentSessionId, {
        completed: true,
        endTime: new Date(),
      });
      setCompletedSessions((prev) => prev + 1);
    }
  }, [currentSessionId, userId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Timer completed
      setIsRunning(false);
      completeSession();

      // Auto-switch to break mode or next session
      if (mode === "focus") {
        if (currentSession < sessionCount) {
          setMode("short-break");
          setTimeLeft(shortBreakDuration * 60);
        } else {
          // All sessions completed
          setMode("focus");
          setTimeLeft(workDuration * 60);
        }
      } else if (mode === "short-break") {
        setMode("focus");
        setTimeLeft(workDuration * 60);
        setCurrentSession((prev) => prev + 1);
      } else {
        setMode("focus");
        setTimeLeft(workDuration * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, workDuration, shortBreakDuration, longBreakDuration, completeSession, currentSession, sessionCount]);

  // Reset timer when settings change (only if not running)
  useEffect(() => {
    if (!isRunning) {
      if (mode === "focus") {
        setTimeLeft(workDuration * 60);
      } else if (mode === "short-break") {
        setTimeLeft(shortBreakDuration * 60);
      } else if (mode === "long-break") {
        setTimeLeft(longBreakDuration * 60);
      }
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, mode, isRunning]);

  return {
    timeLeft,
    isRunning,
    mode,
    currentSession,
    completedSessions,
    sessionCount,
    formatTime: formatTime(timeLeft),
    startTimer,
    pauseTimer,
    resetTimer,
    setMode,
    setTimeLeft: (duration: number) => setTimeLeft(duration * 60),
  };
};