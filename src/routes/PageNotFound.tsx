import { Box, Container, Link, Typography } from "@mui/material";

export default function PageNotFound() {
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
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Box display="flex" flexDirection="row" alignItems="center" sx={{ m: 3 }}>
                        <img
                            src={process.env.PUBLIC_URL + "logo.svg"}
                            alt="swengineer"
                            width={64}
                            style={{ padding: 10 }}
                        />
                        <Typography component="h1" variant="h4" color="white">
                            swengineer
                        </Typography>
                    </Box>
                </Link>
                <Typography component="h1" variant="h5">
                    Page not found
                </Typography>
            </Box>
        </Container>
    );
}
