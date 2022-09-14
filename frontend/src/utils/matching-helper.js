import socket from '../socket';

const capitalizeFirst = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const startMatching = (difficulty, setIsShown) => {
    // Toggle views & countdown
    setIsShown(current => !current);

    if (difficulty !== "") {
        socket.emit("match", {
            "difficulty": difficulty
        });
    } else {
        console.log("no difficulty...")
    }
}

const leaveRoom = () => {
    socket.emit("leave-room");
    console.log("leaving room")
}

export {capitalizeFirst, startMatching, leaveRoom};