import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./componet/Login";
import SignUp from "./componet/SignUp";
import Todo from "./componet/Todo";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/singUp" element={<SignUp />} />
      <Route path="/todo" element={<Todo />} />
    </Routes>
  );
}

export default App;
