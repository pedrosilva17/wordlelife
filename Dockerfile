FROM node:22-bullseye

WORKDIR /app

COPY . .

RUN npm ci

RUN npx nuxi build

ENV HOST=0.0.0.0

ENV PORT=3003

CMD ["node", ".output/server/index.mjs"]