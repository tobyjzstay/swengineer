import { Box, Container, TextField } from "@mui/material";
import { Appbar } from "../components/Appbar";
import { Logo } from "../components/Logo";

export function Home() {
    return (
        <>
            <Appbar />
            <Container component="main" maxWidth="md">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Logo />
                    <Container maxWidth="sm">
                        <TextField fullWidth label="Search" />
                    </Container>
                    <Box sx={{ mt: 1, width: "100%" }}></Box>
                </Box>
            </Container>
        </>
    );
}
