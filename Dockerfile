FROM node:lts-alpine AS build
RUN apk add python3 git openssl && rm -rf /var/cache/apk/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN DATABASE_HOST=placeholder DATABASE_PORT=5432 DATABASE_USER=placeholder DATABASE_PASSWORD=placeholder DATABASE_NAME=placeholder npm run db:gen && npm run build && chmod +x ./healthcheck.sh

FROM node:lts-alpine AS production
RUN apk add openssl && rm -rf /var/cache/apk/*
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --production --ignore-scripts && rm -rf ~/.npm
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/healthcheck.sh ./
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/src/i18n ./src/i18n
COPY --from=build /app/src/@generated ./src/@generated
RUN chown -R node:node /app
USER node
CMD ["npm", "run", "start:prod"]
