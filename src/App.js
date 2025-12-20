import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

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
import ContactUs from "./components/Layout/ContactUs";
import AdminContacts from "./components/Admin/AdminContacts";
import About from "./pages/About";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route
            path="/admin/contacts"
            element={
              <AdminRoute>
                <AdminContacts />
              </AdminRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/home" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DonorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <DonorSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor/dashboard"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />

          {/* Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
