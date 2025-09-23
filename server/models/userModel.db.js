import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";


const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:[true,"Full Name is required"],
        maxlength:[100,'Full Name cannot exceeds 100 character'],
        minlength:[3,"Full Name must be at least 3 characters"],
        unique:[false]

    },

    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"This email is already in use. Try another one"]
    },
    password:{
        type:String,
        required:[true,"Please enter a password"],

    }

})


userSchema.statics.signup=async function(fullName,email,password){
    if(!fullName || !email || !password){
        throw new Error("All fields must be filled. Try again")
    }

    const isEmailExists=await this.findOne({email});

    if(isEmailExists){
        throw new Error("This email is already registered. Try another one")
    }

    const salt= await bcrypt.genSalt(10);
    const hash=await bcrypt.hash(password,salt);

    const user=await this.create({fullName,email,password:hash})

    return user;
}


userSchema.statics.login=async function(email,password){
    if(!email || !password){
        throw new Error("All fields must be filled. Try again")

    }

    const user= await this.findOne({email});
    console.log("email", user)

    if(!user){
        throw new Error("Incorrect Email. Please try again")
    }

    console.log(password)
    console.log(user.password)

    const match=await bcrypt.compare(password, user.password)
    console.log("match",match)

    if(!match){
        throw new Error("Incorrect password. Please try again")

    }

    return user
}



const User=new mongoose.model("User", userSchema)

export default User;
