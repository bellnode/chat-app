import express from 'express'
import { isLoggedIn } from '../middlewares/auth.js'
import { addGroupMember, createGroup, getChatDetails, getGroupChats, getMyChats, getMyFriends, leaveGroup, removeGroupMember, renameChat, sendAttachments, getMyNonGroupFriends, deleteGroup } from '../controllers/chat.js';
import { attachementsMulter } from '../middlewares/multer.js';

const app = express.Router()

app.use(isLoggedIn);
app.post('/createGroup',createGroup)
app.get('/getMyChats',getMyChats)
app.get('/getGroupChats',getGroupChats)
app.put('/addGroupMember',addGroupMember)
app.put('/removeGroupMember',removeGroupMember)
app.delete('/leaveGroup/:id',leaveGroup)
app.delete('/deleteGroup/:id',deleteGroup)
app.post('/sendAttachment',attachementsMulter,sendAttachments)
app.get('/getMyFriends',getMyFriends)
app.get('/getMyNonGroupFriends/:id',getMyNonGroupFriends)
app.route('/:id').get(getChatDetails).put(renameChat)


export default app