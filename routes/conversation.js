const convoRouter = require("express").Router()
const Conversation = require("../models/Conversation")


// Create a convo

convoRouter.post("/",async (req,res) => {
    try {
        const convo = new Conversation({
            members:[req.body.senderId,req.body.receiverId]
        })
        const result = await convo.save()
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json(error)
    }
})

convoRouter.get("/:userId", async (req,res) => {
    try {
            const convo = await Conversation.find({
                members : {$in : req.params.userId}
            })
            res.status(200).json(convo)
    } catch (error) {
        res.status(500).json(error)
    }
})

convoRouter.get("/:userId/:tappedId", async (req,res) => {
    try {
            const convo = await Conversation.find({
                members : {$all : [req.params.userId,req.params.tappedId]}
            })
            res.status(200).json(convo)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = convoRouter