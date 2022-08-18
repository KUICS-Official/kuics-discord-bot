import console from "console";

type LoggingType = "startup" | "start" | "request" | "response" | "end" | "error";
type LogLevel = "error" | "info" | "debug";

export class LoggingMeta {
  requestId: string | undefined;
  type: LoggingType;
  message: string;

  constructor (
    requestId: string | undefined,
    type: LoggingType,
    message: string,
  ) {
    this.requestId = requestId;
    this.type = type;
    this.message = message;
  }

  log(level: LogLevel) {
    const message = this.toString();

    switch (level) {
      case "error":
        console.error(message);
        break;
      case "info":
        console.log(message);
      case "debug":
        console.debug(message);
    }
  }

  toString() {
    return JSON.stringify(this);
  }
}

