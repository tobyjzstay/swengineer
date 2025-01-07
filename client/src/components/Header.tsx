import { DarkMode, Language, LightMode } from "@mui/icons-material";
import { AppBar, Box, Button, Dialog, DialogContent, Grid, IconButton, Toolbar, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Context } from "../App";
import languages from "../locales/languages.json";
import { Logo } from "./Logo";

function Header() {
    const [open, setOpen] = React.useState(false);

    const { mode } = React.useContext(Context);

    const theme = useTheme();
    const { i18n } = useTranslation();

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AppBar position="sticky" style={{ background: "transparent", boxShadow: "none" }}>
            <Toolbar variant="dense">
                <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
                    <Logo scale={0.6} />
                </Box>
                <IconButton onClick={() => setOpen(true)}>
                    <Language />
                </IconButton>
                <Dialog onClose={handleClose} open={open} transitionDuration={{ enter: 300, exit: 0 }}>
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
                                                handleClose();
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
            </Toolbar>
        </AppBar>
    );
}

export default Header;
