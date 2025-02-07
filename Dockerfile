FROM node:20-alpine3.20
WORKDIR /app

COPY package*.json ./
RUN npm i

RUN npm run build
COPY . .

EXPOSE 4004

CMD ["npm", "run", "start:prod"]