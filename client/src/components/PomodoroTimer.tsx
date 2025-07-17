import { useTimer } from "@/hooks/useTimer";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

interface PomodoroTimerProps {
  workDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}

export const PomodoroTimer = ({ 
  workDuration = 25, 
  shortBreakDuration = 5, 
  longBreakDuration = 15 
}: PomodoroTimerProps) => {
  const { user } = useAuth();
  const {
    timeLeft,
    isRunning,
    mode,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer(user?.uid || null, workDuration);

  const getModeDisplay = () => {
    switch (mode) {
      case "focus":
        return "Focus Time";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Focus Time";
    }
  };

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardContent className="pt-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-charcoal mb-6 flex items-center justify-center space-x-2">
            <span className="text-2xl">🍅</span>
            <span>Pomodoro Timer</span>
          </h3>
          
          {/* Timer Display */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-coral to-pink rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">{formatTime}</div>
                <div className="text-sm text-white/80 uppercase tracking-wide">{getModeDisplay()}</div>
              </div>
            </div>
            {/* Cute decorative elements */}
            <div className="absolute -top-4 -right-4 text-2xl">🌺</div>
            <div className="absolute -bottom-4 -left-4 text-2xl">🌿</div>
          </div>
          
          {/* Timer Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              onClick={startTimer}
              disabled={isRunning}
              className="bg-sage hover:bg-sage/80 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
            <Button 
              onClick={pauseTimer}
              disabled={!isRunning}
              className="bg-coral hover:bg-coral/80 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button 
              onClick={resetTimer}
              variant="secondary"
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Timer Settings */}
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>⏰</span>
              <span>Work: {workDuration}min</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>☕</span>
              <span>Break: {shortBreakDuration}min</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
