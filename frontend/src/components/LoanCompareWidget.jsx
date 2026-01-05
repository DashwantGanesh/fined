import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoanCompareWidget() {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("Personal");
  const [amount, setAmount] = useState(500000);

  const handleCompare = () => {
    navigate("/compare", {
      state: { loanType, amount }
    });
  };

  return (
    <section className="bg-white shadow-md rounded-2xl max-w-5xl mx-auto p-6 -mt-16 relative z-10">
      <h2 className="text-xl font-semibold mb-4">Quick Loan Comparison</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <select
          className="border p-3 rounded-lg"
          onChange={(e) => setLoanType(e.target.value)}
        >
          <option>Personal</option>
          <option>Home</option>
          <option>Education</option>
          <option>Business</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-3 rounded-lg"
        />

        <button
          onClick={handleCompare}
          className="bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Compare
        </button>
      </div>
    </section>
  );
}
