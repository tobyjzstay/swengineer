import { Box, Container, Typography } from "@mui/material";
import React from "react";
import "./AuthLayout.scss";
import Footer from "./Footer";
import Header from "./Header";
import LoadingProgress from "./LoadingProgress";
import { Logo } from "./Logo";

function AuthLayout({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <>
            <Container className="auth-layout" maxWidth="lg">
                <Header logo={false} />
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
            </Container>
            <LoadingProgress />
        </>
    );
}

export default AuthLayout;
