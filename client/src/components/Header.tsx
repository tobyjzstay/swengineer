import { AppBar, Avatar, Box, Icon, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import "./Header.scss";
import { Logo } from "./Logo";
import { getRequest, postRequest } from "./Request";

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
        getRequest("/auth", true).then(async (response) => {
            if (!response.ok) return;
            const json = await response.json();
            const { user } = json;
            appContext.setUser(user);
        });
    }, [appContext]);

    return (
        <AppBar className="header-app-bar">
            <Toolbar variant="dense">
                <Box className="header-logo">
                    <Logo scale={0.6} />
                </Box>
                {appContext?.user && (
                    <>
                        <IconButton onClick={handleClick}>
                            <Avatar className="header-avatar" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                className: "header-menu-paper",
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
