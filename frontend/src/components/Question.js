import { Box, Typography, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { capitalizeFirst } from "../utils/matching-helper"
import '../difficulty-colors.css'

function Question({ question }) {
    // const [question, setQuestion] = useState({title: "Loading...", description: "Loading...", difficulty: "easy"});
    // const [loading, setLoading] = useState(false);
    const [classList, setClassList] = useState("");

    useEffect(() => {
        // setLoading(true);
        setClassList(`${question.difficulty} MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-filledDefault css-gac2fo-MuiChip-root`)
        // setLoading(false);
    }, [question.difficulty]);

    return (
        <Box display={"flex"} flexDirection={"column"} >
            {/* { loading && <Skeleton variant="rounded" width={"70vw"} height={"30vw"}/> } */}
            {/* { !loading && <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>
                <Chip label={capitalizeFirst(question.difficulty)} class={classList} />
                </Typography> }
            { !loading && <Typography variant={"body"} marginBottom={"1.5rem"}>{question.description}</Typography> } */}
            <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography>
            <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>
                <Chip label={capitalizeFirst(question.difficulty)} class={classList} />
            </Typography>
            <Typography variant={"body"} marginBottom={"1.5rem"}>{question.description}</Typography>
        </Box>
    )
}

export default Question;
