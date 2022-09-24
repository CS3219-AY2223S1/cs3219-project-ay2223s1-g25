import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

io.on('connection', (socket) => {
    socket.join("room");
    console.log('User connected!', socket.id);

    socket.on("send", (data) => {
        console.log(data);
        socket.to("room").emit('get', data);
    })

    socket.on('disconnect', () => {
        console.log('User disconnected!', socket.id);
    })
});

httpServer.listen(8001, () => {
    console.log('Listening on *:8001');
});
