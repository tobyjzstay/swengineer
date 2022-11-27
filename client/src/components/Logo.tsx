import { Box, Link, Typography } from "@mui/material";

export function Logo({ scale: s }: { scale?: number }) {
    const scale = s || 1;
    return (
        <Link href="/" style={{ textDecoration: "none" }}>
            <Box display="flex" flexDirection="row" alignItems="center">
                <img src={"/logo.svg"} alt="swengineer" width={64 * scale} style={{ padding: 10 * scale }} />
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
