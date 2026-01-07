import { useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./shared/Navbar";

export default function CompareLoans() {
  const { state } = useLocation();
  const loanType = state?.loanType || "Personal";
  const amount = state?.amount || 500000;

  const [sortBy, setSortBy] = useState("rate");

  const loanOffers = [
    { bank: "HDFC Bank", rate: 9.5, fee: 2000 },
    { bank: "ICICI Bank", rate: 10.2, fee: 1500 },
    { bank: "Axis Bank", rate: 9.8, fee: 1000 }
  ];

  // EMI calculation
  const calculateEMI = (rate) => {
    const monthlyRate = rate / 12 / 100;
    const tenureMonths = 60; // 5 years default

    return Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
    );
  };

  // Sorting logic
  const sortedLoans = [...loanOffers].sort((a, b) => {
    if (sortBy === "rate") return a.rate - b.rate;
    if (sortBy === "emi") return calculateEMI(a.rate) - calculateEMI(b.rate);
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
              const emi = calculateEMI(loan.rate);
              const isBest = i === 0;

              return (
                <div
                  key={i}
                  className={`relative bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1
                    ${isBest ? "border-2 border-blue-600" : ""}
                  `}
                >
                  {/* Best Badge */}
                  {isBest && (
                    <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      Best Choice
                    </span>
                  )}

                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {loan.bank}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    Interest Rate: <b>{loan.rate}%</b>
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    Processing Fee: ₹{loan.fee}
                  </p>

                  <p className="text-lg font-bold text-blue-700 mt-4">
                    EMI: ₹{emi.toLocaleString()}
                  </p>

                  <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Apply Now
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
