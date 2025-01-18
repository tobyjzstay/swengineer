import { createWriteStream } from "fs";
import * as path from "path";
import { SitemapStream } from "sitemap";
import routes from "./src/routes";

const sitemapStream = new SitemapStream({ hostname: "https://swengineer.dev" });
const writeStream = createWriteStream(path.join(__dirname, "build", "sitemap.xml"));

sitemapStream.pipe(writeStream);
routes
    .filter((route) => route.sitemap !== null)
    .map((route) => route.sitemap)
    .forEach((route) => sitemapStream.write(route));
sitemapStream.end();
