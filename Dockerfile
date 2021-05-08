FROM node:14-alpine as base

WORKDIR /app
COPY package*.json ./
EXPOSE 4001

FROM base as production

RUN npm i
COPY . ./
RUN npm run prisma:gen
CMD ["npm", "start"]
