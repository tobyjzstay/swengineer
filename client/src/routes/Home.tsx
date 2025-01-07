import { Collapse, Fade, Typography } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes, useTheme } from "@mui/material/styles";
import React from "react";
import { Trans } from "react-i18next";
import Header from "../components/Header";
import "./Home.scss";

const DELAY = 3500;
const COLOUR_DELAY = DELAY + 800;
const HEADER_DELAY = DELAY + 1000;

function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);
    const [replace, setReplace] = React.useState(false);

    const pageRef = React.useRef<HTMLDivElement>(null);

    const theme = responsiveFontSizes(createTheme(useTheme()), {
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
        <div className="home-page" ref={pageRef}>
            <Fade in={header}>
                <div>
                    <Header />
                </div>
            </Fade>
            <div className="home-container">
                <ThemeProvider theme={theme}>
                    <Typography variant="h1" style={{ lineHeight: 1.25 }}>
                        <Trans i18nKey="home.greeting" />
                        <div
                            className="home-swengineer-container"
                            style={{
                                color: colour ? theme.palette.primary.main : theme.palette.text.primary,
                                backgroundColor: colour ? "#121212" : theme.palette.background.default,
                            }}
                        >
                            {replace ? (
                                <strong className="home-swengineer-text" style={{ color: theme.palette.primary.main }}>
                                    swengineer
                                </strong>
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
                                            <Typography variant="inherit">oft</Typography>
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
                                            <Typography variant="inherit">are&nbsp;</Typography>
                                        </Fade>
                                    </Collapse>
                                    <strong>engineer</strong>
                                </>
                            )}
                        </div>
                        <Trans i18nKey="home.greetingSuffix" />
                    </Typography>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default Home;
