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
    // {
    //     path: "/login",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Login")),
    // },
    // {
    //     path: "/register",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Register")),
    // },
    // {
    //     path: "/register/:token",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Verify")),
    // },
    // {
    //     path: "/reset",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/ResetPassword")),
    // },
    // {
    //     path: "/reset/:token",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/ChangePassword")),
    // },
    // {
    //     path: "/profile",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Profile")),
    // },
    {
        path: "/clock",
        sitemap: null,
        element: React.lazy(() => import("./routes/Clock")),
    },
    // {
    //     path: "/draw",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Draw")),
    // },
    // {
    //     path: "/notepad",
    //     sitemap: null,
    //     element: React.lazy(() => import("./routes/Notepad")),
    // },
    {
        path: "*",
        sitemap: null,
        element: React.lazy(() => import("./routes/PageNotFound")),
    },
];

export default routes;
