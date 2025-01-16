import LockReset from "@mui/icons-material/LockReset";
import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest } from "../components/Request";
import "./ChangePassword.scss";
import { PageNotFoundComponent } from "./PageNotFound";
import { ResetPasswordEmail } from "./ResetPassword";

function ChangePassword() {
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);
    const navigate = useNavigate();
    const token = useParams().token;

    React.useMemo(() => {
        getRequest(`/auth/reset/${token}`, true).then((response) => {
            if (response.ok) setComponentToRender(<ChangePasswordComponent />);
            else if (response.status === 401) setComponentToRender(<ResendEmail />);
            else setComponentToRender(<PageNotFoundComponent />);
        });
    }, []);

    function ChangePasswordComponent() {
        const context = React.useContext(Context);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            context.loading[1]((prev) => prev + 1);

            const data = new FormData(event.currentTarget);
            const json = {
                password: data.get("password"),
            };

            postRequest(`/auth/reset/${token}`, json).then((response) => {
                context.loading[1]((prev) => prev - 1);
                setLoading(false);
                if (response.ok) navigate("/login", { replace: true });
            });
        };

        return (
            <AuthLayout name="Reset password">
                <Box className="change-password-layout" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="new-password"
                        autoFocus
                        className="change-password-text-field"
                        disabled={loading}
                        id="password"
                        label="New password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <Button
                        className="change-password-button"
                        disabled={loading}
                        startIcon={<LockReset />}
                        type="submit"
                        variant="contained"
                    >
                        Change password
                    </Button>
                </Box>
            </AuthLayout>
        );
    }

    function ResendEmail() {
        const context = React.useContext(Context);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            context.loading[1]((prev) => prev + 1);

            const data = new FormData(event.currentTarget);
            const json = {
                token: data.get("token"),
            };

            postRequest("/auth/reset", json).then((response) => {
                context.loading[1]((prev) => prev - 1);
                setLoading(false);
                if (response.ok) setComponentToRender(<ResetPasswordEmail />);
            });
        };

        return (
            <AuthLayout name="Reset password">
                <Box className="change-password-resend-layout" component="form" noValidate onSubmit={handleSubmit}>
                    <Typography textAlign="center">The token has expired. Please request a new one.</Typography>
                    <Button
                        className="change-password-button"
                        disabled={loading}
                        startIcon={<Send />}
                        type="submit"
                        variant="contained"
                    >
                        Resend email
                    </Button>
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

export default ChangePassword;
