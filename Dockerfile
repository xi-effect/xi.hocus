FROM node:20-alpine AS base

WORKDIR /app

FROM base AS builder

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json src ./
RUN npm run build

FROM base AS runner

COPY package.json package-lock.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 1234

ENTRYPOINT npm run start
