import { Collapse, Fade, Typography } from "@mui/material";
import { ThemeProvider, createTheme, responsiveFontSizes, useTheme } from "@mui/material/styles";
import React from "react";
import Header from "../components/Header";
import "./Home.scss";

const DELAY = 3500;
const COLOUR_DELAY = DELAY + 800;
const HEADER_DELAY = DELAY + 1000;

function Home() {
    const [header, setHeader] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);
    const [replaceText, setReplaceText] = React.useState(false);

    const pageRef = React.useRef<HTMLDivElement>(null);

    const theme = responsiveFontSizes(createTheme(useTheme()), {
        factor: 5,
    });

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
        setTimeout(function () {
            setReplaceText(true);
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
                    <Typography component="h1" variant="h1">
                        Hi, I&apos;m <strong>Toby</strong>,
                        <br />
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <Typography variant="h1">
                                a&nbsp;
                                {replaceText ? (
                                    <strong style={{ color: theme.palette.primary.main }}>swengineer</strong>
                                ) : (
                                    <div
                                        className="home-swengineer"
                                        style={{
                                            color: colour ? theme.palette.primary.main : theme.palette.text.primary,
                                        }}
                                    >
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
                                                <Typography variant="h1">oft</Typography>
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
                                                <Typography variant="h1">are&nbsp;</Typography>
                                            </Fade>
                                        </Collapse>
                                        <strong>engineer</strong>
                                    </div>
                                )}
                                .
                            </Typography>
                        </div>
                    </Typography>
                </ThemeProvider>
            </div>
        </div>
    );
}

export default Home;
