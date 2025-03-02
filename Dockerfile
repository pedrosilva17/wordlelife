FROM node:22-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    chromium \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip3 install -r external/requirements.txt

RUN playwright install chromium

RUN npm ci

RUN npx nuxi build

ENV HOST=0.0.0.0

ENV PORT=3003

CMD ["node", ".output/server/index.mjs"]