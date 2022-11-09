import { io } from "socket.io-client";
import { API_SERVER, MATCHING_SERVICE, COLLAB_SERVICE, CHAT_SERVICE } from "./configs";
import axios from 'axios';

const URL = API_SERVER;
var matchingSocket;
var collabSocket;
var chatSocket;

let chatSocketCreated = false;
let collabSocketCreated = false;

const getMatchingSocket = () => {
    return matchingSocket;
}

const getCollabSocket = () => {
    return collabSocket;
}

const getChatSocket = () => {
    return chatSocket;
}

const resetCollabSocket = () => {
    collabSocket.disconnect();
    collabSocket.close();
    collabSocketCreated = false;
}

const resetChatSocket = () => {
    chatSocket.disconnect();
    chatSocket.close();
    chatSocketCreated = false;
}

const createMatchingSocket = (accessToken, user) => {
    if (!matchingSocket) {
        matchingSocket = io.connect(URL, {path: MATCHING_SERVICE + "/socket.io",
            query: `user=${user.sub}`,
            extraHeaders: {
                Authorization: "Bearer " + accessToken
            }
        });
    }
};

const createCollabSocket = (accessToken) => {
    if (!collabSocketCreated) {
        collabSocket = io.connect(URL, {path: COLLAB_SERVICE + "/socket.io",
        extraHeaders: {
            Authorization: "Bearer " + accessToken
        }
        });
        collabSocket.on('connected', () => {
            let config = { headers: {
                Authorization: "Bearer " + accessToken
            }};
            axios.get(URL + MATCHING_SERVICE + "/room", config).then(res => {
                const roomId = res.data.roomId;
                console.log(roomId);
                collabSocket.emit('signin', roomId);
            })
        });
        collabSocketCreated = true;
    }
}

const createChatSocket = (accessToken) => {
    if (!chatSocketCreated) {
        chatSocket = io.connect(URL, {path: CHAT_SERVICE + "/socket.io",
        extraHeaders: {
            Authorization: "Bearer " + accessToken
        }
        });
        chatSocket.on('connected', () => {
            let config = { headers: {
                Authorization: "Bearer " + accessToken
            }};
            axios.get(URL + MATCHING_SERVICE + "/room", config).then(res => {
                const roomId = res.data.roomId;
                console.log(roomId);
                chatSocket.emit('signin', roomId);
            })
        });
        chatSocketCreated = true;
    }
}

export {getMatchingSocket, getCollabSocket, getChatSocket, createMatchingSocket, createCollabSocket, createChatSocket, resetCollabSocket, resetChatSocket};