import {
    Stack, Button, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import socket from '../socket.js';
import { startMatching } from "../utils/matching-helper.js"

function CountdownTimer({ targetTime, showTimer }) {
    const [remainingTime, setRemainingTime] = useState(targetTime)
    const [isMatchSuccess, setMatchSuccess] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        socket.onAny((eventName, ...args) => {
            // on matchFail: restart matching process
            // display match fail notification
            if (eventName === "matchFail") {
                setMatchSuccess(false);
            }

            // on matchSuccess: redirect both users to their room
            // display match success notification
            else if (eventName === "matchSuccess") {
                setMatchSuccess(true);
                console.log("match success!")
                console.log(args)
            } 

            else if (eventName === "matchPending") {
                console.log("waiting for match...")
                console.log(args)
            }
        }, [])
    });

    if (remainingTime <= 0) {
        socket.emit("timeout");

        return (
            <Stack direction="column"
            justifyContent="center"
            alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"} color="red">No match found! Go back!</Typography>
                <Button variant="contained" color="success" type="submit" size="large" onClick={() => showTimer(false)}>Match!</Button>
            </Stack>
        )
    } else {
        return (
            <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"}>Time Remaining: {remainingTime} seconds</Typography>
                <Button variant="contained" color="success" type="submit" size="large" onClick={() => showTimer(false)}>Cancel matching</Button>
            </Stack>
        )
    }
}

export default CountdownTimer;
