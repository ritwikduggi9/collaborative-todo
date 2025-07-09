import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const socket = io("https://collaborative-todo-backend-nzoy.onrender.com");

const columns = ["Todo", "In Progress", "Done"];

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Todo"
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTasks();
    socket.on("taskUpdated", fetchTasks);
    return () => socket.off("taskUpdated");
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://collaborative-todo-backend-nzoy.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post("https://collaborative-todo-backend-nzoy.onrender.com/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewTask({ title: "", description: "", priority: "Low", status: "Todo" });
    } catch (err) {
      console.error("Task creation failed:", err);
      alert(err.response?.data?.error || "Task creation failed");
    }
  };

  // ✅ Fixed: Refresh task list after drag
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    try {
      await axios.put(
        `https://collaborative-todo-backend-nzoy.onrender.com/api/tasks/${draggableId}`,
        { status: destination.droppableId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // ✅ Refresh list
    } catch (err) {
      console.error("Drag update failed:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🧠 Collaborative Kanban Board</h2>

      {/* Task Creation Form */}
      <div style={{ marginBottom: 30 }}>
        <h3>Create New Task</h3>
        <input
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />{" "}
        <input
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />{" "}
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>{" "}
        <button onClick={handleCreateTask}>Create Task</button>
      </div>

      {/* DnD Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 20 }}>
          {columns.map((col) => (
            <Droppable key={col} droppableId={col}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    backgroundColor: "#f1f1f1",
                    padding: 10,
                    width: 300,
                    minHeight: 300,
                    borderRadius: 8,
                  }}
                >
                  <h4>{col}</h4>
                  {tasks
                    .filter((t) => t.status === col)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: 10,
                              margin: "8px 0",
                              backgroundColor: "#fff",
                              borderRadius: 4,
                              boxShadow: "0 0 3px rgba(0,0,0,0.1)",
                              ...provided.draggableProps.style,
                            }}
                          >
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <small>Priority: {task.priority}</small>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
