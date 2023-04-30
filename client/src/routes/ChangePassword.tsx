import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Icon, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import LoadingLayout from "../components/LoadingLayout";
import { getRequest, postRequest } from "../components/Request";
import { PageNotFoundComponent } from "./PageNotFound";
import { ResetEmail } from "./Reset";

function ChangePassword() {
    const [componentToRender, setComponentToRender] = React.useState(<LoadingLayout />);
    const navigate = useNavigate();
    const token = useParams().token;

    React.useMemo(() => {
        getRequest(`/auth/reset/${token}`).then((response) => {
            if (response.ok) setComponentToRender(<ChangePasswordComponent />);
            else if (response.status === 401) setComponentToRender(<ResendEmail />);
            else setComponentToRender(<PageNotFoundComponent />);
        });
    }, []);

    function ChangePasswordComponent() {
        const appContext = React.useContext(AppContext);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            appContext?.startLoading();

            const data = new FormData(event.currentTarget);
            const json = {
                password: data.get("password"),
            };

            postRequest(`/auth/reset/${token}`, json).then((response) => {
                appContext?.stopLoading();
                setLoading(false);
                if (response.ok) navigate("/login", { replace: true });
            });
        };

        return (
            <AuthLayout name="Reset password">
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
                        autoComplete="new-password"
                        autoFocus
                        disabled={loading}
                        fullWidth
                        id="password"
                        label="New password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon>lock_reset</Icon>}
                        sx={{ mt: 3, mb: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        Change password
                    </LoadingButton>
                </Box>
            </AuthLayout>
        );
    }

    function ResendEmail() {
        const appContext = React.useContext(AppContext);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            appContext?.startLoading();

            const data = new FormData(event.currentTarget);
            const json = {
                token: data.get("token"),
            };

            postRequest("/auth/reset", json).then((response) => {
                appContext?.stopLoading();
                setLoading(false);
                if (response.ok) setComponentToRender(<ResetEmail />);
            });
        };

        return (
            <AuthLayout name="Reset password">
                <Box
                    component="form"
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    marginTop={1}
                    noValidate
                    onSubmit={handleSubmit}
                    width="100%"
                >
                    <Typography textAlign="center">The token has expired. Please request a new one.</Typography>
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
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

export default ChangePassword;
