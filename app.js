import express from 'express'
import { connectMongoDB } from './utils/features.js';
import { defaultError } from './middlewares/error.js';
import cors from 'cors'
import config from './config.js';
import routes from './routes/route.js'
import {createServer} from 'http'
import { initializeSocket } from './socket.js';


connectMongoDB(config.mongoUri)
const app = express();
const server = createServer(app)
const io = initializeSocket(server)
app.set('io',io)

const port = config.port || 4000

app.use(cors(config.cors))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/',routes)

app.get("/", (req,res) =>
  {
    res.json("Backend working")
  }
)


app.use(defaultError)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
