FROM node:18.12.1-alpine3.17 AS builder
USER node
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --legacy-peer-deps
COPY --chown=node:node . .
RUN npm run build && npm prune --production --legacy-peer-deps

FROM builder AS production
ENV NODE_ENV production
USER node
WORKDIR /app
CMD ["npm", "run", "start:prod"]
