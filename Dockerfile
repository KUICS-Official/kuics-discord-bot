FROM node:16.17.0 AS builder

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

FROM node:16.17.0

WORKDIR /app

COPY --from=builder /app/out out

RUN yarn install --production

CMD [ "yarn", "start" ]
