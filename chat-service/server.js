const io = require("socket.io")(5001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connection: ", socket.id);

  io.to(socket.id).emit("connected", socket.id);

  var roomId;

  socket.on("signin", (data) => {
    roomId = data;
    socket.join(roomId);
  });

  socket.on("send-msg", (msg) => {
    socket.to(roomId).emit("got-msg", msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnection: ", socket.id);
  });
});

