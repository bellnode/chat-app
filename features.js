import mongoose from "mongoose"
import { getSockets } from "../socket.js";

const connectMongoDB = (uri)=>{
    mongoose.connect(uri,{dbName:'TangyChat'})
    .then((data)=> console.log(`Connected to DB ${data.connection.host}`))
    .catch((err)=>{
        throw err;
    })
}

const emitEvent=(req,event,members,data)=>{
    const io = req.app.get('io');
    const usersSocket = getSockets(members)
    io.to(usersSocket).emit(event,data)
}

export {connectMongoDB , emitEvent};