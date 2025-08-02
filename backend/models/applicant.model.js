import mongoose from "mongoose";


const applicationSchema=new mongoose.Schema({
    loan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Loan',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    },
},{timestamps:true});

export const Application=mongoose.model('Application',applicationSchema);