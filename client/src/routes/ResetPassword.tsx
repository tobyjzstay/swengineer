import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Grid, Icon, Link, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest } from "../components/Request";

function ResetPassword() {
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);
    const navigate = useNavigate();

    React.useMemo(() => {
        getRequest("/auth").then(async (response) => {
            if (response.ok) navigate("/", { replace: true });
            else setComponentToRender(<ResetPasswordComponent />);
        });
    }, []);
    
    function ResetPasswordComponent() {
        const appContext = React.useContext(AppContext);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            appContext?.startLoading();

            const data = new FormData(event.currentTarget);
            const json = {
                email: data.get("email"),
            };

            postRequest("/auth/reset", json).then((response) => {
                appContext?.stopLoading();
                setLoading(false);
                if (response.ok) setComponentToRender(<ResetPasswordEmail />);
            });
        };

        return (
            <AuthLayout name={"Reset password"}>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
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
                            <Link href="/login" variant="body2">
                                {"Back"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Register"}
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

export function ResetPasswordEmail() {
    return (
        <AuthLayout name={"Reset password"}>
            <Box display="flex" flexDirection="column" flexGrow={1} marginTop={1} width="100%">
                <Typography textAlign="center">Please check your email for a reset password link.</Typography>
            </Box>
        </AuthLayout>
    );
}

export default ResetPassword;
