# ── Build Stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend
COPY tsconfig.json ./tsconfig.json

RUN pnpm --filter @bond/shared build
RUN pnpm --filter @bond/frontend build

# ── Production Stage ──────────────────────────────────────────────────────────
FROM nginx:alpine AS production

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Custom nginx config to handle SPA routing
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
