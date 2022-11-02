import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import DifficultySelection from '../components/DifficultySelection';
import ErrorPage from '../components/Error';
import { useEffect, useState } from "react";
import { getMatchingSocket, createMatchingSocket } from '../socket';
import { getConfig } from "../configs";

function Dashboard() {
    const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    const [isDuplicateSocket, setDuplicateSocket] = useState(false);

    useEffect(() => {
        
        const authSocket = async () => {
            if (isAuthenticated) {
                const domain = getConfig().domain;
                const accessToken = await getAccessTokenSilently({
                    audience: `https://${domain}/api/v2/`,
                    scope: "read:current_user",
                });
                createMatchingSocket(accessToken, user);

                getMatchingSocket().on("duplicateSocket", () => {
                    setDuplicateSocket(true);
                }, [])
            }
        }
        authSocket();
    }, [isAuthenticated, getAccessTokenSilently]);

    if (isDuplicateSocket) {
        return <ErrorPage />;
    } else if (isAuthenticated) {
        return <DifficultySelection />
    } else {
        return (
            <Box display={"flex"} flexDirection={"column"} width={"60%"}>
                <Typography variant={"h3"} marginBottom={"2rem"}>Welcome to PeerPrep</Typography>
                <Typography variant={"h4"} marginBottom={"2rem"}>Please <Button variant={"outlined"} onClick={() => loginWithRedirect()}>Log In</Button> to continue.</Typography>
            </Box>
        )
    }
}

export default Dashboard;
