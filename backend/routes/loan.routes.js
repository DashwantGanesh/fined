import express from "express";
import { getAdminLoans, getAllLoans, getLoanById, postLoan } from "../controller/loan.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";


const router=express.Router();     //create express router app for handling all routes within here

router.route("/post").post(isAuthenticated,postLoan);
router.route("/get").get(isAuthenticated,getAllLoans);
router.route("/get/:id").get(isAuthenticated,getLoanById);
router.route("/getAdminLoans").get(isAuthenticated,getAdminLoans);

export default router;