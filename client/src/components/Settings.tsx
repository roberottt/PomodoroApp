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
    sessionCount: 4,
    dailyGoal: 4,
    restDays: ["sunday"],
    notifications: true,
  });

  const [inputValues, setInputValues] = useState({
    workDuration: "25",
    shortBreakDuration: "5",
    longBreakDuration: "15",
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
        sessionCount: userSettings.sessionCount,
        dailyGoal: userSettings.dailyGoal,
        restDays: userSettings.restDays,
        notifications: userSettings.notifications,
      });
      setInputValues({
        workDuration: userSettings.workDuration.toString(),
        shortBreakDuration: userSettings.shortBreakDuration.toString(),
        longBreakDuration: userSettings.longBreakDuration.toString(),
      });
    }
  }, [userSettings]);

  const validateInputs = () => {
    const workDuration = parseInt(inputValues.workDuration);
    const shortBreakDuration = parseInt(inputValues.shortBreakDuration);
    const longBreakDuration = parseInt(inputValues.longBreakDuration);

    if (isNaN(workDuration) || workDuration < 1 || workDuration > 120) {
      toast({
        title: "Error de validación",
        description: "La duración del trabajo debe ser entre 1 y 120 minutos.",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(shortBreakDuration) || shortBreakDuration < 1 || shortBreakDuration > 60) {
      toast({
        title: "Error de validación",
        description: "La duración del descanso corto debe ser entre 1 y 60 minutos.",
        variant: "destructive",
      });
      return false;
    }

    if (isNaN(longBreakDuration) || longBreakDuration < 1 || longBreakDuration > 120) {
      toast({
        title: "Error de validación",
        description: "La duración del descanso largo debe ser entre 1 y 120 minutos.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInputs()) return;

    const updatedSettings = {
      ...settings,
      workDuration: parseInt(inputValues.workDuration),
      shortBreakDuration: parseInt(inputValues.shortBreakDuration),
      longBreakDuration: parseInt(inputValues.longBreakDuration),
    };

    updateSettingsMutation.mutate(updatedSettings);
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
                  Duración de la Sesión de Trabajo (minutos)
                </Label>
                <input
                  id="workDuration"
                  type="number"
                  min="1"
                  max="120"
                  value={inputValues.workDuration}
                  onChange={(e) => setInputValues({ ...inputValues, workDuration: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="25"
                />
              </div>
              
              <div>
                <Label htmlFor="shortBreak" className="text-sm font-medium text-gray-700">
                  Duración del Descanso Corto (minutos)
                </Label>
                <input
                  id="shortBreak"
                  type="number"
                  min="1"
                  max="60"
                  value={inputValues.shortBreakDuration}
                  onChange={(e) => setInputValues({ ...inputValues, shortBreakDuration: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="5"
                />
              </div>
              
              <div>
                <Label htmlFor="longBreak" className="text-sm font-medium text-gray-700">
                  Duración del Descanso Largo (minutos)
                </Label>
                <input
                  id="longBreak"
                  type="number"
                  min="1"
                  max="120"
                  value={inputValues.longBreakDuration}
                  onChange={(e) => setInputValues({ ...inputValues, longBreakDuration: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral focus:border-transparent"
                  placeholder="15"
                />
              </div>
              
              <div>
                <Label htmlFor="sessionCount" className="text-sm font-medium text-gray-700">
                  Número de Sesiones Pomodoro
                </Label>
                <Select
                  value={(settings.sessionCount || 4).toString()}
                  onValueChange={(value) => setSettings({ ...settings, sessionCount: parseInt(value) })}
                >
                  <SelectTrigger className="w-full mt-1 border-pink-200 focus:ring-coral rounded-xl">
                    <SelectValue placeholder="Seleccionar sesiones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 sesión</SelectItem>
                    <SelectItem value="2">2 sesiones</SelectItem>
                    <SelectItem value="3">3 sesiones</SelectItem>
                    <SelectItem value="4">4 sesiones</SelectItem>
                    <SelectItem value="5">5 sesiones</SelectItem>
                    <SelectItem value="6">6 sesiones</SelectItem>
                    <SelectItem value="8">8 sesiones</SelectItem>
                    <SelectItem value="10">10 sesiones</SelectItem>
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
                  value={(settings.dailyGoal || 4).toString()}
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

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notificaciones
                </Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked as boolean })}
                  />
                  <Label htmlFor="notifications" className="text-sm">
                    Recibir notificaciones de las sesiones
                  </Label>
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
