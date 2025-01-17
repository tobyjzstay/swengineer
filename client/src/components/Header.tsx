import DarkMode from "@mui/icons-material/DarkMode";
import Language from "@mui/icons-material/Language";
import LightMode from "@mui/icons-material/LightMode";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid2 as Grid,
    Icon,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import languages from "../locales/languages.json";
import "./Header.scss";
import { Logo } from "./Logo";
import { getRequest, postRequest } from "./Request";

function Header() {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const context = React.useContext(Context);

    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const handleAvatarClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        getRequest("/auth", true).then(async (response) => {
            const json = await response.json();
            const { user } = json;
            context.user[1](user);
        });
    }, []);

    return (
        <AppBar className="header-app-bar">
            <Toolbar variant="dense">
                <Box className="header-logo">
                    <Logo scale={0.6} />
                </Box>
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
                                                i18n.changeLanguage(key);
                                                handleLanguageClose();
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
                <IconButton onClick={() => context.mode[1]((prev) => (prev === "light" ? "dark" : "light"))}>
                    {context.mode[0] === "light" ? <DarkMode /> : <LightMode />}
                </IconButton>
                {context.user[0] && (
                    <>
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
                                    postRequest("/auth/logout", {}).then(() => {
                                        navigate(0);
                                    });
                                }}
                            >
                                <ListItemIcon>
                                    <Logout />
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
