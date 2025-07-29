import express from "express";
import connectDB from "./utils/db.js";
import mongoose from "mongoose";

const app=express();
const port=3000;

//DB connection
connectDB();

app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})