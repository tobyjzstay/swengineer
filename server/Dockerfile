FROM node:lts
WORKDIR /server
COPY . .
RUN npm install -g pnpm
RUN pnpm install
EXPOSE 8080
CMD ["pnpm", "start"]
