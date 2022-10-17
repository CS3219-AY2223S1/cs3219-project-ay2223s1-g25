const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
})

io.on("connection", socket => {
    console.log('connected', socket.id);
    io.to(socket.id).emit("sid", socket.id);

    socket.on("send-changes", delta => {
        socket.broadcast.emit("receive-changes", delta)
    })  

    socket.on('disconnect', () => {
        //alert user if other user disconnects
        console.log('Disconnected', socket.id);
    });
})