const authRouter = require("express").Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")


// register a user
authRouter.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            desc: req.body.desc,
            coverPicture: req.body.coverPicture,
            relationship: req.body.relationship,
            city: req.body.city,
            from: req.body.from
        })
        const user = await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})



// login a user

authRouter.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(401).json("User Not Found")
        }
        const validPass = await bcrypt.compare(req.body.password, user.password)
        if (!validPass) {
            res.status(401).json("Wrong email or password")
        }
        else
            res.status(200).json(user)
    }
    catch (err) {
        res.status(401).json(err)
    }
})

module.exports = authRouter