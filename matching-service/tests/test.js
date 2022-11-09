const { findMatch, deleteMatch } = require("../models/match-repository.js"); 
const expect = require("chai").expect;

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

describe("Match", () => {
    describe("Match 2 users different difficulty and categoryTitle", () => {
        it("should not be matched", async () => {
            await sleep(5000);
            let socketId = "1";
            let otherSocketId = "2";
            let difficulty1 = "Easy";
            let difficulty2 = "Hard";
            let categoryTitle = "Algorithms";

            let first = await findMatch(socketId, difficulty1, categoryTitle);
            expect(first.created).to.equal(true);
            expect(first.match.otherSocketId).to.equal(null);

            let second = await findMatch(otherSocketId, difficulty2, categoryTitle);
            expect(second.created).to.equal(true);
            expect(second.match.otherSocketId).to.equal(null);
        });
    });

    describe("Match 2 users with same difficulty and categoryTitle", () => {
        it("should be matched", async () => {
            let socketId = "3";
            let otherSocketId = "4";
            let difficulty = "Medium";
            let categoryTitle = "Algorithms";

            let first = await findMatch(socketId, difficulty, categoryTitle);
            expect(first.created).to.equal(true);
            expect(first.match.otherSocketId).to.equal(null);

            let second = await findMatch(otherSocketId, difficulty, categoryTitle);
            expect(second.created).to.equal(false);
            expect(second.match.otherSocketId).to.equal(otherSocketId);
        });
    });

    describe("Delete match from table", () => {
        it("should be deleted", async () => {
            let socketId = "3";
            let otherSocketId = "4";
            let difficulty = "Medium";
            let categoryTitle = "Algorithms";

            let match = await deleteMatch(socketId);
            expect(match.socketId).to.equal(socketId);
            expect(match.otherSocketId).to.equal(otherSocketId);
            expect(match.difficulty).to.equal(difficulty);
            expect(match.categoryTitle).to.equal(categoryTitle);
        });
    });
});