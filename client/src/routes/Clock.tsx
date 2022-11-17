import { Container, Typography } from "@mui/material";
import React from "react";
import { Appbar } from "../components/Appbar";

export function Clock() {
    React.useEffect(() => {
        const element = document.getElementById("millerTime");

        const microsecond = 1 / 1000;
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const year = day * 365.2425;

        const startDate = new Date("November 11, 2014");
        const timeRatio = (7 * year) / hour;

        // let shift = 0;
        const ms = Math.floor(minUnit(1 / timeRatio));

        function minUnit(ms: number): number {
            if (ms >= 1000) {
                // shift--;
                return minUnit(ms / 1000);
            } else if (ms < 1) {
                // shift++;
                return minUnit(ms * 1000);
            }
            return ms;
        }

        function updateMillerTime() {
            if (!element) return;

            const endDate = new Date();
            const timeElapsed = endDate.getTime() - startDate.getTime();
            const ratioTimeElapsed = timeElapsed / timeRatio;

            const microseconds = Math.floor(Math.floor((ratioTimeElapsed / microsecond) % 1000));
            const milliseconds = Math.floor(ratioTimeElapsed % 1000);
            const seconds = Math.floor((ratioTimeElapsed / second) % 60);
            const minutes = Math.floor((ratioTimeElapsed / minute) % 60);
            const hours = Math.floor((ratioTimeElapsed / hour) % 24);
            const days = Math.floor(Math.floor(ratioTimeElapsed / day) % 365.2425);
            const years = Math.floor(ratioTimeElapsed / year);

            const stringYears = years ? `${years}y ` : "";
            const stringDays = stringYears.length || days ? `${days}d ` : "";
            const stringHours = stringDays.length || hours ? `${hours}h ` : "";
            const stringMinutes = stringHours.length || minutes ? `${minutes}m ` : "";
            const stringSeconds = stringMinutes.length || seconds ? `${seconds}s ` : "";
            const stringMilliseconds =
                stringSeconds.length || milliseconds
                    ? microseconds
                        ? `${padLeadingZeros(milliseconds, 3)}ms `
                        : `${milliseconds}ms `
                    : "";
            const stringMicroseconds =
                stringMilliseconds.length || microseconds ? `${padLeadingZeros(microseconds, 3)}μs` : "";

            element.textContent =
                stringYears +
                stringDays +
                stringHours +
                stringMinutes +
                stringSeconds +
                stringMilliseconds +
                (Math.floor(timeRatio / 1000) > 1 && Math.floor(timeRatio / 1000) < 1000 ? stringMicroseconds : "");
        }

        if (!element) return;
        setInterval(updateMillerTime, ms);
    }, []);

    return (
        <>
            <Appbar />
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
                <Typography id="millerTime" component="h1" variant="h1" />
                <Typography variant="subtitle1">{"have passed on Miller's planet"}</Typography>
            </Container>
        </>
    );
}

function padLeadingZeros(num: number, size: number) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
