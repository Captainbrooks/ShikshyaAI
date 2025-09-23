import User from "../models/userModel.db.js"
import generateToken from "../authentication/token.js"

export const Signup=async(req,res)=>{
    const {fullName,email,password}=req.body;

    console.log(fullName,email,password)


    try {

        const user=await User.signup(fullName,email,password);

        if(!user){
            return res.status(400).json({
                status:"failed",
                message:"Couldn't create a user"
            });
        }

        const token= generateToken(user._id)
        console.log(token);

        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.status(201).json({
            status:"success",
            user,
            token
        })
        
    } catch (error) {
         console.log(error);

        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }


}



export const Login=async(req,res)=>{
    const {email,password}=req.body;
    console.log("email ", email)
    console.log("password ", password)

    try {
        const user=await User.login(email,password);
        if(!user){
            return res.status(404).json({
                status:"failed",
                message:"Couldn't found the user with given credentials"
            })
        }

        const token=generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        
        res.status(200).json({
            status:"Success",
            user,
            token
        })
    } catch (error) {
         console.log(error.message);
        res.status(500).json({
            status: "failed",
            error: error.message
        })
    }


}

export default {Signup, Login}