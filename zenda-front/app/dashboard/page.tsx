"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "../../components/TaskColumn";
import { TaskModal } from "../../components/TaskModal";
import { Task } from "@/types/task";
import { LogData } from "@/components/LogData";
import { TaskEdit } from "@/components/TaskEdit";

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
    const [editModal, setEditModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [crrtStatus, setcrrtStatus] = useState(1);
  const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([]);
  const pendingChanges = useRef<Map<string, Task>>(new Map());
  const syncTimeout = useRef<NodeJS.Timeout | null>(null);
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

  const openEditModal = (task: Task)=> {
    setEditModal(true);
    setEditingTask(task)
  }

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

const handleTaskEdited = (editedTask: Task) => {
  setTasks((prev) =>
    prev.map((t) => (t.id === editedTask.id ? editedTask : t))
  );
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
    pendingChanges.current.delete(taskId);
  };

  const handleCancelDelete = (taskId: string) => {
    const pending = pendingDeletes.find((pd) => pd.id === taskId);
    if (!pending) return;
    clearTimeout(pending.timeoutId);

    setTasks((prev) =>
      [...prev, pending.task].sort((a, b) => a.order - b.order),
    );

    setPendingDeletes((prev) => prev.filter((pd) => pd.id !== taskId));
  };





  const scheduleSync = () => {
    if (syncTimeout.current) clearTimeout(syncTimeout.current);

    syncTimeout.current = setTimeout(async () => {
      const tasksToSync = Array.from(pendingChanges.current.values());
      pendingChanges.current.clear();

      await api("/tasks/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks: tasksToSync.map((t) => ({
            id: t.id,
            statusId: t.statusId,
            order: t.order,
          })),
        }),
      });
    }, 800);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceStatus = Number(source.droppableId);
    const destStatus = Number(destination.droppableId);

    const columnsMap = new Map<number, Task[]>();
    [1, 2, 3].forEach((status) => columnsMap.set(status, []));

    tasks.forEach((t) => {
      columnsMap.get(t.statusId)!.push({ ...t });
    });

    columnsMap.forEach((col) => col.sort((a, b) => a.order - b.order));

    const sourceColumn = columnsMap.get(sourceStatus)!;
    const destColumn = columnsMap.get(destStatus)!;

    const [movedTask] = sourceColumn.splice(source.index, 1);

    movedTask.statusId = destStatus;

    destColumn.splice(destination.index, 0, movedTask);

    sourceColumn.forEach((t, i) => (t.order = i));
    if (sourceStatus !== destStatus) {
      destColumn.forEach((t, i) => (t.order = i));
    }

const newTasks = Array.from(columnsMap.values()).flat();
setTasks(newTasks);

const affected = [
  ...sourceColumn,
  ...(sourceStatus !== destStatus ? destColumn : []),
];

affected.forEach((t) => {
  pendingChanges.current.set(t.id, t);
});

scheduleSync();

    
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
                Welcome back{" "}
                <span className="font-semibold">{user?.email}</span>
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
                onEditTask={openEditModal}
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
      {editModal && editingTask && (
        <TaskEdit
          thisTask={editingTask}
          onEdited={handleTaskEdited}
          onClose={() => {
          setEditModal(false);
          setEditingTask(null);
        }}
        />
      )}
      <LogData pendingDeletes={pendingDeletes} onCancel={handleCancelDelete} />
    </div>
  );
}
