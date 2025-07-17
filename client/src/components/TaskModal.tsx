import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { createTask } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { InsertTask } from "@shared/schema";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal = ({ isOpen, onClose }: TaskModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<InsertTask, 'userId'>>({
    title: "",
    description: "",
    priority: "medium",
    completed: false,
  });

  const createTaskMutation = useMutation({
    mutationFn: (task: Omit<InsertTask, 'userId'>) => createTask(user!.uid, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks", user?.uid] });
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      onClose();
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        completed: false,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }
    createTaskMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-charcoal">Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Task Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Task description"
              className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "low" | "medium" | "high") => 
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger className="mt-1 border-pink-200 focus:ring-coral focus:border-coral rounded-xl">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTaskMutation.isPending}
              className="bg-gradient-to-r from-coral to-pink text-white px-6 py-2 rounded-xl hover:shadow-lg transition-shadow"
            >
              {createTaskMutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
