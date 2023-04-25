import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import { Logo } from "./Logo";

function AuthLayout({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Container
                component="main"
                maxWidth="xs"
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1, marginTop: 8 }}
            >
                <Box sx={{ m: 3 }}>
                    <Logo />
                </Box>
                <Typography component="h1" variant="h5">
                    {name}
                </Typography>
                {children}
            </Container>
            <Footer />
        </Box>
    );
}

export default AuthLayout;
