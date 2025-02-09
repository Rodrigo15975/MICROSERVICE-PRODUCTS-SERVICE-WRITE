# Stage 1: Build
FROM node:alpine3.20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:migrate:prod  # Aplica las migraciones aquí
RUN npm run build

# Stage 2: Production
FROM node:alpine3.20
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 4004
CMD ["npm", "run", "start:prod"]