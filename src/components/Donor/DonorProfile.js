import { useEffect, useState } from "react";
import {
  getMyDonorProfile,
  updateMyDonorProfile,
  uploadDonorPhoto,
} from "../../api/api";
// REMOVED: import { Input } from "postcss"; // This was causing the error

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const GENDERS = ["Male", "Female", "Other"];

export default function DonorProfile() {
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    bloodGroup: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    nationalIdNumber: "",
    presentAddress: "",
    presentPoliceStation: "",
    presentDistrict: "",
    permanentAddress: "",
    permanentPoliceStation: "",
    permanentDistrict: "",
    latitude: "",
    longitude: "",
    lastDonationDate: "",
    isAvailable: true,
    photoUrl: "",
    medicalInfo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getMyDonorProfile();
      setProfile(res.data);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setProfile((p) => ({
              ...p,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            }));
          },
          () => {}
        );
      }
    };
    fetchProfile();
  }, []);

  /* ================= REQUIRED VALIDATION ================= */
  const validateStep = () => {
    if (step === 1) {
      if (!profile.name || !profile.bloodGroup || !profile.gender || !profile.dateOfBirth) {
        alert("Please fill all required (*) fields");
        return false;
      }
    }
    if (step === 2) {
      if (
        !profile.phone ||
        !profile.email ||
        !profile.presentAddress ||
        !profile.presentDistrict
      ) {
        alert("Please fill all required (*) fields");
        return false;
      }
    }
    if (step === 3) {
      if (
        !profile.permanentAddress ||
        !profile.permanentDistrict ||
        !profile.latitude ||
        !profile.longitude
      ) {
        alert("Please fill all required (*) fields");
        return false;
      }
    }
    if (step === 4) {
      if (!profile.lastDonationDate || !profile.medicalInfo) {
        alert("Please fill all required (*) fields");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const saveProfile = async () => {
    if (!validateStep()) return;
    await updateMyDonorProfile(profile);
    alert("Profile saved successfully");
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    const fd = new FormData();
    fd.append("photo", photoFile);
    const res = await uploadDonorPhoto(fd);
    setProfile((p) => ({ ...p, photoUrl: res.data.photoUrl }));
  };

  /* ================= STEPS ================= */

  const steps = [
    <div key="step1" className="space-y-4">
      <div>
        <label className="font-medium block mb-2">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="font-medium block mb-2">
          Blood Group <span className="text-red-600">*</span>
        </label>
        <select
          value={profile.bloodGroup}
          onChange={(e) =>
            setProfile({ ...profile, bloodGroup: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Select</option>
          {BLOOD_GROUPS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium block mb-2">
          Gender <span className="text-red-600">*</span>
        </label>
        <select
          value={profile.gender}
          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value="">Select</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium block mb-2">
          Date of Birth <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          value={profile.dateOfBirth?.split("T")[0] || ""}
          onChange={(e) =>
            setProfile({ ...profile, dateOfBirth: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>,

    <div key="step2" className="space-y-4">
      <div>
        <label className="font-medium block mb-2">
          Phone <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Email <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Full Present Address <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.presentAddress}
          onChange={(e) =>
            setProfile({ ...profile, presentAddress: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Present District <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.presentDistrict}
          onChange={(e) =>
            setProfile({ ...profile, presentDistrict: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>,

    <div key="step3" className="space-y-4">
      <div>
        <label className="font-medium block mb-2">
          Full Permanent Address <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.permanentAddress}
          onChange={(e) =>
            setProfile({ ...profile, permanentAddress: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Permanent District <span className="text-red-600">*</span>
        </label>
        <input
          value={profile.permanentDistrict}
          onChange={(e) =>
            setProfile({ ...profile, permanentDistrict: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <div className="w-1/2">
          <label className="font-medium block mb-2">
            Latitude <span className="text-red-600">*</span>
          </label>
          <input
            placeholder="Latitude"
            value={profile.latitude}
            readOnly
            className="w-full border border-gray-300 p-2 rounded bg-gray-100"
          />
        </div>
        <div className="w-1/2">
          <label className="font-medium block mb-2">
            Longitude <span className="text-red-600">*</span>
          </label>
          <input
            placeholder="Longitude"
            value={profile.longitude}
            readOnly
            className="w-full border border-gray-300 p-2 rounded bg-gray-100"
          />
        </div>
      </div>
    </div>,

    <div key="step4" className="space-y-4">
      <div>
        <label className="font-medium block mb-2">
          Last Donation Date <span className="text-red-600">*</span>
        </label>
        <input 
          type="date"
          value={profile.lastDonationDate}
          onChange={(e) =>
            setProfile({ ...profile, lastDonationDate: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Medical Information <span className="text-red-600">*</span>
        </label>
        <textarea
          value={profile.medicalInfo}
          onChange={(e) =>
            setProfile({ ...profile, medicalInfo: e.target.value })
          }
          className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows="4"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">
          Upload your photo
        </label>
        <input 
          type="file" 
          onChange={(e) => setPhotoFile(e.target.files[0])}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="button"
          onClick={handlePhotoUpload}
          className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
        >
          Upload Photo
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold text-red-600 mb-6 mt-6">
        Donor Profile
      </h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                s === step ? 'bg-red-600 text-white' : 
                s < step ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {s}
              </div>
              <span className="text-sm">Step {s}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-red-600 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {steps[step - 1]}

      <div className="flex justify-between mt-6">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={saveProfile}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Save Profile
          </button>
        )}
      </div>
    </div>
  );
}