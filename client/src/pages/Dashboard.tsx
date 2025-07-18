import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserTasks, getUserStudySessions, getUserSettings } from "@/lib/firestore";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TaskManager } from "@/components/TaskManager";
import { MoodTracker } from "@/components/MoodTracker";
import { AmbientSounds } from "@/components/AmbientSounds";
import { Calendar } from "@/components/Calendar";
import { Analytics } from "@/components/Analytics";
import { Settings } from "@/components/Settings";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Book, History, Calendar as CalendarIcon, BarChart } from "lucide-react";

export const Dashboard = () => {
  const { user } = useAuth();

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks", user?.uid],
    queryFn: () => getUserTasks(user!.uid),
    enabled: !!user?.uid,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/study-sessions", user?.uid],
    queryFn: () => getUserStudySessions(user!.uid),
    enabled: !!user?.uid,
  });

  const { data: settings } = useQuery({
    queryKey: ["/api/settings", user?.uid],
    queryFn: () => getUserSettings(user!.uid),
    enabled: !!user?.uid,
  });

  // Calculate today's study time
  const today = new Date().toDateString();
  const todaysSessions = sessions.filter(session => 
    session.startTime.toDateString() === today && session.completed && session.type === 'focus'
  );
  const todayStudyTime = todaysSessions.reduce((total, session) => total + session.duration, 0) / 60;

  // Get completed tasks today
  const completedTasksToday = tasks.filter(task => 
    task.completed && task.updatedAt.toDateString() === today
  ).length;

  // Get current task (first incomplete task)
  const currentTask = tasks.find(task => !task.completed);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-coral to-pink-300 rounded-3xl border-none text-black relative overflow-hidden">
        <CardContent className="p-8">
          <div className="absolute right-4 top-4 opacity-20">
            <Book className="w-16 h-16" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              ¡{new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 17 ? 'Buenas tardes' : 'Buenas noches'}, {user?.displayName?.split(' ')[0] || 'Estudiante'}! 🌸
            </h2>
            <p className="text-lg opacity-90 mb-6">¿Listo para una sesión de estudio productiva?</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{Math.round(todayStudyTime * 10) / 10}h estudiadas hoy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>{completedTasksToday} tareas completadas</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timer and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-section="timer">
        {/* Pomodoro Timer */}
        <div className="lg:col-span-2">
          <PomodoroTimer />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Current Task */}
          <Card className="rounded-3xl shadow-lg border-pink-100">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-charcoal mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-coral" />
                Tarea Actual
              </h4>
              {currentTask ? (
                <div className="bg-gradient-to-r from-sunny to-peach rounded-2xl p-4">
                  <h5 className="font-medium text-charcoal mb-2">{currentTask.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{currentTask.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Prioridad: {currentTask.priority === 'high' ? 'alta' : currentTask.priority === 'medium' ? 'media' : currentTask.priority === 'low' ? 'baja' : currentTask.priority}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No hay tareas activas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood Tracker */}
          <MoodTracker />

          {/* Ambient Sounds */}
          <AmbientSounds />
        </div>
      </div>

      {/* Task Manager */}
      <TaskManager />

      {/* Calendar Section */}
      <div id="calendar">
        <Calendar />
      </div>

      {/* Analytics Section */}
      <div id="analytics">
        <Analytics />
      </div>

      {/* Settings Section */}
      <div id="settings">
        <Settings />
      </div>
    </div>
  );
};
