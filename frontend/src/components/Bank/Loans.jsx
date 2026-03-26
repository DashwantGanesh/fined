import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { LOAN_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "../utils/constant";

export default function Loans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminLoans = async () => {
      try {
        const res = await axios.get(`${LOAN_API_ENDPOINT}/getAdminLoans`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setLoans(res.data.loans);
        }
      } catch (error) {
        toast.error("Failed to fetch loans");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminLoans();
  }, []);

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
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Posted Loans</h1>
              <p className="text-gray-500 mt-1">All loans you have listed</p>
            </div>
            <button
              onClick={() => navigate("/bank/post-loan")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Post New Loan
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading loans...</div>
          ) : loans.length === 0 ? (
            // Empty state
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏦</p>
              <p className="text-lg font-medium">No loans posted yet.</p>
              <button
                onClick={() => navigate("/bank/post-loan")}
                className="mt-4 text-blue-600 underline text-sm"
              >
                Post your first loan
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <div
                  key={loan._id}
                  className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition space-y-3"
                >
                  {/* Bank + Title */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">
                        {loan.bank?.name || "Bank"}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-800 mt-0.5">
                        {loan.title}
                      </h3>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                      {loan.applications?.length || 0} applicants
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2">{loan.description}</p>

                  {/* Loan details grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-400">Loan Amount</p>
                      <p className="font-semibold text-gray-800">
                        ₹{loan.loanAmount?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Interest Rate</p>
                      <p className="font-semibold text-gray-800">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tenure</p>
                      <p className="font-semibold text-gray-800">{loan.tenure} months</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Posted On</p>
                      <p className="font-semibold text-gray-800">{formatDate(loan.createdAt)}</p>
                    </div>
                  </div>

                  {/* View Applicants button */}
                  <button
                    onClick={() => navigate(`/bank/applicants/${loan._id}`, { state: { loan } })}
                    className="w-full mt-2 border border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-50 transition text-sm font-medium"
                  >
                    View Applicants ({loan.applications?.length || 0})
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}