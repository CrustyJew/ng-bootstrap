import {NgbDate} from './ngb-date';
import {Injectable} from '@angular/core';

function fromJSDate(jsDate: Date) {
  return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
function toJSDate(date: NgbDate) {
  return new Date(date.year, date.month - 1, date.day);
}

export type NgbPeriod = 'y' | 'm' | 'd';

@Injectable()
export abstract class NgbCalendar {
  abstract readonly maxDate: NgbDate;
  abstract readonly minDate: NgbDate;

  abstract getDaysPerWeek(): number;
  abstract getMonths(): number[];
  abstract getWeeksPerMonth(): number;
  abstract getWeekday(date: NgbDate): number;

  abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
  abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;

  abstract getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number;

  abstract getToday(): NgbDate;
}

@Injectable()
export class NgbCalendarGregorian extends NgbCalendar {
  private static _maxDate: NgbDate = NgbDate.from({year: 275759, month: 12, day: 31});

  private static _minDate: NgbDate = NgbDate.from({year: -271820, month: 12, day: 31});

  getDaysPerWeek() { return 7; }

  getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }

  getWeeksPerMonth() { return 6; }

  getNext(date: NgbDate, period: NgbPeriod = 'd', number = 1) {
    if (date.after(this.maxDate)) {
      date = this.maxDate;
    }
    if (date.before(this.minDate)) {
      date = this.minDate;
    }
    let jsDate = toJSDate(date);
    switch (period) {
      case 'y':
        jsDate = toJSDate(new NgbDate(date.year + number, 1, 1));
        break;
      case 'm':
        jsDate = new Date(date.year, date.month + number - 1, 1);
        break;
      case 'd':
        jsDate.setDate(jsDate.getDate() + number);
        break;
      default:
        return date;
    }
    let newDate = fromJSDate(jsDate);
    if (isNaN(jsDate.getTime()) || newDate.before(this.minDate) || newDate.after(this.maxDate)) {
      return number >= 0 ? this.maxDate : this.minDate;
    }
    return newDate;
  }

  getPrev(date: NgbDate, period: NgbPeriod = 'd', number = 1) { return this.getNext(date, period, -number); }

  getWeekday(date: NgbDate) {
    let jsDate = toJSDate(date);
    let day = jsDate.getDay();
    // in JS Date Sun=0, in ISO 8601 Sun=7
    return day === 0 ? 7 : day;
  }

  getWeekNumber(week: NgbDate[], firstDayOfWeek: number) {
    // in JS Date Sun=0, in ISO 8601 Sun=7
    if (firstDayOfWeek === 7) {
      firstDayOfWeek = 0;
    }

    const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
    let date = week[thursdayIndex];

    const jsDate = toJSDate(date);
    jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));  // Thursday
    const time = jsDate.getTime();
    jsDate.setMonth(0);  // Compare with Jan 1
    jsDate.setDate(1);
    return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
  }

  getToday(): NgbDate { return fromJSDate(new Date()); }

  // max and min date given small buffer from absolute max and min javascript dates

  get maxDate(): NgbDate { return NgbCalendarGregorian._maxDate; }

  get minDate(): NgbDate { return NgbCalendarGregorian._minDate; }
}
