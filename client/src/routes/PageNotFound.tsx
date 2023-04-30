import { Box, Typography } from "@mui/material";
import PageLayout from "../components/PageLayout";
import { getRequest } from "../components/Request";

const ERROR_MESSAGES = [
    'Exception in thread "main" java.lang.NullPointerException', // Java
    "Error: ENOENT: no such file or directory, open '/dev/null'", // Node.js
    "Program terminated with signal 11, Segmentation fault.", // C
    "Uncaught TypeError: Cannot read properties of null (reading 'render')", // JavaScript
];

function PageNotFound() {
    getRequest(window.location.pathname);
    return <PageNotFoundComponent />;
}

export function PageNotFoundComponent() {
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
                    {ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]}
                </Typography>
            </Box>
        </PageLayout>
    );
}

export default PageNotFound;
