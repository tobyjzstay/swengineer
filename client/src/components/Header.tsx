import { AppBar, Avatar, Box, Icon, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Logo } from "./Logo";
import { postRequest } from "./Request";

function Header() {
    const appContext = React.useContext(AppContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
        if (!appContext) return;
        fetch("/api/auth", {
            method: "GET",
        }).then(async (response) => {
            const json = await response.json();
            const { user } = json;
            appContext.setUser(user);
        });
    }, [appContext]);

    return (
        <AppBar position="sticky" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Logo scale={0.6} />
                </Box>
                {appContext?.user && (
                    <>
                        <IconButton onClick={handleClick}>
                            <Avatar sx={{ width: 24, height: 24 }} />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {
                                    minWidth: 120,
                                },
                            }}
                        >
                            <MenuItem key="email" disabled divider>
                                {appContext.user.email}
                            </MenuItem>
                            <MenuItem
                                key="profile"
                                onClick={() => {
                                    navigate("/profile");
                                }}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small">person</Icon>
                                </ListItemIcon>
                                Profile
                            </MenuItem>
                            <MenuItem
                                key="logout"
                                onClick={() => {
                                    postRequest("/auth/logout", {}).then(() => {
                                        navigate(0);
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small">logout</Icon>
                                </ListItemIcon>
                                Log out
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
