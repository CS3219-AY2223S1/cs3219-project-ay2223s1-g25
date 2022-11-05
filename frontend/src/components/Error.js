import { Box, Typography } from "@mui/material";

function Error() {
    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} height={"60vh"}>
            <Typography variant={"h3"} marginBottom={"0.5em"} textAlign={"center"}>You are accessing this page from another window!</Typography>
            <Typography variant={"h6"} textAlign={"center"}>Close that window to access it from here.</Typography>
        </Box>
    )
}

export default Error;