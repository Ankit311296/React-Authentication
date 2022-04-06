import React from "react";
import { Register } from "./pages/register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/login";
import Dashboard from './pages/dashboard';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      ,
    </div>
  );
}

export default App;
