# syntax=docker/dockerfile:1

# ══════════════════════════ 构建阶段 ══════════════════════════
# 只在这里需要 devDependencies（vite / typescript / esbuild），产物里不带。
FROM node:22-bookworm-slim AS build
WORKDIR /app

# 依赖清单单独一层，源码改动不会让 npm ci 的缓存失效
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ══════════════════════════ 运行阶段 ══════════════════════════
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

# 运行时必须有 node_modules：dist/server/server.js 里 react / @tanstack/* / h3-v2
# 都是 external 导入，且 PDF 引擎是 node_modules/takumi-pdf/pkg/*.wasm（构建不打包进 dist）。
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/scripts ./scripts
# 字体运行时按 process.cwd()/fonts 读取，必须与 WORKDIR 同级
COPY --from=build /app/fonts ./fonts

ENV PORT=3000 \
    HOST=0.0.0.0
EXPOSE 3000

# 非 root 运行；应用只读不写盘，node 用户有 r-x 权限即可
USER node

# slim 镜像没有 curl，用 node 自带 fetch 探活
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "scripts/prod-server.mjs"]
