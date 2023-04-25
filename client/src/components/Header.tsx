import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import { AppBar, Avatar, Box, IconButton, ListItemIcon, Menu, MenuItem, Toolbar } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { Logo } from "./Logo";
import { postRequest } from "./Request";

function Header() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate();

    const appContext = React.useContext(AppContext);
    const user = appContext?.user;

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
                    {user?.email ? (
                        [
                            <MenuItem key="email" disabled divider>
                                {user.email}
                            </MenuItem>,
                            <MenuItem
                                key="profile"
                                onClick={() => {
                                    navigate("/profile");
                                }}
                            >
                                <ListItemIcon>
                                    <Person fontSize="small" />
                                </ListItemIcon>
                                Profile
                            </MenuItem>,
                            <MenuItem
                                key="logout"
                                onClick={() => {
                                    postRequest("/auth/logout", {}).then(() => {
                                        navigate(0);
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </MenuItem>,
                        ]
                    ) : (
                        <MenuItem onClick={() => navigate("/login")}>
                            <ListItemIcon>
                                <Login fontSize="small" />
                            </ListItemIcon>
                            Login
                        </MenuItem>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Header;