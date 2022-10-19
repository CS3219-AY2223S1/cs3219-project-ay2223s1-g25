import { Box, Typography, Skeleton, Chip } from "@mui/material";
import { useState, useEffect } from "react";
import { API_SERVER, QUESTION_SERVICE, MATCHING_SERVICE, getConfig } from "../configs";
import { capitalizeFirst } from "../utils/matching-helper"
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import '../difficulty-colors.css'

function Question() {
    const [question, setQuestion] = useState({title: "Loading...", description: "Loading...", difficulty: "easy"});
    const [loading, setLoading] = useState(false);
    const [classList, setClassList] = useState("");
    const { getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        setLoading(true);
        const getQuestion = async () => {
            const domain = getConfig().domain;
            const accessToken = await getAccessTokenSilently({
                audience: `https://${domain}/api/v2/`,
                scope: "read:current_user",
            });
            let config = { headers: {
                Authorization: "Bearer " + accessToken
            }};
            
            axios.get(API_SERVER + MATCHING_SERVICE + "/room", config).then(res => {
                return res.data.difficulty;
            })
            // .then((difficulty) => axios.get(API_SERVER + QUESTION_SERVICE + `/getQuestionByDiff?difficulty=${difficulty}`, config)
            .then((diff) => axios.get(`http://localhost:6001/api/question/getQuestionByDiff?difficulty=${diff}`)
                .then((res) => {
                    setQuestion(res.data.body);
                    setLoading(false);
                    setClassList(`${question.difficulty} MuiChip-root MuiChip-filled MuiChip-sizeMedium MuiChip-colorDefault MuiChip-filledDefault css-gac2fo-MuiChip-root`)
                })
                .catch((err) => {
                    console.log(err)
                }))
        };
        getQuestion().catch(console.error);;
    }, [getAccessTokenSilently, question.difficulty]);

    return (
        <Box display={"flex"} flexDirection={"column"} >
            { loading && <Skeleton variant="rounded" width={"70vw"} height={"30vw"}/> }
            { !loading && <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>
                <Chip label={capitalizeFirst(question.difficulty)} class={classList} />
                </Typography> }
            { !loading && <Typography variant={"body"} marginBottom={"1.5rem"}>{question.description}</Typography> }
        </Box>
    )
}

export default Question;
