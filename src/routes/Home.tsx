import { Box, Container, Typography } from "@mui/material";

export default function Home() {
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img src={process.env.PUBLIC_URL + "logo.svg"} alt="swengineer" width={128} style={{ padding: 20 }} />
                <Typography component="h1" variant="h2">
                    swengineer
                </Typography>
            </Box>
        </Container>
    );
}
