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

        socket.on("match", async (args) => {
            // Find a free room in the database
            const req = {
                socketId: socket.id,
                difficulty: args.difficulty
            };
            console.log("Finding a match...");

            const match = await MatchOrm.ormFindMatch(req);

            if (match) {
                // A match is found! This socket joins the room of the first socketId
                const roomId = `room_${match.socketId}`;
                console.log("match found, redirecting... " + roomId)
                socket.join(roomId);
                socket.to(roomId).emit("matchSuccess", "Match found!");
            } else {
                // No match found, socket joins its own room
                const roomId = `room_${socket.id}`;
                console.log("no match found, waiting for rm " + roomId);
                socket.join(roomId);
                socket.emit("matchPending", "Waiting for match...");
            }
        })

        socket.once("timeout", async () => {
            console.log("TIMEOUTTT");
            
            const roomId = `room_${socket.id}`;
            // No match found, delete pending match from DB
            await MatchOrm.ormDeleteMatch(socket.id);
            socket.emit("matchFail", "Match not found!");
            socket.leave(roomId);
        })
    
        socket.on('disconnect', () => {
            console.log(`User connected: ${socket.id}`);
        });
    });
}

module.exports = startSocket;