import express from "express";
import { getBankById, getBanks, registerBank, updateBank } from "../controller/bank.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, isAdmin, singleUpload, registerBank); // ✅ added singleUpload
router.route("/get").get(isAuthenticated, isAdmin, getBanks);
router.route("/get/:id").get(isAuthenticated, isAdmin, getBankById);
router.route("/update/:id").post(isAuthenticated, isAdmin, singleUpload, updateBank);

export default router;