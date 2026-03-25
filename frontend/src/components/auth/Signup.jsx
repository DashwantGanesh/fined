import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_ENDPOINT } from "../utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    employment: "", // ✅ ADD
    income: "",
    file: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const changeFileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files?.[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("employment", input.employment);
    formData.append(
      "income",
      input.employment === "Student" ? 0 : input.income,
    );
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", //You tell axios that you are sending images/files, so you set"Content-Type": "multipart/form-data".
        },
        withCredentials: true, //withCredentials: true means you want cookies (like tokens) to be included.
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />

      <div className="flex justify-center items-center py-12">
        <div className="bg-white shadow-xl rounded-xl flex w-[85%] max-w-5xl overflow-hidden">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-b from-blue-600 to-blue-400 text-white p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Create Your <br /> Account
            </h1>
            <p className="text-lg opacity-90">
              Join us and unlock the best financial assistance & banking
              experience.
            </p>
          </div>

          {/* Right Section (Form) */}
          <form onSubmit={submitHandler} className="w-1/2 p-10">
            <h2 className="font-semibold text-2xl mb-6">Sign Up</h2>

            <div className="my-4">
              <Label>Full Name</Label>
              <Input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                placeholder="Enter your name"
                className="mt-1"
              />
            </div>

            <div className="my-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="xyz@gmail.com"
                className="mt-1"
              />
            </div>
            <div className="my-4">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>

            <div className="my-4">
              <Label>Employment</Label>
              <select
                name="employment"
                value={input.employment}
                onChange={changeEventHandler}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="">Select</option>
                <option>Salaried</option>
                <option>Self Employed</option>
                <option>Student</option>
                <option>Unemployed</option>
              </select>
            </div>

            <div className="my-4">
              <Label>Monthly Income (₹)</Label>
              <Input
                type="number"
                name="income"
                value={input.employment === "Student" ? "" : input.income}
                disabled={input.employment === "Student"}
                onChange={changeEventHandler}
                placeholder={
                  input.employment === "Student"
                    ? "N/A (Not applicable)"
                    : "Enter income"
                }
                className="mt-1"
              />
            </div>

            <div className="my-4">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              <div>
                <Label className="block mb-1">Role</Label>
                <RadioGroup className="flex gap-3 mt-1">
                  <label className="flex items-center gap-2">
                    <Input
                      type="radio"
                      className={"cursor-pointer"}
                      name="role"
                      checked={input.role == "recipient"}
                      onChange={changeEventHandler}
                      value="recipient"
                    />{" "}
                    Recipient
                  </label>
                  <label className="flex items-center gap-2">
                    <Input
                      type="radio"
                      className={"cursor-pointer"}
                      name="role"
                      checked={input.role == "bank"}
                      onChange={changeEventHandler}
                      value="bank"
                    />{" "}
                    Bank
                  </label>
                </RadioGroup>
              </div>

              <div>
                <Label className="block mb-1">Profile</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {loading ? (
              <Button className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-6">
                Create Account
              </Button>
            )}

            <p className="text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-700 font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
