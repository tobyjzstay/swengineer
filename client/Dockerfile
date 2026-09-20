FROM node:20-alpine AS build
WORKDIR /client
COPY . .
RUN npm install -g pnpm@10.33.0
RUN pnpm install --frozen-lockfile
RUN pnpm build
