import { useEffect, useState } from "react";
import { getAllUsers, toggleBanUser } from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId) => {
    try {
      await toggleBanUser(userId);
      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  if (loading) return <div className="text-center mt-6 text-lg">Loading users...</div>;

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
              onClick={() => handleToggleBan(u.id)}
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
