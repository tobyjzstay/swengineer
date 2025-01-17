import { Box, Link, Typography } from "@mui/material";
import "./Logo.scss";

export function Logo() {
    return (
        <Link className="logo-link" href={"/" + window.location.search}>
            <Box className="logo-container">
                <img alt="swengineer" className="logo-image" src="./logo.svg" />
                <Typography className="logo-text">swengineer</Typography>
            </Box>
        </Link>
    );
}
