FROM node:20-alpine

WORKDIR /app

COPY ["/dist", "package.json", "package-lock.json", "drizzle.config.ts", "./"]

RUN npm ci

ENV NODE_ENV="production"

CMD ["npm", "run", "start"]

EXPOSE 8080
