# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.ws.json ./tsconfig.ws.json
COPY tsconfig.json ./tsconfig.json
# copy WS sources folder (contains server.ts)
COPY src/ws-service ./src/ws-service
# compile and show dist contents for debugging
RUN npx tsc -p tsconfig.ws.json && echo '--- DIST ---' && ls -R dist

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm i --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3001 4000
CMD ["node", "dist/ws-service/server.js"]
