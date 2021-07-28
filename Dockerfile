FROM node:alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH="/usr/bin/chromium-browser"
ENV PUPPETEER_EXECUTABLE_PATH="${CHROMIUM_PATH}"

RUN apk add chromium

WORKDIR /app/

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .


