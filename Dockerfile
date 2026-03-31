FROM node:lts-alpine
RUN apk add python3 git openssl && rm -rf /var/cache/apk/* git

WORKDIR /app
COPY package*.json ./
# git required for lefthook
COPY .git .git
RUN npm i
COPY . .
RUN npm run db:gen && npm run build && chmod +x ./healthcheck.sh && rm -rf .git .env

# Set ownership for non-root user
RUN chown -R node:node /app

# Switch to non-root user
USER node

ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]
