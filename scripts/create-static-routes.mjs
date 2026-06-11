import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const routes = [
  "map",
  "system",
  "practice",
  "journal",
  "commitment",
  "models",
  "proof",
  "principles",
];

const root = resolve("dist");
const source = resolve(root, "index.html");

await Promise.all(
  routes.map(async (route) => {
    const directory = resolve(root, route);
    await mkdir(directory, { recursive: true });
    await copyFile(source, resolve(directory, "index.html"));
  }),
);
