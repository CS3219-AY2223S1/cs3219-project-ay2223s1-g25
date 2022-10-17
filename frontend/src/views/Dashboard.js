import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import DifficultySelection from '../components/DifficultySelection';

function Dashboard() {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return isAuthenticated ?  <DifficultySelection /> : (
        <Box display={"flex"} flexDirection={"column"} width={"60%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Welcome to PeerPrep</Typography>
            <Typography variant={"h4"} marginBottom={"2rem"}>Please <Button variant={"outlined"} onClick={() => loginWithRedirect()}>Log In</Button> to continue.</Typography>
        </Box>
    )
}

export default Dashboard;
