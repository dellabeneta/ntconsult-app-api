FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm install

COPY *.js .

EXPOSE 3000

CMD ["node", "app.js"]
