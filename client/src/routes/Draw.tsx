import SquareIcon from "@mui/icons-material/Square";
import { Box, Button, Fade, IconButton, Paper, Slider } from "@mui/material";
import React from "react";

const enum Shape {
    LINE,
}

const enum Color {
    BLACK = "#000000",
    WHITE = "#ffffff",
    GREY = "#7f7f7f",
    LIGHT_GREY = "#c3c3c3",
    DARK_RED = "#880015",
    BROWN = "#b97a57",
    RED = "#ed1c24",
    ROSE = "#ffaec9",
    ORANGE = "#ff7f27",
    GOLD = "#ffc90e",
    YELLOW = "#fff200",
    LIGHT_YELLOW = "#efe4b0",
    GREEN = "#22b14c",
    LIGHT_GREEN = "#b5e61d",
    TURQUOISE = "#00a2e8",
    LIGHT_TURQUOISE = "#99d9ea",
    INDIGO = "#3f48cc",
    BLUE_GREY = "#7092be",
    PURPLE = "#a349a4",
    LAVENDER = "#c8bfe7",
}

const colors = [
    Color.BLACK,
    Color.WHITE,
    Color.GREY,
    Color.LIGHT_GREY,
    Color.DARK_RED,
    Color.BROWN,
    Color.RED,
    Color.ROSE,
    Color.ORANGE,
    Color.GOLD,
    Color.YELLOW,
    Color.LIGHT_YELLOW,
    Color.GREEN,
    Color.LIGHT_GREEN,
    Color.TURQUOISE,
    Color.LIGHT_TURQUOISE,
    Color.INDIGO,
    Color.BLUE_GREY,
    Color.PURPLE,
    Color.LAVENDER,
];

export function Draw() {
    const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [shape, setShape] = React.useState(Shape.LINE);
    const [lineWidth, setLineWidth] = React.useState(3);
    const [color, setColor] = React.useState(Color.BLACK);
    const position = React.useRef([0, 0]);

    React.useEffect(() => {
        if (canvasRef) {
            const ctx = canvasRef.getContext("2d");
            if (!ctx) return;
            const canvas = ctx.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 8;
            handleClear(ctx);
            setCtx(ctx);
        }
    }, [canvasRef]);

    React.useEffect(() => {
        if (!canvasRef || !ctx) return;
        window.addEventListener("resize", handleResize);
        canvasRef.addEventListener("mousedown", handleMouseDown);
        canvasRef.addEventListener("mousemove", handleMouseMove);
        canvasRef.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("resize", handleResize);
            canvasRef.removeEventListener("mousedown", handleMouseDown);
            canvasRef.removeEventListener("mousemove", handleMouseMove);
            canvasRef.removeEventListener("mouseup", handleMouseUp);
        };
    }, [canvasRef, ctx, isDrawing, shape, lineWidth, color]);

    const handleResize = () => {
        if (!ctx) return;
        const canvas = ctx.canvas;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 8;
        handleClear(ctx);
        ctx.putImageData(imageData, 0, 0);
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (!ctx) return;
        const x = e.offsetX;
        const y = e.offsetY;
        position.current = [x, y];
        setIsDrawing(true);
        if (shape === Shape.LINE) {
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = color;
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!ctx) return;
        if (!isDrawing) return;
        const px = position.current[0];
        const py = position.current[1];
        const x = e.offsetX;
        const y = e.offsetY;
        position.current = [x, y];
        if (shape === Shape.LINE) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (!ctx) return;
        if (!isDrawing) return;
        const px = position.current[0];
        const py = position.current[1];
        const x = e.offsetX;
        const y = e.offsetY;
        if (shape === Shape.LINE) {
            position.current = [x, y];
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
            setIsDrawing(false);
        }
    };

    const handleColorChange = (color: Color) => {
        if (!ctx) return;
        setColor(color);
    };

    const handleClear = (ctx: CanvasRenderingContext2D | null) => {
        if (!ctx) return;
        const canvas = ctx.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = Color.WHITE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <>
            <canvas ref={setCanvasRef} />
            <Fade in={!isDrawing} appear={false}>
                <Paper sx={{ position: "absolute", bottom: 0, left: 0, p: 2, m: 2 }}>
                    <Button variant="contained" onClick={() => handleClear(ctx)}>
                        Clear
                    </Button>
                    <Slider
                        min={1}
                        max={20}
                        value={lineWidth}
                        onChange={(e, v) => {
                            setLineWidth(v as number);
                        }}
                    />
                    <Box display="flex">
                        {colors.map((_color, i) => {
                            if (i % 2 !== 0) return;
                            const color1 = colors[i];
                            const color2 = colors[i + 1];
                            return (
                                <Box key={i} display="flex" flexDirection="column">
                                    <IconButton size="small" onClick={() => handleColorChange(color1)}>
                                        <SquareIcon
                                            sx={{
                                                color: color1,
                                            }}
                                        />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => handleColorChange(color2)}>
                                        <SquareIcon
                                            sx={{
                                                color: color2,
                                            }}
                                        />
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>
            </Fade>
        </>
    );
}
