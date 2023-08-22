import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./componet/Login";
import SignUp from "./componet/SignUp";
import Todo from "./componet/Todo";
import ForgotPassword from "./componet/ForgotPassword";
import ResetPassword from "./componet/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/singUp" element={<SignUp />} />
      <Route path="/todo" element={<Todo />} />
      <Route path="/ForgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
