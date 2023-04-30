import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Icon, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import AuthLayout from "../components/AuthLayout";
import LoadingLayout from "../components/LoadingLayout";
import { getRequest, postRequest } from "../components/Request";

function Profile() {
    const appContext = React.useContext(AppContext);
    const [componentToRender, setComponentToRender] = React.useState(<LoadingLayout />);
    const navigate = useNavigate();

    React.useMemo(() => {
        getRequest("/auth").then(async (response) => {
            if (response.ok) {
                const json = await response.json();
                const { user } = json;
                appContext?.setUser(user);
                setComponentToRender(<ProfileComponent />);
            } else navigate("/login?redirect=" + window.location.pathname, { replace: true });
        });
    }, []);

    function ProfileComponent() {
        const [loading, setLoading] = React.useState(false);
        const [value, setValue] = React.useState("");

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            appContext?.startLoading();

            postRequest("/auth/delete", {}).then(async (response) => {
                appContext?.stopLoading();
                setLoading(false);
                if (response.ok) {
                    postRequest("/auth/logout", {}).then(() => {
                        navigate("/");
                    });
                }
            });
        };

        return (
            <AuthLayout name="Profile">
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
                    <Typography>
                        To confirm your account deletion, enter your email associated with your account.
                    </Typography>
                    <TextField
                        disabled={loading}
                        fullWidth
                        id="email"
                        label="Email Address"
                        margin="normal"
                        name="email"
                        onChange={(event) => {
                            setValue(event.target.value);
                        }}
                        required
                        value={value}
                    />
                    <LoadingButton
                        color="error"
                        disabled={value !== appContext?.user?.email}
                        fullWidth
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon>delete</Icon>}
                        sx={{ mt: 3, mb: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        Delete account
                    </LoadingButton>
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

export default Profile;
