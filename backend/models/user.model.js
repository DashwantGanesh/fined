import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true
    },

    email: {
      type: String,
      unique: true,
      required: true
    },

    phoneNumber: {
      type: String, // ✅ better as string (no formatting issues)
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["recipient", "bank"],
      required: true
    },

    // ✅ NEW: Profile fields
    profile: {
      employment: {
        type: String,
        enum: ["Salaried", "Self Employed", "Student", "Unemployed"],
        default: ""
      },

      income: {
        type: Number,
        default: 0
      },

      avatar: {
        type: String, // image URL (Cloudinary later)
        default: ""
      }
    }
  },
  { timestamps: true } // ✅ FIX (you had typo)
);

export const User = mongoose.model("User", userSchema);