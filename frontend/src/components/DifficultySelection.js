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
import { startMatching } from "../utils/matching-helper.js"
import { useAuth0 } from "@auth0/auth0-react";

function DifficultySelection() {
    const [difficulty, setDifficulty] = useState("");
    const [isShown, setIsShown] = useState(false);
    const { user } = useAuth0();

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
                        <FormControlLabel value="easy" control={<Radio />} label="Easy" onChange={() => setDifficulty("Easy")}/>
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" onChange={() => setDifficulty("Medium")}/>
                        <FormControlLabel value="hard" control={<Radio />} label="Hard" onChange={() => setDifficulty("Hard")}/>
                    </RadioGroup>
                    <Button variant="contained" disabled={difficulty === "" ? true : false} color="success" type="submit" size="large" onClick={() => startMatching(user.sub, difficulty, setIsShown)} endIcon={<JoinRightIcon />}>Find a match</Button>
                </Stack>
            </FormControl> )}

            { isShown && <Typography variant={"h3"} marginBottom={"1.5rem"}>Looking for a match...</Typography> }
            { isShown && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>Difficulty: {difficulty}</Typography> }
            { isShown && <CountdownTimer targetTime={30} showTimer={setIsShown}></CountdownTimer> }
        </Box>
    )
}

export default DifficultySelection;
