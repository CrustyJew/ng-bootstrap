import {NgbDateStruct} from './ngb-date-struct';

export class NgbDate {
  static from(date: {year: number, month?: number, day?: number}) {
    let nDate = date ? new NgbDate(date.year, date.month ? date.month : 1, date.day ? date.day : 1) : null;

    return nDate;
  }

  constructor(public year: number, public month: number, public day: number) {}

  equals(other: NgbDateStruct) {
    return other && this.year === other.year && this.month === other.month && this.day === other.day;
  }

  before(other: NgbDateStruct) {
    if (!other) {
      return false;
    }

    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day < other.day;
      } else {
        return this.month < other.month;
      }
    } else {
      return this.year < other.year;
    }
  }

  after(other: NgbDateStruct) {
    if (!other) {
      return false;
    }
    if (this.year === other.year) {
      if (this.month === other.month) {
        return this.day === other.day ? false : this.day > other.day;
      } else {
        return this.month > other.month;
      }
    } else {
      return this.year > other.year;
    }
  }

  toString() { return `${this.year}-${this.month}-${this.day}`; }
}
