FROM node:16 as modules
WORKDIR /app
COPY package*.json ./
RUN npm i

FROM modules as app
WORKDIR /app
COPY . ./
RUN npm run prisma:gen
EXPOSE 4000
CMD ["npm", "start"]
