import { Link } from "react-router-dom";
import { isLoggedIn, removeToken, getUserRole } from "../../utils/auth";

export default function Navbar() {
  const role = getUserRole();
  const loggedIn = isLoggedIn();

  return (
    <nav className="bg-red-900 font-bold text-white px-6 py-3 flex justify-between items-center fixed w-full top-0 z-50 shadow">
      <Link to="/" className="font-bold text-white text-xl text-red-500">BloodBank</Link>

      <div className="space-x-4">
        {!loggedIn && (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            {role === "Admin" && (
              <Link to="/admin/contacts" className="hover:underline">Admin</Link>
            )}
            <button
              onClick={() => { removeToken(); window.location.href = "/login"; }}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-500"
            >Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
