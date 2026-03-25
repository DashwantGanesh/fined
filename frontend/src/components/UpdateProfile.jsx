import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./shared/Navbar";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    employment: "",
    income: ""
  });

  /* ----------------------------------------
     FETCH USER DATA
  ---------------------------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/user/profile",
          { withCredentials: true }
        );

        const user = res.data.user;

        setFormData({
          fullname: user.fullname || "",
          phoneNumber: user.phoneNumber || "",
          employment: user.profile?.employment || "",
          income: user.profile?.income || ""
        });

      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  /* ----------------------------------------
     HANDLE CHANGE
  ---------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ if student → clear income
    if (name === "employment" && value === "Student") {
      setFormData({
        ...formData,
        employment: value,
        income: ""
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  /* ----------------------------------------
     SUBMIT
  ---------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        "http://localhost:3000/api/v1/user/profile/update",
        {
          fullname: formData.fullname,
          phoneNumber: formData.phoneNumber,
          employment: formData.employment,
          income:
            formData.employment === "Student"
              ? 0
              : formData.income
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

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* FULL NAME */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                  required
                />
              </div>

              {/* EMPLOYMENT */}
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

              {/* INCOME */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Monthly Income (₹)
                </label>
                <input
                  type="number"
                  name="income"
                  value={formData.employment === "Student" ? "" : formData.income}
                  disabled={formData.employment === "Student"}
                  onChange={handleChange}
                  placeholder={
                    formData.employment === "Student"
                      ? "N/A (Not applicable)"
                      : "Enter income"
                  }
                  className="mt-1 w-full rounded-xl border px-4 py-2.5"
                />
              </div>

              {/* BUTTONS */}
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
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
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