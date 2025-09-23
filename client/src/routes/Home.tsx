import { Box, Container, Typography } from "@mui/material";
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
        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
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
        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };
    }, [pageRef.current]);

    function handleInteraction() {
        setHeader(true);
        setColour(true);
        setExpanded(false);
        setTimeout(function () {
            setReplace(true);
        }, COLOUR_DELAY);
    }

    return (
        <>
            <Container className="home-page" ref={pageRef}>
                <div className={"home-header " + (header ? "visible" : "")}>
                    <Header />
                </div>
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
                                        <Collapse in={expanded} timeout={750}>
                                            <Typography variant="h1">oft</Typography>
                                        </Collapse>
                                        <strong>w</strong>
                                        <Collapse in={expanded} timeout={800}>
                                            <Typography variant="h1">are&nbsp;</Typography>
                                        </Collapse>
                                        <strong>engineer</strong>
                                    </>
                                )}
                            </Box>
                            <Trans i18nKey="home.greetingSuffix" />
                        </Typography>
                    </Box>
                </ThemeProvider>
                <div className={"home-footer " + (header ? "visible" : "")}>
                    <Footer />
                </div>
            </Container>
            <LoadingProgress />
        </>
    );
}

function Collapse({ children, in: expanded, timeout }: { children: React.ReactNode; in: boolean; timeout: number }) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        if (!ref.current) return;

        const updateWidth = () => {
            if (ref.current) setWidth(ref.current.scrollWidth);
        };

        updateWidth();

        const observer = new ResizeObserver(updateWidth);
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [children]);

    return (
        <span
            className={`collapse ${expanded ? "" : "hidden"}`}
            ref={ref}
            style={
                expanded
                    ? {
                          maxWidth: width,
                      }
                    : {
                          maxWidth: 0,
                          transition: `max-width ${timeout}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 225ms cubic-bezier(0.4, 0, 0.2, 1)`,
                      }
            }
        >
            {children}
        </span>
    );
}

export default Home;
