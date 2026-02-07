import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { Task } from "@/types/task";


interface TaskColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  statusId: number;
  onAddTask?: (statusId: number) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  columnId,
  title,
  tasks,
  statusId,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const getColumnColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return 'bg-gray-50 border-gray-300';
      case 2:
        return 'bg-blue-50 border-blue-300';
      case 3:
        return 'bg-green-50 border-green-300';
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  const getHeaderColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return 'text-gray-700';
      case 2:
        return 'text-blue-700';
      case 3:
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-150">
      <div className={`rounded-lg border-2 ${getColumnColor(statusId)} p-4 flex flex-col h-full`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className={`font-bold text-lg ${getHeaderColor(statusId)}`}>
              {title}
            </h2>
            <span className="bg-white text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {tasks.length}
            </span>
          </div>
          
          {onAddTask && (
            <button
              onClick={() => onAddTask(statusId)}
              className="text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg p-1.5 transition-all hover:shadow-sm"
              title="Agregar tarea"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={columnId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto rounded-lg transition-colors ${
                snapshot.isDraggingOver ? 'bg-white bg-opacity-50 ring-2 ring-blue-300' : ''
              }`}
              style={{ minHeight: '400px' }}
            >
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm font-medium">No hay tareas</p>
                </div>
              ) : (
                <div className="space-y-3 pb-2">
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};