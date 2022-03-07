FROM golang:1.17 as builder

WORKDIR /usr/app

COPY . .
RUN go build

FROM golang:1.17

WORKDIR /usr/app

COPY --from=builder /usr/app/discordbot discordbot

CMD ["/usr/app/discordbot"]
