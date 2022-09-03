import { Box, Container, Typography } from "@mui/material";
import { Logo } from "../components/Logo";

export function PageNotFound() {
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
                <Logo />
                <PageNotFoundContent />
            </Box>
        </Container>
    );
}

export function PageNotFoundContent() {
    return (
        <Typography component="h1" variant="h5">
            Page not found
        </Typography>
    );
}
