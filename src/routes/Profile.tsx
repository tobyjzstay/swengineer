import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { Logo } from "../components/Logo";

export function Profile() {
    const [imageSrc, setImageSrc] = React.useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const json = {
            image: data.get("image"),
        };

        const base64 = await convertBase64(json.image as Blob);
        setImageSrc(base64 as string);

        // fetch("/api/register", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(json),
        // }).then((response) => {
        //     // TODO:
        // });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Logo />
                <Typography component="h1" variant="h5">
                    Profile
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                    <Button component="label" variant="contained">
                        Upload
                        <input name="image" hidden accept="image/*" type="file" />
                    </Button>
                    <Button fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                        Submit
                    </Button>
                </Box>
                <Box component="img" src={imageSrc} />
            </Box>
        </Container>
    );
}

const convertBase64 = (file: Blob) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};
