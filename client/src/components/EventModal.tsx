
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createCalendarEvent } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { InsertCalendarEvent } from "@shared/schema";

const formatDateTimeLocal = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal = ({ isOpen, onClose }: EventModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<InsertCalendarEvent, 'userId'>>({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
  });

  const createEventMutation = useMutation({
    mutationFn: (event: Omit<InsertCalendarEvent, 'userId'>) => createCalendarEvent(user!.uid, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar-events", user?.uid] });
      toast({
        title: "Éxito",
        description: "¡Evento creado exitosamente!",
      });
      onClose();
      setFormData({
        title: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(),
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Error al crear el evento. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Por favor, ingresa un título para el evento.",
        variant: "destructive",
      });
      return;
    }
    createEventMutation.mutate(formData);
  };

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-charcoal">Agregar Nuevo Evento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Título del Evento
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ingresa el título del evento"
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción del evento"
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
              Fecha y Hora de Inicio
            </Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={formatDateTimeLocal(formData.startDate)}
              onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
              Fecha y Hora de Fin
            </Label>
            <Input
              id="endDate"
              type="datetime-local"
              value={formatDateTimeLocal(formData.endDate)}
              onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl"
            />
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
              className="bg-gradient-to-r from-coral to-pink text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow"
            >
              {createEventMutation.isPending ? "Agregando..." : "Agregar Evento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
