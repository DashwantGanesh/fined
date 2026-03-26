import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { APPLICATION_API_ENDPOINT } from "../utils/constant";

const STATUS_OPTIONS = ["pending", "approved", "rejected"];

const statusColor = (status) => {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "rejected") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

const statusIcon = (status) => {
  if (status === "approved") return "✅";
  if (status === "rejected") return "❌";
  return "⏳";
};

export default function Applicants() {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ Search + filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_ENDPOINT}/${loanId}/applicants`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setLoan(res.data.loan);
        }
      } catch (error) {
        toast.error("Failed to fetch applicants");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [loanId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);
      const res = await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Marked as ${newStatus}`);
        setLoan((prev) => ({
          ...prev,
          applications: prev.applications.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          ),
        }));
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // ✅ Filtered + searched applicants
  const filteredApplicants = loan?.applications?.filter((app) => {
    const matchesSearch =
      app.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  // ✅ Summary counts
  const counts = loan?.applications?.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0 }
  ) || { pending: 0, approved: 0, rejected: 0 };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-6">

          {/* Back */}
          <button
            onClick={() => navigate("/bank/loans")}
            className="text-blue-600 mb-6 cursor-pointer"
          >
            ← Back to Loans
          </button>

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading applicants...</div>
          ) : !loan ? (
            <div className="text-center text-gray-400 py-20">Loan not found.</div>
          ) : (
            <>
              {/* ===== Loan Summary Card ===== */}
              <div className="bg-white rounded-2xl shadow p-6 mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  {loan.bank?.name || "Bank"}
                </p>
                <h1 className="text-2xl font-bold text-gray-800">{loan.title}</h1>
                <p className="text-gray-500 mt-1 text-sm">{loan.description}</p>

                <div className="flex gap-6 mt-4 flex-wrap">
                  <div>
                    <p className="text-xs text-gray-400">Loan Amount</p>
                    <p className="font-semibold">₹{loan.loanAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Interest Rate</p>
                    <p className="font-semibold">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Tenure</p>
                    <p className="font-semibold">{loan.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Applicants</p>
                    <p className="font-semibold">{loan.applications?.length || 0}</p>
                  </div>
                </div>
              </div>

              {/* ===== Status Summary Pills ===== */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
                  <p className="text-sm text-yellow-600 mt-0.5">⏳ Pending</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
                  <p className="text-sm text-green-600 mt-0.5">✅ Approved</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
                  <p className="text-sm text-red-600 mt-0.5">❌ Rejected</p>
                </div>
              </div>

              {/* ===== Search + Filter ===== */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Filter by status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* ===== Applicants List ===== */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-700">
                  Applicants{" "}
                  <span className="text-gray-400 font-normal text-sm">
                    ({filteredApplicants.length} of {loan.applications?.length})
                  </span>
                </h2>
              </div>

              {loan.applications?.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No applicants yet for this loan.</p>
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium">No applicants match your search or filter.</p>
                  <button
                    onClick={() => { setSearch(""); setFilterStatus("all"); }}
                    className="mt-3 text-blue-600 underline text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplicants.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
                    >
                      {/* Applicant Info */}
                      <div className="flex items-center gap-4">
                        {/* Avatar with real photo or initial */}
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold flex-shrink-0 overflow-hidden">
                          {app.applicant?.profile?.avatar ? (
                            <img
                              src={app.applicant.profile.avatar}
                              alt={app.applicant.fullname}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            app.applicant?.fullname?.[0]?.toUpperCase() || "?"
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {app.applicant?.fullname || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                          <p className="text-xs text-gray-400">
                            📞 {app.applicant?.phoneNumber || "N/A"} •{" "}
                            💼 {app.applicant?.profile?.employment || "Not specified"}
                            {app.applicant?.profile?.employment !== "Student" &&
                              app.applicant?.profile?.income > 0 && (
                                <> • 💰 ₹{app.applicant.profile.income.toLocaleString()}/mo</>
                              )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Applied on {formatDate(app.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Status + Dropdown */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(app.status)}`}>
                          {statusIcon(app.status)} {app.status}
                        </span>

                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="border rounded-lg px-3 py-1.5 text-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>

                        {updatingId === app._id && (
                          <svg className="animate-spin w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}