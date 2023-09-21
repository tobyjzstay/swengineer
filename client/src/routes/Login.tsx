import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Button, Grid, Icon, Link, TextField } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest, useQuery } from "../components/Request";

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
        const appContext = React.useContext(AppContext);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!appContext) return;
            setLoading(true);

            appContext.startLoading();

            const data = new FormData(event.currentTarget);
            const json = {
                email: data.get("email"),
                password: data.get("password"),
            };

            postRequest("/auth/login", json).then((response) => {
                appContext.stopLoading();
                setLoading(false);
                if (response.ok) navigate(redirect || "/", { replace: true });
            });
        };

        return (
            <AuthLayout name="Log in">
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    noValidate
                    onSubmit={handleSubmit}
                    width="100%"
                >
                    <TextField
                        autoComplete="email"
                        autoFocus
                        disabled={loading}
                        fullWidth
                        id="email"
                        label="Email Address"
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="current-password"
                        disabled={loading}
                        fullWidth
                        id="password"
                        label="Password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon>login</Icon>}
                        sx={{ mt: 3, mb: 2 }}
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
                        color="secondary"
                        disabled={loading}
                        fullWidth
                        href="/api/auth/google"
                        sx={{ mt: 3, mb: 2 }}
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
