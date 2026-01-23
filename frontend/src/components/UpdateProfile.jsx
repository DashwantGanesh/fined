import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    employment: "",
    income: ""
  });

  /* ----------------------------------------
     FETCH USER DATA (ON PAGE LOAD)
     ---------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/user/profile", 
          { withCredentials: true }
        );

        setFormData({
          name: res.data.user.name,
          phone: res.data.user.phone,
          employment: res.data.user.employment,
          income: res.data.user.income
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  /* ----------------------------------------
     HANDLE INPUT CHANGE
     ---------------------------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ----------------------------------------
     UPDATE PROFILE API CALL
     ---------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        "http://localhost:3000/api/v1/user/profile/update", // 🔴 REPLACE THIS API IF NEEDED
        {
          name: formData.name,
          phone: formData.phone,
          employment: formData.employment,
          income: formData.income
        },
        { withCredentials: true }
      );

      navigate("/profile");
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-12">
        <div className="max-w-xl mx-auto px-6">

          <div className="bg-white p-8 rounded-3xl shadow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Update Profile
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Keep your personal information up to date
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Employment Type
                </label>
                <select
                  name="employment"
                  value={formData.employment}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                >
                  <option value="">Select</option>
                  <option>Salaried</option>
                  <option>Self Employed</option>
                  <option>Student</option>
                  <option>Unemployed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Monthly Income (₹)
                </label>
                <input
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="px-5 py-2.5 rounded-xl border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>

        </div>
      </section>
    </>
  );
};

export default UpdateProfile;
