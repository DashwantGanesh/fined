import express from "express";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";
import userRoute from "./routes/user.routes.js";
import loanRoute from "./routes/loan.routes.js";
import bankRoute from "./routes/bank.routes.js";
import applicationRoute from "./routes/application.routes.js";
import cookieParser from "cookie-parser";

const app=express();
const port=3000;

app.use(cookieParser());
app.use(express.json());  //Hey, if someone sends me data in JSON format (like { "name": "Ganesh" }), please read it, convert it into a JavaScript object, and put it inside req.body so I can use it.”
app.use("/api/v1/user",userRoute);
app.use("/api/v1/loan",loanRoute);
app.use("/api/v1/bank",bankRoute);
app.use("/api/v1/application",applicationRoute);


//DB connection
connectDB();

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})