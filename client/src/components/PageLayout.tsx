import { Box, Container } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import "./PageLayout.scss";

function PageLayout({ children }: { children?: React.ReactNode }) {
    return (
        <Box className="page-layout">
            <Header />
            <Container className="page-container" component="main" maxWidth="md">
                {children}
            </Container>
            <Footer />
        </Box>
    );
}

export default PageLayout;
