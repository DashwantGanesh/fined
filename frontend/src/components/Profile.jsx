import { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Ganesh Dashwant",
    email: "ganesh@email.com",
    phone: "9876543210",
    employment: "Salaried",
    income: "50,000"
  });

  const applications = [
    {
      bank: "HDFC Bank",
      type: "Personal Loan",
      amount: 500000,
      status: "Under Review",
      date: "12 Sep 2025"
    },
    {
      bank: "Axis Bank",
      type: "Education Loan",
      amount: 800000,
      status: "Approved",
      date: "01 Sep 2025"
    }
  ];

  const statusColor = (status) => {
    if (status === "Approved") return "bg-green-100 text-green-700";
    if (status === "Rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // 🔥 Later: call backend API here
    setIsEditing(false);
  };

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-10">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="profile"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  ✔ Verified User
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* PERSONAL INFO */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-6">
              Personal Information
            </h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Phone", value: user.phone },
                { label: "Employment", value: user.employment },
                { label: "Monthly Income", value: `₹${user.income}` },
                { label: "Email", value: user.email }
              ].map((item, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LOAN APPLICATIONS */}
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
                    <h4 className="font-semibold text-gray-800">
                      {app.bank}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {app.type} • ₹{app.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Applied on {app.date}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${statusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT MODAL */}
          {isEditing && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-scaleIn">

      {/* Header */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800">
          Edit Profile
        </h3>
        <p className="text-sm text-gray-500">
          Update your personal details below
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">

        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Full Name
          </label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter full name"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Phone Number
          </label>
          <input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Employment */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Employment Type
          </label>
          <select
            name="employment"
            value={user.employment}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option>Salaried</option>
            <option>Self Employed</option>
            <option>Student</option>
            <option>Unemployed</option>
          </select>
        </div>

        {/* Income */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Monthly Income (₹)
          </label>
          <input
            name="income"
            value={user.income}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. 50000"
          />
        </div>

      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => setIsEditing(false)}
          className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-md"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}


        </div>
      </section>
    </>
  );
}
