import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, User, GripVertical } from 'lucide-react';
import { Task } from "@/types/task";

interface TaskCardProps {
  task: {
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
  };
  index: number;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 transition-all hover:shadow-md ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              {...provided.dragHandleProps}
              className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
            >
              <GripVertical size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 
                className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                onClick={() => onEdit?.(task)}
              >
                {task.title}
              </h3>
              
              {task.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
                
                {task.user && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span className="truncate max-w-30">{task.user.name}</span>
                  </div>
                )}
              </div>
            </div>
            
            {(onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(task)}
                    className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50"
                    title="Editar tarea"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                    title="Eliminar tarea"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};