import { Box, Container, Typography } from "@mui/material";
import React from "react";
import "./AuthLayout.scss";
import Footer from "./Footer";
import { Logo } from "./Logo";

function AuthLayout({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <Box className="auth-layout">
            <Container className="auth-container" component="main" maxWidth="xs">
                <Box className="auth-logo-layout">
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
