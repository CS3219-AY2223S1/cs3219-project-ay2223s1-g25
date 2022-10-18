import {
    Box, Typography, Button, Stack
} from "@mui/material";
import { leaveRoom } from "../utils/matching-helper"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMatchingSocket } from '../socket';
import TextEditor from './TextEditor'
import Question from "./Question";

function Room() {
    const navigate = useNavigate();

    useEffect(() => {
        getMatchingSocket().on("matchExited", () => {
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
                <Question difficulty={"hard"}/>
                {/* PASS IN DIFFICULTY WHEN ENTERING ROOM */}
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => leaveRoom()}>Leave Room</Button>
            </Stack>
        </Box>
    )
}

export default Room;
