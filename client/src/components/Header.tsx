import DarkMode from "@mui/icons-material/DarkMode";
import Language from "@mui/icons-material/Language";
import LightMode from "@mui/icons-material/LightMode";
import { AppBar, Box, Button, Dialog, DialogContent, Grid2 as Grid, Icon, IconButton, Toolbar } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import languages from "../locales/languages.json";
import "./Header.scss";
import { Logo } from "./Logo";
import { getRequest } from "./Request";

function Header({ logo = true }: { logo?: boolean }) {
    const context = React.useContext(Context);

    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const navigate = useNavigate();
    const { i18n } = useTranslation();

    React.useEffect(() => {
        handleLanguageClose();
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    const handleAvatarClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getRequest("/auth", true);
                const json = await response.json();
                const { user } = json;
                context.user[1](user);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    return (
        <AppBar className="header-app-bar">
            <Toolbar variant="dense">
                {logo && (
                    <Box className="header-start">
                        <Logo />
                    </Box>
                )}
                <Box className="header-end">
                    <IconButton onClick={() => setOpen(true)}>
                        <Language />
                    </IconButton>
                    <Dialog
                        onClose={handleLanguageClose}
                        open={open}
                        transitionDuration={{
                            enter: 225,
                            exit: 0, // no duration for exit to prevent selecting during transition
                        }}
                    >
                        <DialogContent>
                            <Grid className="header-flag-grid" container>
                                {Object.entries(languages)
                                    .sort((a, b) => a[1].name.localeCompare(b[1].name))
                                    .map(([key, value]) => (
                                        <Grid key={key}>
                                            <Button
                                                className="header-flag-button"
                                                onClick={() => {
                                                    if (i18n.language === key) handleLanguageClose();
                                                    else i18n.changeLanguage(key);
                                                }}
                                                startIcon={<Icon className="header-flag-icon">{value.flag}</Icon>}
                                                variant="text"
                                            >
                                                {value.name}
                                            </Button>
                                        </Grid>
                                    ))}
                            </Grid>
                        </DialogContent>
                    </Dialog>
                    <IconButton
                        onClick={() => {
                            context.mode[1]((prev) => {
                                const mode = prev === "light" ? "dark" : "light";
                                localStorage.setItem("theme", mode);
                                return mode;
                            });
                        }}
                    >
                        {context.mode[0] === "light" ? <DarkMode /> : <LightMode />}
                    </IconButton>

                    {/* <>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <Avatar className="header-avatar" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleAvatarClose}
                            slotProps={{
                                paper: {
                                    className: "header-avatar-menu-paper",
                                },
                            }}
                        >
                            {!context.user[0] && (
                                <MenuItem
                                    key="login"
                                    onClick={() => {
                                        navigate("/login");
                                    }}
                                >
                                    <ListItemIcon>
                                        <Login />
                                    </ListItemIcon>
                                    Login
                                </MenuItem>
                            )}
                            {context.user[0] && (
                                <>
                                    <MenuItem key="email" disabled divider>
                                        {context.user[0].email}
                                    </MenuItem>
                                    <MenuItem
                                        key="profile"
                                        onClick={() => {
                                            navigate("/profile");
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Person />
                                        </ListItemIcon>
                                        Profile
                                    </MenuItem>
                                    <MenuItem
                                        key="logout"
                                        onClick={() => {
                                            postRequest("/auth/logout", {}).then((response) => {
                                                if (response.ok) {
                                                    navigate("/");
                                                    document.cookie =
                                                        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                                                }
                                            });
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Logout />
                                        </ListItemIcon>
                                        Log out
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
