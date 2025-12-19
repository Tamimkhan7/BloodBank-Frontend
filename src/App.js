import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminRoute from "./components/Auth/AdminRoute";

import Dashboard from "./components/Layout/Dashboard";
import DonorProfile from "./components/Donor/DonorProfile";
import DonorSearch from "./components/Donor/DonorSearch";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminDashboard from "./components/Admin/AdminDashboard";
import DonorDashboard from "./components/Donor/DonorDashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><DonorSearch /></ProtectedRoute>} />

        <Route path="/donor/dashboard" element={<ProtectedRoute><DonorDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;
