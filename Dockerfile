FROM node:20-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:20-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
COPY --from=builder /home/node/docs/ /home/node/docs/

CMD ["node", "dist/src/main.js"]

# FROM node:20-alpine AS build

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build

# FROM node:20-alpine AS runner

# WORKDIR /app

# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/package*.json ./

# EXPOSE 3000

# CMD node dist/src/main.js

