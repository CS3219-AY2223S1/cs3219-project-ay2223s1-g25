import { Box, Button, Stack } from "@mui/material";
import { leaveRoom } from "../utils/matching-helper"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getMatchingSocket } from '../socket';
import TextEditor from './TextEditor'
import Question from "./Question";
import ChatBox from './ChatBox';


function Room() {
    const navigate = useNavigate();

    useEffect(() => {
        getMatchingSocket().on("matchExited", () => {
            navigate('/');
        }, [])
    });

    return (          
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>
            <Stack direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}>
                <Question/>
                <TextEditor/>
                <ChatBox/>
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => leaveRoom()}>Leave Room</Button>
            </Stack>
        </Box>
    )
}

export default Room;
