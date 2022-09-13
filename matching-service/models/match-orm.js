const { createMatch, findMatch, deleteMatch } = require('./match-repository.js');
const { setTimeout } = require('timers/promises');

async function ormFindMatch(data) {
    try {
        // Find a match based on the description
        const match = await findMatch(data.socketId, data.difficulty);

        if (match.otherSocketId !== null) {
            const prettyMatch = {
                socketId: match.socketId,
                otherSocketId: match.otherSocketId,
                difficulty: match.difficulty,
            };
            return prettyMatch;
        }

        return false;
    } catch (err) {
        console.log('ERROR: Could not find a match.', err);
        return { err };
    }
}

async function ormCreateMatch(data) {
    try {
        // Create a room when listening
        const newMatch = await createMatch(data);
        return newMatch;
    } catch (err) {
        console.log('ERROR: Could not create a match.');
        return { err };
    }
}

async function ormDeleteMatch(socketId) {
    try {
        await deleteMatch(socketId);
    } catch (err) {
        console.log('ERROR: Could not delete a match.');
        return { err };
    }
}

module.exports = { ormCreateMatch, ormFindMatch, ormDeleteMatch };