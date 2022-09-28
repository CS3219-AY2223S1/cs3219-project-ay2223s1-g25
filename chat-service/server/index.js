import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Hello World from matching-service");
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connection: ", socket.id);
  io.to(socket.id).emit("sid", socket.id);

  socket.on("sendMsg", (msg) => {
    socket.broadcast.emit("gotMsg", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnection: ", socket.id);
  })
});

httpServer.listen(3001, () => {
  console.log("Server running 3001");
});
