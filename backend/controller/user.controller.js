import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
env.config();

//registration User
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, employment, income } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Data incomplete",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE NEW USER (DON’T TOUCH existingUser.profile)
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        employment: employment || "",
        income: employment === "Student" ? 0 : income || 0,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Register failed",
      success: false,
    });
  }
};
//login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Data incomplete",
        success: false,
      });
    }
    //checking if the email is correct
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email." });
    }
    //checking if password is correct
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Incorrect Password" });
    }
    if (role != user.role) {
      return res.status(403).json({
        message: "Access Denied.Enter Valid Role",
        success: "false",
      });
    }

    //creating token
    const tokenData = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1D",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure:true,
      })
      .json({
        message: `Welcome back ${user.fullname}.`,
        success: true,
        token,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

//creating logout logic

export const logout = async (req, res) => {
  try {
   return res.status(200).cookie("token", "", {
  maxAge: 0,
  httpOnly: true,
  sameSite: "none",
  secure: true,
}).json({
  message: "Logged out successfully!",
  success: true,
});
  } catch (error) {
    console.log(error);
  }
};

//get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};



//updating the user

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, employment, income } = req.body;
    const userId = req.id;

    let user = await User.findById(userId);

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (employment) user.profile.employment = employment;
    if (income) user.profile.income = income;

    // ✅ Save avatar as base64 if file uploaded
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      const mimeType = req.file.mimetype; // e.g. image/jpeg
      user.profile.avatar = `data:${mimeType};base64,${base64}`;
    }

    await user.save();
    user = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile Updated Successfully!",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
