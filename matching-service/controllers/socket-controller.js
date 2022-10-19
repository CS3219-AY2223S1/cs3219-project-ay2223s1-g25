const { Server } = require('socket.io')
const MatchOrm = require("../models/match-orm.js")

var userRoomDict = {};

const getRoom = (req, res) => {
    if (req.auth.sub in userRoomDict) {
        res.send({
            roomId: userRoomDict[req.auth.sub].roomId,
            difficulty: userRoomDict[req.auth.sub].difficulty
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
        console.log(`Matching socket connected: ${socket.id}`);

        socket.on("match", async (args) => {
            // Find a free room in the database
            const req = {
                socketId: socket.id,
                difficulty: args.difficulty,
                userId: args.userId
            };
            console.log("Finding a match...");

            // User is waiting for a match/has a match
            if (!userRoomDict[args.userId]) {
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
            }
        })

        socket.once("timeout", async (args) => {
            console.log("TIMEOUT");
            // No match found, delete pending match from DB
            const roomId = `room_${socket.id}`;
            await MatchOrm.ormDeleteMatch(socket.id);
            delete userRoomDict[args.userId];
            socket.emit("matchFail", "Match not found!");
            await socket.leave(roomId);
        })

        socket.on("leave-room", async (args) => {
            console.log("LEAVE ROOM");
            // delete match only if both players leave the room, otherwise remain the same
            const [socketId, roomId] = socket.rooms;
            socket.emit("matchExited");
            delete userRoomDict[args.userId];
            await socket.leave(roomId);
        })
    
        socket.on('disconnect', () => {
            console.log(`Matching socket disconnected: ${socket.id}`);

            // todo: delete user from userRoomDict
        });
    });
}

module.exports = {startSocket, getRoom};