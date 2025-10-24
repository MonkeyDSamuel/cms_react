import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./elements/Navbar";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import DoctorDashboardPage from "./pages/Doctor/DoctorDashboardPage";
import About from "./pages/About";         // Create this file/component
import Contact from "./pages/Contact";     // Create this file/component
import Login from "./pages/Login";         // Create this file/component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard section="home" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminDashboardPage />} />
        <Route path="/login/doctor" element={<DoctorDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;