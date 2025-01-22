import LoginIcon from "@mui/icons-material/Login";
import { Backdrop, Box, Button, Grid2 as Grid, Link, TextField } from "@mui/material";
import { t } from "i18next";
import * as React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest, useQuery } from "../components/Request";
import "./Login.scss";

function Login() {
    const navigate = useNavigate();
    const query = useQuery();
    const redirect = query.get("redirect") || "/";

    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);

    React.useMemo(() => {
        getRequest("/auth", true).then(async (response) => {
            if (response.ok) navigate(redirect, { replace: true });
            else setComponentToRender(<LoginComponent />);
        });
    }, [navigate, redirect]);

    function LoginComponent() {
        const context = React.useContext(Context);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!context) return;
            setLoading(true);

            context.loading[1]((prev) => prev + 1);

            const data = new FormData(event.currentTarget);
            const json = {
                email: data.get("email"),
                password: data.get("password"),
            };

            postRequest("/auth/login", json).then((response) => {
                context.loading[1]((prev) => prev - 1);
                setLoading(false);
                if (response.ok) navigate(redirect || "/", { replace: true });
            });
        };

        return (
            <Layout layoutType={LayoutType.Auth} name={t("login.title")}>
                <Box className="login-layout" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="login-email-text-field"
                        disabled={loading}
                        id="email"
                        label={<Trans i18nKey="login.emailAddress" />}
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="current-password"
                        className="login-password-text-field"
                        disabled={loading}
                        id="password"
                        label={<Trans i18nKey="login.password" />}
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <Button
                        className="login-button"
                        disabled={loading}
                        startIcon={<LoginIcon />}
                        type="submit"
                        variant="contained"
                    >
                        <Trans i18nKey="login.logIn" />
                    </Button>
                    <Grid container>
                        <Grid size="grow">
                            <Link href="/reset" variant="body2">
                                <Trans i18nKey="login.forgotPassword" />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/register" variant="body2">
                                <Trans i18nKey="login.register" />
                            </Link>
                        </Grid>
                    </Grid>
                    <Button className="login-button" disabled={loading} href="/api/auth/google" variant="outlined">
                        <Trans i18nKey="login.googleLogIn" />
                    </Button>
                    <Backdrop open={loading} />
                </Box>
            </Layout>
        );
    }

    return componentToRender;
}

export default Login;
