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
import { useState } from "react";
import JoinRightIcon from '@mui/icons-material/JoinRight';
import CountdownTimer from "./CountdownTimer.js";
import { capitalizeFirst, startMatching } from "../utils/matching-helper.js"

function DifficultySelection() {
    const [difficulty, setDifficulty] = useState("");
    const [isShown, setIsShown] = useState(false)

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>
            { !isShown && (<Typography variant={"h3"} marginBottom={"1.5rem"}>Select a Difficulty</Typography>) }
            { !isShown && (
            <FormControl>
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={3}>
                    <RadioGroup name="controlled-radio-buttons-group">
                        <FormControlLabel value="easy" control={<Radio />} label="Easy" onChange={() => setDifficulty("easy")}/>
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" onChange={() => setDifficulty("medium")}/>
                        <FormControlLabel value="hard" control={<Radio />} label="Hard" onChange={() => setDifficulty("hard")}/>
                    </RadioGroup>
                    <Button variant="contained" color="success" type="submit" size="large" onClick={() => startMatching(difficulty, setIsShown)} endIcon={<JoinRightIcon />}>Find a match</Button>
                </Stack>
            </FormControl> )}

            { isShown && <Typography variant={"h3"} marginBottom={"1.5rem"}>Looking for a match...</Typography> }
            { isShown && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>Difficulty: {capitalizeFirst(difficulty)}</Typography> }
            { isShown && <CountdownTimer targetTime={30} showTimer={setIsShown}></CountdownTimer> }
        </Box>
    )
}

export default DifficultySelection;
