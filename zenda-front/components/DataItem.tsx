"use client";

import { useEffect, useState } from "react";

type Props = {
  id: string;
  message: string;
  action?: string;
  onFinish: (id: string) => void;
  onCancel: (id: string) => void;
};

export const DataItem = ({ id, message, action, onFinish, onCancel }: Props) => {
  const [progress, setProgress] = useState(100);

  const doAction = () => {
    onCancel(id);
  };

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onFinish(id);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [id, onFinish]);

  return (
    <div className="relative w-full flex justify-between items-center
                    px-3 py-2
                    bg-zinc-800
                    border border-zinc-700
                    rounded-md
                    text-sm text-zinc-200
                    overflow-hidden
                    shadow-lg">
      
      <div
        className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all"
        style={{ width: `${progress}%` }}
      />

      <span className="z-10">{message}</span>
      {action && (
        <button
          onClick={doAction}
          className="text-xs text-red-400 hover:text-red-300 z-10 font-medium cursor-pointer"
        >
          {action}
        </button>
      )}
    </div>
  );
};