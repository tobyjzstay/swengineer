import { Box, Container } from "@mui/material";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

function PageLayout({ children }: { children?: React.ReactNode }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Header />
            <Container
                component="main"
                maxWidth="md"
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginY: 2 }}
            >
                {children}
            </Container>
            <Footer />
        </Box>
    );
}

export default PageLayout;
