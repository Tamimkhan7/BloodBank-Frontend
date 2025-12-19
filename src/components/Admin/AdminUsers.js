import { useEffect, useState } from "react";
import { getAllUsers, toggleBanUser } from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBan = async (user) => {
    await toggleBanUser(user.id);
    fetchUsers();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              {u.fullName} — {u.email} — Role: {u.role} — {u.isBanned ? "Banned" : "Active"}
            </div>
            <button
              onClick={() => handleToggleBan(u)}
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
