import express from "express";
import { applyLoan, checkApplication, getApplicants, getAppliedLoans, updateStatus } from "../controller/application.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// ✅ Static / specific routes FIRST
router.route("/apply/:id").post(isAuthenticated, applyLoan);
router.route("/get").get(isAuthenticated, getAppliedLoans);
router.route("/check/:id").get(isAuthenticated, checkApplication);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

// ✅ Dynamic pattern routes LAST
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

export default router;