import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['recipient','bank'],
        required:true
    },
    profile:{
        course:{type:String},
        courseDuration:{type:Number},
        aadharCard:{type:String},
        panCard:{type:String},
        bank:{type:mongoose.Schema.Types.ObjectId,ref:'Bank'},
        profilePhoto:{
            type:String,
            default:""
        }
    },

},{timeStamps:true});

export const User=mongoose.model("User",userSchema);