import { DarkMode, Language, LightMode } from "@mui/icons-material";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    Grid,
    Icon,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    useTheme,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import languages from "../locales/languages.json";
import "./Header.scss";
import { Logo } from "./Logo";
import { postRequest } from "./Request";

function Header() {
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const { mode, user } = React.useContext(Context);

    const navigate = useNavigate();
    const theme = useTheme();

    const { i18n } = useTranslation();

    const handleAvatarClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageClose = () => {
        setOpen(false);
    };

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
            user[1](user);
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
                <Dialog onClose={handleLanguageClose} open={open} transitionDuration={{ enter: 300, exit: 0 }}>
                    <DialogContent>
                        <Grid container direction="column">
                            {Object.entries(languages)
                                .sort((a, b) => a[1].name.localeCompare(b[1].name))
                                .map(([key, value]) => (
                                    <Grid item key={key}>
                                        <Button
                                            startIcon={<span style={{ fontSize: "2em" }}>{value.flag}</span>}
                                            onClick={() => {
                                                i18n.changeLanguage(key);
                                                handleLanguageClose();
                                            }}
                                            variant="text"
                                            style={{
                                                color: theme.palette.text.primary,
                                                lineHeight: 1,
                                                textTransform: "none",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {value.name}
                                        </Button>
                                    </Grid>
                                ))}
                        </Grid>
                    </DialogContent>
                </Dialog>
                <IconButton onClick={() => mode[1]((prev) => (prev === "light" ? "dark" : "light"))}>
                    {mode[0] === "light" ? <DarkMode /> : <LightMode />}
                </IconButton>
                {user[0] && (
                    <>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <Avatar className="header-avatar" />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleAvatarClose}
                            PaperProps={{
                                className: "header-menu-paper",
                            }}
                        >
                            <MenuItem key="email" disabled divider>
                                {user[0].email}
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
