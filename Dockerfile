FROM node:lts-alpine AS build
RUN apk add python3 git openssl && rm -rf /var/cache/apk/* git
WORKDIR /app
COPY package*.json ./
COPY .git .git
RUN PRISMA_SKIP_POSTINSTALL_GENERATE=1 npm i
COPY . .
RUN npm run db:gen && npm run build && chmod +x ./healthcheck.sh

FROM node:lts-alpine AS production
RUN apk add openssl && rm -rf /var/cache/apk/*
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN PRISMA_SKIP_POSTINSTALL_GENERATE=1 npm ci --production && rm -rf ~/.npm
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/healthcheck.sh ./
COPY --from=build /app/data ./data
RUN chown -R node:node /app
USER node
CMD ["npm", "run", "start:prod"]
