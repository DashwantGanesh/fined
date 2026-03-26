import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_ENDPOINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);

        // ✅ Role-based redirect — INSIDE success block, AFTER setUser
        if (res.data.user.role === "bank") {
          navigate("/bank/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />

      <div className="flex justify-center items-center py-12">
        <div className="bg-white shadow-xl rounded-xl flex w-[85%] max-w-4xl overflow-hidden">
          {/* Left Section */}
          <div className="w-1/2 bg-gradient-to-b from-blue-600 to-blue-400 text-white p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 leading-tight">Welcome Back</h1>
            <p className="text-lg opacity-90">
              Login and continue exploring smart financial solutions.
            </p>
          </div>

          {/* Right Section */}
          <form onSubmit={submitHandler} className="w-1/2 p-10">
            <h2 className="font-semibold text-2xl mb-6">Login</h2>

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
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            {/* Role Selection */}
            <div className="my-4">
              <Label className="block mb-2">Role</Label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    name="role"
                    checked={input.role === "recipient"}
                    onChange={changeEventHandler}
                    value="recipient"
                    className="cursor-pointer"
                  />
                  Recipient
                </label>
                <label className="flex items-center gap-2">
                  <Input
                    type="radio"
                    name="role"
                    checked={input.role === "bank"}
                    onChange={changeEventHandler}
                    value="bank"
                    className="cursor-pointer"
                  />
                  Bank
                </label>
              </div>
            </div>

            {loading ? (
              <Button className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" className="w-full mt-6">
                Login
              </Button>
            )}

            <p className="text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-700 font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;