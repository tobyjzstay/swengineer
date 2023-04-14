import { Container, Typography } from "@mui/material";
import React from "react";

const MICROSECOND = 1 / 1000;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const YEAR = DAY * 365.2425;

const START_TIME = new Date("November 11, 2014").getTime();
const TIME_DILATION = (7 * YEAR) / HOUR;
const UPDATE_RATE = Math.floor(minUnit(1 / TIME_DILATION));

export function Clock() {
    const timeRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const element = timeRef.current;
        setInterval(() => tick(element), UPDATE_RATE);
    }, []);

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                minHeight: "100vh",
            }}
        >
            <Typography ref={timeRef} component="h1" variant="h1" />
            <Typography variant="subtitle1">{"have passed on Miller's planet"}</Typography>
        </Container>
    );
}

function tick(element: HTMLDivElement | null) {
    if (!element) return;
    const timeElapsed = new Date().getTime() - START_TIME;
    const ratioTimeElapsed = timeElapsed / TIME_DILATION;

    const microseconds = Math.floor(Math.floor((ratioTimeElapsed / MICROSECOND) % 1000));
    const milliseconds = Math.floor(ratioTimeElapsed % 1000);
    const seconds = Math.floor((ratioTimeElapsed / SECOND) % 60);
    const minutes = Math.floor((ratioTimeElapsed / MINUTE) % 60);
    const hours = Math.floor((ratioTimeElapsed / HOUR) % 24);
    const days = Math.floor(Math.floor(ratioTimeElapsed / DAY) % 365.2425);
    const years = Math.floor(ratioTimeElapsed / YEAR);

    const strYears = years ? `${years}y ` : "";
    const strDays = strYears.length || days ? `${days}d ` : "";
    const strHours = strDays.length || hours ? `${hours}h ` : "";
    const strMinutes = strHours.length || minutes ? `${minutes}m ` : "";
    const strSeconds = strMinutes.length || seconds ? `${seconds}s ` : "";
    const strMilliseconds = strSeconds.length || milliseconds ? `${milliseconds}ms ` : "";
    const strMicroseconds = strMilliseconds.length || microseconds ? `${padLeadingZeros(microseconds, 3)}μs` : "";

    element.textContent = strYears + strDays + strHours + strMinutes + strSeconds + strMilliseconds + strMicroseconds;
}

function minUnit(ms: number): number {
    if (ms >= 1000) return minUnit(ms / 1000);
    else if (ms < 1) return minUnit(ms * 1000);
    else return ms;
}

function padLeadingZeros(num: number, size: number) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
