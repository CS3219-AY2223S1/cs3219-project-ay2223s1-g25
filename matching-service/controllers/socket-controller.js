const { Server } = require('socket.io')
const MatchOrm = require("../models/match-orm.js")

var userRoomDict = {};

const getRoomId = (req, res) => {
    if (req.auth.sub in userRoomDict) {
        res.send({
            roomId: userRoomDict[req.auth.sub]
        });
    } else {
        res.send({
            error: "No room id found."
        });
    }
}

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
                console.log("match found, redirecting... " + roomId);
                userRoomDict[args.userId] = roomId;
                await socket.join(roomId);
                io.to(roomId).emit("matchSuccess", "Match found!");
            } else {
                // No match found, socket joins its own room
                const roomId = `room_${socket.id}`;
                console.log("no match found, waiting for rm " + roomId);
                userRoomDict[args.userId] = roomId;
                await socket.join(roomId);
                socket.emit("matchPending", "Waiting for match...");
            }
        })

        socket.once("timeout", async () => {
            console.log("TIMEOUT");
            // No match found, delete pending match from DB
            const roomId = `room_${socket.id}`;
            await MatchOrm.ormDeleteMatch(socket.id);
            delete userRoomDict[args.userId];
            socket.emit("matchFail", "Match not found!");
            await socket.leave(roomId);
        })

        socket.on("sendMsg", (msg) => {
            const [socketId, roomId] = socket.rooms;
            socket.to(roomId).emit("gotMsg", msg);
          });

        socket.on("leave-room", async () => {
            console.log("LEAVE ROOM");
            // delete match only if both players leave the room, otherwise remain the same
            const [socketId, roomId] = socket.rooms;
            socket.emit("matchExited");
            await socket.leave(roomId);
        })
    
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}

module.exports = {startSocket, getRoomId};