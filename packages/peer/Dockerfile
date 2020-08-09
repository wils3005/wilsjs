FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
COPY build/ .
RUN npm ci --only=production
CMD [ "node", "index.js" ]