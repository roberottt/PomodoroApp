import { useTimer } from "@/hooks/useTimer";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserSettings } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

export const PomodoroTimer = () => {
  const { user } = useAuth();

  // Get settings from Firebase
  const { data: settings } = useQuery({
    queryKey: ["/api/settings", user?.uid],
    queryFn: () => getUserSettings(user!.uid),
    enabled: !!user?.uid,
  });

  // Use settings or default values
  const workDuration = settings?.workDuration || 25;
  const shortBreakDuration = settings?.shortBreakDuration || 5;
  const longBreakDuration = settings?.longBreakDuration || 15;
  const sessionCount = settings?.sessionCount || 4;

  const {
    timeLeft,
    isRunning,
    mode,
    currentSession,
    completedSessions,
    formatTime: formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer(user?.uid || null, workDuration, shortBreakDuration, longBreakDuration, sessionCount);

  const getModeDisplay = () => {
    switch (mode) {
      case "focus":
        return "Tiempo de Enfoque";
      case "short-break":
        return "Descanso Corto";
      case "long-break":
        return "Descanso Largo";
      default:
        return "Tiempo de Enfoque";
    }
  };

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-charcoal mb-2">
              {getModeDisplay()}
            </h2>
            <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold text-coral mb-4">
              {formattedTime}
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              Sesión {currentSession} de {sessionCount} • {completedSessions} completadas
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              onClick={isRunning ? pauseTimer : startTimer}
              size="lg"
              className="bg-coral hover:bg-coral/90 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg w-full sm:w-auto"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="border-coral text-coral hover:bg-coral hover:text-white px-4 sm:px-6 py-3 rounded-full font-semibold w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Reiniciar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};