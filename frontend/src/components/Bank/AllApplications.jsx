import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { LOAN_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "../utils/constant";

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

export default function AllApplications() {
  const navigate = useNavigate();
  const [allApps, setAllApps] = useState([]); // flat list of all apps across loans
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLoan, setFilterLoan] = useState("all");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch all loans by this admin
        const loansRes = await axios.get(`${LOAN_API_ENDPOINT}/getAdminLoans`, {
          withCredentials: true,
        });

        if (!loansRes.data.success) return;
        const loans = loansRes.data.loans;

        // For each loan, fetch its applicants and flatten into one list
        const appPromises = loans.map((loan) =>
          axios
            .get(`${APPLICATION_API_ENDPOINT}/${loan._id}/applicants`, {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.success) {
                // Attach loan info to each application
                return (res.data.loan.applications || []).map((app) => ({
                  ...app,
                  loanTitle: loan.title,
                  loanId: loan._id,
                  bankName: loan.bank?.name || "Bank",
                }));
              }
              return [];
            })
            .catch(() => [])
        );

        const nested = await Promise.all(appPromises);
        const flat = nested.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAllApps(flat);
      } catch (error) {
        toast.error("Failed to fetch applications");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

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
        setAllApps((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });

  // Unique loan titles for filter dropdown
  const uniqueLoans = [...new Map(allApps.map((a) => [a.loanId, { id: a.loanId, title: a.loanTitle }])).values()];

  // Filtered list
  const filtered = allApps.filter((app) => {
    const matchSearch =
      app.applicant?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    const matchLoan = filterLoan === "all" || app.loanId === filterLoan;
    return matchSearch && matchStatus && matchLoan;
  });

  // Summary counts
  const counts = allApps.reduce(
    (acc, app) => { acc[app.status] = (acc[app.status] || 0) + 1; return acc; },
    { pending: 0, approved: 0, rejected: 0 }
  );

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">All Applications</h1>
            <p className="text-gray-500 mt-1">Every application received across all your loans</p>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading applications...</div>
          ) : (
            <>
              {/* ===== Summary Pills ===== */}
              <div className="grid grid-cols-3 gap-4">
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

              {/* ===== Search + Filters ===== */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by applicant name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                {/* Filter by loan */}
                <select
                  value={filterLoan}
                  onChange={(e) => setFilterLoan(e.target.value)}
                  className="border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Loans</option>
                  {uniqueLoans.map((l) => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>

                {/* Filter by status */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Result count */}
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{filtered.length}</span> of{" "}
                <span className="font-medium text-gray-700">{allApps.length}</span> applications
              </p>

              {/* ===== Applications List ===== */}
              {allApps.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No applications received yet.</p>
                  <button onClick={() => navigate("/bank/loans")} className="mt-3 text-blue-600 underline text-sm">
                    View your loans
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="font-medium">No applications match your filters.</p>
                  <button
                    onClick={() => { setSearch(""); setFilterStatus("all"); setFilterLoan("all"); }}
                    className="mt-3 text-blue-600 underline text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold flex-shrink-0 overflow-hidden">
                          {app.applicant?.profile?.avatar ? (
                            <img src={app.applicant.profile.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            app.applicant?.fullname?.[0]?.toUpperCase() || "?"
                          )}
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800">{app.applicant?.fullname || "Unknown"}</h4>
                          <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                          <p className="text-xs text-gray-400">
                            📞 {app.applicant?.phoneNumber || "N/A"} •{" "}
                            💼 {app.applicant?.profile?.employment || "Not specified"}
                            {app.applicant?.profile?.employment !== "Student" &&
                              app.applicant?.profile?.income > 0 && (
                                <> • 💰 ₹{app.applicant.profile.income.toLocaleString()}/mo</>
                              )}
                          </p>
                          {/* ✅ Loan tag — unique to this page */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              onClick={() => navigate(`/bank/applicants/${app.loanId}`)}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full cursor-pointer hover:bg-blue-100 transition"
                            >
                              🏦 {app.bankName} — {app.loanTitle}
                            </span>
                            <span className="text-xs text-gray-400">Applied {formatDate(app.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status + dropdown */}
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
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
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