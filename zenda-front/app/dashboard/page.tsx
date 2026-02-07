"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "../../components/TaskColumn";
import { TaskModal } from "../../components/TaskModal";
import { Task } from "@/types/task";
import { LogData } from "@/components/LogData";

type User = {
  id: string;
  email: string;
};

type PendingDelete = {
  id: string;
  task: Task;
  timeoutId: NodeJS.Timeout;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [crrtStatus, setcrrtStatus] = useState(1);
  const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([]);
  const router = useRouter();

  useEffect(() => {
    api("/auth/me")
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const openAddTask = (val: boolean, num?: number) => {
    setAddModal(val);
    setcrrtStatus(num ? num : 1);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleLogout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    const timeoutId = setTimeout(() => {
      api(`/tasks/${taskId}`, { method: "DELETE" })
        .then(() => {
          console.log("Task deleted permanently");
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          setTasks((prev) => [...prev, taskToDelete]);
        });

      setPendingDeletes((prev) => prev.filter((pd) => pd.id !== taskId));
    }, 5000);

    setPendingDeletes((prev) => [
      ...prev,
      {
        id: taskId,
        task: taskToDelete,
        timeoutId,
      },
    ]);
  };

  const handleCancelDelete = (taskId: string) => {
    const pending = pendingDeletes.find((pd) => pd.id === taskId);
    if (!pending) return;

    clearTimeout(pending.timeoutId);

    setTasks((prev) => [...prev, pending.task].sort((a, b) => a.order - b.order));

    setPendingDeletes((prev) => prev.filter((pd) => pd.id !== taskId));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      const columnTasks = tasks.filter(
        (t) => t.statusId === parseInt(source.droppableId)
      );
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = tasks.map((task) => {
        const newOrder = columnTasks.findIndex((t) => t.id === task.id);
        if (newOrder !== -1) {
          return { ...task, order: newOrder };
        }
        return task;
      });

      setTasks(updatedTasks);
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === result.draggableId
          ? { ...task, statusId: parseInt(destination.droppableId) }
          : task
      );
      setTasks(updatedTasks);
    }
  };

  const columns = [
    { id: "1", title: "To do", statusId: 1 },
    { id: "2", title: "In Progress", statusId: 2 },
    { id: "3", title: "Complete", statusId: 3 },
  ];

  useEffect(() => {
    api("/tasks/")
      .then(setTasks)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back <span className="font-semibold">{user?.email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {columns.map((column) => (
              <TaskColumn
                key={column.id}
                columnId={column.id}
                title={column.title}
                statusId={column.statusId}
                tasks={tasks.filter((t) => t.statusId === column.statusId)}
                onAddTask={(statusId) => openAddTask(true, statusId)}
                onEditTask={(taskId) => console.log("Edit task", taskId)}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {addModal && (
        <TaskModal
          onClose={() => openAddTask(false)}
          thisStatus={crrtStatus}
          onCreate={handleTaskCreated}
        />
      )}

      <LogData
        pendingDeletes={pendingDeletes}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}