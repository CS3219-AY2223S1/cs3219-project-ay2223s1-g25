const io = require('socket.io')(4001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

    io.on("connection", socket => {
    console.log('connected', socket.id);
    io.to(socket.id).emit("connected", socket.id);
    var roomId;
    socket.on("signin", (data) => {
        roomId = data;
        socket.join(roomId);});
    socket.on("send-changes", (delta) => {
        socket.to(roomId).emit("receive-changes", delta);
    });

    socket.on('disconnect', () => {
        //alert user if other user disconnects
        console.log('Disconnected', socket.id);
    });
})