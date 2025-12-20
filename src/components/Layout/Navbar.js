import { Link } from "react-router-dom";
import { isLoggedIn, removeToken, getUserRole } from "../../utils/auth";
import { useState } from "react";

export default function Navbar() {
  const role = getUserRole(); // "admin" | "user"
  const loggedIn = isLoggedIn();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-red-700 to-red-800 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home" className="text-2xl font-bold">
              Blood<span className="text-red-200">Bank</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">

            <Link to="/home">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/search">Search Donors</Link>

            {loggedIn && <Link to="/contact">Contact</Link>}

            {!loggedIn ? (
              <>
                <Link to="/login" className="bg-white text-red-700 px-4 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="bg-red-600 px-4 py-2 rounded">
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">

                {/* Role badge */}
                {/* <div className="bg-red-600 px-3 py-1 rounded-full text-sm">
                  {role === "Admin" ? "🛡️ Admin" : "👤 User"}
                </div> */}

                {/* ✅ MAIN FIX HERE */}
                {role === "Admin" ? (
                  <Link
                    to="/dashboard"
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Profile
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-white text-red-700 px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-red-800 px-4 py-3 space-y-2">
          <Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>

          {loggedIn && <Link to="/contact">Contact</Link>}

          {loggedIn ? (
            <>
              {role === "Admin" ? (
                <Link to="/dashboard">Dashboard</Link>
              ) : (
                <Link to="/profile">Profile</Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
