import express from "express"
import {register,login,logout,updateProfile} from "../controller/user.controller.js"
import Authentication from "../middleware/isAuthenticated.js";

const router =express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/user/update").post(Authentication,updateProfile);

export default router;