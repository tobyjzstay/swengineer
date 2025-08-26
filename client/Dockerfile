FROM node:20-alpine AS build
WORKDIR /client
COPY . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build
