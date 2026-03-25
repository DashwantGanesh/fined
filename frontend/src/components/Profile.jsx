import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "./utils/constant";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [user, setUserState] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_ENDPOINT}/profile`, {
          withCredentials: true,
        });
        setUserState(res.data.user);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchProfile();
  }, []);

  // Fetch real loan applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setApplications(res.data.application);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setAppsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // ✅ Handle avatar photo change
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setAvatarUploading(true);
      const res = await axios.put(
        `${USER_API_ENDPOINT}/profile/update`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        setUserState(res.data.user);
        dispatch(setUser(res.data.user));
        toast.success("Profile photo updated!");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
      console.error(error);
    } finally {
      setAvatarUploading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const statusLabel = (status) => {
    if (status === "approved") return "✅ Approved";
    if (status === "rejected") return "❌ Rejected";
    return "⏳ Pending";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-gray-600">Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        className="hidden"
      />

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-10">

          {/* ================= PROFILE HEADER ================= */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">

              {/* ✅ Avatar with camera overlay on hover */}
              <div className="relative w-24 h-24 group">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={user.profile?.avatar || "https://github.com/shadcn.png"}
                    alt="profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {user.fullname?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Camera overlay */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {avatarUploading ? (
                    <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white text-xs mt-1">Change</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">{user.fullname}</h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  ✔ Verified User
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/update-profile")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* ================= PERSONAL INFO ================= */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Phone", value: user.phoneNumber },
                { label: "Employment", value: user.profile?.employment || "Not Set" },
                {
                  label: "Monthly Income",
                  value:
                    user.profile?.employment === "Student"
                      ? "N/A"
                      : `₹${user.profile?.income?.toLocaleString() || 0}`,
                },
                { label: "Email", value: user.email },
              ].map((item, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= LOAN APPLICATIONS ================= */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-6">Your Loan Applications</h3>

            {appsLoading ? (
              <div className="text-center text-gray-400 py-10">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-4xl mb-3">📭</p>
                <p className="font-medium">No loan applications yet.</p>
                <button
                  onClick={() => navigate("/compare")}
                  className="mt-4 text-blue-600 underline text-sm"
                >
                  Browse & apply for loans
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5 hover:shadow-lg transition"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {app.loan?.bank?.name || "Bank"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {app.loan?.title || "Loan"} • ₹{app.loan?.loanAmount?.toLocaleString() || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {app.loan?.interestRate}% interest • {app.loan?.tenure} months tenure
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied on {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap ${statusColor(app.status)}`}>
                      {statusLabel(app.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
}