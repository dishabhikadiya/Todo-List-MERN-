import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./componet/Login";
import SignUp from "./componet/SignUp";
// import Dashboard from "./Templates/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="singUp" element={<SignUp />} />
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

export default App;
