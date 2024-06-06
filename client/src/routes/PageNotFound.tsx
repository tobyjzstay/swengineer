import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import PageLayout from "../components/PageLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest } from "../components/Request";
import "./PageNotFound.scss";

function PageNotFound() {
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);

    React.useMemo(() => {
        getRequest(window.location.pathname).then(async (response) => {
            const json = await response.json();
            setComponentToRender(<PageNotFoundComponent message={json?.message || response.text()} />);
        });
    }, []);

    return componentToRender;
}

export function PageNotFoundComponent({ message }: { message?: string }) {
    const theme = useTheme();

    return (
        <PageLayout>
            <Box className="page-not-found-container">
                <Typography
                    className="page-not-found-text"
                    color={theme.palette.primary.main}
                    component="h1"
                    variant="h4"
                >
                    {message}
                </Typography>
            </Box>
        </PageLayout>
    );
}

export default PageNotFound;
