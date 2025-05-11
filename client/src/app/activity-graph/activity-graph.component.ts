import {Component, input, OnInit} from '@angular/core';
import {MatTooltip} from "@angular/material/tooltip";
import {DatePipe, NgForOf} from "@angular/common";
import {Workout} from "../models/Workout";
import {DateTimeService} from "../services/date-time.service";

@Component({
  selector: 'app-activity-graph',
  standalone: true,
  imports: [
    MatTooltip,
    NgForOf,
    DatePipe
  ],
  templateUrl: './activity-graph.component.html',
  styleUrl: './activity-graph.component.scss'
})
export class ActivityGraphComponent implements OnInit {
  contributions = input.required<Workout[]>(); // Array of contributions for 365 days
  levels: string[] = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']; // Color levels
  startDate= input.required<Date>(); // Start date of the contribution graph (yyyy-MM-dd)

  weeks: { date: Date; value: number }[][] = []; // Matrix of weeks with date and contribution value


  constructor(private dateTimeService: DateTimeService) {
  }

  ngOnInit(): void {
    this.generateWeeks();
  }

  private generateWeeks(): void {
    const baseDate = new Date(this.startDate());
    const daysInYear = 365;
    const daysInWeek = 7;
    let week: { date: Date; value: number }[] = [];

    for (let i = 0; i < daysInYear; i++) {
      const currentDate = new Date(baseDate);
      currentDate.setDate(baseDate.getDate() + i); // Calculate the date for the current index

      week.push({
        date: currentDate,
        value: this.contributions().filter(w => this.dateTimeService.sameDay(new Date(w.date), currentDate)).length,
      });

      if (week.length === daysInWeek || i === daysInYear - 1) {
        this.weeks.push(week);
        week = [];
      }
    }
  }

  getColor(value: number): string {
    const level = Math.min(this.levels.length - 1, value); // Determine activity level
    return this.levels[level];
  }
}
