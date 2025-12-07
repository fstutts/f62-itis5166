FROM node:18-alpine

WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm install --only=production

COPY server/ ./

EXPOSE 3000

CMD ["node", "index.js"]
