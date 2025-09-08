import { Server } from "socket.io";
import { CURRENT_ONLINE_USERS, MESSAGES_READ, NEW_MESSAGE, NEW_MESSAGE_ALERT, TYPING_ENDED, TYPING_STARTED, USER_CONNECTED, USER_DISCONNECTED } from "./constants/event.js";
import { v4 as uuid } from 'uuid'
import { Message } from "./models/message.js";
import { isSocketAuthenticated } from "./middlewares/auth.js";
import config from "./config.js";

const usersocketIDs = new Map()

const getSockets = (users) => {
    const sockets = users.map((user) => usersocketIDs.get(user._id.toString()))
    return sockets
}

const initializeSocket = (server) => {
    const io = new Server(server, {cors:config.cors});

    io.use(isSocketAuthenticated)

    io.on('connection', async (socket) => {
        const user = socket.user
        usersocketIDs.set(user._id.toString(), socket.id)
        console.log({usersocketIDs})
        socket.emit(CURRENT_ONLINE_USERS,Array.from(usersocketIDs.keys()))
        socket.broadcast.emit(USER_CONNECTED,{ userId: user._id })

        socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
            const messageRealTime = {
                chat: chatId,
                _id: uuid(), //temp id using uuid
                sender: {
                    _id: user._id,
                    username: user.username,
                    avatar:user.avatar.url
                },
                content: message,
                createdAt: new Date().toISOString(),
                readBy : [user._id]
            }

            const messageForDB = {
                chat: chatId,
                sender: user._id,
                content: message,
                readBy:[user._id]
            }

            const membersSocket = getSockets(members)
            const membersExceptUser = members.filter((member)=>member._id.toString() !== user._id.toString())
            const membersExcludingUserSocket = getSockets(membersExceptUser)

            io.to(membersSocket).emit(NEW_MESSAGE, {
                chatId,
                message: messageRealTime
            })
            io.to(membersExcludingUserSocket).emit(NEW_MESSAGE_ALERT,{chatId})

            await Message.create(messageForDB)
        })

        socket.on(TYPING_STARTED,({chatId,members})=>{
            const membersSocket = getSockets(members)
            io.to(membersSocket).emit(TYPING_STARTED,{chatId,username : user.username})
        })

        socket.on(TYPING_ENDED,({chatId,members})=>{
            const membersSocket = getSockets(members)
            io.to(membersSocket).emit(TYPING_ENDED,{chatId})
        })

        socket.on('disconnect', () => {
            usersocketIDs.delete(user._id.toString())
            socket.broadcast.emit(USER_DISCONNECTED,{ userId: user._id })
            console.log({usersocketIDs})
        })

        socket.on(MESSAGES_READ, async ({ chatId, userId }) => {
            console.log('Message read------------by ',userId)
            await Message.updateMany(
                { chat: chatId, readBy: { $ne: userId } },  // Add only if user hasn't read it
                { $push: { readBy: userId } }
            );
        
            // // Notify all members in the chat that the user has read messages
            // io.to(chatId).emit('messagesRead', { chatId, userId });
        });
    });
    return io
}

export { initializeSocket , getSockets }