import { Loan } from "../models/loan.model.js";


//posting loan by a bank
export const postLoan=async(req,res)=>{
    try {
        const {title,description,loanAmount,interestRate,tenure,bankId}=req.body;
        const userId=req.id;

        if(!title || !description || !loanAmount || !interestRate ||!tenure){
           return res.status(400).json({
                message:"Data Incomplete",
                success:false
            })
        }

        const loan=await Loan.create({
            title,
            description,
            loanAmount:Number(loanAmount),
            interestRate:Number(interestRate),
            tenure,
            bank:bankId,
            created_by:userId,
        });

        return res.status(200).json({
            message:"New Loan Created Successfully!!",
            loan,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//getting loan by filter (student)

export const getAllLoans=async (req,res)=>{
    try {
        const keyword=req.query.keyword || "";
        const isNumeric = !isNaN(keyword);

        const query={
            $or:[                                 //or operator since we are filtering by multiple conditions
                {title:{$regex:keyword,$options:"i"}},  //$regex: keyword: This tells MongoDB to match the title field against the provided keyword using a regular expression (Regex). 
                {descriptions:{$regex:keyword,$options:"i"}}, //"i"=makes it case insensitive
                ...(isNumeric ? [{ tenure: parseInt(keyword) }] : [])
            ]
        };
        //query made
        //finding loan based on query
        const loans=await Loan.find(query).populate({  //populate used to replace referenced ObjectIds with actual document data.
            path:"bank"
        }).sort({createdAt:-1});  //Sorts the job results by the createdAt field in descending order (-1 means newest first).
        if(loans.length === 0){
            return res.status(400).json({
                message:"Loans not found",
                success:false
            })
        }
        //if jobs are found
        return res.status(200).json({
            loans,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//getting loan by id(student)
export const getLoanById=async (req,res)=>{
 try {
       const loanId=req.params.id;

    const loan=await Loan.findById(loanId).populate({
        path:"applications"
    });

    if(!loan){
       return res.status(400).json({
        message:"Loan not found",
        success:false
       });
    }

    return res.status(200).json({loan,success:true});
 } catch (error) {
    console.log(error);
 }
}

//getting loans created by admin(bank)

export const getAdminLoans=async(req,res)=>{
   try {
     const adminId=req.id;

    const loans=await Loan.find({created_by:adminId}).populate("bank")
            .sort({ createdAt: -1 });

    if(!loans){
       return res.status(400).json({
        message:"Loans not found",
        success:false,
       });
    }

    return res.status(200).json({loans,success:true});
   } catch (error) {
    console.log(error);
    
   }
}