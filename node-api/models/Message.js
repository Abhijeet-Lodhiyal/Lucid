const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    conversationId:String,
    senderId:String,
    message:String
},{timestamps:true})

module.exports = mongoose.model("Message",MessageSchema)