import React, { useEffect, useState } from "react";
import { getMyDonorProfile, updateMyDonorProfile, searchDonors } from "../../api/api";

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function DonorDashboard() {
  const [profile, setProfile] = useState({ bloodGroup: "", age: "", address: "", latitude: "", longitude: "", isAvailable: true });
  const [donors, setDonors] = useState([]);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [searchBlood, setSearchBlood] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getMyDonorProfile();
      setProfile(res.data);
    };
    fetchProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    await updateMyDonorProfile(profile);
    alert("Profile updated");
  };

  const searchNearby = async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      const res = await searchDonors(searchBlood, pos.coords.latitude, pos.coords.longitude);
      setDonors(res.data);
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Profile */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form className="space-y-3" onSubmit={saveProfile}>
          {["bloodGroup", "age", "address", "latitude", "longitude"].map(f => (
            <input
              key={f}
              placeholder={f}
              value={profile[f]}
              onChange={e => setProfile({...profile, [f]: e.target.value})}
              className="w-full border p-2 rounded"
            />
          ))}
          <label className="flex items-center gap-2 mt-2">
            <span>Available:</span>
            <input type="checkbox" checked={profile.isAvailable} onChange={e => setProfile({...profile, isAvailable: e.target.checked})} className="w-5 h-5"/>
          </label>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Save</button>
        </form>
      </div>

      {/* Search Donors */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-2xl font-bold mb-4">Search Donors Nearby</h2>
        <div className="flex gap-2 mb-4">
          <select value={searchBlood} onChange={e => setSearchBlood(e.target.value)} className="border p-2 rounded">
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={searchNearby}>Search</button>
        </div>
        <ul className="space-y-2">
          {donors.map(d => (
            <li key={d.id} className="border p-3 rounded flex justify-between">
              <div>
                <p className="font-semibold">{d.user.fullName} - {d.bloodGroup}</p>
                <p>Available: {d.isAvailable ? "Yes" : "No"}</p>
              </div>
              <div>{coords.lat && coords.lon ? getDistance(coords.lat, coords.lon, d.latitude, d.longitude) + " km" : ""}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
