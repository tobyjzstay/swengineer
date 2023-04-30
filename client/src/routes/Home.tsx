import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import React from "react";
import Header from "../components/Header";

const DELAY = 3500;
const COLOUR_DELAY = DELAY + 800;
const HEADER_DELAY = DELAY + 1000;

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
        if (pageRef?.current) {
            pageRef.current.tabIndex = 0;
            pageRef.current.onclick = () => {
                handleInteraction();
            };
            pageRef.current.onkeydown = () => {
                handleInteraction();
            };
        }
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

    function handleInteraction() {
        setHeader(true);
        setColour(true);
        setExpanded(false);
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            ref={pageRef}
            flexGrow={1}
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
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
                                    transition: "color 0.5s",
                                }}
                            >
                                <strong>s</strong>
                                <Collapse
                                    orientation="horizontal"
                                    in={expanded}
                                    unmountOnExit
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
        </Box>
    );
}

export default Home;
