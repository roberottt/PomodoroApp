import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createMood, getUserMoods } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InsertMood } from "@shared/schema";

const moodOptions = [
  { value: "happy", emoji: "😊", label: "Feliz" },
  { value: "good", emoji: "🙂", label: "Bien" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "tired", emoji: "😕", label: "Cansado" },
  { value: "stressed", emoji: "😞", label: "Estresado" },
] as const;

export const MoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const { data: moods = [] } = useQuery({
    queryKey: ["/api/moods", user?.uid],
    queryFn: () => getUserMoods(user!.uid),
    enabled: !!user?.uid,
  });

  const createMoodMutation = useMutation({
    mutationFn: (mood: Omit<InsertMood, 'userId'>) => createMood(user!.uid, mood),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods", user?.uid] });
      toast({
        title: "¡Estado de ánimo registrado!",
        description: "Tu estado de ánimo ha sido guardado para hoy.",
      });
    },
  });

  // Check if user has logged mood today
  const today = new Date().toDateString();
  const todayMood = moods.find(mood => {
    const moodDate = mood.date instanceof Date ? mood.date : new Date(mood.date);
    return moodDate.toDateString() === today;
  });

  useEffect(() => {
    if (todayMood) {
      setSelectedMood(todayMood.mood);
    }
  }, [todayMood]);

  const handleMoodSelect = (mood: string) => {
    if (todayMood) {
      // User already logged mood today
      return;
    }

    setSelectedMood(mood);
    createMoodMutation.mutate({
      mood: mood as InsertMood['mood'],
      date: new Date(),
    });
  };

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-charcoal">
          <Heart className="w-5 h-5 mr-2 text-coral" />
          ¿Cómo te sientes?
        </CardTitle>
      </CardHeader>
      <CardContent>
        {todayMood ? (
          <div className="text-center">
            <div className="text-4xl mb-2">
              {moodOptions.find(option => option.value === selectedMood)?.emoji}
            </div>
            <p className="text-sm text-gray-600">
              Registraste tu estado de ánimo como {moodOptions.find(option => option.value === selectedMood)?.label} hoy
            </p>
          </div>
        ) : (
          <div className="flex justify-center space-x-3">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="lg"
                onClick={() => handleMoodSelect(option.value)}
                className={`text-3xl hover:scale-110 transition-transform p-3 ${
                  selectedMood === option.value ? "ring-2 ring-coral" : ""
                }`}
                disabled={createMoodMutation.isPending}
              >
                {option.emoji}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
