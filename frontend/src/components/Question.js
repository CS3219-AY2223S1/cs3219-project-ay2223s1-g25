import { Box, Typography, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import '../chip-colors.css';
import '../skeleton.css' ;
import '../question.css'
import ReactHtmlParser from 'html-react-parser'; 

function Question({ question }) {
    const [classList, setClassList] = useState("");
    const [tagList, setTagList] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        setClassList(`${question.difficulty} chip MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-filledDefault css-gac2fo-MuiChip-root`)
        setTagList(`${question.categoryTitle} chip MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-filledDefault css-gac2fo-MuiChip-root`)
        var newString = `${question.content}`.replaceAll("\\n\\n", "");
        newString = newString.replaceAll("\\n", "<br>")
        newString = newString.replaceAll("\\t", "")
        newString = newString.replaceAll("<p>&nbsp;</p>", "<p></p>");
        setContent(newString);
    }, [question.difficulty, question.content, question.categoryTitle]);

    return (
        <Box display={"flex"} flexDirection={"column"} className="questionContainer">
            <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography>
            <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>
                <Chip label={question.difficulty} className={classList} />
                <Chip label={question.categoryTitle} className={tagList} />
            </Typography>
            <div className="question">
                { ReactHtmlParser (content) }
            </div>
        </Box>
    )
}

export default Question;
