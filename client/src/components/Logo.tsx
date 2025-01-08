import { Box, Link, Typography } from "@mui/material";

export function Logo({ scale: s }: { scale?: number }) {
    const scale = s || 1;
    return (
        <Link href={"/" + window.location.search} style={{ textDecoration: "none" }}>
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ backgroundColor: "#121212", paddingRight: 10 * scale }}
            >
                <img
                    src="./logo.svg"
                    alt="swengineer"
                    width={64 * scale}
                    style={{ padding: 5 * scale, margin: 5 * scale }}
                />
                <Typography
                    component="h1"
                    variant="h4"
                    color="white"
                    fontFamily="Cascadia Mono"
                    fontSize={2.125 * scale + "rem"}
                >
                    swengineer
                </Typography>
            </Box>
        </Link>
    );
}
