import cloudinary from "cloudinary";             // For file uploads
import {Bank} from "../models/bank.model.js";       // Your Mongoose model
// import getDataUri from "../utils/dataUri.js";    // Utility to convert file buffer → Data URI


//registeration of bank
export const registerBank=async(req,res)=>{
    try {
        const {bankName}=req.body;

        if(!bankName){
            return res.status(400).json({
                message:"Bank Name is required",
                success:false
            });
        }
        let bank=await Bank.findOne({name:bankName});
        if(bank){
            return res.status(400).json({
                message:"Bank already exist",
                success:false
            });
        }
        //if not creating new bank and storing it
         bank=await Bank.create({
            name:bankName,
            userId:req.id
        });
        return res.status(201).json({
            message:"Bank registered successfully",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}

//getting banks posted by particular manager(user)
export const getBanks= async(req,res)=>{
    try {
    const userId=req._id;
    const banks=await Bank.find(userId);
    if(!banks){
        return res.status(404).json({
            message:"Banks not found",
            success:false
        });
    }

    return res.status(200).json({
        banks,
        success:true
    });
    } catch (error) {
        console.log(error);
    }
}

//getting bank by id
export const getBankById=async(req,res)=>{
    try {
        const bankId=req.params.id;  //:id from this url 
        const bank=await Bank.findById(bankId);     //mongo query

        if(!bank){
            return res.status(404).json({
                message:"Bank not found",
                success:false
            });
        }

        return res.status(200).json({
            bank,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

//updating bank info

export const updateBank=async(req,res)=>{
    try {
        const {name,description,website,location}=req.body;

    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content);

    //this how and where your logo file  will be saved in Db
    const logo=cloudResponse.secure_url;

    const updateData={name,description,website,location};

    const bank=await Bank.findByIdAndUpdate(req.params.id,updateData,{new:true});

    if(!bank){
        return res.status(404).json({
            message:"Bank not found",
            success:false
        });
    }
    return res.status(200).json({
        message:"Bank updated successfully",
        success:false
    });

    } catch (error) {
        console.log(error);
    }
}