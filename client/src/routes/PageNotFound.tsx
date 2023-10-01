import { Box, Typography } from "@mui/material";
import React from "react";
import PageLayout from "../components/PageLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest } from "../components/Request";

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
    return (
        <PageLayout>
            <Box alignItems="center" display="flex" flexDirection="column" flexGrow={1} justifyContent="center">
                <Typography
                    component="h1"
                    variant="h4"
                    color="white"
                    fontFamily="Cascadia Mono"
                    sx={{ overflowWrap: "anywhere" }}
                    textAlign="center"
                >
                    {message}
                </Typography>
            </Box>
        </PageLayout>
    );
}

export default PageNotFound;
