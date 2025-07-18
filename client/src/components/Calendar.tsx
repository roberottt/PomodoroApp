import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserCalendarEvents } from "@/lib/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Edit, Plus } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { EventModal } from "./EventModal";

export const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ["/api/calendar-events", user?.uid],
    queryFn: () => getUserCalendarEvents(user!.uid),
    enabled: !!user?.uid,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.startDate, day));
  };

  const upcomingEvents = events
    .filter(event => event.startDate >= new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 3);

  return (
    <Card className="rounded-3xl shadow-lg border-pink-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-charcoal flex items-center">
            <CalendarDays className="w-6 h-6 mr-3 text-coral" />
            Calendario
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsEventModalOpen(true)}
              className="bg-gradient-to-r from-coral to-pink text-white px-4 py-2 rounded-xl hover:shadow-lg transition-shadow flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Evento</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={previousMonth}
              className="p-2 rounded-full hover:bg-pink-100"
            >
              <ChevronLeft className="w-4 h-4 text-charcoal" />
            </Button>
            <h3 className="text-xl font-semibold text-charcoal">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-pink-100"
            >
              <ChevronRight className="w-4 h-4 text-charcoal" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-8">
          {/* Day headers */}
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`h-24 rounded-lg p-2 transition-colors cursor-pointer ${
                  isToday
                    ? "bg-coral/20 border-2 border-coral"
                    : "bg-warmGray hover:bg-pink-50"
                }`}
              >
                <div className={`text-sm font-medium ${
                  isToday ? "text-coral" : "text-charcoal"
                }`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="h-1 bg-coral rounded-full w-full"
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div>
          <h4 className="text-lg font-semibold text-charcoal mb-4">Próximos Eventos</h4>
          <div className="space-y-3">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No hay próximos eventos</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-coral/10 to-pink/10 rounded-2xl"
                >
                  <div className="w-3 h-3 bg-coral rounded-full" />
                  <div className="flex-1">
                    <h5 className="font-medium text-charcoal">{event.title}</h5>
                    <p className="text-sm text-gray-600">
                      {format(event.startDate, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-coral hover:text-coral/80"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      
      <EventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
      />
    </Card>
  );
};
