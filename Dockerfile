FROM node:16.17.0

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

CMD [ "yarn", "start" ]
