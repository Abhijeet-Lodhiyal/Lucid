const postRouter = require("express").Router()
const Post = require("../models/Post")
const User = require("../models/User")
const fs = require('fs')

// create a post
postRouter.post("/", async (req, res) => {
    try {
        const post = await new Post({
            userId: req.body.userId,
            desc: req.body.desc,
            img: req.body.img,
        })
        const newPost = await post.save()
        res.status(200).json(newPost)
    } catch (err) {
        res.status(500).json(err)
    }
})

//update post
postRouter.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("Post updated successfully!")
        } else {
            res.status(403).json("You can update only your post!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

//comment on post
postRouter.put("/:id/comment", async (req,res) => {
    try {
            const post = await Post.findById(req.params.id)
            const commentObject = {username:req.body.username,comment:req.body.comment, profilePicture:req.body.profilePicture}
            await post.updateOne({$push:{comments : commentObject}})
            res.status(200).json(commentObject)
    } catch (err) {
        res.status(500).json(err)  
    }
})

//delete post
postRouter.put("/:id/delete", async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)  
        if(post.userId === req.body.userId) {
            if(post.img !== undefined)
                fs.unlinkSync('./public/images/'+post.img)
            await post.delete()
            res.status(200).json("Post deleted successfully!")
        } else {
            res.status(403).json("You can delete only your post!")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

postRouter.delete("/userDelete/:userId" , async (req,res) => {
    try {
        
        const posts = await Post.find({userId:req.params.userId})
        let imgNames = []
        posts.map((im) => {
            imgNames.push(im.img)
        })
        imgNames.map( (imageToBeDeleted) => {
            fs.unlinkSync("./public/images/"+imageToBeDeleted)
        })
        await Post.deleteMany({userId:req.params.userId})
        res.status(200).json("Deleted User")
    } catch (err) {
        res.status(500).json(err)
        
    }
})

//like a post
postRouter.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("Post Liked!")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("Post disliked")
        }
    } catch (err) {
        res.status(500).json(err)
    }
})



postRouter.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
})


postRouter.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const currentUserPost = await Post.find({ userId: req.params.userId })
        const friendPost = await Promise.all(
            currentUser.following.map(async (friendId) => {
                return await Post.find({ userId: friendId })
            })
        )
        res.status(200).json(currentUserPost.concat(...friendPost))
    } catch (err) {
        res.status(500).json(err)
    }
})




postRouter.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
        const posts = await Post.find({ userId: user._id })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = postRouter