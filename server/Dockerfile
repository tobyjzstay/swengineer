FROM node:20-alpine
WORKDIR /server
COPY . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm build
EXPOSE 8080
CMD ["node", "dist/index.js"]
