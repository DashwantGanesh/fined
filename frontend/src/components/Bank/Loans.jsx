import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { LOAN_API_ENDPOINT } from "../utils/constant";

export default function Loans() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editLoan, setEditLoan] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { fetchLoans(); }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${LOAN_API_ENDPOINT}/getAdminLoans`, { withCredentials: true });
      if (res.data.success) setLoans(res.data.loans);
    } catch (error) {
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (loan) => {
    setEditLoan(loan);
    setEditForm({ title: loan.title, description: loan.description, loanAmount: loan.loanAmount, interestRate: loan.interestRate, tenure: loan.tenure });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      const res = await axios.put(`${LOAN_API_ENDPOINT}/update/${editLoan._id}`, editForm, { withCredentials: true });
      if (res.data.success) {
        toast.success("Loan updated!");
        setLoans((prev) => prev.map((l) => l._id === editLoan._id ? { ...l, ...editForm } : l));
        setEditLoan(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await axios.delete(`${LOAN_API_ENDPOINT}/delete/${deleteId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Loan deleted");
        setLoans((prev) => prev.filter((l) => l._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Posted Loans</h1>
              <p className="text-gray-500 mt-1">All loans you have listed</p>
            </div>
            <button onClick={() => navigate("/bank/post-loan")} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              + Post New Loan
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-20">Loading loans...</div>
          ) : loans.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏦</p>
              <p className="text-lg font-medium">No loans posted yet.</p>
              <button onClick={() => navigate("/bank/post-loan")} className="mt-4 text-blue-600 underline text-sm">Post your first loan</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loans.map((loan) => (
                <div key={loan._id} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{loan.bank?.name || "Bank"}</p>
                      <h3 className="text-lg font-semibold text-gray-800 mt-0.5">{loan.title}</h3>
                    </div>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
                      {loan.applications?.length || 0} applicants
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{loan.description}</p>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div><p className="text-xs text-gray-400">Loan Amount</p><p className="font-semibold text-gray-800">₹{loan.loanAmount?.toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-400">Interest Rate</p><p className="font-semibold text-gray-800">{loan.interestRate}%</p></div>
                    <div><p className="text-xs text-gray-400">Tenure</p><p className="font-semibold text-gray-800">{loan.tenure} months</p></div>
                    <div><p className="text-xs text-gray-400">Posted On</p><p className="font-semibold text-gray-800">{formatDate(loan.createdAt)}</p></div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => navigate(`/bank/applicants/${loan._id}`)} className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-xl hover:bg-blue-50 transition text-sm font-medium">
                      👥 Applicants ({loan.applications?.length || 0})
                    </button>
                    <button onClick={() => openEdit(loan)} className="px-3 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-sm" title="Edit">✏️</button>
                    <button onClick={() => setDeleteId(loan._id)} className="px-3 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition text-sm" title="Delete">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Edit Modal */}
      {editLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Edit Loan</h2>
              <button onClick={() => setEditLoan(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3} className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (₹)</label>
                  <input type="number" value={editForm.loanAmount} onChange={(e) => setEditForm({ ...editForm, loanAmount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <input type="number" step="0.1" value={editForm.interestRate} onChange={(e) => setEditForm({ ...editForm, interestRate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenure (months)</label>
                <input type="number" value={editForm.tenure} onChange={(e) => setEditForm({ ...editForm, tenure: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditLoan(null)} className="flex-1 border py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-60">
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <p className="text-4xl mb-3">🗑️</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Loan?</h2>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete this loan and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm hover:bg-red-600 transition disabled:opacity-60">
                {deleteLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}