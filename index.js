const express = require("express")
const app = express()
const mongoose = require("mongoose")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const convoRoute = require("./routes/conversation")
const messagesRoute = require("./routes/messages")
const multer = require('multer')
const path = require('path')

dotenv.config()
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connection Secure!")
    })
    .catch((e) => {
        console.log(e);
    })

//middleware

app.use("/images",express.static(path.join(__dirname,"public/images")))
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


const storage = multer.diskStorage({
    destination:(req,file,callback) => {
        callback(null,"public/images")
    },
    filename:(req,file,callback)=>{
        callback(null,req.body.name)
    }
})

const upload = multer({storage})
app.post("/api/upload",upload.single("file"),(req,res) => {
    try {
        return res.status(200).json("File uploaded")
    } catch (err) {
        console.log(err)
    }
})

//requests 

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/convo",convoRoute)
app.use("/api/messages",messagesRoute)


app.listen(8011, () => {
    console.log("Server running")
})