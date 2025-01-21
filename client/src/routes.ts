import { ComponentType } from "react";

interface Route {
    path: string;
    sitemap: {
        url: string;
    } | null;
    component: () => Promise<{ default: ComponentType<unknown> }>;
}

const routes: Route[] = [
    {
        path: "/",
        sitemap: { url: "/" },
        component: () => import("./routes/Home"),
    },
    {
        path: "/login",
        sitemap: { url: "/login" },
        component: () => import("./routes/Login"),
    },
    {
        path: "/register",
        sitemap: { url: "/register" },
        component: () => import("./routes/Register"),
    },
    {
        path: "/register/:token",
        sitemap: null,
        component: () => import("./routes/Verify"),
    },
    {
        path: "/reset",
        sitemap: { url: "/reset" },
        component: () => import("./routes/ResetPassword"),
    },
    {
        path: "/reset/:token",
        sitemap: null,
        component: () => import("./routes/ChangePassword"),
    },
    {
        path: "/profile",
        sitemap: { url: "/profile" },
        component: () => import("./routes/Profile"),
    },
    {
        path: "/clock",
        sitemap: { url: "/clock" },
        component: () => import("./routes/Clock"),
    },
    {
        path: "/draw",
        sitemap: { url: "/draw" },
        component: () => import("./routes/Draw"),
    },
    {
        path: "/notepad",
        sitemap: { url: "/notepad" },
        component: () => import("./routes/Notepad"),
    },
    {
        path: "*",
        sitemap: null,
        component: () => import("./routes/PageNotFound"),
    },
];

export default routes;
