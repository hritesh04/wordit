FROM node:18-alpine AS builder

WORKDIR /app

COPY ./apps/server/package*.json .

RUN npm install

COPY ./apps/server .

RUN npm run build

FROM node:18-alpine AS production 

WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm install

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/assets ./assets

ARG FRONTEND_URL
ARG PORT

EXPOSE 3000

CMD ["node","/app/dist/index.js"]