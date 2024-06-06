import { Box, Link, Typography } from "@mui/material";
import "./Logo.scss";

export function Logo({ scale: s }: { scale?: number }) {
    const scale = s || 1;
    return (
        <Link className="logo-link" href="/">
            <Box className="logo-container">
                <img alt="swengineer" src="./logo.svg" style={{ padding: 10 * scale }} width={64 * scale} />
                <Typography
                    className="logo-text"
                    color={(theme) => theme.palette.text.primary}
                    component="h1"
                    fontSize={2.125 * scale + "rem"}
                    variant="h4"
                >
                    swengineer
                </Typography>
            </Box>
        </Link>
    );
}
