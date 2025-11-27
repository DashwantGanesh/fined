import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
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

  const submitHandler = async (e) =>{
    e.preventDefault();
    console.log(input);
  }

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
                    <Input type="radio" className={"cursor-pointer"} name="role" checked={input.role=="recipient"} onChange={changeEventHandler} value="recipient" />{" "}
                    Recipient
                  </label>
                  <label className="flex items-center gap-2">
                    <Input type="radio" className={"cursor-pointer"} name="role" checked={input.role=="bank"} onChange={changeEventHandler} value="bank" /> Bank
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

            <Button type="submit" className="w-full mt-6">Create Account</Button>

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
