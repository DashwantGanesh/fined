import express from "express";
import { applyLoan, checkApplication, getApplicants, getAppliedLoans, updateStatus } from "../controller/application.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated, applyLoan);
router.route("/get").get(isAuthenticated, getAppliedLoans);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/check/:id").get(isAuthenticated, checkApplication); // ✅ fixed

export default router;