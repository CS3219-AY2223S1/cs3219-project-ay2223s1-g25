import {
    Stack, Button, Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { getMatchingSocket, createCollabSocket, createChatSocket } from '../socket';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { API_SERVER, MATCHING_SERVICE, QUESTION_SERVICE, getConfig } from "../configs";

function CountdownTimer({ targetTime, showTimer, setDifficulty, setCategory }) {
    const navigate = useNavigate();
    const [remainingTime, setRemainingTime] = useState(targetTime);
    const { user, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((remainingTime) => remainingTime - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getMatchingSocket().onAny(async (eventName, ...args) => {
            // on matchFail: restart matching process
            // display match fail notification
            if (eventName === "matchFail") {
            }

            // on matchSuccess: redirect both users to their room
            // display match success notification
            else if (eventName === "matchSuccess") {
                const domain = getConfig().domain;
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`,
                    scope: "read:current_user",
                });
                createCollabSocket(accessToken);
                createChatSocket(accessToken);

                let config = { headers: {
                    Authorization: "Bearer " + accessToken
                }};
                axios.get(API_SERVER + MATCHING_SERVICE + "/room", config).then(res => {
                    return res.data.roomId;
                })
                .then((data) => {
                    axios.get(API_SERVER + QUESTION_SERVICE + `/getQuestionByRoom?roomId=${data}`, config)
                        .then((res) => {
                            navigate('/room', { state: res.data.body });
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    });
            } 
            
            // else if (eventName === "duplicateSocket") {
            //     cancelMatching(user.sub);
            // }
        }, [])
    });

    const cancelMatching = (userId) => {
        getMatchingSocket().emit("timeout", {
            "userId": userId
        });
        showTimer(false);
        setDifficulty("");
        setCategory("");
    }

    if (remainingTime <= 0) {
        getMatchingSocket().emit("timeout", {
            "userId": user.sub
        });
        return (
            <Stack direction="column"
            justifyContent="center"
            alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"} color="red">No match found! Try again in a few minutes!</Typography>
                <Button variant="contained" color="secondary" type="submit" size="large" onClick={() => cancelMatching(user.sub)} startIcon={<ArrowBack />}>Back</Button>
            </Stack>
        )
    } else {
        return (
            <Stack direction="column"
                justifyContent="center"
                alignItems="center">
                <Typography sx={{ fontWeight: '500' }} marginBottom={"2rem"}>Time Remaining: {remainingTime} seconds</Typography>
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => cancelMatching(user.sub)}>Cancel matching</Button>
            </Stack>
        )
    }
}

export default CountdownTimer;
