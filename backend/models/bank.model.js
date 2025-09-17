import mongoose from "mongoose";

const bankSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        
    },
    website:[{
        type:String,
        
    }],
    logo:{
        type:String,
       
    },
    location:{
        type:String,
        
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true});

export const Bank=mongoose.model("Bank",bankSchema);