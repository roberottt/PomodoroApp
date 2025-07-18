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
        title: "¡Configuración guardada!",
        description: "Tus preferencias han sido actualizadas.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración. Por favor, inténtalo de nuevo.",
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
    { value: "sunday", label: "Domingo" },
    { value: "monday", label: "Lunes" },
    { value: "tuesday", label: "Martes" },
    { value: "wednesday", label: "Miércoles" },
    { value: "thursday", label: "Jueves" },
    { value: "friday", label: "Viernes" },
    { value: "saturday", label: "Sábado" },
  ];

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-charcoal flex items-center">
          <SettingsIcon className="w-6 h-6 mr-3 text-coral" />
          Configuración de Estudio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pomodoro Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-charcoal">Temporizador Pomodoro</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="workDuration" className="text-sm font-medium text-gray-700">
                  Duración de la Sesión de Trabajo
                </Label>
                <Select
                  value={settings.workDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, workDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="shortBreak" className="text-sm font-medium text-gray-700">
                  Duración del Descanso Corto
                </Label>
                <Select
                  value={settings.shortBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, shortBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="longBreak" className="text-sm font-medium text-gray-700">
                  Duración del Descanso Largo
                </Label>
                <Select
                  value={settings.longBreakDuration.toString()}
                  onValueChange={(value) => setSettings({ ...settings, longBreakDuration: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="20">20 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Study Schedule */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-charcoal">Horario de Estudio</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dailyGoal" className="text-sm font-medium text-gray-700">
                  Meta de Estudio Diaria
                </Label>
                <Select
                  value={settings.dailyGoal.toString()}
                  onValueChange={(value) => setSettings({ ...settings, dailyGoal: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 horas</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Días de Descanso
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
            {updateSettingsMutation.isPending ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
