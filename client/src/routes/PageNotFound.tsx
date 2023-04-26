import { Box, Typography } from "@mui/material";
import PageLayout from "../components/PageLayout";
import { getRequest } from "../components/Request";

const ERROR_MESSAGES = [
    'Exception in thread "main" java.lang.StackOverflowError',
    "Program terminated with signal 11, Segmentation fault.",
    "Uncaught TypeError: Cannot read property 'length' of undefined",
];

export function PageNotFound() {
    getRequest(window.location.pathname);
    return (
        <PageLayout>
            <Box display="flex" flexDirection="column" alignItems="center" flexGrow={1} marginTop={8}>
                <Typography
                    component="h1"
                    variant="h4"
                    color="white"
                    fontFamily="Cascadia Mono"
                    sx={{ overflowWrap: "anywhere" }}
                    textAlign="center"
                >
                    {ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]}
                </Typography>
            </Box>
        </PageLayout>
    );
}

export function PageNotFoundContent() {
    return (
        // display the path the user tried to access
        <Typography component="h1" variant="h5">
            Page not found for path: {window.location.pathname}
        </Typography>
    );
}
