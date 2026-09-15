export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskData = {
  title: string;
  description?: string;
  priority?: string;
};