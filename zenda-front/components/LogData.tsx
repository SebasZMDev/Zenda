"use client";

import { DataItem } from "./DataItem";

type PendingDelete = {
  id: string;
  task: {
    id: string;
    title?: string;
    [key: string]: any;
  };
  timeoutId: NodeJS.Timeout;
};

type Props = {
  pendingDeletes: PendingDelete[];
  onCancel: (id: string) => void;
};

export const LogData = ({ pendingDeletes, onCancel }: Props) => {
  const handleFinish = (id: string) => {
    console.log("Delete completed for:", id);
  };

  if (pendingDeletes.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2 z-50">
      {pendingDeletes.map((pending) => (
        <DataItem
          key={pending.id}
          id={pending.id}
          message={`Deleting: ${pending.task.title || "Task"}`}
          action="Undo"
          onFinish={handleFinish}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};