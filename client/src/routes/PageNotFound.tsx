import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { getRequest } from "../components/Request";
import "./PageNotFound.scss";

function PageNotFound() {
    const context = React.useContext(Context);

    const theme = useTheme();

    React.useMemo(() => {
        context.loading[1]((prev) => prev + 1);
        getRequest(window.location.pathname).then(async (response) => {
            context.loading[1]((prev) => prev - 1);
        });
    }, []);

    return (
        <Layout layoutType={LayoutType.Page}>
            <Box className="page-not-found-container">
                <Typography
                    className="page-not-found-text"
                    color={theme.palette.primary.main}
                    component="h1"
                    variant="h4"
                >
                    Page not found
                </Typography>
            </Box>
        </Layout>
    );
}

export default PageNotFound;
