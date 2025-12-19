import { useEffect, useState } from "react";
import { getMyDonorProfile, updateMyDonorProfile } from "../../api/api";

export default function DonorProfile() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getMyDonorProfile().then((res) => setProfile(res.data));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await updateMyDonorProfile(profile);
    alert("Saved");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <form onSubmit={save} className="space-y-3">
        {["bloodGroup", "age", "address", "latitude", "longitude"].map((f) => (
          <input
            key={f}
            className="w-full border p-2 rounded"
            placeholder={f}
            value={profile[f] || ""}
            onChange={(e) => setProfile({ ...profile, [f]: e.target.value })}
          />
        ))}
        <button className="bg-red-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
