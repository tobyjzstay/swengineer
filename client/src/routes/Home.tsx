import { Box, Collapse, Container, Fade, Typography } from "@mui/material";
import { ThemeProvider, responsiveFontSizes, useTheme } from "@mui/material/styles";
import React from "react";
import { Trans } from "react-i18next";
import { Context } from "../App";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingProgress from "../components/LoadingProgress";
import "./Home.scss";

const DELAY = 3500;
const COLOUR_DELAY = DELAY + 800;
const HEADER_DELAY = DELAY + 1000;

function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);
    const [replace, setReplace] = React.useState(false);

    const context = React.useContext(Context);

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
        }, DELAY);
        setTimeout(function () {
            setColour(true);
            setReplace(true);
        }, COLOUR_DELAY);
        setTimeout(function () {
            setHeader(true);
        }, HEADER_DELAY);
    }, [pageRef.current]);

    function handleInteraction() {
        setHeader(true);
        setColour(true);
        setExpanded(false);
        setTimeout(function () {
            setReplace(true);
        }, 800);
    }

    return (
        <>
            <Container className="home-page" ref={pageRef}>
                <Fade in={header}>
                    <div>
                        <Header />
                    </div>
                </Fade>
                <ThemeProvider theme={theme}>
                    <Box className="home-container">
                        <Typography // using `Typography` to handle `responsiveFontSizes`
                            variant="h1"
                        >
                            <Trans i18nKey="home.greeting" />
                            <Box className={"home-swengineer " + (colour ? "colour " + context.mode[0] : "default")}>
                                {replace ? (
                                    <strong>swengineer</strong>
                                ) : (
                                    <>
                                        <strong>s</strong>
                                        <Collapse
                                            in={expanded}
                                            orientation="horizontal"
                                            timeout={{
                                                enter: 250,
                                                exit: 750,
                                            }}
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
                                                enter: 400,
                                                exit: 800,
                                            }}
                                        >
                                            <Fade in={expanded}>
                                                <span>are&nbsp;</span>
                                            </Fade>
                                        </Collapse>
                                        <strong>engineer</strong>
                                    </>
                                )}
                            </Box>
                            <Trans i18nKey="home.greetingSuffix" />
                        </Typography>
                    </Box>
                </ThemeProvider>
                <Fade in={header}>
                    <div>
                        <Footer />
                    </div>
                </Fade>
            </Container>
            <LoadingProgress />
        </>
    );
}

export default Home;
