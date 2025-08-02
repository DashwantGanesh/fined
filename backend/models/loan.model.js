import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //links to user
      required: true,
    },
    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bank",
      required: true,
    },
    title: {
      type: String,
      required: true, // e.g. "Student Loan for Engineering"
    },
    description: {
      type: String,
      required: true, // e.g. "Upto ₹10L at 9.5% for Indian colleges"
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    application: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

export const Loan = mongoose.model("Loan", loanSchema);
