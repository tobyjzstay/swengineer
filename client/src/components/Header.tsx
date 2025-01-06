import { DarkMode, LightMode } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import React from "react";
import { Context } from "../App";
import { Logo } from "./Logo";

function Header() {
    const { mode } = React.useContext(Context);

    return (
        <AppBar position="sticky" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Logo scale={0.6} />
                </Box>
                <IconButton onClick={() => mode[1]((prev) => (prev === "light" ? "dark" : "light"))}>
                    {mode[0] === "light" ? <DarkMode /> : <LightMode />}
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
