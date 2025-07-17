import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserSettings, updateUserSettings, createUserSettings } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Settings, InsertSettings } from "@shared/schema";

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [settings, setSettings] = useState<InsertSettings>({
    userId: user?.uid || "",
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    dailyGoal: 4,
    restDays: ["sunday"],
    notifications: true,
  });

  const { data: userSettings } = useQuery({
    queryKey: ["/api/settings", user?.uid],
    queryFn: () => getUserSettings(user!.uid),
    enabled: !!user?.uid,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<InsertSettings>) => {
      if (userSettings) {
        return updateUserSettings(user!.uid, newSettings);
      } else {
        return createUserSettings(user!.uid, { ...settings, ...newSettings });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings", user?.uid] });
      toast({
        title: "Settings saved!",
        description: "Your preferences have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (userSettings) {
      setSettings({
        userId: userSettings.userId,
        workDuration: userSettings.workDuration,
        shortBreakDuration: userSettings.shortBreakDuration,
        longBreakDuration: userSettings.longBreakDuration,
        dailyGoal: userSettings.dailyGoal,
        restDays: userSettings.restDays,
        notifications: userSettings.notifications,
      });
    }
  }, [userSettings]);

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleRestDayToggle = (day: string, checked: boolean) => {
    const newRestDays = checked
      ? [...settings.restDays, day]
      : settings.restDays.filter(d => d !== day);
    
    setSettings({ ...settings, restDays: newRestDays });
  };

  const weekdays = [
    { value: "sunday", label: "Sunday" },
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-charcoal flex items-center">
          <SettingsIcon className="w-6 h-6 mr-3 text-coral" />
          Study Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pomodoro Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-charcoal">Pomodoro Timer</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workDuration" className="text-sm font-medium text-gray-700">
                  Work Session Duration
                </Label>
                <Select
                  value={settings.workDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, workDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="shortBreak" className="text-sm font-medium text-gray-700">
                  Short Break Duration
                </Label>
                <Select
                  value={settings.shortBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, shortBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="longBreak" className="text-sm font-medium text-gray-700">
                  Long Break Duration
                </Label>
                <Select
                  value={settings.longBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, longBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Study Schedule */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-charcoal">Study Schedule</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dailyGoal" className="text-sm font-medium text-gray-700">
                  Daily Study Goal
                </Label>
                <Select
                  value={settings.dailyGoal.toString()}
                  onValueChange={(value) => setSettings({ ...settings, dailyGoal: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rest Days
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {weekdays.map((day) => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.value}
                        checked={settings.restDays.includes(day.value)}
                        onCheckedChange={(checked) => handleRestDayToggle(day.value, checked as boolean)}
                      />
                      <Label htmlFor={day.value} className="text-sm">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="bg-gradient-to-r from-coral to-pink text-white px-8 py-3 rounded-2xl font-medium hover:shadow-lg transition-shadow"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
