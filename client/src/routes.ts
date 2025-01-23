import React, { ComponentType } from "react";

interface Route {
    path: string;
    sitemap: {
        url: string;
    } | null;
    element: ComponentType<unknown>;
}

const routes: Route[] = [
    {
        path: "/",
        sitemap: { url: "/" },
        element: React.lazy(() => import("./routes/Home")),
    },
    {
        path: "/login",
        sitemap: { url: "/login" },
        element: React.lazy(() => import("./routes/Login")),
    },
    {
        path: "/register",
        sitemap: { url: "/register" },
        element: React.lazy(() => import("./routes/Register")),
    },
    {
        path: "/register/:token",
        sitemap: null,
        element: React.lazy(() => import("./routes/Verify")),
    },
    {
        path: "/reset",
        sitemap: { url: "/reset" },
        element: React.lazy(() => import("./routes/ResetPassword")),
    },
    {
        path: "/reset/:token",
        sitemap: null,
        element: React.lazy(() => import("./routes/ChangePassword")),
    },
    {
        path: "/profile",
        sitemap: { url: "/profile" },
        element: React.lazy(() => import("./routes/Profile")),
    },
    {
        path: "/clock",
        sitemap: { url: "/clock" },
        element: React.lazy(() => import("./routes/Clock")),
    },
    {
        path: "/draw",
        sitemap: { url: "/draw" },
        element: React.lazy(() => import("./routes/Draw")),
    },
    {
        path: "/notepad",
        sitemap: { url: "/notepad" },
        element: React.lazy(() => import("./routes/Notepad")),
    },
    {
        path: "*",
        sitemap: null,
        element: React.lazy(() => import("./routes/PageNotFound")),
    },
];

export default routes;
