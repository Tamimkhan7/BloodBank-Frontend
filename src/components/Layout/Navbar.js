import { Link, useLocation } from "react-router-dom";
import { isLoggedIn, removeToken, getUserRole } from "../../utils/auth";

export default function Navbar() {
  const location = useLocation();
  const role = getUserRole();
  const loggedIn = isLoggedIn();

  // শুধুমাত্র Login/Register page-এ navbar optional hide করতে চাও, সেটা নীচের মতো করা যায়
  // যদি hide না করতে চাও, নিচের line ডিলিট করো
  // if (["/login", "/register"].includes(location.pathname)) return null;

  return (
    <nav className="bg-red-600 text-white px-6 py-3 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        BloodBank
      </Link>

      <div className="space-x-4">
        {!loggedIn && (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}

        {loggedIn && (
          <>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
            <Link to="/search" className="hover:underline">
              Search
            </Link>
            {role === "Admin" && (
              <Link to="/admin/users" className="hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                removeToken();
                window.location.href = "/login";
              }}
              className="bg-white text-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
