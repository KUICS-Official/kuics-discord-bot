FROM node:16.17.0

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build
RUN yarn playwright install

CMD [ "yarn", "start" ]
