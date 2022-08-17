import { CtfInfo } from "./ctfInfo"

export const timeFormat = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric", month: "numeric", day: "numeric",
  hour: "numeric", minute: "numeric", second: "numeric",
  timeZone: "Asia/Seoul",
})

export class CtfInfoDetail {
  summary: CtfInfo;
  url: string;
  description: string;
  logo: string;
  duration: CtfDuration
  startRaw: Date;
  finishRaw: Date;

  constructor (
    name: string,
    start: Date,
    finish: Date,
    format: string,
    weight: number,
    ctftimeUrl: string,

    url: string,
    description: string,
    logo: string,
    duration: CtfDuration,
  ) {
    this.summary = new CtfInfo(
      name,
      timeFormat.format(start),
      timeFormat.format(finish),
      format,
      weight,
      ctftimeUrl,
    );

    this.url = url;
    this.description = description;
    this.logo = logo;
    this.duration = duration;

    this.startRaw = start;
    this.finishRaw = finish;
  }
}

export class CtfDuration {
  days: number;
  hours: number;

  constructor (days: number, hours: number) {
    this.days = days;
    this.hours = hours;
  }
}
