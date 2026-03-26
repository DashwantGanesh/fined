import express from "express";
import { getAdminLoans, getAllLoans, getAllSpLoans, getLoanById, postLoan, updateLoan, deleteLoan } from "../controller/loan.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, isAdmin, postLoan);
router.route("/get").get(isAuthenticated, getAllLoans);
router.route("/getS").get(isAuthenticated, getAllSpLoans);
router.route("/getAdminLoans").get(isAuthenticated, isAdmin, getAdminLoans);
router.route("/get/:id").get(isAuthenticated, getLoanById);
router.route("/update/:id").put(isAuthenticated, isAdmin, updateLoan);   // ✅ new
router.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteLoan); // ✅ new

export default router;