import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Button, Grid, Icon, Link, TextField } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
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
            <AuthLayout name="Log in">
                <Box className="login-layout" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="login-email-text-field"
                        disabled={loading}
                        id="email"
                        label="Email Address"
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="current-password"
                        className="login-password-text-field"
                        disabled={loading}
                        id="password"
                        label="Password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <LoadingButton
                        className="login-button"
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon>login</Icon>}
                        type="submit"
                        variant="contained"
                    >
                        Log in
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/reset" variant="body2">
                                {"Forgot password?"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Register"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Button
                        className="login-button"
                        color="secondary"
                        disabled={loading}
                        href="/api/auth/google"
                        variant="contained"
                    >
                        Log in with Google
                    </Button>
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

export default Login;
