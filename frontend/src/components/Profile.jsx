import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();

  const [profileImage] = useState("https://github.com/shadcn.png");

  // ✅ Dynamic user state
  const [user, setUser] = useState(null);

  // ✅ Fetch user from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/user/profile",
          { withCredentials: true },
        );

        setUser(res.data.user);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  // ✅ Loading state
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-20 text-gray-600">
          Loading profile...
        </div>
      </>
    );
  }

  const applications = [
    {
      bank: "HDFC Bank",
      type: "Personal Loan",
      amount: 500000,
      status: "Under Review",
      date: "12 Sep 2025",
    },
    {
      bank: "Axis Bank",
      type: "Education Loan",
      amount: 800000,
      status: "Approved",
      date: "01 Sep 2025",
    },
  ];

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          {/* ================= PROFILE HEADER ================= */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={profileImage}
                  alt="profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  {user.fullname?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.fullname}
                </h2>
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
                {
                  label: "Employment",
                  value: user.profile?.employment || "Not Set",
                },
                {
                  label: "Monthly Income",
                  value:
                    user.profile?.employment === "Student"
                      ? "N/A"
                      : `₹${user.profile?.income || 0}`,
                },
                { label: "Email", value: user.email },
              ].map((item, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">
                    {item.value || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= LOAN APPLICATIONS ================= */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-6">
              Your Loan Applications
            </h3>

            <div className="space-y-4">
              {applications.map((app, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border rounded-xl p-5 hover:shadow-lg transition"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">{app.bank}</h4>
                    <p className="text-sm text-gray-600">
                      {app.type} • ₹{app.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Applied on {app.date}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor(
                      app.status,
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
