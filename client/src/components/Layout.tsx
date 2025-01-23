import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./Layout.scss";
import LoadingProgress from "./LoadingProgress";
import { Logo } from "./Logo";

export enum LayoutType {
    Page = "PAGE",
    Auth = "AUTH",
}

function Layout({
    children,
    initialised = true,
    layoutType,
    name,
}: {
    children: React.ReactNode;
    initialised?: boolean;
    layoutType: LayoutType;
    name?: string;
}) {
    const authPage = layoutType === LayoutType.Auth;
    return (
        <>
            <Container className="auth-layout">
                {initialised && (
                    <>
                        <Header logo={!authPage} />
                        <Container className="auth-container" component="main" maxWidth={getMaxWidth(layoutType)}>
                            {authPage && (
                                <Box className="auth-logo-layout">
                                    <Logo />
                                </Box>
                            )}
                            {name && (
                                <Typography component="h1" variant="h5">
                                    {name}
                                </Typography>
                            )}
                            {children}
                        </Container>
                        <Footer />
                    </>
                )}
            </Container>
            <LoadingProgress />
        </>
    );
}

function getMaxWidth(type: LayoutType): React.ComponentProps<typeof Container>["maxWidth"] {
    switch (type) {
        case LayoutType.Page:
            return "md";
        case LayoutType.Auth:
            return "xs";
        default:
            return "lg";
    }
}

export default Layout;
