import socket from '../socket.js';

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

export {capitalizeFirst, startMatching};