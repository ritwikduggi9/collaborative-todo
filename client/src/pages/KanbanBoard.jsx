import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const columns = ["Todo", "In Progress", "Done"];

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks");
    setTasks(res.data);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updatedTask = tasks.find(task => task._id === draggableId);
    updatedTask.status = destination.droppableId;

    await axios.put(`http://localhost:5000/api/tasks/${draggableId}`, updatedTask);
    fetchTasks();
  };

  return (
    <div style={{ display: "flex", padding: 20, gap: 20 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  backgroundColor: "#f2f2f2",
                  padding: 10,
                  borderRadius: 8,
                  minHeight: 300,
                }}
              >
                <h3>{col}</h3>
                {tasks
                  .filter((task) => task.status === col)
                  .map((task, index) => (
                    <Draggable draggableId={task._id} index={index} key={task._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: 10,
                            backgroundColor: "#fff",
                            marginBottom: 10,
                            borderRadius: 4,
                            boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <strong>{task.title}</strong>
                          <div style={{ fontSize: "0.8em", color: "#555" }}>
                            {task.assignedTo?.username || "Unassigned"}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;
