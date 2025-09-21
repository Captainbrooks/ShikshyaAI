import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


console.log("connection string", process.env.MONGO_URI
 )

const connectionString=process.env.MONGO_URI

// setting up the database connection

const dbConnection= async ()=>{
try {
   await mongoose.connect(connectionString,{
    useNewUrlParser: true,
      useUnifiedTopology: true,
   })
    console.log("Database connected successfully")
    
} catch (error) {
    console.log(error)
}
}


export default dbConnection;
