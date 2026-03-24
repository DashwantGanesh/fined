import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";

export default function LoanDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="p-10 text-center">
        <p>Invalid Loan Selection</p>
        <button
          onClick={() => navigate("/compare")}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { loan, loanType, amount, emi } = state;

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-6">

          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 mb-6 cursor-pointer"
          >
            ← Back to comparison
          </button>

          <div className="bg-white p-8 rounded-2xl shadow space-y-6">
            
            {/* ✅ FIX 1: bank.name instead of object */}
            <h1 className="text-3xl font-bold">
              {loan?.bank?.name || "Bank"} – {loanType}
            </h1>

            <p className="text-gray-600">
              {loan.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-semibold">
                  ₹{loan.loanAmount.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                
                {/* ✅ FIX 2: interestRate instead of rate */}
                <p className="font-semibold">{loan.interestRate}%</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-semibold">{loan.tenure} months</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Processing Fee</p>
                
                {/* ✅ FIX 3: fallback (since fee not in DB) */}
                <p className="font-semibold">
                  ₹{loan.processingFee || "N/A"}
                </p>
              </div>

            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-600">Estimated EMI</p>
              <p className="text-2xl font-bold text-blue-700">
                ₹{emi.toLocaleString()}
              </p>
            </div>

            {/* ✅ Optional: show bank website */}
            {loan?.bank?.website && (
              <a
                href={loan.bank.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-600 underline"
              >
                Visit Bank Website
              </a>
            )}

            <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
              Apply for this Loan
            </button>

          </div>

        </div>
      </section>
    </>
  );
}