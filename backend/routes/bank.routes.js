import express from "express";
import { getBankById, getBanks, registerBank, updateBank } from "../controller/bank.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";



const router =express.Router();

router.route("/register").post(isAuthenticated,isAdmin,registerBank);
router.route("/get").get(isAuthenticated,isAdmin,getBanks);
router.route("/get/:id").get(isAuthenticated,isAdmin,getBankById);
router.route("/update/:id").get(isAuthenticated,isAdmin,updateBank);

export default router;