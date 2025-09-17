

export const isAdmin=async(req,res,next)=>{
    try {
        
        if(req.user.role !== "bank"){
        return res.status(403).json({
            message:"Access Denied.Bank Admins only",
            success:false
        });
    }
    next();
    } catch (error) {
        console.log(error);
    }

}