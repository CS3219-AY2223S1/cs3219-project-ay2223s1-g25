import {
    Box, Typography, Button, Skeleton, Stack
} from "@mui/material";
import { leaveRoom } from "../utils/matching-helper"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import socket from '../socket';
import TextEditor from './TextEditor'

function Room() {
    const navigate = useNavigate();

    useEffect(() => {
        socket.on("matchExited", () => {
            navigate('/difficulty');
        }, [])
    });

    return (          
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>

            <Typography variant={"h3"} margin={"1rem"}>Room</Typography>
            <TextEditor/>

            <Stack direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}>
                <Skeleton variant="rounded" width={"70vw"} height={"30vw"}/>
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => leaveRoom()}>Leave Room</Button>
            </Stack>
        </Box>
    )
}

export default Room;
