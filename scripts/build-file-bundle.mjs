import { mkdir, cp, writeFile, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const dist = "dist";
const fileDist = "file-dist";

await mkdir(fileDist, { recursive: true });
await cp(dist, fileDist, { recursive: true });

const files = await readdir(join(fileDist, "assets"));
const js = files.find((file) => file.endsWith(".js"));
const css = files.find((file) => file.endsWith(".css"));
if (!js) throw new Error("Missing bundled JS asset");

let html = await readFile(join(dist, "index.html"), "utf8");
html = html.replaceAll("/assets/", "./assets/");
if (css) html = html.replaceAll(`href="./assets/${css}"`, `href="./assets/${css}"`);
await writeFile(join(fileDist, "index.html"), html);
