const userRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/User")


// update user
userRouter.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, { $set: req.body })
            res.status(200).json("Account has been updated!")
        }
        catch (err) {
            return res.status(500).json(err)
        }
    }
    else {
        return res.status(403).json("You can only update your account!")
    }
})

//delete User
userRouter.put("/:id/delete", async (req, res) => {
    if (req.body.userId == req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.body.userId)
            res.status(200).json("Account deleted")
        }
        catch (err) {
            return res.status(500).json(err)
        }
    }
    else {
        return res.status(403).json("You can only delete your account!")
    }
})

// get user
userRouter.get("/", async (req, res) => {
    const username = req.query.username
    const userId = req.query.userId
    try {
        const user =  userId ? await User.findById(userId) : await User.findOne({username : username})
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other)
    }
    catch (err) {
        return res.status(400).json(err)
    }
})

// Online friends
userRouter.get("/friends/:userId", async (req,res) => {
    try{
        const user = await User.findById(req.params.userId)
        const friends = await Promise.all( user.following.map(async (friendId) => {
                return await User.findById(friendId)
            })
        )
        let friendsList = []
        friends.map((friend) => {
            const { _id,username,profilePicture } = friend
            friendsList.push({_id,username,profilePicture})
        })
        res.status(200).json(friendsList)
    }catch(err)
    {
        res.status(500).json(err)
    }
})


// follow user
userRouter.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } })
                await currentUser.updateOne({ $push : { following: req.params.id } })
                res.status(200).json("User is followed!")
            } else {
                res.status(403).json("You have already followed this account!")
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
    else {
        res.status(403).json("You can't follow yourself")
    }
})


//unfollow user
userRouter.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const curretUser = await User.findById(req.body.userId)
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } })
                await curretUser.updateOne({ $pull: { following: req.params.id } })
                res.status(200).json("User unfollowed successfully")
            } else {
                res.status(403).json("First follow to unfollow")
            }
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("You can't unfollow yourself")
    }


})

userRouter.get("/allUsers" , async (req,res) => {
    try{
            const allUserData = await User.find()
            let allSpecificUserData = []
            allUserData.map((user) => {
                const {_id,username,profilePicture} = user
                allSpecificUserData.push({_id,username,profilePicture})
            })
            res.status(200).json(allSpecificUserData)

    }catch(err){
        res.status(500).json(err)
    }
})

module.exports = userRouter