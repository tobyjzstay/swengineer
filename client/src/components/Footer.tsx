import { Box, Fade, LinearProgress } from "@mui/material";
import React from "react";
import { AppContext } from "../App";
import "./Footer.scss";

function Footer() {
    const appContext = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!appContext) return;
        setLoading(appContext.loading > 0);
    }, [appContext?.loading]);

    return (
        <Box className="footer-layout" component="footer">
            <Fade in={loading} unmountOnExit>
                <LinearProgress />
            </Fade>
        </Box>
    );
}

export default Footer;
