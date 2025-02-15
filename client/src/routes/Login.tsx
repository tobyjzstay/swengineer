import LoginIcon from "@mui/icons-material/Login";
import { Box, Button, Grid2 as Grid, Link, TextField } from "@mui/material";
import { t } from "i18next";
import * as React from "react";
import { Trans } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { getRedirectTo, getRequest, postRequest } from "../components/Request";
import "./Login.scss";

function Login() {
    const context = React.useContext(Context);

    const [initialised, setInitialised] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const disabled = !initialised && loading;

    const navigate = useNavigate();
    const redirectTo = getRedirectTo();

    React.useMemo(() => {
        if (initialised) return;
        // redirect user if already logged in
        getRequest("/auth", true).then(async (response) => {
            setLoading(false);
            console.log(redirectTo);
            if (response.ok) navigate(redirectTo, { replace: true });
            else setInitialised(true);
        });
    }, [navigate]);

    React.useEffect(() => {
        // update local loading state with global loading state
        if (loading) context.loading[1]((prev) => prev + 1);
        else context.loading[1]((prev) => prev - 1);
    }, [loading]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };

        postRequest("/auth/login", json).then((response) => {
            setLoading(false);
            if (response.ok) navigate(redirectTo, { replace: true });
        });
    };

    return (
        <Layout initialised={initialised} layoutType={LayoutType.Auth} name={t("login.title")}>
            <Box className="login-layout" component="form" noValidate onSubmit={handleSubmit}>
                <TextField
                    autoComplete="email"
                    autoFocus
                    className="login-email-text-field"
                    disabled={disabled}
                    id="email"
                    label={<Trans i18nKey="login.emailAddress" />}
                    margin="normal"
                    name="email"
                    required
                />
                <TextField
                    autoComplete="current-password"
                    className="login-password-text-field"
                    disabled={disabled}
                    id="password"
                    label={<Trans i18nKey="login.password" />}
                    margin="normal"
                    name="password"
                    required
                    type="password"
                />
                <Button
                    className="login-button"
                    disabled={disabled}
                    startIcon={<LoginIcon />}
                    type="submit"
                    variant="contained"
                >
                    <Trans i18nKey="login.logIn" />
                </Button>
                <Grid container>
                    <Grid size="grow">
                        <Link component={RouterLink} to="/reset" variant="body2">
                            <Trans i18nKey="login.forgotPassword" />
                        </Link>
                    </Grid>
                    <Grid>
                        <Link component={RouterLink} to="/register" variant="body2">
                            <Trans i18nKey="login.register" />
                        </Link>
                    </Grid>
                </Grid>
                <Button
                    className="login-button"
                    component={RouterLink}
                    disabled={disabled}
                    to="/api/auth/google"
                    variant="outlined"
                >
                    <Trans i18nKey="login.googleLogIn" />
                </Button>
            </Box>
        </Layout>
    );
}

export default Login;
