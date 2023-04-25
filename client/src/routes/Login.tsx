import { Box, Button, CircularProgress, Grid, Link, TextField } from "@mui/material";
import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import { getRequest, postRequest } from "../components/Request";

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export function Login() {
    const navigate = useNavigate();

    const query = useQuery();
    const redirect = query.get("redirect");

    const [submitted, setSubmitted] = React.useState(false);
    const [responded, setResponded] = React.useState(false);

    const appContext = React.useContext(AppContext);

    React.useEffect(() => {
        getRequest("/auth").then(async (response) => {
            const json = await response.json();
            const { user } = json;
            if (user) navigate("/", { replace: true });
        });
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        appContext?.startLoading();

        const data = new FormData(event.currentTarget);
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };
        postRequest("/auth/login" + (redirect ? `?redirect=${redirect}` : ""), json).then(async (response) => {
            const success = response.status === 200;
            appContext?.stopLoading();
            setSubmitted(success);
            setResponded(success);
            if (success) navigate("/");
            if (redirect) navigate(redirect);
        });
    };

    return (
        <AuthLayout name={"Log in"}>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <TextField
                    disabled={submitted}
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    disabled={submitted}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                />
                <Button disabled={submitted} fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                    {submitted && !responded ? <CircularProgress size={24.5} /> : "Log in"}
                </Button>
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
                    disabled={submitted}
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    variant="contained"
                    color="secondary"
                    href="api/auth/google"
                >
                    {submitted && !responded ? <CircularProgress size={24.5} /> : "Log in with Google"}
                </Button>
            </Box>
        </AuthLayout>
    );
}
