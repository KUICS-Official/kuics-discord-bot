export class CtfInfo {
  name: string;
  start: string;
  end: string;
  format: string;
  weight: number;
  url: string;

  constructor (
    name: string,
    start: string,
    end: string,
    format: string,
    weight: number,
    url: string,
  ) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.format = format;
    this.weight = weight;
    this.url = url;
  }
}

