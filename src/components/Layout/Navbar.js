import { Link } from "react-router-dom";
import { isLoggedIn, removeToken, getUserRole } from "../../utils/auth";
import { useState } from "react";

export default function Navbar() {
  const role = getUserRole(); // "Admin" | "User"
  const loggedIn = isLoggedIn();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-red-700 to-red-800 text-white fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold">
          Blood<span className="text-red-200">Bank</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/search">Search Donors</Link>

          {loggedIn && <Link to="/contact">Contact</Link>}

          {/* USER ONLY */}
          {loggedIn && role !== "Admin" && (
            <>
              <Link to="/blood-request">Add Blood Request</Link>
              {/* <Link to="/my-blood-requests">My Requests</Link> */}
            </>
          )}

          {!loggedIn ? (
            <>
              <Link to="/login" className="bg-white text-red-700 px-4 py-1 rounded">
                Login
              </Link>
              <Link to="/register" className="bg-red-600 px-4 py-1 rounded">
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "Admin" ? (
                <Link to="/admin/dashboard" className="bg-red-600 px-4 py-1 rounded">
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/Profile" className="bg-red-600 px-4 py-1 rounded">
                  Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-red-700 px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-red-800 px-4 py-3 space-y-2">
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>

          {loggedIn && role !== "Admin" && (
            <>
              <Link to="/blood-request">Add Blood Request</Link>
              <Link to="/my-blood-requests">My Requests</Link>
            </>
          )}

          {loggedIn ? (
            <>
              {role === "Admin" ? (
                <Link to="/admin/dashboard">Admin Dashboard</Link>
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
