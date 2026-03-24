import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./shared/Navbar";
import { useSelector } from "react-redux";

export default function CompareLoans() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const loanType = state?.loanType || "Personal";
  const amount = state?.amount || 500000;

  const [sortBy, setSortBy] = useState("rate");

  // ✅ FIX 1: Correct slice name
  const { allLoans } = useSelector((store) => store.loan);

  // ✅ FIX 2: Use Redux loans instead of static data
  const loanOffers = allLoans || [];

  // EMI calculation
  const calculateEMI = (rate) => {
    const monthlyRate = rate / 12 / 100;
    const tenureMonths = 60;

    return Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  };

  // ✅ FIX 3: Use interestRate from DB instead of rate
  const sortedLoans = [...loanOffers].sort((a, b) => {
    if (sortBy === "rate") return a.interestRate - b.interestRate;
    if (sortBy === "emi")
      return calculateEMI(a.interestRate) - calculateEMI(b.interestRate);
    return 0;
  });

  return (
    <>
      <Navbar />

      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Best {loanType} Loan Offers
            </h1>
            <p className="text-gray-600 mt-1">
              Loan Amount: ₹{amount.toLocaleString()}
            </p>
          </div>

          {/* Sort */}
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm"
            >
              <option value="rate">Sort by Interest Rate</option>
              <option value="emi">Sort by Lowest EMI</option>
            </select>
          </div>

          {/* Loan Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedLoans.map((loan, i) => {
              const emi = calculateEMI(loan.interestRate);
              const isBest = i === 0;

              return (
                <div
                  key={loan._id}
                  onClick={() =>
                    navigate("/loan-details", {
                      state: {
                        loan,
                        loanType,
                        amount,
                        emi
                      }
                    })
                  }
                  className={`cursor-pointer relative bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1
                    ${isBest ? "border-2 border-blue-600" : ""}
                  `}
                >
                  {isBest && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      Best Choice
                    </span>
                  )}

                  {/* ✅ FIX 4: Show dynamic bank name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {loan?.bank?.name || "Bank"}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Interest Rate: <b>{loan.interestRate}%</b>
                  </p>

                  <p className="text-lg font-bold text-blue-700 mt-4">
                    EMI: ₹{emi.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}