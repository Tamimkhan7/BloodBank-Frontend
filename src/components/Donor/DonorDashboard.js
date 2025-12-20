import React, { useEffect, useState } from "react";
import { getMyDonorProfile, updateMyDonorProfile, searchDonors } from "../../api/api";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
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
  const [profile, setProfile] = useState({
    bloodGroup: "", 
    age: "", 
    gender: "", 
    phone: "", 
    email: "", 
    dateOfBirth: "",
    latitude: "", 
    longitude: "", 
    isAvailable: true
  });
  
  const [donors, setDonors] = useState([]);
  const [coords, setCoords] = useState({ lat: 0, lon: 0 });
  const [searchBlood, setSearchBlood] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const pageSize = 6;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyDonorProfile();
        setProfile(res.data);

        if (!res.data.latitude || !res.data.longitude) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
              setProfile(prev => ({
                ...prev,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
              }));
              setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            });
          }
        } else {
          setCoords({ lat: res.data.latitude, lon: res.data.longitude });
        }
      } catch {
        alert("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateMyDonorProfile(profile);
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const searchNearby = async () => {
    if (!searchBlood) {
      alert("Please select a blood group to search");
      return;
    }

    setLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });
      try {
        const params = {
          bloodGroup: searchBlood,
          lat: latitude,
          lon: longitude,
          page: page,
          pageSize: pageSize
        };
        const res = await searchDonors(params);
        setDonors(res.data.donors || []);
        setPage(1);
      } catch {
        alert("Search failed");
      } finally {
        setLoading(false);
      }
    }, () => {
      alert("Please allow location access to search nearby donors");
      setLoading(false);
    });
  };

  const paginatedDonors = donors.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(donors.length / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 pt-24 pb-16 px-4">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-100 to-transparent rounded-full opacity-20"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-tr from-red-50 to-transparent rounded-full opacity-15"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
            Donor <span className="text-red-600">Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600">
            Manage your profile and find nearby blood donors
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-900 flex items-center gap-3">
                <span className="bg-red-100 text-red-600 p-2 rounded-lg">👤</span>
                My Profile
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                profile.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {profile.isAvailable ? '🟢 Available' : '🔴 Not Available'}
              </div>
            </div>

            <div className="space-y-5">
              {/* Name (Disabled) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input 
                  value={profile.user?.fullName || "Loading..."} 
                  disabled 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
                />
              </div>

              {/* Blood Group & Age Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={profile.bloodGroup} 
                    onChange={e => setProfile({...profile, bloodGroup: e.target.value})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Blood Group</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Age</label>
                  <input 
                    type="number" 
                    placeholder="Enter your age"
                    value={profile.age} 
                    onChange={e => setProfile({...profile, age: e.target.value})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    min="18"
                    max="65"
                  />
                </div>
              </div>

              {/* Gender & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Gender</label>
                  <input 
                    placeholder="Male/Female/Other"
                    value={profile.gender} 
                    onChange={e => setProfile({...profile, gender: e.target.value})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    placeholder="01XXXXXXXXX"
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email"
                  placeholder="you@example.com"
                  value={profile.email} 
                  onChange={e => setProfile({...profile, email: e.target.value})}
                  className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Location Info */}
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">📍 Current Location</h4>
                    <p className="text-sm text-gray-600">
                      Latitude: {profile.latitude || "Not set"} | Longitude: {profile.longitude || "Not set"}
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                          setProfile(prev => ({
                            ...prev,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                          }));
                          setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                          alert("Location updated!");
                        });
                      }
                    }}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Update Location
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button 
                onClick={saveProfile}
                disabled={saving}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "💾 Save Profile"
                )}
              </button>
            </div>
          </div>

          {/* Search Donors Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
              <span className="bg-red-100 text-red-600 p-2 rounded-lg">🔍</span>
              Search Nearby Donors
            </h2>

            {/* Search Controls */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Select Blood Group to Search
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select 
                    value={searchBlood} 
                    onChange={e => setSearchBlood(e.target.value)}
                    className="flex-1 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Choose Blood Group</option>
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <button 
                    onClick={searchNearby}
                    disabled={loading || !searchBlood}
                    className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Searching...
                      </span>
                    ) : (
                      "🔍 Search Nearby"
                    )}
                  </button>
                </div>
              </div>

              {/* Location Info */}
              {coords.lat && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 text-xl">📍</span>
                    <div>
                      <p className="font-medium text-blue-800">Searching from your location</p>
                      <p className="text-sm text-blue-600">
                        Lat: {coords.lat.toFixed(4)}, Lon: {coords.lon.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Nearby Donors</h3>
                {donors.length > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {donors.length} found
                  </span>
                )}
              </div>

              {donors.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <span className="text-4xl mb-4 block">🩸</span>
                  <p className="text-gray-600 mb-2">No donors found yet</p>
                  <p className="text-gray-500 text-sm">Select a blood group and click search to find nearby donors</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedDonors.map(d => {
                      const donor = d.donor || d;
                      const distance = coords.lat && coords.lon 
                        ? getDistance(coords.lat, coords.lon, donor.latitude, donor.longitude)
                        : null;

                      return (
                        <div key={donor.id} className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-200 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600 font-bold">
                                    {donor.user?.fullName?.charAt(0) || "D"}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {donor.user?.fullName || "Anonymous Donor"}
                                  </h4>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                                      {donor.bloodGroup}
                                    </span>
                                    <span className={`text-sm font-medium ${donor.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                      {donor.isAvailable ? '🟢 Available' : '🔴 Not Available'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              {donor.phone && (
                                <a 
                                  href={`tel:${donor.phone}`}
                                  className="text-gray-600 hover:text-red-600 transition-colors text-sm flex items-center gap-2 mt-2"
                                >
                                  <span>📞</span> {donor.phone}
                                </a>
                              )}
                            </div>

                            {distance && (
                              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-medium text-sm whitespace-nowrap">
                                📍 {distance} km
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {donors.length > pageSize && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-gray-600 text-sm">
                        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, donors.length)} of {donors.length} donors
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                          disabled={page === 1}
                          className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          ← Previous
                        </button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                  page === pageNum
                                    ? 'bg-red-600 text-white'
                                    : 'text-red-600 hover:bg-red-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          {totalPages > 3 && page < totalPages - 1 && (
                            <>
                              <span className="text-red-400">...</span>
                              <button
                                onClick={() => setPage(totalPages)}
                                className="w-10 h-10 rounded-lg text-red-600 hover:bg-red-50 font-medium"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
                          disabled={page === totalPages}
                          className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{profile.bloodGroup || "-"}</div>
              <div className="text-lg">Your Blood Group</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{profile.isAvailable ? "Yes" : "No"}</div>
              <div className="text-lg">Available to Donate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{donors.length}</div>
              <div className="text-lg">Donors Found</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Dashboard Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}