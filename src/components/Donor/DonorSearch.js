import { useState } from "react";
import { searchDonors } from "../../api/api";

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

export default function DonorSearch() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });

  const handleSearch = async () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });
      const res = await searchDonors(bloodGroup, latitude, longitude);
      setDonors(res.data);
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Donors</h2>

      <div className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">All Blood Groups</option>
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      <ul className="space-y-2">
        {donors.map((d) => (
          <li
            key={d.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              {d.user.fullName} — {d.bloodGroup} — Available:{" "}
              {d.isAvailable ? "Yes" : "No"}
            </div>
            <div>
              {coords.lat && coords.lon
                ? getDistance(coords.lat, coords.lon, d.latitude, d.longitude) +
                  " km"
                : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
