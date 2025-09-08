import express from 'express'
import { getMyProfile, updateMyProfile, login, logout, searchUser, signup } from '../controllers/user.js';
import { SingleAvatar } from '../middlewares/multer.js';
import { isLoggedIn } from '../middlewares/auth.js';

const app = express.Router();

app.post('/signup', SingleAvatar, signup)
app.post('/login', login)

// can only be accessed if loggedin
app.use(isLoggedIn)
app.get('/profile', getMyProfile)
app.put('/updateMyProfile',SingleAvatar, updateMyProfile)
app.get('/logout',logout)
app.get('/search', searchUser)

export default app;