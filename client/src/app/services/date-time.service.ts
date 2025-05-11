import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

  constructor() { }

  toUtc(date: Date): Date {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  }

  sameDay(d1: Date, d2: Date): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

  unixEpoch(){
    return new Date("1970-01-01");
  }
}
