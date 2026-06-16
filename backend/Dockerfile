FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm install --frozen-lockfile=false

COPY . .
RUN pnpm build

EXPOSE 4000
CMD ["pnpm", "start"]
