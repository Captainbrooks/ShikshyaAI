import express from "express"
import OpenAI from "openai"
import Chat from "../models/Chat.db.js"
import { requireAuth } from "../authentication/requireAuth.js";

const router = express.Router();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });




router.post("/chat", requireAuth ,async (req, res) => {

    const { chatId, messages } = req.body;
    const userId=req.userId;

    console.log("chatId", chatId)

    console.log("userId", userId)

    if (!userId || !messages) {
        return res.status(400).json({
            error: "Missing userId or messages"
        })
    }

    try {

        // sending to OpenAI

        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {

                    role: "system",
                    content: "You are a friendly AI tutor. Always answer in simple English. Use code blocks for code."
                },
                ...messages

            ],
            max_tokens:500
        });


        const answer=response.choices[0].message.content;

        let chat;

        // if chatId exists
        if(chatId){
          chat=await Chat.findById(chatId);

          if(!chat){
            return res.status(404).json({
                error:"Chat not found"
            })
          }

          chat.messages.push(
            {role:"user", text:messages[messages.length -1].content},
            {role:"assistant", text: answer}
          );


          chat.updatedAt=Date.now();
          await chat.save();

        }else{
            // New Chat

            chat=await Chat.create({
                userId,
                messages:[
                    {role:'user', text:messages[messages.length -1].content},
                    {role:'assistant', text:answer}
                ]
            });



            const titleResponse=await client.chat.completions.create({
                model:"gpt-4o-mini",
                messages:[
                    {role:'system', content: "You are a title generator. Summarize the following conversation in 3-5 words suitable as a chat title."},
                    {role:"user",content:JSON.stringify(messages)}
                ],
                max_tokens:20
            });

            const chatTitle=titleResponse.choices[0].message.content.trim();

            chat.title=chatTitle;
            await chat.save();
        }


        return res.json({
            chatId: chat._id,
            title:chat.title,
            answer,
            messages:chat.messages
        });


    } catch (error) {

        console.log(error);
        res.status(500).json({
            error:"Something went wrong"
        });

    }
});

// start a new chat

router.post("/chat/new" ,requireAuth ,async (req, res) => {
    console.log("new route is activated")
    try {
        const  userId  = req.userId;
        console.log("user id ", userId)
        const chat = await Chat.create({ userId, messages: [] });
        res.json({chatId: chat._id})

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})









router.post("/:id/message", async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const chat = await Chat.findById(id);
        if (!chat) return res.status(404).json({ error: "Chat not found." });

        // Add user message to the chat

        chat.messages.push({ role: 'user', text: message });

        // Get AI response
        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            input: message

        });

        const ai_reply = response.output_text;

        chat.messages.push({ role: 'bot', text: ai_reply });
        chat.updatedAt = Date.now();

        await chat.save()

        res.json({ reply: ai_reply, chat })
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
})





router.get("/get-chats",requireAuth, async (req, res) => {
    try {
        const  userId  = req.userId;

        const chats=await Chat.find({userId:userId}).sort({updatedAt: -1})

        res.json({
            chats
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



export default router;