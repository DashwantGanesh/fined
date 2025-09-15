import express from "express";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";
import UserRoute from "./routes/user.route.js"
import cookieParser from "cookie-parser";

const app=express();
const port=3000;

app.use(cookieParser());
app.use(express.json());  //Hey, if someone sends me data in JSON format (like { "name": "Ganesh" }), please read it, convert it into a JavaScript object, and put it inside req.body so I can use it.”
app.use("/api/v1/user",UserRoute);

//DB connection
connectDB();

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})