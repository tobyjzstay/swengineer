import { Box, Fade, LinearProgress } from "@mui/material";
import React from "react";
import { Context } from "../App";
import "./LoadingProgress.scss";

function LoadingProgress() {
    const context = React.useContext(Context);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (!context) return;
        setLoading(context.loading[0] > 0);
    }, [context.loading[0]]);

    return (
        <Box className="loading-progress">
            <Fade in={loading}>
                <LinearProgress />
            </Fade>
        </Box>
    );
}

export default LoadingProgress;
