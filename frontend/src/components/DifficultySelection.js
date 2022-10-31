import { Box, Stack, Button, Typography, FormControl, FormControlLabel, RadioGroup, Radio, Select, MenuItem, InputLabel } from "@mui/material";
import { useState, useEffect } from "react";
import JoinRightIcon from '@mui/icons-material/JoinRight';
import CountdownTimer from "./CountdownTimer.js";
import { startMatching } from "../utils/matching-helper.js"
import { useAuth0 } from "@auth0/auth0-react";

function DifficultySelection() {
    const [difficulty, setDifficulty] = useState("");
    const [category, setCategory] = useState("");
    const [isShown, setIsShown] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [isHardDisabled, setHardDisabled] = useState(false);
    const [isShellDisabled, setShellDisabled] = useState(false);
    const [isConcurrencyDisabled, setConcurrencyDisabled] = useState(false);
    const { user } = useAuth0();
    
    useEffect(() => {
        setIsDisabled(difficulty === "" && category === "");
        if (difficulty == "Hard") {
            setShellDisabled(true);
            setConcurrencyDisabled(true);
        } else if (category === "Shell" || category === "Concurrency") {
            setHardDisabled(true);
        } else {
            setShellDisabled(false);
            setConcurrencyDisabled(false);
            setHardDisabled(false);
        }
        
    }, [difficulty, category])

    const categorySelect = (e) => {
        setCategory(e.target.value);
    };
    const difficultySelect = (e) => {
        setDifficulty(e.target.value);
    };

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
                    <RadioGroup name="controlled-radio-buttons-group" onChange={difficultySelect}>
                        <FormControlLabel value="Easy" control={<Radio />} label="Easy" />
                        <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="Hard" control={<Radio />} label="Hard" disabled={isHardDisabled}/>
                    </RadioGroup>
                    <FormControl fullWidth>
                        <InputLabel id="category-select-label">Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-simple-select"
                            value={category}
                            label="Category"
                            onChange={categorySelect}>
                            <MenuItem value={"Algorithms"}>Algorithms</MenuItem>
                            <MenuItem value={"Databases"}>Databases</MenuItem>
                            <MenuItem value={"Shell"} disabled={isShellDisabled}>Shell</MenuItem>
                            <MenuItem value={"Concurrency"} disabled={isConcurrencyDisabled}>Concurrency</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" disabled={isDisabled} color="success" type="submit" size="large" onClick={() => startMatching(user.sub, difficulty, category, setIsShown)} endIcon={<JoinRightIcon />}>Find a match</Button>
                </Stack>
            </FormControl> )}

            { isShown && <Typography variant={"h3"} marginBottom={"1.5rem"}>Looking for a match...</Typography> }
            { isShown && difficulty != "" && <Typography variant={"subtitle1"}>Difficulty: {difficulty}</Typography> }
            { isShown && category != "" && <Typography variant={"subtitle1"}>Category: {category}</Typography> }
            { isShown && <Typography marginBottom={"1.5rem"}></Typography> }
            { isShown && <CountdownTimer targetTime={30} showTimer={setIsShown} setDifficulty={setDifficulty} setCategory={setCategory}></CountdownTimer> }
        </Box>
    )
}

export default DifficultySelection;
