import { Box, Container, Typography } from "@mui/material";
import { Logo } from "../components/Logo";
import { getRequest } from "../components/Request";

export function PageNotFound() {
    
    getRequest(window.location.pathname);
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ m: 3 }}>
                    <Logo />
                </Box>
                <PageNotFoundContent />
            </Box>
        </Container>
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
