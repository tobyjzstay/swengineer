import { Button, Paper, Slider } from "@mui/material";
import React from "react";

const enum Shape {
    LINE,
}

export function Draw() {
    const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = React.useState(false);
    const [shape, setShape] = React.useState(Shape.LINE);
    const [lineWidth, setLineWidth] = React.useState(10);
    const [position, setPosition] = React.useState([0, 0]);

    React.useEffect(() => {
        if (canvasRef) {
            const ctx = canvasRef.getContext("2d");
            if (!ctx) return;
            const canvas = ctx.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 8;
            ctx.translate(0.5, 0.5);
            setCtx(ctx);
        }
    }, [canvasRef]);

    React.useEffect(() => {
        if (!canvasRef || !ctx) return;
        canvasRef.addEventListener("mousedown", mousedownListener);
        canvasRef.addEventListener("mousemove", mousemoveListener);
        canvasRef.addEventListener("mouseup", mouseupListener);
        return () => {
            canvasRef.removeEventListener("mousedown", mousedownListener);
            canvasRef.removeEventListener("mousemove", mousemoveListener);
            canvasRef.removeEventListener("mouseup", mouseupListener);
        };
    }, [canvasRef, ctx, isDrawing, shape, lineWidth, position]);

    const mousedownListener = (e: MouseEvent) => {
        if (!ctx) return;
        const x = e.offsetX;
        const y = e.offsetY;
        setPosition([x, y]);
        setIsDrawing(true);
        if (shape === Shape.LINE) {
            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.strokeStyle = "white";
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const mousemoveListener = (e: MouseEvent) => {
        if (!ctx) return;
        if (!isDrawing) return;
        const px = position[0];
        const py = position[1];
        const x = e.offsetX;
        const y = e.offsetY;
        setPosition([x, y]);
        if (shape === Shape.LINE) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    const mouseupListener = (e: MouseEvent) => {
        if (!ctx) return;
        if (!isDrawing) return;
        const px = position[0];
        const py = position[1];
        const x = e.offsetX;
        const y = e.offsetY;
        if (shape === Shape.LINE) {
            setPosition([x, y]);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(x, y);
            ctx.stroke();
            setIsDrawing(false);
        }
    };

    return (
        <>
            <canvas ref={setCanvasRef} />
            <Paper sx={{ position: "absolute", bottom: 0, left: 0, p: 2, m: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => {
                        if (!canvasRef) return;
                        const ctx = canvasRef.getContext("2d");
                        if (!ctx) return;
                        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                    }}
                >
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
            </Paper>
        </>
    );
}
