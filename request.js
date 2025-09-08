import express from 'express'
import { isLoggedIn } from '../middlewares/auth.js'
import { acceptRequest, getNotifications, sendRequest } from '../controllers/request.js';

const app = express.Router()

app.use(isLoggedIn);
app.post('/send',sendRequest)
app.post('/accept',acceptRequest)
app.get('/notification',getNotifications)

export default app