import jwt from "jsonwebtoken"
import dotenv from "dotenv";


dotenv.config();



export const requireAuth=(req,res,next)=>{
    const token=req.cookies.jwt;



    if(!token){
        return res.status(404).json({
            status:"Failed",
            message:"Not authenticated"
        })
    }

    try {

        const decoded=jwt.verify(token, process.env.SECRET);

        req.userId=decoded.id;
        next();
        
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }

   

   
}





