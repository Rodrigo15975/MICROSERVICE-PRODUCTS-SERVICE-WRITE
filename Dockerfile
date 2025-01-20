# Usa una imagen base de Node.js
FROM node:20-alpine3.20
WORKDIR /app

COPY package*.json ./
# cambiar todo esto
RUN npm i

COPY prisma prisma
COPY . .

COPY wait-for-db.sh .

EXPOSE 4004

CMD [ "sh","./wait-for-db.sh" ]