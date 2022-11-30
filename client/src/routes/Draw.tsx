import React from "react";

type Position = {
    x: number;
    y: number;
};

export function Draw() {
    const [canvasRef, setCanvasRef] = React.useState<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        if (!canvasRef) return;
        const ctx = canvasRef.getContext("2d");
        if (!ctx) return;
        const canvas = ctx.canvas;

        let isDrawing = false;
        let x = 0;
        let y = 0;

        // handle resize
        window.addEventListener("resize", () => {
            const ratio = window.devicePixelRatio;
            const style = canvas.style;

            style.width = "" + window.innerWidth / ratio + "px";
            style.height = "" + window.innerHeight / ratio + "px";

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });


        canvasRef.addEventListener("mousedown", (e) => {
            x = e.offsetX;
            y = e.offsetY;
            isDrawing = true;
        });

        canvasRef.addEventListener("mousemove", (e) => {
            if (isDrawing) {
                drawLine(ctx, x, y, e.offsetX, e.offsetY);
                x = e.offsetX;
                y = e.offsetY;
            }
        });

        canvasRef.addEventListener("mouseup", (e) => {
            if (isDrawing) {
                drawLine(ctx, x, y, e.offsetX, e.offsetY);
                x = 0;
                y = 0;
                isDrawing = false;
            }
        });
    });

    return <canvas ref={setCanvasRef} />;
}

function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}
