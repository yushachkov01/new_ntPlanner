# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false \
 && npm config set registry https://registry.npmmirror.com
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app

RUN npm config set strict-ssl false \
 && npm config set registry https://registry.npmmirror.com

COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.ws.json ./tsconfig.ws.json
COPY tsconfig.json ./tsconfig.json
COPY src/ws-service ./src/ws-service
RUN npx tsc -p tsconfig.ws.json

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN npm config set strict-ssl false \
 && npm config set registry https://registry.npmmirror.com

COPY package*.json ./
RUN npm i --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3001 4000
CMD ["node", "dist/ws-service/server.js"]