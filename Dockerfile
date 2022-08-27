FROM node:16.17.0 AS builder

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM node:16.17.0

WORKDIR /app

RUN apt-get update
RUN apt-get install -y \
libnss3 libwayland-client0 libatspi2.0-0 \
libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
libcups2 libdrm2 libdbus-1-3 \
libxkbcommon-x11-0 libxcomposite1 libxdamage1 \
libxfixes3 libxrandr2 libgbm1 \
libasound2

COPY --from=builder /app/out out
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .

RUN yarn install --production

CMD [ "yarn", "start" ]
