import {
    Box,
    Stack,
    Button,
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio
} from "@mui/material";
import { useState, useEffect } from "react";
import JoinRightIcon from '@mui/icons-material/JoinRight';
import socket from '../socket.js';

function DifficultySelection() {
    const [difficulty, setDifficulty] = useState("");
    const [room, setRoom] = useState("");

    const match = () => {
        if (difficulty != "") {
            socket.emit("match", {
                "difficulty": difficulty
            });
        }
    }

    useEffect(() => {
        socket.on("notification", (data) => {
            setRoom(data);
        })
    }, [socket])

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>
            <Typography variant={"h3"} marginBottom={"1.5rem"}>Select a Difficulty</Typography>
            <FormControl>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}>
                    <RadioGroup name="controlled-radio-buttons-group">
                        <FormControlLabel value="beginner" control={<Radio />} label="Beginner" onChange={() => setDifficulty("beginner")}/>
                        <FormControlLabel value="intermediate" control={<Radio />} label="Intermediate" onChange={() => setDifficulty("intermediate")}/>
                        <FormControlLabel value="expert" control={<Radio />} label="Expert" onChange={() => setDifficulty("expert")}/>
                    </RadioGroup>
                    <Button variant="contained" color="success" type="submit" size="large" onClick={() => match()} endIcon={<JoinRightIcon />}>Find a match</Button>

                    <Typography variant={"p"}>User has joined room {room}.</Typography>
                </Stack>
            </FormControl>
        </Box>
    )
}

export default DifficultySelection;
