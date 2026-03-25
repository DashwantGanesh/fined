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

export default function Applicants() {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // track which app is being updated

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
        toast.success(`Status updated to ${newStatus}`);
        // Update status locally without refetch
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

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-6">

          {/* Back button */}
          <button
            onClick={() => navigate("/admin/loans")}
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
              {/* Loan summary card */}
              <div className="bg-white rounded-2xl shadow p-6 mb-8">
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

              {/* Applicants heading */}
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Applicants</h2>

              {loan.applications?.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl shadow">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-medium">No applicants yet for this loan.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loan.applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                      {/* Applicant info */}
                      <div className="flex items-center gap-4">
                        {/* Avatar circle with initial */}
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
                          {app.applicant?.fullname?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {app.applicant?.fullname || "Unknown"}
                          </h4>
                          <p className="text-sm text-gray-500">{app.applicant?.email}</p>
                          <p className="text-xs text-gray-400">
                            📞 {app.applicant?.phoneNumber || "N/A"} •{" "}
                            💼 {app.applicant?.profile?.employment || "Not specified"}
                          </p>
                          <p className="text-xs text-gray-400">
                            Applied on {formatDate(app.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Status + dropdown */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Current status badge */}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(app.status)}`}>
                          {app.status}
                        </span>

                        {/* Change status dropdown */}
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
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
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