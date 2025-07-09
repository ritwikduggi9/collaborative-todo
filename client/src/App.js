import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<KanbanBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
