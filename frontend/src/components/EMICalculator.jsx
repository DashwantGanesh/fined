import { useState } from "react";

export default function EMICalculator() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(5);

  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;

  const emi =
    (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          EMI Calculator
        </h2>

        <div className="bg-white rounded-2xl shadow-lg p-8 grid gap-8">
          
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">
                Loan Amount (₹)
              </label>
              <span className="text-blue-600 font-medium">
                ₹{amount.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min="50000"
              max="5000000"
              step="10000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">
                Interest Rate (%)
              </label>
              <span className="text-blue-600 font-medium">
                {rate}%
              </span>
            </div>

            <input
              type="range"
              min="5"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-semibold text-gray-700">
                Loan Tenure (Years)
              </label>
              <span className="text-blue-600 font-medium">
                {tenure} Years
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          {/* EMI Output */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-1">Estimated Monthly EMI</p>
            <p className="text-3xl font-bold text-blue-700">
              ₹{isFinite(emi) ? Math.round(emi).toLocaleString() : 0}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
