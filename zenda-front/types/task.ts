export interface Task {
  id: string;
  title: string;
  description?: string;
  statusId: number;
  order: number;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}