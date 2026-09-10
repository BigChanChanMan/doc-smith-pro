/**
 * 文匠 DocSmith — 自托管生产服务器入口
 * 包装 TanStack Start 构建产物（WinterCG fetch handler）为 Node HTTP 服务。
 * 用法: PORT=3000 node scripts/prod-server.mjs
 */
import process from "node:process";

// 构建 bundle 使用 development JSX 运行时（react/jsx-dev-runtime）。
// React 的该模块在 NODE_ENV=production 下导出 jsxDEV: undefined，会导致 SSR 500。
// 故此处固定 NODE_ENV（仅影响运行时警告开关，不影响产物本身）。
process.env.NODE_ENV = "development";

import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST = join(__dirname, "..", "dist");
const CLIENT = join(DIST, "client");
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const handlerModule = await import(join(DIST, "server", "server.js"));
const handler = handlerModule.default ?? handlerModule;
if (!handler?.fetch) {
  console.error("[docsmith] dist/server/server.js 未导出 fetch handler，构建产物形态已变化");
  process.exit(1);
}

const MIME = {
  ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css",
  ".html": "text/html", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".wasm": "application/wasm",
  ".map": "application/json", ".txt": "text/plain",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

    // 1) 静态资源（/assets/ 下的带 hash 文件直接回源）
    if (url.pathname.startsWith("/assets/")) {
      const filePath = join(CLIENT, url.pathname);
      if (existsSync(filePath)) {
        const body = readFileSync(filePath);
        res.writeHead(200, {
          "content-type": MIME[extname(filePath)] ?? "application/octet-stream",
          "cache-control": "public, max-age=31536000, immutable",
        });
        res.end(body);
        return;
      }
    }

    // 2) 其余全部交给 SSR handler（WinterCG fetch 语义）
    const method = req.method ?? "GET";
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      if (Array.isArray(v)) v.forEach((vv) => headers.append(k, vv));
      else if (v != null) headers.set(k, v);
    }

    const hasBody = method !== "GET" && method !== "HEAD";
    const body = hasBody
      ? await new Promise((resolve) => {
          const chunks = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks)));
        })
      : undefined;

    const request = new Request(url.href, {
      method,
      headers,
      body,
      duplex: "half",
    });

    const response = await handler.fetch(request);

    const resHeaders = {};
    response.headers.forEach((v, k) => {
      resHeaders[k] = v;
    });

    // 静态兜底：SPA 未带 hash 的资源
    if (response.status === 404 && url.pathname.startsWith("/assets/")) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not Found");
      return;
    }

    res.writeHead(response.status, resHeaders);
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) { res.end(); return; }
          res.write(Buffer.from(value));
        }
      };
      await pump();
    } else {
      res.end();
    }
  } catch (e) {
    console.error("[docsmith] request error:", e);
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Internal Server Error");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[docsmith] 文匠 DocSmith 生产服务已启动: http://${HOST}:${PORT}`);
});
