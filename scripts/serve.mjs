import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";

const root = path.resolve("out");
const port = Number(process.env.PORT ?? 4173);

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const compressible = new Set([".html", ".js", ".css", ".json", ".webmanifest", ".txt", ".svg"]);
const cache = new Map();

const resolveFile = async (pathname) => {
  const target = path.join(root, decodeURIComponent(pathname));
  if (!target.startsWith(root)) return null;
  const info = await stat(target).catch(() => null);
  if (info?.isFile()) return target;
  if (info?.isDirectory()) return path.join(target, "index.html");
  return null;
};

const load = async (file) => {
  const { mtimeMs } = await stat(file);
  const cached = cache.get(file);
  if (cached?.mtimeMs === mtimeMs) return cached;
  const body = await readFile(file);
  const ext = path.extname(file);
  const entry = {
    body,
    mtimeMs,
    gzip: compressible.has(ext) ? gzipSync(body) : null,
    type: types[ext],
  };
  cache.set(file, entry);
  return entry;
};

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  const file = (await resolveFile(pathname)) ?? path.join(root, "404.html");
  const entry = await load(file).catch(() => null);
  if (!entry) {
    res.writeHead(404).end("Not found");
    return;
  }

  const useGzip = entry.gzip && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(file.endsWith("404.html") && !pathname.endsWith("404.html") ? 404 : 200, {
    "Content-Type": entry.type ?? "application/octet-stream",
    "Cache-Control": pathname.startsWith("/_next/static/")
      ? "public, max-age=31536000, immutable"
      : "no-cache",
    ...(useGzip && { "Content-Encoding": "gzip", Vary: "Accept-Encoding" }),
  });
  res.end(useGzip ? entry.gzip : entry.body);
}).listen(port, () => console.log(`Serving out/ on http://localhost:${port}`));
