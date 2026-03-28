import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // ✅ from .env
        console.log("MongoDB connected successfully!!");
    } catch (error) {
        console.log(error);
    }
}//v

export default connectDB;