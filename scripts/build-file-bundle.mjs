import { mkdir, cp, writeFile, readdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const dist = "dist";
const fileDist = "file-dist";

await rm(fileDist, { recursive: true, force: true });
await mkdir(fileDist, { recursive: true });
await cp(dist, fileDist, { recursive: true });

const files = await readdir(join(fileDist, "assets"));
const js = files.find((file) => file.endsWith(".js"));
const css = files.find((file) => file.endsWith(".css"));
if (!js) throw new Error("Missing bundled JS asset");

const jsSource = await readFile(join(fileDist, "assets", js), "utf8");
const cssSource = css ? await readFile(join(fileDist, "assets", css), "utf8") : "";
let html = await readFile(join(dist, "index.html"), "utf8");
html = html
  .replace(/<script[^>]+src="\/assets\/[^"]+"><\/script>/g, "")
  .replace(/<link[^>]+href="\/assets\/[^"]+">/g, "")
  .replace("</head>", `<style>${cssSource}</style><script type="module">${jsSource}</script></head>`);
await writeFile(join(fileDist, "index.html"), html);
