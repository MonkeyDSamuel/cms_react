import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Navbar from "./elements/Navbar";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import DoctorDashboardPage from "./pages/Doctor/DoctorDashboardPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./service/ProtectRoutes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Only dashboard and login routes since internal sections */}
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute requiredRole="ADMIN" />}> 
          <Route path="/login/admin" element={<AdminDashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredRole="DOCTOR" />}> 
          <Route path="/login/doctor" element={<DoctorDashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;