import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";
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

//  Blood request pages
import BloodRequest from "./pages/donor/BloodRequest";
import BloodRequestHistory from "./pages/donor/BloodRequestHistory";
import AdminBloodRequests from "./components/Admin/AdminBloodRequests";

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<ContactUs />} />
           <Route path="/forget-password" element={<ForgetPassword />} />
           <Route path="/reset-password" element={<ResetPassword />} />
          


          {/* User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
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
            path="/"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />

          {/*  Blood Request (User) */}
          <Route
            path="/blood-request"
            element={
              <ProtectedRoute>
                <BloodRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-blood-requests"
            element={
              <ProtectedRoute>
                <BloodRequestHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
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
          <Route
            path="/admin/contacts"
            element={
              <AdminRoute>
                <AdminContacts />
              </AdminRoute>
            }
          />

          {/*  Blood Request (Admin) */}
          <Route
            path="/admin/blood-requests"
            element={
              <AdminRoute>
                <AdminBloodRequests />
              </AdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
