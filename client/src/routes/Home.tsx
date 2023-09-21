import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import React from "react";
import Header from "../components/Header";

const TRANSITION_DURATION = 750;
const TRANSITION_DELAY = 3000;
const COLOUR_DURATION = 500;
const COLOUR_DELAY = TRANSITION_DELAY + COLOUR_DURATION;
const HEADER_DELAY = TRANSITION_DELAY + 1000;

let theme = createTheme();
theme = responsiveFontSizes(theme, {
    factor: 5,
});

function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);

    const pageRef = React.useRef<HTMLDivElement>(null);

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
        <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
            ref={pageRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                outline: "none",
            }}
            tabIndex={0}
        >
            <Fade in={header}>
                <Box>
                    <Header />
                </Box>
            </Fade>
            <Container
                component="main"
                maxWidth="md"
                sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1, marginY: 2 }}
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
                                    transition: "color 500ms",
                                }}
                            >
                                <strong>s</strong>
                                <Collapse
                                    orientation="horizontal"
                                    in={expanded}
                                    unmountOnExit
                                    timeout={{
                                        exit: TRANSITION_DURATION,
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
                                        exit: TRANSITION_DURATION,
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
        </Box>
    );
}

export default Home;
