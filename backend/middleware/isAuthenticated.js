import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token=req.cookies.token;//looks for cookie(token)
        if(!token){//token not found
            return res.status(400).json({
                message:"User not authenticated",
                success:false
        })
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(400).json({
                message:"User not verified",
                success:false
            })
        }
        req.id=decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;