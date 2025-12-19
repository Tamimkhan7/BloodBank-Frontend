import { useEffect, useState } from "react";
import { getAllUsers, toggleBanUser } from "../../api/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await getAllUsers();
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleBan = async (user) => {
    await toggleBanUser(user.id);
    fetchUsers();
  };

  const total = users.length;
  const active = users.filter(u => !u.isBanned).length;
  const banned = users.filter(u => u.isBanned).length;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-600 text-white p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">Total Users</h3>
          <p className="text-2xl mt-2">{total}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">Active Users</h3>
          <p className="text-2xl mt-2">{active}</p>
        </div>
        <div className="bg-gray-600 text-white p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">Banned Users</h3>
          <p className="text-2xl mt-2">{banned}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {users.map(u => (
          <li key={u.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{u.fullName}</p>
              <p className="text-sm">{u.email} — Role: {u.role}</p>
              <p className="text-sm">{u.isBanned ? "Banned" : "Active"}</p>
            </div>
            <button
              onClick={() => toggleBan(u)}
              className={`px-3 py-1 rounded ${u.isBanned ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
