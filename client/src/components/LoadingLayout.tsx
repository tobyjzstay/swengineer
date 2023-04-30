import { Box } from "@mui/material";
import React from "react";
import { AppContext } from "../App";
import Footer from "./Footer";

function LoadingLayout() {
    const appContext = React.useContext(AppContext);

    React.useEffect(() => {
        appContext?.startLoading();
        return () => appContext?.stopLoading();
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Footer />
        </Box>
    );
}

export default LoadingLayout;
