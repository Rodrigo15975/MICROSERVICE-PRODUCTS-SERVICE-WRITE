FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npx prisma generate
RUN npm run build   

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
EXPOSE 4004
CMD ["npm", "run", "start:prod"]