import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { BANK_API_ENDPOINT } from "../utils/constant";

export default function RegisterBank() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [form, setForm] = useState({
    bankName: "",
    description: "",
    website: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle logo file selection with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file)); // show preview instantly
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bankName.trim()) {
      toast.error("Bank name is required");
      return;
    }

    // Use FormData since we're sending a file
    const formData = new FormData();
    formData.append("bankName", form.bankName);
    formData.append("description", form.description);
    formData.append("website", form.website);
    formData.append("location", form.location);
    if (logoFile) {
      formData.append("file", logoFile); // multer expects "file"
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BANK_API_ENDPOINT}/register`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.data.success) {
        toast.success("Bank registered successfully!");
        navigate("/bank/loans");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to register bank";
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
        <div className="max-w-xl mx-auto px-6">

          <button
            onClick={() => navigate("/bank/loans")}
            className="text-blue-600 mb-6 cursor-pointer"
          >
            ← Back to Loans
          </button>

          <div className="bg-white rounded-2xl shadow p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Register Your Bank</h1>
              <p className="text-gray-500 text-sm mt-1">
                Register your bank to start posting loan offers for applicants.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ✅ Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Logo{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>

                <div className="flex items-center gap-5">
                  {/* Preview circle */}
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 transition overflow-hidden bg-gray-50 flex-shrink-0"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <svg className="w-7 h-7 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="text-sm text-blue-600 border border-blue-300 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                    >
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </button>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => { setLogoPreview(null); setLogoFile(null); }}
                        className="text-xs text-red-400 mt-1 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Bank"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="e.g. Leading private sector bank offering a wide range of financial services"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="e.g. https://www.hdfcbank.com"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Info note */}
              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                💡 Only Bank Name is required. You can update other details later from bank settings.
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register Bank"}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}