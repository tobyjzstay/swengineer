import { Box, Container, Typography } from "@mui/material";
import { ThemeProvider, responsiveFontSizes, useTheme } from "@mui/material/styles";
import React from "react";
import { Trans } from "react-i18next";
import { Context } from "../App";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingProgress from "../components/LoadingProgress";
import "./Home.scss";

const INITIALISE_DELAY = 3500;
const INITIALISED_DELAY = 1000;
const SWENGINEER_DURATION = 2000;
const SYNONYM_DURATION = 500;

const SWENGINEER = "swengineer";
const SYNONYMS = ["software engineer", "coder", "developer", "programmer"];

function Home() {
    const [initialise, setInitialise] = React.useState(false);
    const [initialised, setInitialised] = React.useState(false);
    const [expanded, setExpanded] = React.useState(true);
    const [colour, setColour] = React.useState(false);

    const [currentWord, setCurrentWord] = React.useState(SWENGINEER);
    const [displayedText, setDisplayedText] = React.useState(currentWord);
    const [cursorIndex, setCursorIndex] = React.useState(0);
    const [deleting, setDeleting] = React.useState(false);
    const [synonymWord, setSynonymWord] = React.useState(false);

    const randomSynonyms = React.useMemo(() => {
        const shuffled = SYNONYMS.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, shuffled.length);
    }, []);

    React.useEffect(() => {
        if (!initialised) return;
        let timeout: NodeJS.Timeout;

        if (!deleting && displayedText === currentWord)
            timeout = setTimeout(() => setDeleting(true), synonymWord ? SYNONYM_DURATION : SWENGINEER_DURATION);
        else if (deleting && displayedText === "") {
            if (synonymWord) {
                setCurrentWord(SWENGINEER);
                setSynonymWord(false);
            } else {
                const nextIndex = cursorIndex % randomSynonyms.length;
                setCurrentWord(randomSynonyms[nextIndex]);
                setCursorIndex(nextIndex + 1);
                setSynonymWord(true);
            }
            setDeleting(false);
        } else {
            timeout = setTimeout(
                () => {
                    setDisplayedText((prev) => (deleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)));
                },
                deleting ? 80 : 120
            );
        }

        return () => clearTimeout(timeout);
    }, [displayedText, deleting, initialised, cursorIndex, currentWord, synonymWord]);

    const context = React.useContext(Context);

    const theme = responsiveFontSizes(useTheme(), {
        factor: 5,
    });

    React.useLayoutEffect(() => {
        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);
        const timer = setTimeout(function () {
            setInitialise(true);
        }, INITIALISE_DELAY);
        return () => {
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            clearTimeout(timer);
        };
    }, []);

    React.useEffect(() => {
        if (!initialise) return;
        setColour(true);
        setExpanded(false);
        const timer = setTimeout(() => {
            setInitialised(true);
        }, INITIALISED_DELAY);
        return () => clearTimeout(timer);
    }, [initialise]);

    function handleInteraction() {
        setInitialise(true);
    }

    const isTyping = deleting || displayedText.length !== currentWord.length;

    return (
        <>
            <Container className="home-page">
                <div className={"home-header " + (initialised ? "visible" : "")}>
                    <Header />
                </div>
                <ThemeProvider theme={theme}>
                    <Box className="home-container">
                        <Typography // using `Typography` to handle `responsiveFontSizes`
                            variant="h1"
                        >
                            <Trans i18nKey="home.greeting" />
                            <Box className={"home-swengineer " + (colour ? "colour " + context.mode[0] : "default")}>
                                {initialised ? (
                                    <strong className={`keyword ${isTyping ? "typing" : ""}`}>{displayedText}</strong>
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
                                        <strong className="keyword">engineer</strong>
                                    </>
                                )}
                            </Box>
                            <Trans i18nKey="home.greetingSuffix" />
                        </Typography>
                    </Box>
                </ThemeProvider>
                <div className={"home-footer " + (initialised ? "visible" : "")}>
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
