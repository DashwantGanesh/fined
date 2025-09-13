import express from "express";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";
import UserRoute from "./routes/user.route.js"

const app=express();
const port=3000;

app.use(express.json());
app.use("/user",UserRoute);

//DB connection
connectDB();

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})