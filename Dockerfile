FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./app

RUN npm install

COPY . ./app

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

EXPOSE 3000

CMD node dist/src/main.js
