import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Task } from "@/types/task";

interface ModalProps {
  thisTask: Task
  onClose: ()=>void
  onEdited: (task: Task) => void
}


export const TaskEdit: React.FC<ModalProps> = ({thisTask, onClose, onEdited}) => {

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateTask= async() => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");
    setLoading(true);

    if (!title) return
    try {
      
        const editedTask = await api(`/tasks/${thisTask.id}`,{method: "PUT",
              body: JSON.stringify({ 
                title: title.trim(),
                description: desc.trim(),
                statusId: thisTask.statusId,
                order: thisTask.order,
              }),
            });
        onClose();
        onEdited(editedTask)
    }catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.log(err)
    } finally {
      setLoading(false);
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      updateTask();
    }
  };

  useEffect(()=>{
    setTitle(thisTask.title)
    setDesc(thisTask.description?? "")
  },[thisTask])

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="border border-zinc-700 rounded-xl bg-white
                  p-6 min-w-[320px] w-max shadow-xl relative"
      >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
                rounded-md text-zinc-500 hover:text-zinc-800 transition">
            ✕
          </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Edit Task</h2>
        <input
          className="w-full mb-3 p-2 rounded-md border border-zinc-700 outline-none text-gray-700"

            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"  
            onKeyUp={handleKeyPress}
            disabled={loading}
            autoFocus
          />
        <textarea
          className="w-full mb-4 rounded-md border border-zinc-700 outline-none text-gray-700"
            id="description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter task description (optional)"
            disabled={loading}
            rows={4}
        ></textarea>
        <button onClick={()=>updateTask()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          Add
        </button>
      </div>
    </div>
  );
};
