const messageRouter = require("express").Router()
const Message = require("../models/Message")


//send message
messageRouter.post("/",async (req,res) => {
    try {
        const newMessage = new Message(req.body)
        const sendMessage = await newMessage.save()
        res.status(200).json(sendMessage)
    } catch (error) {
        res.status(200).json()
    }
})


//get convo
messageRouter.get("/:convoId",async (req,res) => {
    try {
        const messages = await Message.find({conversationId:req.params.convoId})
        res.status(200).json(messages)
    } catch (error) {
        res.status(200).json(error)
    }
})

module.exports = messageRouter