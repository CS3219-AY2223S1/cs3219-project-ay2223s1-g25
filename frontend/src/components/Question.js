import { Box, Typography, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import {URL_MATCHING_SVC} from "../configs";

function Question({ difficulty }) {
    const [question, setQuestion] = useState({title: "Loading...", description: "Loading..."});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${URL_MATCHING_SVC}/getQuestionByDiff?difficulty=${difficulty}`)
            .then((res) => {
                setQuestion(res.data.body);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>
            { loading && <Skeleton variant="rounded" width={"70vw"} height={"30vw"}/> }
            { !loading && <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>{question.description}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>Difficulty: {difficulty}</Typography> }
        </Box>
    )
}

export default Question;
