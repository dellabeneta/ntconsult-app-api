FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "prd"]
