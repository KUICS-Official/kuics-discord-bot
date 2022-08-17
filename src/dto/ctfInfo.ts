export class CtfInfo {
  name: string;
  start: string;
  finish: string;
  format: string;
  weight: number;
  ctftimeUrl: string;

  constructor (
    name: string,
    start: string,
    finish: string,
    format: string,
    weight: number,
    ctftimeUrl: string,
  ) {
    this.name = name;
    this.start = start;
    this.finish = finish;
    this.format = format;
    this.weight = weight;
    this.ctftimeUrl = ctftimeUrl;
  }
}

