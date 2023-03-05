FROM node:lts-alpine3.17
RUN apk add python3
WORKDIR /app
COPY package*.json ./
RUN npm i --legacy-peer-deps
COPY . .
RUN npm run db:gen && npm run build
ENV NODE_ENV production
CMD ["npm", "run", "start:prod"]
