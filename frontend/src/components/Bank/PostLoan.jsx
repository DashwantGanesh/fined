import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { LOAN_API_ENDPOINT } from "../utils/constant";

// Bank API endpoint — add this to your constant.js if not already there
const BANK_API_ENDPOINT = "http://localhost:3000/api/v1/bank";

export default function PostLoan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    loanAmount: "",
    interestRate: "",
    tenure: "",
    bankId: "",
  });

  // ✅ Fetch banks registered by this admin for the dropdown
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await axios.get(`${BANK_API_ENDPOINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setBanks(res.data.banks);
          // Auto-select first bank if only one
          if (res.data.banks.length === 1) {
            setForm((prev) => ({ ...prev, bankId: res.data.banks[0]._id }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch banks:", error);
        toast.error("Could not load your banks. Please register a bank first.");
      } finally {
        setBanksLoading(false);
      }
    };
    fetchBanks();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.title || !form.description || !form.loanAmount || !form.interestRate || !form.tenure) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!form.bankId) {
      toast.error("Please select a bank");
      return;
    }
    if (Number(form.interestRate) <= 0 || Number(form.interestRate) > 50) {
      toast.error("Interest rate must be between 0 and 50%");
      return;
    }
    if (Number(form.tenure) <= 0) {
      toast.error("Tenure must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${LOAN_API_ENDPOINT}/post`,
        {
          title: form.title,
          description: form.description,
          loanAmount: Number(form.loanAmount),
          interestRate: Number(form.interestRate),
          tenure: Number(form.tenure),
          bankId: form.bankId,
        },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Loan posted successfully!");
        navigate("/bank/loans");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to post loan";
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-2xl mx-auto px-6">

          {/* Back */}
          <button
            onClick={() => navigate("/bank/loans")}
            className="text-blue-600 mb-6 cursor-pointer"
          >
            ← Back to Loans
          </button>

          <div className="bg-white rounded-2xl shadow p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Post a New Loan</h1>
            <p className="text-gray-500 text-sm mb-8">
              Fill in the details below to list a new loan offer for applicants.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bank <span className="text-red-500">*</span>
                </label>
                {banksLoading ? (
                  <p className="text-sm text-gray-400">Loading banks...</p>
                ) : banks.length === 0 ? (
                  <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                    No banks registered.{" "}
                    <span
                      className="underline cursor-pointer"
                      onClick={() => navigate("/bank/register")}
                    >
                      Register a bank first
                    </span>
                  </div>
                ) : (
                  <select
                    name="bankId"
                    value={form.bankId}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Select a bank --</option>
                    {banks.map((bank) => (
                      <option key={bank._id} value={bank._id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Student Loan for Engineering"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Upto ₹10L at 9.5% for Indian colleges"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* Loan Amount + Interest Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loan Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={form.loanAmount}
                    onChange={handleChange}
                    placeholder="e.g. 500000"
                    min="1"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interest Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="interestRate"
                    value={form.interestRate}
                    onChange={handleChange}
                    placeholder="e.g. 9.5"
                    min="0.1"
                    max="50"
                    step="0.1"
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tenure (months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tenure"
                  value={form.tenure}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  min="1"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-xs text-gray-400 mt-1">Enter number of months (e.g. 12, 24, 60)</p>
              </div>

              {/* Live EMI Preview */}
              {form.loanAmount && form.interestRate && form.tenure && (
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Estimated Monthly EMI</p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{(() => {
                      const r = Number(form.interestRate) / 12 / 100;
                      const n = Number(form.tenure);
                      const p = Number(form.loanAmount);
                      if (r === 0) return Math.round(p / n).toLocaleString();
                      return Math.round(
                        (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
                      ).toLocaleString();
                    })()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Visible to applicants on the compare page</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || banks.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Loan"}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}