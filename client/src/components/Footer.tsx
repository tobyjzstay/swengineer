import { Box, Fade, LinearProgress } from "@mui/material";
import React from "react";
import { Context } from "../App";
import "./Footer.scss";

function Footer() {
    const context = React.useContext(Context);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!context) return;
        setLoading(context.loading[0] > 0);
    }, [context.loading[0]]);

    return (
        <Box className="footer-layout" component="footer">
            <Fade in={loading} unmountOnExit>
                <LinearProgress />
            </Fade>
        </Box>
    );
}

export default Footer;
