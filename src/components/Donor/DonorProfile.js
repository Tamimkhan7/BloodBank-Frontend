import { useEffect, useState } from "react";
import { getMyDonorProfile, updateMyDonorProfile } from "../../api/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function DonorProfile() {
  const [profile, setProfile] = useState({
    bloodGroup: "",
    age: "",
    address: "",
    latitude: "",
    longitude: "",
    isAvailable: true,
  });

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyDonorProfile();
        if (res.data) {
          setProfile({
            bloodGroup: res.data.bloodGroup ?? "",
            age: res.data.age ?? "",
            address: res.data.address ?? "",
            latitude: res.data.latitude ?? "",
            longitude: res.data.longitude ?? "",
            isAvailable: res.data.isAvailable ?? true,
          });
        }
      } catch (err) {
        console.error("Fetch profile failed:", err);
      }
    };
    fetchProfile();
  }, []);

  // Auto get location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setProfile((p) => ({
          ...p,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => alert("Location permission denied")
    );
  };

  // Save profile
  const save = async (e) => {
    e.preventDefault();

    const payload = {
      bloodGroup: profile.bloodGroup || null,
      age: Number(profile.age) || 0,
      address: profile.address || null,
      latitude:
        profile.latitude === "" ? null : Number(profile.latitude),
      longitude:
        profile.longitude === "" ? null : Number(profile.longitude),
      isAvailable: profile.isAvailable,
    };

    try {
      await updateMyDonorProfile(payload);
      const res = await getMyDonorProfile();
      setProfile({
        bloodGroup: res.data.bloodGroup ?? "",
        age: res.data.age ?? "",
        address: res.data.address ?? "",
        latitude: res.data.latitude ?? "",
        longitude: res.data.longitude ?? "",
        isAvailable: res.data.isAvailable ?? true,
      });
      alert("Profile saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-red-600">
        My Profile
      </h2>

      <form onSubmit={save} className="space-y-3">
        {/* Blood Group */}
        <select
          className="w-full border p-2 rounded"
          value={profile.bloodGroup}
          onChange={(e) =>
            setProfile({ ...profile, bloodGroup: e.target.value })
          }
        >
          <option value="">Select Blood Group</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        {/* Age */}
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Age"
          value={profile.age}
          onChange={(e) =>
            setProfile({ ...profile, age: e.target.value })
          }
        />

        {/* Address */}
        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />

        {/* Latitude */}
        <input
          type="number"
          step="any"
          className="w-full border p-2 rounded"
          placeholder="Latitude"
          value={profile.latitude}
          onChange={(e) =>
            setProfile({ ...profile, latitude: e.target.value })
          }
        />

        {/* Longitude */}
        <input
          type="number"
          step="any"
          className="w-full border p-2 rounded"
          placeholder="Longitude"
          value={profile.longitude}
          onChange={(e) =>
            setProfile({ ...profile, longitude: e.target.value })
          }
        />

        <button
          type="button"
          onClick={getLocation}
          className="bg-gray-600 text-white px-4 py-2 rounded w-full"
        >
          📍 Use My Current Location
        </button>

        {/* Availability */}
        <label className="flex items-center gap-2 mt-2">
          <span>Available:</span>
          <input
            type="checkbox"
            checked={profile.isAvailable}
            onChange={(e) =>
              setProfile({
                ...profile,
                isAvailable: e.target.checked,
              })
            }
            className="w-5 h-5"
          />
        </label>

        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
