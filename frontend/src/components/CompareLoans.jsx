import { useLocation } from "react-router-dom";

export default function CompareLoans() {
  const { state } = useLocation();
  const loanType = state?.loanType || "Personal";
  const amount = state?.amount || 500000;

  const loanOffers = [
    { bank: "HDFC Bank", rate: 9.5 },
    { bank: "ICICI Bank", rate: 10.2 },
    { bank: "Axis Bank", rate: 9.8 }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Best {loanType} Loan Offers
      </h1>

      <p className="text-gray-600 mb-6">
        Loan Amount: ₹{amount.toLocaleString()}
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {loanOffers.map((loan, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg">{loan.bank}</h3>
            <p>Interest Rate: <b>{loan.rate}%</b></p>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
