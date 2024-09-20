FROM node:18-alpine as builder

WORKDIR /app

COPY ./apps/server/package*.json .

RUN npm install

COPY ./apps/server .

RUN npm run build

FROM node:18-alpine as production 

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/assets ./assets

COPY --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node","/app/dist/index.js"]