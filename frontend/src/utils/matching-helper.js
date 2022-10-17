import { getSocket } from '../socket';

const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const startMatching = (userId, difficulty, setIsShown) => {
    // Toggle views & countdown
    setIsShown(current => !current);

    if (difficulty !== "") {
        getSocket().emit("match", {
            "difficulty": difficulty,
            "userId": userId
        });
    } else {
        console.log("no difficulty...")
    }
}

const leaveRoom = () => {
    getSocket().emit("leave-room");
    console.log("leaving room")
}

export {capitalizeFirst, startMatching, leaveRoom};