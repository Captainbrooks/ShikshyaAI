import express from "express"
import OpenAI from "openai"
import Chat from "../models/Chat.db.js"

const router=express.Router();

const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

// start a new chat

router.post("/new", async(req,res)=>{
    console.log("new route is activated")
    try {
        const {userId}=req.body;
        console.log("user id ", userId)
        const chat= await Chat.create({userId, messages:[]});
        console.log("chat",chat)
        res.json(chat)
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})









router.post("/:id/message",async(req,res)=>{
    try {
        const {id}=req.params;
        const {message}=req.body;

        const chat=await Chat.findById(id);
        if(!chat) return res.status(404).json({error:"Chat not found."});

        // Add user message to the chat

        chat.messages.push({role:'user',text:message});

        // Get AI response
        const response=await client.responses.create({
            model:'gpt-4o-mini',
            input: message

        });

        const ai_reply=response.output_text;

        chat.messages.push({role:'bot', text:ai_reply});
        chat.updatedAt=Date.now();

        await chat.save()

        res.json({reply:ai_reply, chat})
    } catch (error) {
            res.status(500).json({ error: err.message });
    }
})





router.get("/user/:userId", async(req,res)=>{
    try {
        const {userId}=req.params;
        const chats=(await Chat.find({userId})).sort({updatedAt:-1})
        res.json(chats)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})



export default router;