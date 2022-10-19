import { getMatchingSocket } from '../socket';

const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const startMatching = (userId, difficulty, setIsShown) => {
    // Toggle views & countdown
    setIsShown(current => !current);

    if (difficulty !== "") {
        getMatchingSocket().emit("match", {
            "difficulty": difficulty,
            "userId": userId
        });
    } else {
        console.log("no difficulty...")
    }
}

const leaveRoom = (userId) => {
    getMatchingSocket().emit("leave-room", {
        "userId": userId
    });
    console.log("leaving room")
}

export {capitalizeFirst, startMatching, leaveRoom};