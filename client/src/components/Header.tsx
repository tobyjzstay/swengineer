import { AppBar, Box, Toolbar } from "@mui/material";
import React from "react";

import { AppContext } from "../App";
import { Logo } from "./Logo";

function Header() {
    const appContext = React.useContext(AppContext);

    // React.useEffect(() => {
    //     getRequest("/auth").then(async (response) => {
    //         const json = await response.json();
    //         const { user } = json;
    //         setUser(user);
    //     });
    // }, []);

    React.useEffect(() => {
        fetch(`/api/auth`, {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json();
            const { user } = json;
            appContext?.setUser(user);
        });
    }, []);

    return (
        <AppBar position="sticky" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Logo scale={0.6} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
