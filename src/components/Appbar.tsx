import { Login, Logout } from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Link,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import { showResponse, UserContext } from "../App";

export function Appbar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { user, setUser } = React.useContext(UserContext);

    React.useEffect(() => {
        fetch(`/api/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            setUser(json);
        });
    }, []);

    return (
        <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Link href="/" style={{ textDecoration: "none" }} sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center">
                        <img src={"/logo.svg"} alt="swengineer" width={40} style={{ padding: 6 }} />
                        <Typography component="h1" variant="h4" color="white" fontSize={20}>
                            swengineer
                        </Typography>
                    </Box>
                </Link>
                <IconButton onClick={handleClick}>
                    <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ minWidth: 180 }}>
                    {user.email ? (
                        [
                            <MenuItem key="email" disabled divider>
                                {user.email}
                            </MenuItem>,
                            <MenuItem
                                key="logout"
                                onClick={() => {
                                    fetch(`/api/logout`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then(async (response) => {
                                        showResponse(response, enqueueSnackbar, closeSnackbar);
                                        navigate("/login");
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
