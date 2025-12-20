import { Link } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

export default function Dashboard() {
  const role = getUserRole();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/profile" className="bg-white shadow rounded p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold">My Profile</h2>
          <p className="text-gray-500">Update donor information</p>
        </Link>

        <Link to="/search" className="bg-white shadow rounded p-6 hover:scale-105 transition">
          <h2 className="text-xl font-semibold">Search Donors</h2>
          <p className="text-gray-500">Find nearby donors</p>
        </Link>

        {role === "Admin" && (
          <Link to="/admin/users" className="bg-white shadow rounded p-6 hover:scale-105 transition">
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            <p className="text-gray-500">Manage all users</p>
          </Link>
        )}
      </div>
    </div>
  );
}
