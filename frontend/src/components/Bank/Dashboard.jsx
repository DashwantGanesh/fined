import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../shared/Navbar";
import { LOAN_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "../utils/constant";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${LOAN_API_ENDPOINT}/getAdminLoans`, {
          withCredentials: true,
        });
        if (res.data.success) setLoans(res.data.loans);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Compute stats from loans
  const totalLoans = loans.length;
  const totalApplicants = loans.reduce((sum, l) => sum + (l.applications?.length || 0), 0);

  // To get approved/rejected we need to look at applications — 
  // we compute from what's populated in getAdminLoans
  const allApplications = loans.flatMap((l) => l.applications || []);
  const approved = allApplications.filter((a) => a.status === "approved").length;
  const rejected = allApplications.filter((a) => a.status === "rejected").length;
  const pending = allApplications.filter((a) => a.status === "pending").length;

  const stats = [
    { label: "Total Loans Posted", value: totalLoans, icon: "🏦", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { label: "Total Applicants", value: totalApplicants, icon: "👥", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { label: "Approved", value: approved, icon: "✅", color: "bg-green-50 border-green-200 text-green-700" },
    { label: "Pending", value: pending, icon: "⏳", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { label: "Rejected", value: rejected, icon: "❌", color: "bg-red-50 border-red-200 text-red-700" },
  ];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6 space-y-8">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.fullname?.split(" ")[0]} 👋
            </h1>
            <p className="text-gray-500 mt-1">Here's an overview of your bank activity</p>
          </div>

          {/* ===== Stats Grid ===== */}
          {loading ? (
            <div className="text-center text-gray-400 py-10">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className={`border rounded-2xl p-5 text-center ${s.color}`}>
                    <p className="text-3xl mb-1">{s.icon}</p>
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="text-sm mt-1 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* ===== Quick Actions ===== */}
              <div className="grid sm:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/bank/post-loan")}
                  className="bg-blue-600 text-white rounded-2xl p-5 text-left hover:bg-blue-700 transition"
                >
                  <p className="text-2xl mb-2">➕</p>
                  <p className="font-semibold text-lg">Post New Loan</p>
                  <p className="text-sm text-blue-100 mt-1">List a new loan offer for applicants</p>
                </button>
                <button
                  onClick={() => navigate("/bank/loans")}
                  className="bg-white border rounded-2xl p-5 text-left hover:shadow-md transition"
                >
                  <p className="text-2xl mb-2">📋</p>
                  <p className="font-semibold text-lg text-gray-800">Manage Loans</p>
                  <p className="text-sm text-gray-500 mt-1">Edit or delete your posted loans</p>
                </button>
                <button
                  onClick={() => navigate("/bank/register")}
                  className="bg-white border rounded-2xl p-5 text-left hover:shadow-md transition"
                >
                  <p className="text-2xl mb-2">🏛️</p>
                  <p className="font-semibold text-lg text-gray-800">Register Bank</p>
                  <p className="text-sm text-gray-500 mt-1">Add a new bank to your account</p>
                </button>
              </div>

              {/* ===== Recent Loans ===== */}
              <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Loans</h2>
                  <button
                    onClick={() => navigate("/bank/loans")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View all →
                  </button>
                </div>

                {loans.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <p className="text-4xl mb-2">🏦</p>
                    <p>No loans posted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {loans.slice(0, 5).map((loan) => (
                      <div
                        key={loan._id}
                        onClick={() => navigate(`/bank/applicants/${loan._id}`)}
                        className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{loan.title}</p>
                          <p className="text-xs text-gray-400">
                            {loan.bank?.name} • ₹{loan.loanAmount?.toLocaleString()} • {loan.interestRate}% • Posted {formatDate(loan.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                            {loan.applications?.length || 0} applicants
                          </span>
                          <span className="text-gray-400">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}