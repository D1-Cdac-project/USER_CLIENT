import React, { useEffect, useState, useRef } from "react";
import { Camera, Mail, Phone } from "lucide-react";
import { updateProfile, getUserDetails } from "../services/userService";
import toast from "react-hot-toast";

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Ladakh",
  "Jammu and Kashmir",
  "Puducherry",
];

const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: {
      state: "",
      city: "",
      pinCode: "",
      fullAddress: "",
    },
    profileImage: null as File | null,
    profileImageUrl: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUser = async () => {
    const userDetails = await getUserDetails();
    setProfileData((prev) => ({
      ...prev,
      ...userDetails.user,
      address: userDetails.user.address || prev.address,
      profileImage: null, // Reset file on load
      profileImageUrl: userDetails.user.profileImage || "",
    }));
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        profileImage: e.target.files[0],
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", profileData.fullName || "");
      formData.append("email", profileData.email || "");
      formData.append("phoneNumber", profileData.phoneNumber || "");
      if (profileData.address) {
        formData.append("address[state]", profileData.address.state || "");
        formData.append("address[city]", profileData.address.city || "");
        formData.append("address[pinCode]", profileData.address.pinCode || "");
        formData.append(
          "address[fullAddress]",
          profileData.address.fullAddress || ""
        );
      }
      if (profileData.profileImage) {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await updateProfile(formData);
      toast.success(response.message || "Profile updated successfully");
      // Refresh user data after update
      await getUser();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar section */}
          <div className="relative">
            <img
              src={profileData.profileImageUrl || "/default-avatar.png"} // Fallback image
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleFileClick}
              className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Profile form */}
          <div className="flex-1 space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Address Block */}
            <div className=" rounded-lg p-4 ">
              <h3 className="text-md font-semibold text-gray-700 mb-4">
                Address
              </h3>

              {/* State Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={profileData.address?.state}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Not specified">Not specified</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={profileData.address?.city}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  value={profileData.address?.fullAddress}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, fullAddress: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={profileData.address?.pinCode}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, pinCode: e.target.value },
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
