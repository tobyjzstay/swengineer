import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { Masonry } from "@mui/lab";
import {
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout, { LayoutType } from "../components/Layout";
import { getRequest, postRequest, showResponse } from "../components/Request";

interface Notepad {
    _id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

function Notepad() {
    const [initialised, setInitialised] = React.useState(false);
    const [refresh, setRefresh] = React.useState(true);
    const [notepads, setNotepads] = React.useState<Notepad[]>([]);
    const [notepadIndex, setNotepadIndex] = React.useState(-1);
    const [edit, setEdit] = React.useState(false);

    const navigate = useNavigate();
    const forceUpdate = useForceUpdate();

    React.useMemo(() => {
        const pathname = window.location.pathname;
        getRequest(pathname).then(async (response) => {
            if (!response.ok) navigate("/login?redirect=" + pathname, { replace: true });
            else setInitialised(true);
        });
    }, [navigate]);

    React.useEffect(() => {
        if (!refresh) return;
        getRequest("/notepad").then(async (response) => {
            const json = await response.json();
            const { notepads } = json || {};
            if (!notepads) setNotepads([]);
            else
                setNotepads(
                    notepads?.map((notepad: Notepad) => ({
                        ...notepad,
                        createdAt: new Date(notepad.createdAt),
                        updatedAt: new Date(notepad.updatedAt),
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
            id: notepad._id,
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
            id: notepad._id,
            title: notepad.title,
            content: notepad.content,
        };
        postRequest("/notepad/edit", json).then(async (response) => {
            const json = await response.json();
            const { modified } = json;
            if (modified) notepads[notepadIndex].updatedAt = new Date(modified);
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
        <Layout initialised={initialised} layoutType={LayoutType.Page}>
            <Masonry columns={{ xs: 1, sm: 2, md: 3 }}>
                {notepads
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .map((notepad, i) => (
                        <Card>
                            <CardActionArea onClick={() => handleClick(i)}>
                                <CardContent>
                                    {notepad.title && (
                                        <Typography gutterBottom noWrap>
                                            {notepad.title}
                                        </Typography>
                                    )}
                                    {notepad.content && (
                                        <Typography gutterBottom sx={{ fontSize: 12 }}>
                                            {notepad.content}
                                        </Typography>
                                    )}
                                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                        Created {notepad.createdAt.toISOString()}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12 }} color="text.secondary">
                                        Modified {notepad.updatedAt.toISOString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton component="span" size="small" onClick={(e) => handleDelete(e, i)}>
                                        <Delete />
                                    </IconButton>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    ))}
            </Masonry>
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
        </Layout>
    );
}

function useForceUpdate() {
    const [, setValue] = React.useState(0);
    return () => setValue((value) => value + 1);
}

export default Notepad;
