import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import { ThemeProvider, responsiveFontSizes, useTheme } from "@mui/material/styles";
import React from "react";
import Header from "../components/Header";
import "./Home.scss";

const TRANSITION_DURATION = 750;
const TRANSITION_DELAY = 3000;
const COLOUR_DURATION = 500;
const COLOUR_DELAY = TRANSITION_DELAY + COLOUR_DURATION;
const HEADER_DELAY = TRANSITION_DELAY + 1000;

function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);

    const pageRef = React.useRef<HTMLDivElement>(null);

    const theme = responsiveFontSizes(useTheme(), {
        factor: 5,
    });

    React.useLayoutEffect(() => {
        if (!pageRef.current) return;
        pageRef.current.focus();
        pageRef.current.onclick = handleInteraction;
        pageRef.current.onkeydown = handleInteraction;
        setTimeout(function () {
            setExpanded(false);
        }, TRANSITION_DELAY);
        setTimeout(function () {
            setColour(true);
        }, COLOUR_DELAY);
        setTimeout(function () {
            setHeader(true);
        }, HEADER_DELAY);
    }, [pageRef.current]);

    function handleInteraction() {
        setHeader(true);
        setColour(true);
        setExpanded(false);
    }

    return (
        <Box className="home-layout" ref={pageRef}>
            <Fade in={header}>
                <Box className="home-header-container">
                    <Header />
                </Box>
            </Fade>
            <Container className="home-container" component="main" maxWidth="md">
                <ThemeProvider theme={theme}>
                    <Typography className="home-text" component="h1" variant="h1">
                        Hi, I&apos;m <strong>Toby</strong>,
                        <br />
                        <span className="home-text-line">
                            <span>a </span>
                            <span
                                className="home-text-word"
                                style={{
                                    color: colour ? theme.palette.primary.main : theme.palette.text.primary,
                                }}
                            >
                                <strong>s</strong>
                                <Collapse
                                    in={expanded}
                                    orientation="horizontal"
                                    timeout={{
                                        exit: TRANSITION_DURATION,
                                    }}
                                    unmountOnExit
                                >
                                    <Fade in={expanded}>
                                        <span>oft</span>
                                    </Fade>
                                </Collapse>
                                <strong>w</strong>
                                <Collapse
                                    in={expanded}
                                    orientation="horizontal"
                                    timeout={{
                                        exit: TRANSITION_DURATION,
                                    }}
                                >
                                    <Fade in={expanded}>
                                        <span>are </span>
                                    </Fade>
                                </Collapse>
                                <strong>engineer</strong>
                            </span>
                            .
                        </span>
                    </Typography>
                </ThemeProvider>
            </Container>
        </Box>
    );
}

export default Home;
