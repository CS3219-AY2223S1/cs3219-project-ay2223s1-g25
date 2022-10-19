import { Box, Typography, Skeleton } from "@mui/material";
import { useState, useEffect } from "react";
import { API_SERVER, QUESTION_SERVICE, MATCHING_SERVICE } from "../configs";
import { getConfig } from "../configs";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

function Question() {
    const [question, setQuestion] = useState({title: "Loading...", description: "Loading..."});
    const [loading, setLoading] = useState(false);
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
            .then((difficulty) => axios.get(API_SERVER + QUESTION_SERVICE + `/getQuestionByDiff?difficulty=${difficulty}`, config)
            .then((res) => {
                setQuestion(res.data.body);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err)
            }))
        };
        getQuestion().catch(console.error);;
    }, [getAccessTokenSilently]);

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems="center" maxHeight={"80vh"}>
            { loading && <Skeleton variant="rounded" width={"70vw"} height={"30vw"}/> }
            { !loading && <Typography variant={"h3"} marginBottom={"1.5rem"}>{question.title}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>{question.description}</Typography> }
            { !loading && <Typography variant={"subtitle1"} marginBottom={"1.5rem"}>Difficulty: {question.difficulty}</Typography> }
        </Box>
    )
}

export default Question;
