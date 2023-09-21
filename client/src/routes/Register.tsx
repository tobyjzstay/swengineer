import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Grid, Icon, Link, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest } from "../components/Request";

function Register() {
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);
    const navigate = useNavigate();

    React.useMemo(() => {
        getRequest("/auth").then(async (response) => {
            if (response.ok) navigate("/", { replace: true });
            else setComponentToRender(<RegisterComponent />);
        });
    }, []);

    function RegisterComponent() {
        const appContext = React.useContext(AppContext);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            appContext?.startLoading();

            const data = new FormData(event.currentTarget);
            const email = data.get("email")?.toString();
            const json = {
                email: data.get("email"),
                password: data.get("password"),
            };

            postRequest("/auth/register", json).then((response) => {
                appContext?.stopLoading();
                setLoading(false);
                if (email && (response.ok || response.status === 409))
                    setComponentToRender(<VerificationEmail email={email} />);
            });
        };

        return (
            <AuthLayout name={"Register"}>
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
                        autoComplete="new-password"
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
                        startIcon={<Icon>send</Icon>}
                        sx={{ mt: 3, mb: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        Send email
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/reset" variant="body2">
                                {"Forgot password?"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Log in"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

function VerificationEmail({ email }: { email: string }) {
    const appContext = React.useContext(AppContext);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        appContext?.startLoading();

        const json = {
            email: email,
            verify: true,
        };

        postRequest("/auth/register", json).then(() => {
            appContext?.stopLoading();
            setLoading(false);
        });
    };

    return (
        <AuthLayout name={"Register"}>
            <Box
                component="form"
                display="flex"
                flexDirection="column"
                flexGrow={1}
                noValidate
                onSubmit={handleSubmit}
                width="100%"
            >
                <Typography textAlign="center">Please check your email for a verification link.</Typography>
                <LoadingButton
                    fullWidth
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<Icon>send</Icon>}
                    sx={{ mt: 3, mb: 2 }}
                    type="submit"
                    variant="contained"
                >
                    Resend email
                </LoadingButton>
            </Box>
        </AuthLayout>
    );
}

export default Register;
