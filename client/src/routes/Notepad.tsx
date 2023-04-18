import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { getRequest, postRequest, showResponse } from "../components/Request";

interface Notepad {
    id: string;
    title: string;
    content: string;
    created: Date;
    modified: Date;
}

export function Notepad() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();

    const [refresh, setRefresh] = React.useState(true);
    const [notepads, setNotepads] = React.useState<Notepad[]>([]);
    const [notepadIndex, setNotepadIndex] = React.useState(-1);
    const [edit, setEdit] = React.useState(false);

    React.useEffect(() => {
        if (!refresh) return;
        getRequest("/notepad").then(async (response) => {
            const json = await response.json();
            const { notepads } = json;
            setNotepads(
                notepads.map((notepad: Notepad) => ({
                    ...notepad,
                    created: new Date(notepad.created),
                    modified: new Date(notepad.modified),
                }))
            );
            setRefresh(false);
        });
    }, [refresh]);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (notepadIndex < 0) setEdit(false);
        else timeout = setTimeout(handleEdit, 1000);

        return () => clearTimeout(timeout);
    }, [notepads, notepadIndex]);

    const handleCreate = () => {
        getRequest("/notepad/create").then((response) => {
            const success = response.status === 201;
            if (success) setRefresh(true);
            showResponse(response);
        });
    };

    const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, index: number) => {
        e.stopPropagation();
        const notepad = notepads[index];
        const json = {
            id: notepad.id,
        };
        postRequest("/notepad/delete", json).then((response) => {
            const success = response.status === 200;
            if (success) notepads.splice(index, 1);
            showResponse(response);
            forceUpdate();
        });
    };

    const handleClick = (index: number) => {
        setNotepadIndex(index);
    };

    const handleEdit = () => {
        if (!edit) return;
        const notepad = notepads[notepadIndex];
        const json = {
            id: notepad.id,
            title: notepad.title,
            content: notepad.content,
        };
        postRequest("/notepad/edit", json).then(async (response) => {
            const json = await response.json();
            const { modified } = json;
            if (modified) notepads[notepadIndex].modified = new Date(modified);
            setEdit(false);
            forceUpdate();
        });
    };

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (notepadIndex < 0) return;
        const title = event.target.value;

        if (title !== notepads[notepadIndex].title) {
            const newNotepads = [...notepads];
            newNotepads[notepadIndex] = { ...notepads[notepadIndex], title };
            setEdit(true);
            setNotepads(newNotepads);
        }
    };

    const onContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (notepadIndex < 0) return;
        const content = event.target.value;

        if (content !== notepads[notepadIndex].content) {
            const newNotepads = [...notepads];
            newNotepads[notepadIndex] = { ...notepads[notepadIndex], content };
            setEdit(true);
            setNotepads(newNotepads);
        }
    };

    return (
        <>
            <Appbar />
            <Container maxWidth="sm">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Grid container spacing={2}>
                        {notepads
                            .sort((a, b) => b.modified.getTime() - a.modified.getTime())
                            .map((notepad, i) => (
                                <Grid key={notepad.id} item xs={12}>
                                    <Card sx={{ width: "100%", marginTop: 2 }}>
                                        <CardActionArea onClick={() => handleClick(i)}>
                                            <CardContent>
                                                {notepad.title && (
                                                    <Typography gutterBottom noWrap>
                                                        {notepad.title}
                                                    </Typography>
                                                )}
                                                {notepad.content && (
                                                    <Typography gutterBottom noWrap sx={{ fontSize: 12 }}>
                                                        {notepad.content}
                                                    </Typography>
                                                )}
                                                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                                    Created {notepad.created.toISOString()}
                                                </Typography>
                                                <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                                    Modified {notepad.modified.toISOString()}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton
                                                    component="span"
                                                    size="small"
                                                    onClick={(e) => handleDelete(e, i)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </CardActions>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </Box>
            </Container>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={notepadIndex >= 0}
                onClose={() => {
                    handleEdit();
                    setNotepadIndex(-1);
                }}
            >
                <DialogTitle>
                    <TextField
                        fullWidth
                        label="Title"
                        margin="dense"
                        onChange={onTitleChange}
                        defaultValue={notepadIndex >= 0 ? notepads[notepadIndex].title : ""}
                    />
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Content"
                        margin="dense"
                        multiline
                        onChange={onContentChange}
                        defaultValue={notepadIndex >= 0 ? notepads[notepadIndex].content : ""}
                    />
                </DialogContent>
            </Dialog>
            <Fab
                color="primary"
                onClick={handleCreate}
                sx={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                }}
            >
                <Add />
            </Fab>
        </>
    );
}

function useForceUpdate() {
    const [, setValue] = React.useState(0);
    return () => setValue((value) => value + 1);
}
