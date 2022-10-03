import {
    Stack, Button, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import socket from '../socket';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";

function CountdownTimer({ targetTime, showTimer }) {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(targetTime)

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
            }

            // on matchSuccess: redirect both users to their room
            // display match success notification
            else if (eventName === "matchSuccess") {
                navigate('/room');
            } 
        }, [])
    });

    const cancelMatching = () => {
        socket.emit("timeout");
        showTimer(false)
    }

    if (remainingTime <= 0) {
        socket.emit("timeout");
        return (
            <Stack direction="column"
            justifyContent="center"
            alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"} color="red">No match found! Try again in a few minutes!</Typography>
                <Button variant="contained" color="secondary" type="submit" size="large" onClick={() => showTimer(false)} startIcon={<ArrowBack />}>Back</Button>
            </Stack>
        )
    } else {
        return (
            <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"}>Time Remaining: {remainingTime} seconds</Typography>
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => cancelMatching()}>Cancel matching</Button>
            </Stack>
        )
    }
}

export default CountdownTimer;
