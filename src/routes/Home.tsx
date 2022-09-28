import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import React from "react";

import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import { Appbar } from "../components/Appbar";

const DELAY = 3500;
const COLOUR_DELAY = DELAY + 800;
const HEADER_DELAY = DELAY + 1000;

export function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);

    let theme = createTheme();
    theme = responsiveFontSizes(theme, {
        factor: 5,
    });

    React.useLayoutEffect(() => {
        document.body.addEventListener("click", handleClick, true);
        document.body.addEventListener("keypress", handleClick, true);
        setTimeout(function () {
            setExpanded(false);
        }, DELAY);
        setTimeout(function () {
            setColour(true);
        }, COLOUR_DELAY);
        setTimeout(function () {
            setHeader(true);
        }, HEADER_DELAY);
    }, []);

    function handleClick() {
        setHeader(true);
        setColour(true);
        setExpanded(false);
    }

    return (
        <>
            <Fade in={header}>
                <Box>
                    <Appbar />
                </Box>
            </Fade>
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
                onClick={handleClick}
            >
                <ThemeProvider theme={theme}>
                    <Typography component="h1" variant="h1">
                        Hi, I&apos;m <strong>Toby</strong>,
                        <br />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Typography component="h1" variant="h1" style={{ whiteSpace: "pre" }}>
                                a{" "}
                            </Typography>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    color: colour ? "#fdd835" : "#fff",
                                    transition: "color 0.5s",
                                }}
                            >
                                <strong>s</strong>
                                <Collapse
                                    orientation="horizontal"
                                    in={expanded}
                                    timeout={{
                                        enter: 250,
                                        exit: 750,
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
                                <strong>engineer</strong>
                            </div>
                            .
                        </div>
                    </Typography>
                </ThemeProvider>
            </Container>
        </>
    );
}
