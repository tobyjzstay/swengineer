import { Box, Fade, LinearProgress } from "@mui/material";
import React from "react";
import { AppContext } from "../App";

function Footer() {
    const appContext = React.useContext(AppContext);
    const loading = (appContext?.loading || 0) > 0;

    return (
        <Box position="sticky" component="footer" height={4}>
            <Fade in={loading} unmountOnExit>
                <LinearProgress />
            </Fade>
        </Box>
    );
}

export default Footer;
