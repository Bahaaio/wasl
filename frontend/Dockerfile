FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
RUN npm i -g serve@14.2.6

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
