import { Box, Button, Stack, Divider, Snackbar, Alert } from "@mui/material";
import { leaveRoom } from "../utils/matching-helper"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMatchingSocket } from '../socket';
import { useAuth0 } from "@auth0/auth0-react";
import TextEditor from '../components/TextEditor'
import Question from "../components/Question";
import ChatBox from '../components/ChatBox';
import { useLocation } from "react-router-dom";

function Room() {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { state } = useLocation();
    const [openToast, setOpenToast] = useState(false);

    useEffect(() => {
        getMatchingSocket().on("matchExited", () => {
            navigate('/');
        }, [])

        // TODO
        getMatchingSocket().on("oneClientRoom", () => {
            console.log("Friend has left the room!");
            // Open toast
            setOpenToast(true);
        }, [])
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenToast(false);
    };

    return (          
        <Box display={"flex"} flexDirection={"column"} alignItems="center">
            <Stack
                direction={{ xs: 'column', sm: 'column', md: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                divider={<Divider orientation="vertical" flexItem />}
                m={2}>
                <Question question={state}/>
                <TextEditor/>
            </Stack>
            <Stack
                direction={"column"}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                mt={6}>
                <ChatBox/>
                <Button variant="contained" color="error" type="submit" size="large" onClick={() => leaveRoom(user.sub)}>Leave Room</Button>
            </Stack>
            <Snackbar open={openToast} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Your friend has left the room!
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default Room;
