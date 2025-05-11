import {Component, input, OnInit} from '@angular/core';
import {Workout} from "../../../models/Workout";
import { CommonModule } from '@angular/common';
import {ActivityComponent} from "../activity/activity.component";
import {WorkoutFormDialogComponent} from "../workout-form-dialog/workout-form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {WorkoutService} from "../../../services/workout.service";
import {CdkDrag, CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {Label} from "../../../models/Label";
import {FoodCardComponent} from "../food-card/food-card.component";
import {Food} from "../../../models/Food";
import {LoggedFood} from "../../../models/LoggedFood";
import {DateTimeService} from "../../../services/date-time.service";

@Component({
  selector: 'app-calendar-content',
  standalone: true,
  imports: [CommonModule, ActivityComponent, CdkDrag, CdkDropList, FoodCardComponent],
  templateUrl: './calendar-content.component.html',
  styleUrl: './calendar-content.component.scss'
})
export class CalendarContentComponent implements OnInit {
  workouts = input.required<Workout[]>();
  foods = input.required<LoggedFood[]>();
  date = input.required<Date>();

  constructor(public dialog: MatDialog,
              public workoutService: WorkoutService,
              public dateTimeService: DateTimeService,) {
  }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<Workout[]>){
    console.log(event);
    if(event.container == event.previousContainer ||
      (event.previousContainer.id != "templateList"  && !event.event.shiftKey) ) return;

    let w: Workout = {...event.item.data,
      isTemplate: false,
      date: this.date(),
      musclesTargeted: event.item.data.labels.map( (label: Label) => label.muscle)
    };

    this.workoutService.createWorkout(w).subscribe( () => this.workoutService.triggerGetWorkouts.next());

  }

  dayIsToday(): boolean{
    return this.dateTimeService.sameDay(new Date(), this.date())
  }
}
