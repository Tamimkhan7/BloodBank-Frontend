import { useState } from "react"; // Removed unused useEffect
import { searchDonors } from "../../api/api";

export default function DonorSearch() {
  const [filters, setFilters] = useState({
    bloodGroup: "",
    district: ""
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonors, setTotalDonors] = useState(0);
  const pageSize = 6;

  // Available blood groups
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  
  // All 64 Districts of Bangladesh
  const allDistricts = [
    "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogra", "Brahmanbaria", 
    "Chandpur", "Chattogram", "Chuadanga", "Comilla", "Cox's Bazar", "Dhaka", 
    "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj", 
    "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", 
    "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", 
    "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", 
    "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", 
    "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", 
    "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira", 
    "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", 
    "Thakurgaon"
  ];

  const handleSearch = async (pageNum = 1) => {
    if (!filters.bloodGroup) {
      alert("Please select a blood group");
      return;
    }

    setLoading(true);
    try {
      const params = {
        bloodGroup: filters.bloodGroup,
        district: filters.district || null,
        page: pageNum,
        pageSize
      };

      const response = await searchDonors(params);
      setDonors(response.data.donors || []);
      setTotalDonors(response.data.totalCount || 0);
      setTotalPages(response.data.totalPages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error("Search failed:", error);
      alert("Failed to search donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      handleSearch(newPage);
    }
  };

  const getTimeSinceLastDonation = (dateString) => {
    if (!dateString) return "Never donated";
    
    const lastDonation = new Date(dateString);
    const now = new Date();
    const diffMonths = Math.floor((now - lastDonation) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffMonths === 0) return "This month";
    if (diffMonths === 1) return "1 month ago";
    if (diffMonths < 12) return `${diffMonths} months ago`;
    
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-100 border-red-200",
      "bg-pink-100 border-pink-200",
      "bg-rose-100 border-rose-200",
      "bg-orange-100 border-orange-200"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-red-50 pt-24 pb-16 px-4">
      {/* Background blood drop decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-red-100 to-transparent rounded-full opacity-20"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-gradient-to-tr from-red-50 to-transparent rounded-full opacity-15"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-red-50 to-transparent rounded-full opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl">❤️</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-900 mb-4">
            Find Blood Donors
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Search for voluntary blood donors by blood group and district. 
            Every search could save a life.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-red-100">
          <h2 className="text-2xl font-bold text-red-900 mb-6">
            🔍 Search Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🩸 Blood Group *
              </label>
              <select
                name="bloodGroup"
                value={filters.bloodGroup}
                onChange={handleFilterChange}
                className="w-full p-3 border-2 border-red-100 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                required
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg} className="py-2">
                    {bg} {bg.includes('+') ? 'Positive' : 'Negative'}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Select District
              </label>
              <select
                name="district"
                value={filters.district}
                onChange={handleFilterChange}
                className="w-full p-3 border-2 border-red-100 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300"
              >
                <option value="">All Districts of Bangladesh</option>
                {allDistricts.sort().map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => handleSearch(1)}
              disabled={loading || !filters.bloodGroup}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  🔍 Search Donors
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-900">
              Available Donors
              {totalDonors > 0 && (
                <span className="ml-3 text-red-600 bg-red-50 px-3 py-1 rounded-full text-base">
                  {totalDonors} found
                </span>
              )}
            </h2>
            
            {/* Sort Info */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-red-50 px-3 py-2 rounded-lg">
              📅 Sorted by recent blood donation
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : donors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-red-300 text-4xl">🩸</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                No donors found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {filters.bloodGroup 
                  ? `No ${filters.bloodGroup} donors found in ${filters.district || "Bangladesh"}.`
                  : "Please select a blood group to start searching."}
              </p>
            </div>
          ) : (
            <>
              {/* Donor Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donors.map((item, index) => {
                  const donor = item.donor || item;
                  
                  return (
                    <div 
                      key={donor.id} 
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-100 overflow-hidden group"
                    >
                      {/* Blood Group Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                          {donor.bloodGroup}
                        </div>
                      </div>

                      {/* Donation Date Badge */}
                      {donor.lastDonationDate && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg font-semibold text-sm shadow-lg">
                            🩸 {formatDate(donor.lastDonationDate)}
                          </div>
                        </div>
                      )}

                      {/* Donor Info */}
                      <div className="p-6 pt-12">
                        {/* Avatar Section */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-20 h-20 rounded-full flex items-center justify-center overflow-hidden ${getRandomColor()}`}>
                            {donor.photoUrl ? (
                              <img 
                                src={donor.photoUrl} 
                                alt={donor.user?.fullName || "Donor"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center">
                                <span className="text-2xl font-bold text-red-700">
                                  {donor.user?.fullName?.charAt(0) || "D"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                              {donor.user?.fullName || "Anonymous Donor"}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              👤 {donor.age ? `${donor.age} years` : "Age not specified"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              📍 {donor.presentDistrict || "District not specified"}
                            </p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3 mb-6">
                          {donor.phone && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-500">📞</span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Phone Number</p>
                                <a 
                                  href={`tel:${donor.phone}`}
                                  className="font-semibold text-gray-800 hover:text-red-600 transition-colors"
                                >
                                  {donor.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          {donor.email && (
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                <span className="text-red-500">✉️</span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Email Address</p>
                                <a 
                                  href={`mailto:${donor.email}`}
                                  className="font-semibold text-gray-800 hover:text-red-600 transition-colors"
                                >
                                  {donor.email}
                                </a>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-50">
                          <div>
                            <p className="text-sm text-gray-500">📍 District</p>
                            <p className="font-semibold text-gray-800">
                              {donor.presentDistrict || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">🩸 Last Donation</p>
                            <p className={`font-semibold ${donor.lastDonationDate ? 'text-green-600' : 'text-yellow-600'}`}>
                              {getTimeSinceLastDonation(donor.lastDonationDate)}
                            </p>
                          </div>
                        </div>

                        {/* Call to Action */}
                        <button className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 group-hover:shadow-md flex items-center justify-center gap-2">
                          📞 Contact Donor
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-gray-600">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalDonors)} of {totalDonors} donors
                    <span className="ml-2 text-red-600">• Sorted by recent donors first</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                              page === pageNum
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && page < totalPages - 2 && (
                        <>
                          <span className="text-red-400">...</span>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="w-10 h-10 rounded-xl text-red-600 hover:bg-red-50 font-semibold"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">🚨 Need Immediate Help?</h3>
              <p className="opacity-90">
                For emergency blood requirements, please contact our 24/7 helpline
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">+880 123-456-7890</div>
              <p className="text-sm opacity-80">24/7 Emergency Helpline</p>
            </div>
          </div>
        </div>

        {/* District Info */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>📌 Showing donors from all 64 districts of Bangladesh</p>
        </div>
      </div>
    </div>
  );
}