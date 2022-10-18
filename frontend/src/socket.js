import { io } from "socket.io-client";
import { API_SERVER, MATCHING_SERVICE, COLLAB_SERVICE } from "./configs";
import axios from 'axios';

const URL = API_SERVER;
var matchingSocket;
var collabSocket;

const getMatchingSocket = () => {
    return matchingSocket;
}

const getCollabSocket = () => {
    return collabSocket;
}

const createMatchingSocket = (accessToken) => {
    if (!matchingSocket) {
        matchingSocket = io.connect(URL, {path: MATCHING_SERVICE + "/socket.io",
        extraHeaders: {
            Authorization: "Bearer " + accessToken
        }
        });
    }
};

const createCollabSocket = (accessToken) => {
    if (!collabSocket) {
        collabSocket = io.connect(URL, {path: COLLAB_SERVICE + "/socket.io",
        extraHeaders: {
            Authorization: "Bearer " + accessToken
        }
        });
        collabSocket.on('connected', () => {
            let config = { headers: {
                Authorization: "Bearer " + accessToken
            }};
            axios.get(URL + MATCHING_SERVICE + "/roomId", config).then(res => {
                const roomId = res.data.roomId;
                console.log(roomId);
                collabSocket.emit('signin', roomId);
            })
        });
    }
}

export {getMatchingSocket, getCollabSocket, createMatchingSocket, createCollabSocket};