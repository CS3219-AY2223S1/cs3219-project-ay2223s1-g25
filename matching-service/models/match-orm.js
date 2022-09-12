const { createMatch, findMatch, deleteMatch } = require('./match-repository.js');
const { setTimeout } = require('timers/promises');

async function ormFindMatch(data) {
    try {
        // Find a match based on the description
        const [match, created] = await findMatch(data.socketId, data.difficulty);
        return match;
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

async function ormDeleteMatch(match) {
    try {
        const res = await deleteMatch(match);
        return res;
    } catch (err) {
        console.log('ERROR: Could not delete a match.');
        return { err };
    }
}

module.exports = { ormCreateMatch, ormFindMatch, ormDeleteMatch };