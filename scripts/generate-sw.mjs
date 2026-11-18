import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("out");

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return files.flat();
};

const files = (await walk(outDir)).filter(
  (file) => !file.endsWith("sw.js") && !file.endsWith(".DS_Store"),
);

const hash = createHash("sha256");
const urls = [];

for (const file of files.sort()) {
  hash.update(file);
  hash.update(await readFile(file));
  const url = "/" + path.relative(outDir, file).split(path.sep).join("/");
  urls.push(url.endsWith("/index.html") ? url.slice(0, -"index.html".length) : url);
}

const version = hash.digest("hex").slice(0, 12);

const sw = `const CACHE = "panduan-umroh-${version}";
const PRECACHE = ${JSON.stringify(urls)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const withTrailingSlash = (url) => {
  const next = new URL(url);
  if (!next.pathname.endsWith("/") && !next.pathname.split("/").pop().includes(".")) {
    next.pathname += "/";
  }
  return next.href;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached =
        (await cache.match(request, { ignoreSearch: true })) ||
        (request.mode === "navigate" &&
          (await cache.match(withTrailingSlash(request.url), { ignoreSearch: true })));
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        if (request.mode === "navigate") {
          const fallback = await cache.match("/");
          if (fallback) return fallback;
        }
        throw error;
      }
    })(),
  );
});
`;

await writeFile(path.join(outDir, "sw.js"), sw);
console.log(`sw.js generated: ${urls.length} files precached (version ${version})`);
