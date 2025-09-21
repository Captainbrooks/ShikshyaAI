import mongoose from "mongoose"



// mongodb username and password for ShikshyaAI


// miltongaire264_db_user
// iKR4e6G5qCHkASz4


// for each messages
const messageSchema=new mongoose.Schema({
    role:{type:String, enum:["user","bot"], required:true},
    text:{type:String,required:true},
    time:{type:Date, default:Date.now}
})


// for each Chat

const chatSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    chatId: { type: Number, required: true,unique:true },
    title: { type: String, default: "New Chat" },
    messages: [messageSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})


export default mongoose.model("Chat", chatSchema)




