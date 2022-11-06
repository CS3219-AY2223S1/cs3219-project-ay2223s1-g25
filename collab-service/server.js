const io = require('socket.io')(4001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

io.on("connection", socket => {
    console.log("Connected: ", socket.id);
    io.to(socket.id).emit("connected", socket.id);
    var roomId;

    socket.on("signin", (data) => {
        roomId = data;
        socket.join(roomId);
    });
    
    socket.on("send-changes", (data) => {
        socket.to(roomId).emit("receive-changes", data);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected', socket.id);
    });
})

module.exports = io;