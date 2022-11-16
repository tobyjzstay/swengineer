import { Box, Link, Typography } from "@mui/material";

export function Logo() {
    return (
        <Link href="/" style={{ textDecoration: "none" }}>
            <Box display="flex" flexDirection="row" alignItems="center" sx={{ m: 3 }}>
                <img src={"/logo.svg"} alt="swengineer" width={64} style={{ padding: 10 }} />
                <Typography component="h1" variant="h4" color="white">
                    swengineer
                </Typography>
            </Box>
        </Link>
    );
}
