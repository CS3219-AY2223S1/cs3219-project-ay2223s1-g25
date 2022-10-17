import { io } from "socket.io-client";
import { API_SERVER, MATCHING_SERVICE } from "./configs";

const URL = API_SERVER;
var socket;

const getSocket = () => {
    return socket;
}

const createSocket = (accessToken) => {
    if (!socket) {
        socket = io.connect(URL, {path: MATCHING_SERVICE + "/socket.io",
        extraHeaders: {
            Authorization: "Bearer " + accessToken
        }
        });
    }
};

export {getSocket, createSocket};