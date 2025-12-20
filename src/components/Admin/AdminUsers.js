import { useEffect, useState } from "react";
import { getAllUsers, toggleBanUser, adminUpdateDonor } from "../../api/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBan = async (id) => {
    await toggleBanUser(id);
    fetchUsers();
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm(user.donorProfile || {});
  };

  const handleSave = async () => {
    await adminUpdateDonor(editUser.id, form);
    setEditUser(null);
    fetchUsers();
  };

  if (loading) return <div className="text-center mt-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto mt-24">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

      {users.map(u => (
        <div key={u.id} className="border p-3 mb-2 flex justify-between items-center">
          <div>
            {u.fullName} — {u.email} — {u.role}
          </div>
          <div className="space-x-2">
            <button
              onClick={() => handleToggleBan(u.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>

            {u.donorProfile && (
              <button
                onClick={() => openEdit(u)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit Donor
              </button>
            )}
          </div>
        </div>
      ))}

      {/* EDIT MODAL */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center overflow-auto p-4 z-50">
          <div className="bg-white p-6 rounded max-w-[600px] w-full">
            <h3 className="text-xl mb-3 font-bold">Edit Donor: {editUser.fullName}</h3>

            {/* BASIC INFO */}
            <input className="border w-full p-2 mb-2" placeholder="Blood Group"
              value={form.bloodGroup || ""} onChange={e => setForm({...form, bloodGroup: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Phone"
              value={form.phone || ""} onChange={e => setForm({...form, phone: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Email"
              value={form.email || ""} onChange={e => setForm({...form, email: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Age" type="number"
              value={form.age || ""} onChange={e => setForm({...form, age: Number(e.target.value)})} />
            <input className="border w-full p-2 mb-2" placeholder="Gender"
              value={form.gender || ""} onChange={e => setForm({...form, gender: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Date of Birth" type="date"
              value={form.dateOfBirth?.split('T')[0] || ""} onChange={e => setForm({...form, dateOfBirth: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="National ID Number"
              value={form.nationalIdNumber || ""} onChange={e => setForm({...form, nationalIdNumber: e.target.value})} />

            {/* ADDRESS */}
            <input className="border w-full p-2 mb-2" placeholder="Present Address"
              value={form.presentAddress || ""} onChange={e => setForm({...form, presentAddress: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Present Police Station"
              value={form.presentPoliceStation || ""} onChange={e => setForm({...form, presentPoliceStation: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Present District"
              value={form.presentDistrict || ""} onChange={e => setForm({...form, presentDistrict: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Permanent Address"
              value={form.permanentAddress || ""} onChange={e => setForm({...form, permanentAddress: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Permanent Police Station"
              value={form.permanentPoliceStation || ""} onChange={e => setForm({...form, permanentPoliceStation: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Permanent District"
              value={form.permanentDistrict || ""} onChange={e => setForm({...form, permanentDistrict: e.target.value})} />

            {/* LOCATION */}
            <input className="border w-full p-2 mb-2" placeholder="Latitude" type="number"
              value={form.latitude || ""} onChange={e => setForm({...form, latitude: Number(e.target.value)})} />
            <input className="border w-full p-2 mb-2" placeholder="Longitude" type="number"
              value={form.longitude || ""} onChange={e => setForm({...form, longitude: Number(e.target.value)})} />

            {/* DONATION */}
            <input className="border w-full p-2 mb-2" placeholder="Last Donation Date" type="date"
              value={form.lastDonationDate?.split('T')[0] || ""} onChange={e => setForm({...form, lastDonationDate: e.target.value})} />
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" checked={form.isAvailable || false}
                onChange={e => setForm({...form, isAvailable: e.target.checked})} />
              Available
            </label>

            {/* OTHER */}
            <textarea className="border w-full p-2 mb-2" placeholder="Medical Info"
              value={form.medicalInfo || ""} onChange={e => setForm({...form, medicalInfo: e.target.value})} />
            <input className="border w-full p-2 mb-2" placeholder="Photo URL"
              value={form.photoUrl || ""} onChange={e => setForm({...form, photoUrl: e.target.value})} />

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setEditUser(null)} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
