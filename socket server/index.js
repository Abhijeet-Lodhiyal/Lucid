const io = require("socket.io")(6969, {
    cors:{
        origin:"http://localhost:5173"
    }
});

let users = []
function addUser(userId,socketId){
    !users.some(user => user.userId === userId) && users.push({userId,socketId})
    
}
function removerUser(socketId)
{
    users = users.filter(user => user.socketId !== socketId)
}
function getUser(receiverId)
{
  return users.find(user => user.userId === receiverId)
}


io.on("connection", (socket)=>{
    socket.on("addUser",(userId)=> {
        addUser(userId,socket.id);
        io.emit("getUsers",users)
    })

    socket.on("disconnect" , ()=>{
        removerUser(socket.id)
        io.emit("getUsers",users)
    })
    socket.on("sendMessage",({senderId,receiverId,message})=>{
        const userR = getUser(receiverId)
        try {
            io.to(userR.socketId).emit("getMessage",{
                senderId,
                message
            })
        } catch (error) {
                console.log(error)
        }
        
    })
})