import jwt from "jsonwebtoken";
import env from "dotenv";
import { User } from "../models/user.model";
env.config();

//registration User
export const register = async (req,res) =>{
    try {
        const {fullname,email,phoneNumber,password}=req.body;
        if(!fullname || !email || !phoneNumber || !password){
           return req.status(400).json({
                message:"Data incomplete",
                success:false,
            })
        }
           const user= await User.findOne({email});
             if(user){
                return req.status(400).json({
                    message:"User already exist.",
                    success:false,
                })
           }

        const hashedPassword= await bcrypt.hash(password,10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
        });

        return res.status(201).json({
            message:"Account created successfully.",
            success:true,
        })

    } catch (error) {
        console.log(error);
    }
}

//login
export const login=async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return req.status(400).json({
                message:"Data incomplete",
                success:false
            });
        }
        //checking if the email is correct
        let user=await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Incorrect email."})
        }
        //checking if password is correct
        const isPasswordMatched= await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.status(400).json({message:"Incorrect Password"});
        }

        //creating token
        const tokenData={
            userId:user._id,
        };

        const token= jwt.sign(tokenData,process.env.SECRET_KEY,{
            expiresIn:"1D",
        });

        user={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            profile:user.profile
        }

        return res.status(200).cookie("token",token,{
            maxAge:1*24*60*60*1000,
            httpsOnly:false,
            sameSite:"strict",
        }).json({
            message:`Welcome back ${user.fullname}.`,
            success:true,
            token,
            userData:user,
        });
    } catch (error) {
        console.log(error);
    }
}

//creating logout logic

export const logout= async(req,res) =>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({  //emptied the token hence logged out.
            message:"Logged out successfully!",
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}

//updating the user

export const updateProfile= async(req,res)=>{
    try {
        const { fullname, email, phoneNumber, course } = req.body;
        const file=req.file   
       
       
        
        const userId=req.id;  

        let user=await User.findById(userId);
        //updating the data and can update only single.

      if(fullname) user.fullname=fullname
      if(email) user.email=email
      if(phoneNumber) user.phoneNumber=phoneNumber
      if(course) user.profile.course=course

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profile: user.profile,
          };

          return res.status(200).json({
            message:"Profile Updated Successfully!",
            user,
            success:true,
          })

    } catch (error) {
        console.log(error)
    }
}