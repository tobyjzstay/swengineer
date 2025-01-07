import { Box, Link, Typography, useTheme } from "@mui/material";

export function Logo({ scale: s }: { scale?: number }) {
    const scale = s || 1;
    const theme = useTheme();
    return (
        <Link href={"/" + window.location.search} style={{ textDecoration: "none" }}>
            <Box display="flex" flexDirection="row" alignItems="center">
                <img
                    src="./logo.svg"
                    alt="swengineer"
                    width={64 * scale}
                    style={{ padding: 5 * scale, backgroundColor: "#121212", margin: 5 * scale }}
                />
                <Typography
                    component="h1"
                    variant="h4"
                    color={theme.palette.text.primary}
                    fontFamily="Cascadia Mono"
                    fontSize={2.125 * scale + "rem"}
                >
                    swengineer
                </Typography>
            </Box>
        </Link>
    );
}
