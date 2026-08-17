export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'on-hold';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Subtask {
  _id: string;
  title: string;
  priority: TaskPriority;
  dueDate?: string;
  completed: boolean;
}

export interface TaskUpdate {
  _id: string;
  text: string;
  userName: string;
  createdAt: string;
}

export interface Resource {
  _id: string;
  name: string;
  url: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  labels: string[];
  subtasks: Subtask[];
  resources: Resource[];
  updates: TaskUpdate[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}