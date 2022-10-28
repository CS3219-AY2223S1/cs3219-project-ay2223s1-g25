import { Box, Typography, Chip, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { capitalizeFirst } from "../utils/matching-helper"
import '../difficulty-colors.css';
import '../skeleton.css' ;

function Question({ question }) {
    const [classList, setClassList] = useState("");

    useEffect(() => {
        setClassList(`${question.difficulty} MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-filledDefault css-gac2fo-MuiChip-root`)
    }, [question.difficulty]);

    return (
        <Box display={"flex"} flexDirection={"column"} >
            <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography>
            <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>
                <Chip label={capitalizeFirst(question.difficulty)} className={classList} />
                </Typography>
            <Typography variant={"body"} marginBottom={"1.5rem"}>{question.description}</Typography>
        </Box>
    )
}

export default Question;
