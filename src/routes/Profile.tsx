import { Box, Button, Container, Typography } from "@mui/material";
import { Logo } from "../components/Logo";

export function Profile() {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const json = {
            image: data.get("image")
        };

        const base64 = await convertBase64(json.image as Blob);
        console.log(base64);

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
                    <Button variant="contained" component="label">
                        Upload
                        <input id="image" hidden accept="image/*" type="file" />
                    </Button>
                </Box>
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