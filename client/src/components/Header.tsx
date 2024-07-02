import { AppBar, Box, Toolbar } from "@mui/material";
import { Logo } from "./Logo";

function Header() {
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
