export class CtfInfo {
  name: string;
  start: string;
  end: string;
  format: string;
  weight: number;

  constructor (
    name: string,
    start: string,
    end: string,
    format: string,
    weight: number,
  ) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.format = format;
    this.weight = weight;
  }
}

