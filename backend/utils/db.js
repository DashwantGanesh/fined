import mongoose from "mongoose";

//mongodb connection
const connectDB = async() =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/FinEd");
        console.log("MongoDB connected successfully!!");
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;