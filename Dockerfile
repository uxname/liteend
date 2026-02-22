FROM node:lts-alpine
RUN apk add python3 git openssl && rm -rf /var/cache/apk/* git

# Create non-root user if it doesn't exist (exists in node:lts-alpine by default)
RUN addgroup -g 1000 appgroup && \
    adduser -u 1000 -G appgroup -D appuser || true

WORKDIR /app
COPY package*.json ./
# git required for lefthook
COPY .git .git
RUN npm i
COPY . .
RUN npm run db:gen && npm run build && chmod +x ./healthcheck.sh && rm -rf .git .env

# Set ownership for non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

ENV NODE_ENV=production
CMD ["npm", "run", "start:prod"]
