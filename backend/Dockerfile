FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json .
RUN pnpm install --frozen-lockfile=false

COPY . .
RUN pnpm build

EXPOSE 4000
CMD ["pnpm", "start"]
