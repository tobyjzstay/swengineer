import { Box, Fade, LinearProgress } from "@mui/material";
import React from "react";
import { AppContext } from "../App";

function Footer() {
    const appContext = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setLoading((appContext?.loading || 0) > 0);
    }, [appContext?.loading]);

    return (
        <Box position="sticky" marginTop="auto" component="footer" height={4}>
            <Fade in={loading} unmountOnExit>
                <LinearProgress />
            </Fade>
        </Box>
    );
}

export default Footer;
