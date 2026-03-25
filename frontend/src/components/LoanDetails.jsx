import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoanDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checking, setChecking] = useState(true); // ✅ prevents flash

  const { loan, loanType, amount, emi } = state || {};

  useEffect(() => {
    if (!loan?._id) {
      setChecking(false); // ✅ don't get stuck if no loanId
      return;
    }

    const checkIfApplied = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/application/check/${loan._id}`, // ✅ port 3000
          { withCredentials: true }
        );
        console.log("check response:", res.data); // 👈 add this to debug
        if (res.data.success) {
          setHasApplied(res.data.hasApplied);
        }
      } catch (error) {
        console.error("Check application error:", error);
      } finally {
        setChecking(false); // ✅ done checking either way
      }
    };

    checkIfApplied();
  }, [loan?._id]);

  if (!state) {
    return (
      <div className="p-10 text-center">
        <p>Invalid Loan Selection</p>
        <button onClick={() => navigate("/compare")} className="mt-4 text-blue-600 underline">
          Go Back
        </button>
      </div>
    );
  }

  const handleApply = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/application/apply/${loan._id}`, // ✅ port 3000
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Loan applied successfully!");
        setHasApplied(true);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => navigate(-1)} className="text-blue-600 mb-6 cursor-pointer">
            ← Back to comparison
          </button>

          <div className="bg-white p-8 rounded-2xl shadow space-y-6">
            <h1 className="text-3xl font-bold">
              {loan?.bank?.name || "Bank"} – {loanType}
            </h1>
            <p className="text-gray-600">{loan.description}</p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-semibold">₹{loan.loanAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-semibold">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-semibold">{loan.tenure} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Processing Fee</p>
                <p className="font-semibold">₹{loan.processingFee || "N/A"}</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Estimated EMI</p>
              <p className="text-2xl font-bold text-blue-700">₹{emi.toLocaleString()}</p>
            </div>

            {loan?.bank?.website && (
              <a href={loan.bank.website} target="_blank" rel="noopener noreferrer"
                className="block text-center text-blue-600 underline">
                Visit Bank Website
              </a>
            )}

            {/* ✅ Show spinner while checking, then correct button */}
            {checking ? (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-3 rounded-xl cursor-not-allowed">
                Checking status...
              </button>
            ) : hasApplied ? (
              <button disabled className="w-full bg-green-100 text-green-700 border border-green-400 py-3 rounded-xl cursor-not-allowed">
                ✅ You have already applied for this loan
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Applying..." : "Apply for this Loan"}
              </button>
            )}

          </div>
        </div>
      </section>
    </>
  );
}