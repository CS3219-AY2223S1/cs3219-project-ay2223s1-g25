require("dotenv/config");
const { Server } = require('socket.io')
const MatchOrm = require("../models/match-orm.js")
const { createClient } = require('redis');

let publisher = createClient({
    socket: {
        host: process.env.REDIS_REMOTE_HOST,
        port: process.env.REDIS_REMOTE_PORT,
    },
    password: process.env.REDIS_REMOTE_PASSWORD
});
(async () => { await publisher.connect(); })();

var userRoomDict = {};
var userSocketDict = {};

const getRoom = (req, res) => {
    if (req.auth.sub in userRoomDict) {
        res.send({
            roomId: userRoomDict[req.auth.sub].roomId,
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
            origin: process.env.APP_ORIGIN,
            methods: ["GET", "POST"]
        }
    })
    
    io.on('connection', (socket) => {
        let user = socket.handshake.query.user;

        if (userSocketDict[user]) {
            // disconnect socket and send back error!
            console.log("User exists in socket dictionary")
            socket.emit("duplicateSocket");
        } else {
            userSocketDict[user] = socket.id;
        }
        
        console.log(`Matching socket connected: ${socket.id}`);

        socket.on("match", async (args) => {
            // Find a free room in the database
            const req = {
                socketId: socket.id,
                difficulty: args.difficulty,
                categoryTitle: args.categoryTitle,
                userId: args.userId
            };
            console.log("Finding a match...");

            // User is waiting for a match/has a match
            // if (!userRoomDict[args.userId] ) {
            const match = await MatchOrm.ormFindMatch(req);

            if (match instanceof Object) {
                // A match is found! This socket joins the room of the first socketId
                const roomId = `room_${match.id}`;
                console.log("Match found, redirecting... " + roomId);
                userRoomDict[args.userId] = { socketId: socket.id, roomId: roomId, difficulty: args.difficulty, categoryTitle: args.categoryTitle };
                await socket.join(roomId);

                // Pub to question service
                publisher.publish("matched", JSON.stringify({ roomId: `${roomId}`, difficulty: `${args.difficulty}`, categoryTitle: `${args.categoryTitle}` }), function(){
                    process.exit(0);
                });

                io.to(roomId).emit("matchSuccess", "Match found!");
            } else {
                // No match found yet, socket joins its own room
                const roomId = `room_${match}`;
                console.log("No match found, waiting for room " + roomId);
                userRoomDict[args.userId] = { socketId: socket.id, roomId: roomId, difficulty: args.difficulty, categoryTitle: args.categoryTitle };
                await socket.join(roomId);
                socket.emit("matchPending", "Waiting for match...");
            }
        })

        socket.on("timeout", async (args) => {
            console.log("TIMEOUT");
            // No match found, delete pending match from DB
            var match = await MatchOrm.ormDeleteMatch(socket.id);
            const roomId = `room_${match.id}`;
            delete userRoomDict[args.userId];
            socket.emit("matchFail", "Match not found!");
            await socket.leave(roomId);
        })

        socket.on("leave-room", async (args) => {
            const [socketId, roomId] = socket.rooms;
            console.log(`Matching socket ${socket.id} has left the room ${roomId}`);
            socket.emit("matchExited");
            delete userRoomDict[args.userId];
            clientsLeft = io.of("/").adapter.rooms.get(roomId).size;

            // TODO: prevent crashing unexpectedly, make sure to remove from room when socket disconnects
            if (clientsLeft == 2) {
                io.to(roomId).emit("oneClientRoom");
            } else if (clientsLeft == 1) {
                // delete match only if both players have left the room
                await MatchOrm.ormDeleteMatch(socketId);
            }
            await socket.leave(roomId);
        })

        socket.on('disconnecting', async () => {
            // Remove socket / user from dict
            for (const [key, value] of Object.entries(userRoomDict)) {
                if (value.socketId === socket.id) {
                    delete userRoomDict[key];
                    clientsLeft = io.of("/").adapter.rooms.get(value.roomId).size;
                    if (clientsLeft == 2) {
                        io.to(value.roomId).emit("oneClientRoom");
                    } else if (clientsLeft == 1) {
                        await MatchOrm.ormDeleteMatch(socket.id);
                    }
                    await socket.leave(value.roomId);
                }
            }
        });

        socket.on('disconnect', () => {
            // Remove user from userSocketDict
            for (const [key, value] of Object.entries(userSocketDict)) {
                if (value === socket.id) {
                    delete userSocketDict[key];
                }
            }

            console.log(`Matching socket disconnected: ${socket.id}`);
        });
    });
}

module.exports = {startSocket, getRoom};