import Delete from "@mui/icons-material/Delete";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest } from "../components/Request";
import "./Profile.scss";

function Profile() {
    const context = React.useContext(Context);
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);
    const navigate = useNavigate();

    React.useMemo(() => {
        getRequest("/auth").then(async (response) => {
            if (response.ok) {
                const json = await response.json();
                const { user } = json;
                context.user[1](user);
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
            context.loading[1]((prev) => prev + 1);

            postRequest("/auth/delete", {}).then(async (response) => {
                context.loading[1]((prev) => prev - 1);
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
                <Box className="profile-container" component="form" noValidate onSubmit={handleSubmit}>
                    <Typography>
                        To confirm your account deletion, enter your email associated with your account.
                    </Typography>
                    <TextField
                        className="profile-text-field"
                        disabled={loading}
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
                    <Button
                        className="profile-button"
                        color="error"
                        disabled={loading || value !== context.user[0]?.email}
                        startIcon={<Delete />}
                        type="submit"
                        variant="contained"
                    >
                        Delete account
                    </Button>
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

export default Profile;
