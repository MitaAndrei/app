import {Component, OnDestroy, OnInit} from '@angular/core';
import {Workout} from "../../../models/Workout";
import {ActivityComponent} from "../activity/activity.component";
import {CdkDragDrop, CdkDropList} from "@angular/cdk/drag-drop";
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {WorkoutService} from "../../../services/workout.service";
import {DateTimeService} from "../../../services/date-time.service";
import {Label} from "../../../models/Label";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    ActivityComponent,
    CdkDropList,
    NgForOf,
    NgIf,
    MatIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  constructor(public workoutService: WorkoutService, public dateTimeService: DateTimeService,) {
  }

  ngOnInit() {
    this.getTemplates();
    this.workoutService.triggerGetTemplates
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getTemplates())
  }

  ngOnDestroy() {
    this.destroy$.next();  // Emits a value to complete the observables
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  templates: Workout[] = [];


  drop(event: CdkDragDrop<Workout>){
    console.log(event)
    if(event.previousContainer == event.container) return;

    let w: Workout = {...event.item.data,
      isTemplate: true,
      date: this.dateTimeService.unixEpoch(),
      musclesTargeted: event.item.data.labels.map( (label: Label) => label.muscle)
    };
    this.workoutService.createWorkout(w).subscribe( () => this.getTemplates())
  }

  getTemplates(){
    this.workoutService.getTemplates().subscribe(templates => this.templates = templates);
  }
}
