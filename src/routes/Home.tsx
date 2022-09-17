import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import React from "react";

import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";

let theme = createTheme();
theme = responsiveFontSizes(theme, {
    factor: 5,
});

export function Home() {
    const [expanded, setExpanded] = React.useState(true);

    React.useEffect(() => {
        setTimeout(function () {
            setExpanded(false);
        }, 2500);
    }, []);

    return (
        <>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "left",
                    minHeight: "100vh",
                }}
            >
                <Box>
                    <ThemeProvider theme={theme}>
                        <Typography component="h1" variant="h1">
                            Hi, I&apos;m <strong>Toby</strong>,
                            <br />
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Typography component="h1" variant="h1" style={{ whiteSpace: "pre" }}>
                                    a{" "}
                                </Typography>
                                <strong>s</strong>
                                <Collapse
                                    orientation="horizontal"
                                    in={expanded}
                                    timeout={{
                                        enter: 250,
                                        exit: 1000,
                                    }}
                                >
                                    <Fade in={expanded}>
                                        <Typography component="h1" variant="h1">
                                            oft
                                        </Typography>
                                    </Fade>
                                </Collapse>
                                <strong>w</strong>
                                <Collapse
                                    orientation="horizontal"
                                    in={expanded}
                                    timeout={{
                                        enter: 400,
                                        exit: 800,
                                    }}
                                >
                                    <Fade in={expanded}>
                                        <Typography component="h1" variant="h1" style={{ whiteSpace: "pre" }}>
                                            are{" "}
                                        </Typography>
                                    </Fade>
                                </Collapse>
                                <strong>engineer</strong>.
                            </div>
                        </Typography>
                    </ThemeProvider>
                    <Box sx={{ mt: 1, width: "100%" }}></Box>
                </Box>
            </Container>
        </>
    );
}
