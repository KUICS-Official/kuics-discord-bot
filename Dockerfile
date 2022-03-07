FROM golang:1.17 as builder

WORKDIR /usr/app

COPY go.mod go.mod
COPY go.sum go.sum

RUN go mod download

COPY . .

RUN go build

FROM golang:1.17

WORKDIR /usr/app

COPY --from=builder /usr/app/discordbot discordbot

CMD ["/usr/app/discordbot"]
