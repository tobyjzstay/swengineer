import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { Context } from "../App";
import "./Logo.scss";

export function Logo() {
    const context = React.useContext(Context);

    return (
        <Link className="logo-link" href={"/" + window.location.search}>
            <Box className={"logo-container " + context.mode[0]}>
                <img alt="swengineer" className="logo-image" src="/logo.svg" />
                <Typography className={"logo-text " + context.mode[0]}>swengineer</Typography>
            </Box>
        </Link>
    );
}
