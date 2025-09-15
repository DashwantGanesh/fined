import { populate } from "dotenv";
import { Application } from "../models/applicant.model.js";
import { Loan } from "../models/loan.model.js";


export const applyLoan=async(req,res)=>{
    try {
        const userId=req.id;
    const loanId=req.params.id;

    //if loanId exist(bad request)
    if(!loanId){
        res.status(400).json({
            message:"Loan id not found",
            success:false
        });
    }

    //checking if user has already applied for loan
    const existingApplication=await Application.findOne({loan:loanId,applicant:userId});
    if(existingApplication){
        return res.status(400).json({
            message:"You have already applied for this loan",
            success:false
        });
    }
    //find the loan
    const loan=await Loan.findById(loanId);
    if(!loan){
        return res.status(400).json({
            message:"Loan not found",
            success:false
        });
    }
    //loan found ;create new application
    const newApplication=await Application.create({
        loan:loanId,
        applicant:userId
    });

    loan.applications.push(newApplication._id);
    await loan.save();

    return res.status(201).json({
        message:"Loan Applied successfully",
        success:false
    });
    } catch (error) {
        console.log(error);
    }
}

//getting applcations which myself as a user has applied
export const getAppliedLoans=async(req,res)=>{
    try {
        const userId=req.id;
        const application=(await Application.find({applicant:userId})).toSorted({createdAt:-1}).populate({
            path:"loan",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"bank",
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(400).json({
                message:"No Application",
                success:false
            });
        }
        return res.status(200).json({
            application,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

//getting applicants who have applied for loan posted by bank manager
export const getApplicants=async(req,res)=>{
    try {
        const loanId=req.params.is;
       const loan=await Loan.findById(loanId).populate({
        path:"applications",
        options:{sort:{createdAt:-1}},
        populate:{
            path:"applicant",
            options:{sort:{createdAt:-1}}
        }
       });
        if(!loan){
            return req.status(400).json({
                message:"Loan not found",
                success:false
            });
        }

        return res.status(200).json({
            loan,
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

//updating status(accepted or rejected)
export const updateStatus=async(req,res)=>{
    try {
        const {status}=req.body;
    const applicationId=req.params.id;
    if(!status){
        return res.status(400).json({
            message:"Status is required",
            success:false
        })
    }

    const application=await Application.findById({_id:applicationId});
    if(!application){
        return res.status(400).json({
            message:"Application not found",
            success:false
        });
    }
    application.status=status.toLowerCase();
    await application.save();
    
    return res.status(200).json({
        message:"Status updated successfully!",
        success:true
    });
    } catch (error) {
        console.log(error);
    }
}

