const { findMatch, deleteMatch } = require('./match-repository.js');

async function ormFindMatch(data) {
    try {
        // Find a match based on the difficulty
        const match = await findMatch(data.socketId, data.difficulty);

        if (match.otherSocketId !== null) {
            const prettyMatch = {
                id: match.id,
                socketId: match.socketId,
                otherSocketId: match.otherSocketId,
                difficulty: match.difficulty,
            };
            return prettyMatch;
        }
        return match.id;
    } catch (err) {
        console.log('ERROR: Could not find a match.', err);
        return { err };
    }
}

async function ormDeleteMatch(socketId) {
    try {
        const match = await deleteMatch(socketId);
        return match;
    } catch (err) {
        console.log('ERROR: Could not delete a match.', err);
        return { err };
    }
}

module.exports = { ormFindMatch, ormDeleteMatch };