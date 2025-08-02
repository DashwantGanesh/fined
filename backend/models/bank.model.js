import mongoose from "mongoose";

const bankSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    website:[{
        type:String,
        required:true,
    }],
    logo:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});

export const Bank=mongoose.model("Bank",bankSchema);