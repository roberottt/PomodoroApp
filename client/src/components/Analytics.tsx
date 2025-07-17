import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserStudySessions, getUserMoods, getUserTasks } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Clock, Target, CheckCircle, Heart, TrendingUp } from "lucide-react";

export const Analytics = () => {
  const { user } = useAuth();

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/study-sessions", user?.uid],
    queryFn: () => getUserStudySessions(user!.uid),
    enabled: !!user?.uid,
  });

  const { data: moods = [] } = useQuery({
    queryKey: ["/api/moods", user?.uid],
    queryFn: () => getUserMoods(user!.uid),
    enabled: !!user?.uid,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["/api/tasks", user?.uid],
    queryFn: () => getUserTasks(user!.uid),
    enabled: !!user?.uid,
  });

  // Calculate statistics
  const completedSessions = sessions.filter(s => s.completed);
  const focusSessions = completedSessions.filter(s => s.type === 'focus');
  const totalStudyHours = focusSessions.reduce((total, session) => total + session.duration, 0) / 60;
  const completedTasks = tasks.filter(t => t.completed);
  
  // Recent mood (last 7 days)
  const recentMoods = moods.slice(0, 7);
  const moodValues = { happy: 5, good: 4, neutral: 3, tired: 2, stressed: 1 };
  const averageMood = recentMoods.length > 0 
    ? recentMoods.reduce((sum, mood) => sum + moodValues[mood.mood], 0) / recentMoods.length
    : 3;

  // Get mood emoji
  const getMoodEmoji = (value: number) => {
    if (value >= 4.5) return "😊";
    if (value >= 3.5) return "🙂";
    if (value >= 2.5) return "😐";
    if (value >= 1.5) return "😕";
    return "😞";
  };

  // Weekly study hours data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const daySessions = focusSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.toDateString() === date.toDateString();
    });
    
    const hours = daySessions.reduce((total, session) => total + session.duration, 0) / 60;
    
    return {
      day: dayName,
      hours: Math.round(hours * 10) / 10,
    };
  }).reverse();

  // Mood trend data
  const moodTrendData = recentMoods.map((mood, index) => ({
    day: new Date(mood.date).toLocaleDateString('en-US', { weekday: 'short' }),
    mood: moodValues[mood.mood],
  })).reverse();

  const stats = [
    {
      title: "Total Study Time",
      value: `${Math.round(totalStudyHours * 10) / 10}h`,
      icon: Clock,
      color: "bg-coral",
      change: "+12%",
    },
    {
      title: "Pomodoro Sessions",
      value: focusSessions.length,
      icon: Target,
      color: "bg-sage",
      change: "+8%",
    },
    {
      title: "Tasks Completed",
      value: completedTasks.length,
      icon: CheckCircle,
      color: "bg-peach",
      change: "+25%",
    },
    {
      title: "Average Mood",
      value: getMoodEmoji(averageMood),
      icon: Heart,
      color: "bg-sunny",
      change: "Stable",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <TrendingUp className="w-6 h-6 text-coral" />
        <h2 className="text-2xl font-bold text-charcoal">Analytics & Reports</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-3xl shadow-lg border-pink-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sage text-sm">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Study Hours Chart */}
        <Card className="rounded-3xl shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-charcoal">
              Weekly Study Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#FF8B94" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Mood Trend Chart */}
        <Card className="rounded-3xl shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-charcoal">
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {moodTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#A8E6CF" 
                      strokeWidth={3}
                      dot={{ fill: "#A8E6CF", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start tracking your mood to see trends</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
