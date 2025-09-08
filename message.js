import express from 'express'
import { isLoggedIn } from '../middlewares/auth.js'
import { getMessages } from '../controllers/message.js';

const app = express.Router()

app.use(isLoggedIn);
app.route('/:id').get(getMessages)

export default app