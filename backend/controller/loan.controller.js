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
const keyword = req.query.keyword?.trim() || "";

let query = {};
const orConditions = [];

// ✅ Numeric search
if (!isNaN(keyword) && keyword !== "") {
  const tenureVal = parseInt(keyword, 10);
  const loanAmountVal = parseInt(keyword, 10);
  const interestRateVal = parseFloat(keyword);

  if (!isNaN(tenureVal)) orConditions.push({ tenure: tenureVal });
  if (!isNaN(loanAmountVal)) orConditions.push({ loanAmount: loanAmountVal });
  if (!isNaN(interestRateVal)) orConditions.push({ interestRate: interestRateVal });
}

// ✅ Text search (case-insensitive regex)
if (keyword && isNaN(keyword)) {
  orConditions.push(
    { title: { $regex: keyword, $options: "i" } },
    { description: { $regex: keyword, $options: "i" } },
    // If bank has "name", we need nested populate filtering → use aggregation or filter after populate
  );
}

// ✅ Only add $or if conditions exist
if (orConditions.length > 0) {
  query.$or = orConditions;
}

const loans = await Loan.find(query)
  .populate("bank")
  .sort({ createdAt: -1 });

if (loans.length === 0) {
  return res.status(400).json({
    message: "Loans not found",
    success: false,
  });
}

return res.status(200).json({
  loans,
  success: true,
});


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