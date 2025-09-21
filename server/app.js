import express from "express";
import dotenv from "dotenv";

dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dbConnection from "./dbConnection/dbconnection.js";
import chatRoutes from "./routes/chatRoutes.js"
import ChatDb from "./models/Chat.db.js";





const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

dbConnection();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


app.use("/api/chat",chatRoutes);


app.get("/", (req, res) => {
  res.send("ShikshyaAI backend is running");
});

app.post("/api/chat/", async (req, res) => {
  console.log("route activated")
  try {

    
    const { messages,userId,chatId} = req.body; // Expecting array of messages from frontend

    console.log("messages ", messages)
    console.log("chatid", chatId)

    
    return

    if (!messages || !messages.length)
      return res.status(400).json({ error: "No messages sent" });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "You are a friendly AI tutor. Always answer in simple English. Use code blocks for code." },
        ...messages,
      ],
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content;
    console.log("answer " + answer)
    let chat;

    if(chatId){
      chat=await ChatDb.findById({chatId});
      chat.messages.push(
        
        {  sender:'user', text:messages[messages.length -1].content},
        {sender:'bot', text:answer}
      );

      await chat.save();

        }else{
          chat=await ChatDb.create({
            userId,
            title:"New Chat",
            messages:[
              {sender:"user",text:messages[messages.length -1].content},
              {sender:'bot', text:answer}
            ]

          });
        }



      
    



    res.json({ answer, chatId:chatId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});




app.listen(PORT, () => {
  console.log(`ShikshyaAI server running on port ${PORT}`);
});
