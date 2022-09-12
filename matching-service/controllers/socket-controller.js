const { Server } = require('socket.io')
const MatchOrm = require("../models/match-orm.js")

const startSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    })
    
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
    
        // socket.on("join_room", (room) => {
        //     // Room not made yet
        //     if (room == undefined) {
        //         room = socket.id
        //     }
        //     socket.join(room);
        //     console.log(socket)
    
        //     socket.to(room).emit("notification", room);
        // });

        socket.on("match", async (args) => {
            // Find a free room in the database
            const req = {
                socketId: socket.id,
                difficulty: args.difficulty
            };
            console.log("Finding a match...");
            const otherSocketId = await MatchOrm.ormFindMatch(req);


            socket.join(otherSocketId);
            socket.to(args.socketId).emit("notification", "Match found!");
        })
    
        socket.on('disconnect', () => {
            console.log(`User connected: ${socket.id}`);
        });
    });
}

module.exports = startSocket;