import LockReset from "@mui/icons-material/LockReset";
import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { getRequest, postRequest } from "../components/Request";
import "./ChangePassword.scss";
import PageNotFound from "./PageNotFound";
import { ResetPasswordEmail } from "./ResetPassword";

function ChangePassword() {
    const context = React.useContext(Context);

    const [initialised, setInitialised] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [componentToRender, setComponentToRender] = React.useState<React.JSX.Element>();
    const disabled = !initialised && loading;

    const navigate = useNavigate();
    const { token } = useParams();

    React.useMemo(() => {
        // check if token is valid
        getRequest(`/auth/reset/${token}`, true).then((response) => {
            if (response.ok) setInitialised(true);
            else if (response.status === 401) setComponentToRender(<ResendEmail />); // token expired
            else setComponentToRender(<PageNotFound />);
        });
    }, []);

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
            password: data.get("password"),
        };

        postRequest(`/auth/reset/${token}`, json).then((response) => {
            setLoading(false);
            if (response.ok) navigate("/login", { replace: true });
        });
    };

    return (
        componentToRender ?? (
            <Layout initialised={initialised} layoutType={LayoutType.Auth} name="Reset password">
                <Box className="change-password-layout" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="new-password"
                        autoFocus
                        className="change-password-text-field"
                        disabled={disabled}
                        id="password"
                        label="New password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <Button
                        className="change-password-button"
                        disabled={disabled}
                        startIcon={<LockReset />}
                        type="submit"
                        variant="contained"
                    >
                        Change password
                    </Button>
                </Box>
            </Layout>
        )
    );

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
            <Layout layoutType={LayoutType.Auth} name="Reset password">
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
            </Layout>
        );
    }
}

export default ChangePassword;
