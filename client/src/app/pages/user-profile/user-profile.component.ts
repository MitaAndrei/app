import {Component, OnInit} from '@angular/core';
import {RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/User";
import {ActivityGraphComponent} from "../../activity-graph/activity-graph.component";
import {WorkoutService} from "../../services/workout.service";
import {DateTimeService} from "../../services/date-time.service";
import {Workout} from "../../models/Workout";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [RouterModule, ActivityGraphComponent, AsyncPipe, NgIf],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
    workouts: Workout[] | null = null;
    currentUser: User = {} as User;
    constructor(private authService: AuthService,
                private workoutService: WorkoutService,
                private dateTimeService: DateTimeService,) {
    }

    ngOnInit(): void {
      this.authService.getCurrentUser().subscribe( user =>  this.currentUser = user);
      this.fetchWorkouts();
    }


    get activityStartDate(): Date{
      const pastDate = new Date();
      pastDate.setDate(new Date().getDate() - 364);
      return pastDate;
    }


   fetchWorkouts(): void {
    const activityStartDate = this.dateTimeService.toUtc(this.activityStartDate);
    const todayUtc = this.dateTimeService.toUtc(new Date());

    this.workoutService
      .getAllInDateRange(activityStartDate, todayUtc)
      .subscribe(data => {
        this.workouts = data;
      });
  }

  workoutsPerMonth(month: number = (new Date()).getMonth()) : number {
      return this.workouts?.filter(w => new Date(w.date).getMonth() == month).length ?? 0
  }

  maxWorkoutsAMonth() : number {
      let max = 0;
      for(let i = 0; i < 12; i++){
        max = Math.max(max, this.workoutsPerMonth(i))
      }
      return max
  }
}
