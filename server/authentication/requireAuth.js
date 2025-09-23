import jwt from "jsonwebtoken"
import dotenv from "dotenv";


dotenv.config();



const requireAuth=(req,res,next)=>{
    const authorization=req.headers.authorization;

    if(!authorization){
        return res.status(404).json({
            status:"Failed",
            message:"Authorization headers not found"
        })
    }

    const token= authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({
            status:"failed",
            message:"Invalid Token"
        })
    }

    jwt.verify(token,process.env.SECRET,(error,decodedToken)=>{
        if(error){
            console.log(error);
            return res.status(401).json({
                status:"Failed",
                error:error.message
            })
        }

        console.log(decodedToken)
        next();
    })
}


export default requireAuth;



