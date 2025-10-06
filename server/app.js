import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dbConnection from "./dbConnection/dbconnection.js";
import chatRoutes from "./routes/chatRoutes.js"
import authRoutes from "./routes/authRoutes.js"





const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

dbConnection();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.use("/api",chatRoutes);
app.use("/api/user",authRoutes);


app.get("/", (req, res) => {
  res.send("ShikshyaAI backend is running");
});





app.listen(PORT, () => {
  console.log(`ShikshyaAI server running on port ${PORT}`);
});
