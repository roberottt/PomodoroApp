import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getUserTasks, updateTask, deleteTask } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Play, Trash2 } from "lucide-react";
import { TaskModal } from "./TaskModal";
import type { Task } from "@shared/schema";

export const TaskManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["/api/tasks", user?.uid],
    queryFn: () => getUserTasks(user!.uid),
    enabled: !!user?.uid,
    retry: 3,
    retryDelay: 1000,
  });

  // Add debugging
  console.log("TaskManager - User ID:", user?.uid);
  console.log("TaskManager - Tasks:", tasks);
  console.log("TaskManager - Loading:", isLoading);
  console.log("TaskManager - Error:", error);

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<Task> }) =>
      updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user?.uid] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user?.uid] });
    },
  });

  const toggleTaskCompletion = (task: Task) => {
    updateTaskMutation.mutate({
      taskId: task.id,
      updates: { completed: !task.completed },
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-coral/20 text-coral";
      case "medium":
        return "bg-sage/20 text-sage";
      case "low":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const translatePriority = (priority: string) => {
    switch (priority) {
      case "high":
        return "alta";
      case "medium":
        return "media";
      case "low":
        return "baja";
      default:
        return priority;
    }
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-20 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-charcoal">Gestor de Tareas</h3>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-coral to-pink text-white rounded-2xl hover:shadow-lg transition-shadow"
        >
          Agregar Tarea
        </Button>
      </div>

      {/* Upcoming Tasks */}
      <Card className="rounded-3xl shadow-lg border-pink-100">
        <CardHeader>
          <CardTitle className="flex items-center text-charcoal">
            <Circle className="w-5 h-5 mr-2 text-coral" />
            Tareas Pendientes ({incompleteTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {incompleteTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Circle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay tareas pendientes. ¡Agrega una para comenzar!</p>
            </div>
          ) : (
            incompleteTasks.map((task) => (
              <div key={task.id} className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-warmGray rounded-2xl">
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTaskCompletion(task)}
                    className="text-coral hover:bg-coral/10 mt-1 sm:mt-0 flex-shrink-0"
                  >
                    <Circle className="w-5 h-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base text-charcoal break-words">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {translatePriority(task.priority)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTaskMutation.mutate(task.id)}
                    className="text-red-500 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card className="rounded-3xl shadow-lg border-pink-100">
          <CardHeader>
            <CardTitle className="flex items-center text-charcoal">
              <CheckCircle className="w-5 h-5 mr-2 text-sage" />
              Tareas Completadas ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completedTasks.map((task) => (
              <div key={task.id} className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-sage/10 rounded-2xl">
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTaskCompletion(task)}
                    className="text-sage hover:bg-sage/10 mt-1 sm:mt-0 flex-shrink-0"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base text-charcoal line-through break-words">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs sm:text-sm text-gray-600 line-through break-words">{task.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                  className="text-red-500 hover:bg-red-50 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};